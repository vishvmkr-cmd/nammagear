import { randomBytes } from 'node:crypto';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  signup,
  login,
  getUserById,
  loginOrSignupWithGoogle,
} from '../services/auth.service.js';
import { isBangalorePincode } from '../lib/bangalore.js';
import { getGoogleOAuthClient } from '../lib/google-oauth.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const OAUTH_STATE_COOKIE = 'g_oauth_st';
const OAUTH_NEXT_COOKIE = 'g_oauth_nx';
const OAUTH_COOKIE_MS = 10 * 60 * 1000;

function sessionCookieBase() {
  const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';
  const useSecure = cookieDomain !== 'localhost';
  return {
    path: '/' as const,
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax' as const,
    domain: cookieDomain,
  };
}

function setNgTokenCookie(res: Response, token: string) {
  res.cookie('ng_token', token, {
    ...sessionCookieBase(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function getFrontendOrigin(): string {
  return (process.env.FRONTEND_ORIGIN || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
}

/** Relative in-app path only (open-redirect safe). */
function sanitizeNextPath(raw: string | undefined): string {
  if (!raw || typeof raw !== 'string') return '/';
  const t = raw.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return '/';
  return t.length > 512 ? '/' : t;
}

function clearOauthCookies(res: Response) {
  const b = sessionCookieBase();
  res.clearCookie(OAUTH_STATE_COOKIE, { path: b.path, domain: b.domain });
  res.clearCookie(OAUTH_NEXT_COOKIE, { path: b.path, domain: b.domain });
}

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 40,
  message: { error: 'Too many requests, please try again later' },
});

const signupSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(254, 'Email is too long'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be under 128 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number'),
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be under 50 characters'),
    pincode: z
      .string({ required_error: 'Pincode is required' })
      .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number is required')
      .regex(
        /^[6-9]\d{9}$/,
        'Enter a valid 10-digit Indian mobile number starting with 6-9'
      ),
    college: z.string().max(100, 'College name is too long').optional(),
  })
  .refine((d) => isBangalorePincode(d.pincode), {
    message: 'We currently serve Bangalore only (pincodes 560001–560103)',
    path: ['pincode'],
  });

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

router.get('/google', (req: Request, res: Response) => {
  const client = getGoogleOAuthClient();
  const frontend = getFrontendOrigin();
  const nextPath = sanitizeNextPath(
    typeof req.query.next === 'string' ? req.query.next : undefined
  );

  if (!client) {
    return res.redirect(
      `${frontend}/auth/signin?error=google_not_configured`
    );
  }

  const state = randomBytes(24).toString('hex');
  const c = sessionCookieBase();
  res.cookie(OAUTH_STATE_COOKIE, state, { ...c, maxAge: OAUTH_COOKIE_MS });
  res.cookie(OAUTH_NEXT_COOKIE, nextPath, { ...c, maxAge: OAUTH_COOKIE_MS });

  const url = client.generateAuthUrl({
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state,
    prompt: 'select_account',
  });
  res.redirect(302, url);
});

router.get('/google/callback', async (req: Request, res: Response) => {
  const frontend = getFrontendOrigin();

  const fail = (code: string) => {
    clearOauthCookies(res);
    res.redirect(302, `${frontend}/auth/signin?error=${code}`);
  };

  if (req.query.error === 'access_denied') {
    clearOauthCookies(res);
    return res.redirect(302, `${frontend}/auth/signin?error=google_denied`);
  }

  const code =
    typeof req.query.code === 'string' ? req.query.code : undefined;
  const stateQ =
    typeof req.query.state === 'string' ? req.query.state : undefined;
  const stateC = req.cookies?.[OAUTH_STATE_COOKIE] as string | undefined;

  if (!code || !stateQ || !stateC || stateQ !== stateC) {
    return fail('google_invalid_state');
  }

  const nextPath = sanitizeNextPath(
    req.cookies?.[OAUTH_NEXT_COOKIE] as string | undefined
  );

  const client = getGoogleOAuthClient();
  if (!client) {
    return fail('google_not_configured');
  }

  try {
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
      return fail('google_failed');
    }

    const audience = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!audience) {
      return fail('google_not_configured');
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience,
    });
    const p = ticket.getPayload();
    if (!p?.sub || !p.email) {
      return fail('google_failed');
    }
    if (p.email_verified === false) {
      return fail('google_email_unverified');
    }

    const { token } = await loginOrSignupWithGoogle({
      googleId: p.sub,
      email: p.email,
      name: p.name || p.email.split('@')[0] || 'User',
      picture: p.picture,
    });

    clearOauthCookies(res);
    setNgTokenCookie(res, token);
    res.redirect(302, `${frontend}${nextPath}`);
  } catch (e) {
    console.error('[auth/google/callback]', e);
    return fail('google_failed');
  }
});

router.post(
  '/signup',
  authLimiter,
  validate(signupSchema),
  async (req: Request, res: Response) => {
    try {
      const { user, token } = await signup({
        ...req.body,
        college:
          typeof req.body.college === 'string' && req.body.college.trim()
            ? req.body.college.trim()
            : undefined,
      });

      setNgTokenCookie(res, token);

      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Signup failed' });
      }
    }
  }
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { user, token } = await login(req.body);

      setNgTokenCookie(res, token);

      res.json({ user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Login failed' });
      }
    }
  }
);

router.post('/logout', (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';
  res.clearCookie('ng_token', {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    domain: isProduction ? cookieDomain : undefined,
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user!.userId);
    res.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
});

export default router;
