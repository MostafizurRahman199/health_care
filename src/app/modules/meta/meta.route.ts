import express from 'express';
import { metaController } from './meta.controller';
import { auth, restrictTo } from '../../../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  auth,
  restrictTo('ADMIN', 'DOCTOR', 'PATIENT'),
  metaController.getDashboardStats
);

export const metaRoutes = router;