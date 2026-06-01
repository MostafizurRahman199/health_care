import express, { NextFunction, Request, Response } from 'express';
import { medicalReportController } from './medicalReport.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { medicalReportValidation } from './medicalReport.validation';
import { multerUpload } from '../../../helpers/multer';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('PATIENT', 'ADMIN'),
  multerUpload.array('files'), // Allow multiple files
  validateRequest(medicalReportValidation.createMedicalReport),
  medicalReportController.createMedicalReport
);

router.get(
  '/',
  auth,
  restrictTo('ADMIN'),
  medicalReportController.getAllMedicalReports
);

router.get(
  '/my-reports',
  auth,
  restrictTo('PATIENT'),
  medicalReportController.getMyMedicalReports
);

router.get(
  '/:id',
  auth,
  restrictTo('PATIENT', 'ADMIN'),
  medicalReportController.getMedicalReportById
);

router.patch(
  '/:id',
  auth,
  restrictTo('PATIENT', 'ADMIN'),
  validateRequest(medicalReportValidation.updateMedicalReport),
  medicalReportController.updateMedicalReport
);

router.delete(
  '/:id',
  auth,
  restrictTo('PATIENT', 'ADMIN'),
  medicalReportController.deleteMedicalReport
);

export const medicalReportRoutes = router;
