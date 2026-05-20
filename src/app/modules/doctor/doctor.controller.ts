import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { doctorService } from './doctor.service';
import { doctorFilterableFields } from './doctor.constants';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await doctorService.getAllFromDB(filters, options);

  res.status(200).json({
    success: true,
    message: 'Doctors fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await doctorService.updateIntoDB(id as string, req.body, user, req.file);

  res.status(200).json({
    success: true,
    message: 'Doctor updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.deleteFromDB(id as string);

  res.status(200).json({
    success: true,
    message: 'Doctor deleted successfully',
    data: result,
  });
});

export const doctorController = {
  getAllFromDB,
  updateIntoDB,
  deleteFromDB,
};