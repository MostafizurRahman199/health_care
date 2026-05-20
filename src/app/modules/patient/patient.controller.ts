import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { patientService } from './patient.service';
import { patientFilterableFields } from './patient.constants';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await patientService.getAllFromDB(filters, options);

  res.status(200).json({
    success: true,
    message: 'Patients fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await patientService.getByIdFromDB(id as string, user);

  res.status(200).json({
    success: true,
    message: 'Patient fetched successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await patientService.updateIntoDB(id as string, req.body, user, req.file);

  res.status(200).json({
    success: true,
    message: 'Patient updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.deleteFromDB(id as string);

  res.status(200).json({
    success: true,
    message: 'Patient deleted successfully',
    data: result,
  });
});

export const patientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
