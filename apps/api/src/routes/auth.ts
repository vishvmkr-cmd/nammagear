import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { signup, login, getUserById } from '../services/auth.service.js';
import { isBangalorePincode } from '../lib/bangalore.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 40,
  message: { error: 'Too many requests, please try again later' },
});

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address').trim(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    college: z.string().optional(),
  })
  .refine((d) => isBangalorePincode(d.pincode), {
    message: 'Only Bangalore pincodes (560001–560103) are allowed',
    path: ['pincode'],
  });

const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z.string().min(1, 'Password is required'),
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

      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';
      const useSecure = cookieDomain !== 'localhost';

      res.cookie('ng_token', token, {
        path: '/',
        httpOnly: true,
        secure: useSecure,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: cookieDomain,
      });

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

      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';
      const useSecure = cookieDomain !== 'localhost';

      res.cookie('ng_token', token, {
        path: '/',
        httpOnly: true,
        secure: useSecure,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: cookieDomain,
      });

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
