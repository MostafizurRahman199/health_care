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

export const userController = {
  createPatient,
};