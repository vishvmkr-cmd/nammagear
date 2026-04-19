import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}
