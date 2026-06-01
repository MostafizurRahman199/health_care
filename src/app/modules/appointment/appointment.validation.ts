import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

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

const updateAppointmentStatus = z.object({
  body: z.object({
    status: z.enum(['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED'], {
      message: 'Invalid status',
    }),
  }),
});

export const appointmentValidation = {
  createAppointment,
  updateAppointmentStatus,
};
