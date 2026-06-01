import express from 'express';
import { prescriptionController } from './prescription.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { prescriptionValidation } from './prescription.validation';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('DOCTOR'),
  validateRequest(prescriptionValidation.createPrescription),
  prescriptionController.createPrescription
);

router.get(
  '/my-prescription',
  auth,
  restrictTo('DOCTOR', 'PATIENT'),
  prescriptionController.getMyPrescriptions
);

router.patch(
  '/:id',
  auth,
  restrictTo('DOCTOR'),
  validateRequest(prescriptionValidation.updatePrescription),
  prescriptionController.updatePrescription
);

export const prescriptionRoutes = router;
