import express from 'express';
import { scheduleController } from './schedule.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { scheduleValidation } from './schedule.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(scheduleValidation.createSchedule),
  scheduleController.insertIntoDB
);

router.get('/', scheduleController.getAllFromDB);

export const scheduleRoutes = router;
