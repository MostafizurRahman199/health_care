import express from 'express';
import { paymentController } from './payment.controller';
import { auth, restrictTo } from '../../../middlewares/auth';

const router = express.Router();

router.post(
  '/webhook',
  paymentController.stripeWebhook
);

router.post(
  '/init/:appointmentId',
  auth,
  restrictTo('PATIENT'),
  paymentController.initPayment
);

export const paymentRoutes = router;
