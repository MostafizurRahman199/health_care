import { z } from 'zod';

const createPrescription = z.object({
  body: z.object({
    appointmentId: z.string({
      message: 'Appointment Id is required',
    }),
    instructions: z.string({
      message: 'Instructions are required',
    }),
    followUpDate: z.string().optional(),
  }),
});

const updatePrescription = z.object({
  body: z.object({
    instructions: z.string().optional(),
    followUpDate: z.string().optional(),
  }),
});

export const prescriptionValidation = {
  createPrescription,
  updatePrescription,
};
