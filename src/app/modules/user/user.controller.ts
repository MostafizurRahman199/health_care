import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { userService } from './user.service';
import { pick } from '../../../shared/pick';
import { calculatePagination } from '../../../helpers/paginationHelper';

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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'role', 'status']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const paginationOptions = calculatePagination(options);

  const result = await userService.getAllUsersFromDB(filters, paginationOptions);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const userController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};