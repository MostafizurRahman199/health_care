import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { specialtiesService } from './specialties.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.insertIntoDB(req.file, req.body);

  res.status(201).json({
    success: true,
    message: 'Specialty created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getAllFromDB();

  res.status(200).json({
    success: true,
    message: 'Specialties fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await specialtiesService.getByIdFromDB(id);

  res.status(200).json({
    success: true,
    message: 'Specialty fetched successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await specialtiesService.updateIntoDB(
    id,
    req.file,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Specialty updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await specialtiesService.deleteFromDB(id);

  res.status(200).json({
    success: true,
    message: 'Specialty deleted successfully',
    data: result,
  });
});

export const specialtiesController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
