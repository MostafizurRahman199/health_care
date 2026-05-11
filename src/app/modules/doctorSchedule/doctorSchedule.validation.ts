import { z } from 'zod';

const insertValidationSchema = z.object({
  body: z.object({
    scheduleIds: z
      .array(z.string({ message: 'Each schedule ID must be a string' }))
      .min(1, 'At least one schedule ID is required'),
  }),
});

const deleteValidationSchema = z.object({
  body: z.object({
    scheduleIds: z
      .array(z.string({ message: 'Each schedule ID must be a string' }))
      .min(1, 'At least one schedule ID is required'),
  }),
});

const updateValidationSchema = z.object({
  body: z.object({
    isBooked: z.boolean({ message: 'isBooked must be a boolean' }),
  }),
});

export const doctorScheduleValidation = {
  insertValidationSchema,
  deleteValidationSchema,
  updateValidationSchema,
};