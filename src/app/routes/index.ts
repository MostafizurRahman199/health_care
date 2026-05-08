import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/Schedule/schedule.route';

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
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
