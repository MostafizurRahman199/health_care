import { z } from 'zod';

const createAppointment = z.object({
  body: z.object({
    doctorId: z.string({
      message: 'Doctor id is required',
    }),
    scheduleId: z.string({
      message: 'Schedule id is required',
    }),
  }),
});

export const appointmentValidation = {
  createAppointment,
};
