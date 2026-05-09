import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { doctorScheduleService } from './doctorSchedule.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user!;

  const result = await doctorScheduleService.insertIntoDB(email, req.body);

  res.status(200).json({
    success: true,
    message: 'Doctor schedule created successfully',
    data: result,
  });
});

export const doctorScheduleController = {
  insertIntoDB,
};