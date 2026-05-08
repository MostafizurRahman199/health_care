import { z } from 'zod';

const createSchedule = z.object({
  body: z.object({
    startDate: z.string().min(1, 'Start Date is required!'),
    endDate: z.string().min(1, 'End Date is required!'),
    startTime: z.string().min(1, 'Start Time is required!'),
    endTime: z.string().min(1, 'End Time is required!'),
    sessionTime: z.number().min(1, 'Session Time is required!'),
  }),
});

export const scheduleValidation = {
  createSchedule,
};
