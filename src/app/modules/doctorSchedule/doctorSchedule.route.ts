import express from 'express';
import { auth, restrictTo } from '../../../middlewares/auth';
import { doctorScheduleController } from './doctorSchedule.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { doctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('DOCTOR'),
  validateRequest(doctorScheduleValidation.insertValidationSchema),
  doctorScheduleController.insertIntoDB
);

router.get(
  '/my-schedules',
  auth,
  restrictTo('DOCTOR'),
  doctorScheduleController.getMySchedules
);

router.get(
  '/available-schedules',
  auth,
  restrictTo('DOCTOR'),
  doctorScheduleController.getAvailableSchedules
);

router.patch(
  '/:scheduleId',
  auth,
  restrictTo('DOCTOR'),
  validateRequest(doctorScheduleValidation.updateValidationSchema),
  doctorScheduleController.updateFromDB
);

router.delete(
  '/',
  auth,
  restrictTo('DOCTOR'),
  validateRequest(doctorScheduleValidation.deleteValidationSchema),
  doctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router;