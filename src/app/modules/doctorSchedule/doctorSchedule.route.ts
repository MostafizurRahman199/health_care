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

export const doctorScheduleRoutes = router;