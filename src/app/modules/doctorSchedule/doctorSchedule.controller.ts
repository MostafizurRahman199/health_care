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


const getMySchedules = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user!;

  const result = await doctorScheduleService.getMySchedules(email);

  res.status(200).json({
    success: true,
    message: 'My schedules fetched successfully',
    data: result,
  });
});


const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user!;

  const result = await doctorScheduleService.deleteFromDB(email, req.body);

  res.status(200).json({
    success: true,
    message: 'Doctor schedule(s) deleted successfully',
    data: result,
  });
});

const getAvailableSchedules = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user!;

  const result = await doctorScheduleService.getAvailableSchedules(email);

  res.status(200).json({
    success: true,
    message: 'Available schedules fetched successfully',
    data: result,
  });
});


const updateFromDB = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user!;
  const { scheduleId } = req.params as { scheduleId: string };

  const result = await doctorScheduleService.updateFromDB(
    email,
    scheduleId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Doctor schedule updated successfully',
    data: result,
  });
});


export const doctorScheduleController = {
  insertIntoDB,
  getMySchedules,
  getAvailableSchedules,
  updateFromDB,
  deleteFromDB,
};