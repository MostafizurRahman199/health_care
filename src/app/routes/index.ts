import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/Schedule/schedule.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/schedule',
    route: scheduleRoutes,
  },
  {
    path: '/doctor-schedule',
    route: doctorScheduleRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
