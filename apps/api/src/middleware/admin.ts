import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.ng_token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const payload = verifyToken(token);
    if (payload.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
