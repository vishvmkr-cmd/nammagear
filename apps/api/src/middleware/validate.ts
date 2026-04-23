import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path.join('.');
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        }

        const firstMessage = error.issues[0]?.message || 'Validation failed';

        return res.status(400).json({
          error: firstMessage,
          fieldErrors,
          details: error.issues,
        });
      }
      next(error);
    }
  };
}
