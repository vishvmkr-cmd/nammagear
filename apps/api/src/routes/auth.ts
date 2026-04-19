import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { signup, login, getUserById } from '../services/auth.service.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later' },
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  phone: z.string().optional(),
  college: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post(
  '/signup',
  authLimiter,
  validate(signupSchema),
  async (req: Request, res: Response) => {
    try {
      const { user, token } = await signup(req.body);

      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';

      res.cookie('ng_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: isProduction ? cookieDomain : undefined,
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

      res.cookie('ng_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: isProduction ? cookieDomain : undefined,
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
  res.clearCookie('ng_token');
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
