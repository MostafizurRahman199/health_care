import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { medicalReportService } from './medicalReport.service';

const createMedicalReport = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await medicalReportService.createMedicalReport(user, req.body, req.files);

  res.status(201).json({
    success: true,
    message: 'Medical report created successfully',
    data: result,
  });
});

const getMyMedicalReports = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await medicalReportService.getMyMedicalReports(user);

  res.status(200).json({
    success: true,
    message: 'Medical reports retrieved successfully',
    data: result,
  });
});

const getAllMedicalReports = catchAsync(async (req: Request, res: Response) => {
  const result = await medicalReportService.getAllMedicalReports();

  res.status(200).json({
    success: true,
    message: 'All medical reports retrieved successfully',
    data: result,
  });
});

const getMedicalReportById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user;
  const result = await medicalReportService.getMedicalReportById(id, user);

  res.status(200).json({
    success: true,
    message: 'Medical report retrieved successfully',
    data: result,
  });
});

const updateMedicalReport = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user;
  const result = await medicalReportService.updateMedicalReport(id, user, req.body);

  res.status(200).json({
    success: true,
    message: 'Medical report updated successfully',
    data: result,
  });
});

const deleteMedicalReport = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user;
  const result = await medicalReportService.deleteMedicalReport(id, user);

  res.status(200).json({
    success: true,
    message: 'Medical report deleted successfully',
    data: result,
  });
});

export const medicalReportController = {
  createMedicalReport,
  getMyMedicalReports,
  getAllMedicalReports,
  getMedicalReportById,
  updateMedicalReport,
  deleteMedicalReport,
};
