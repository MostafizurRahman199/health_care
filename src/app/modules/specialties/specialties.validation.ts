import { z } from 'zod';

const createValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
  }),
});

const updateValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title must be a string' }).optional(),
  }),
});

export const specialtiesValidation = {
  createValidationSchema,
  updateValidationSchema,
};
