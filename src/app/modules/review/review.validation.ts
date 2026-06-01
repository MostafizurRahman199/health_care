import { z } from 'zod';

const createReview = z.object({
  body: z.object({
    appointmentId: z.string({
      message: 'Appointment Id is required',
    }),
    rating: z.number({
      message: 'Rating is required',
    }).min(1).max(5),
    comment: z.string({
      message: 'Comment is required',
    }),
  }),
});

const updateReview = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const reviewValidation = {
  createReview,
  updateReview,
};
