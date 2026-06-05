import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { auth } from '../../../middlewares/auth';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.get(
  '/me',
  auth,
  AuthController.getMyProfile
);

router.post(
  '/forgot-password',
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  AuthController.resetPassword
);

export const AuthRoutes = router;