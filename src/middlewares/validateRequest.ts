import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({ body: req.body });
      req.body = (parsedData as any).body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
