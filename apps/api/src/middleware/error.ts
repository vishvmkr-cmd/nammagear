import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[error]', err);

  if (res.headersSent) {
    return next(err);
  }

  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Internal server error',
    ...(isDev && { details: err.message, stack: err.stack }),
  });
}
