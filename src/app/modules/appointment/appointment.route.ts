import express from 'express';
import { appointmentController } from './appointment.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { appointmentValidation } from './appointment.validation';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('PATIENT'),
  validateRequest(appointmentValidation.createAppointment),
  appointmentController.createAppointment
);

router.get(
  '/',
  auth,
  restrictTo('ADMIN'),
  appointmentController.getAllFromDB
);

router.get(
  '/my-appointment',
  auth,
  restrictTo('DOCTOR', 'PATIENT'),
  appointmentController.getMyAppointment
);

router.patch(
  '/status/:id',
  auth,
  restrictTo('ADMIN', 'DOCTOR'),
  validateRequest(appointmentValidation.updateAppointmentStatus),
  appointmentController.changeAppointmentStatus
);

export const appointmentRoutes = router;
