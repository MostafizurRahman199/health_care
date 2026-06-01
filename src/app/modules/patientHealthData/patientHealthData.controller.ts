import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { patientHealthDataService } from './patientHealthData.service';

const upsertPatientHealthData = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await patientHealthDataService.upsertPatientHealthData(user, req.body);

  res.status(200).json({
    success: true,
    message: 'Patient health data saved successfully',
    data: result,
  });
});

const getMyHealthData = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await patientHealthDataService.getMyHealthData(user);

  res.status(200).json({
    success: true,
    message: 'Patient health data retrieved successfully',
    data: result,
  });
});

export const patientHealthDataController = {
  upsertPatientHealthData,
  getMyHealthData,
};
