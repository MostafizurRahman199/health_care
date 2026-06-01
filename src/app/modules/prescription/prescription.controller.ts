import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { prescriptionService } from './prescription.service';

const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await prescriptionService.createPrescription(user, req.body);

  res.status(201).json({
    success: true,
    message: 'Prescription created successfully',
    data: result,
  });
});

const getMyPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const filters = pick(req.query, ['patientId', 'doctorId', 'appointmentId']); // Added some basic filter fields
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  
  // Custom searchTerm extraction if passed
  if (req.query.searchTerm) {
    filters.searchTerm = req.query.searchTerm;
  }

  const result = await prescriptionService.getMyPrescriptions(user, filters, options);

  res.status(200).json({
    success: true,
    message: 'My prescriptions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updatePrescription = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user;
  const result = await prescriptionService.updatePrescription(id, user, req.body);

  res.status(200).json({
    success: true,
    message: 'Prescription updated successfully',
    data: result,
  });
});

export const prescriptionController = {
  createPrescription,
  getMyPrescriptions,
  updatePrescription,
};
