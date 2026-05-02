import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { userService } from './user.service';

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatientIntoDB(req.file, req.body);

  res.status(201).json({
    success: true,
    message: 'Patient created successfully',
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctorIntoDB(req.file, req.body);

  res.status(201).json({
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdminIntoDB(req.file, req.body);

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

export const userController = {
  createPatient,
  createDoctor,
  createAdmin,
};