import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e: { message: string }) => e.message).join('. ');
        _res.status(400).json({
          success: false,
          message: messages,
          errors: error.issues,
        });
        return;
      }
      next(error);
    }
  };
};
