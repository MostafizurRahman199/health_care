import express from 'express';
import { auth, restrictTo } from '../../../middlewares/auth';
import { doctorScheduleController } from './doctorSchedule.controller';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('DOCTOR'),
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
  doctorScheduleController.updateFromDB
);

router.delete(
  '/',
  auth,
  restrictTo('DOCTOR'),
  doctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router;