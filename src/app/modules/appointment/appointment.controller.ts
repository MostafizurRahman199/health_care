import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { appointmentService } from './appointment.service';

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await appointmentService.createAppointment(user, req.body);

  res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['status', 'paymentStatus']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await appointmentService.getAllFromDB(filters, options);

  res.status(200).json({
    success: true,
    message: 'Appointments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyAppointment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const filters = pick(req.query, ['status', 'paymentStatus']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await appointmentService.getMyAppointment(user, filters, options);

  res.status(200).json({
    success: true,
    message: 'My appointments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const appointmentController = {
  createAppointment,
  getAllFromDB,
  getMyAppointment,
};
