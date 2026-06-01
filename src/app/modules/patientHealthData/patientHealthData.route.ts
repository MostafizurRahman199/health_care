import express from 'express';
import { patientHealthDataController } from './patientHealthData.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { patientHealthDataValidation } from './patientHealthData.validation';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('PATIENT'),
  // Since it can be upsert, we might pass create or update validation. 
  // Let's rely on the service to handle the difference or just use update validation 
  // to allow partials when updating. But we want strict for creation.
  // For simplicity, since it's upsert, we'll allow partials in the body, but the service enforces required fields for creation.
  validateRequest(patientHealthDataValidation.updatePatientHealthData),
  patientHealthDataController.upsertPatientHealthData
);

router.get(
  '/',
  auth,
  restrictTo('PATIENT'),
  patientHealthDataController.getMyHealthData
);

export const patientHealthDataRoutes = router;
