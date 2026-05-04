import express from 'express';
import { userController } from './user.controller';
import { multerUpload } from '../../../helpers/multer';
import validateRequest from '../../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { auth, restrictTo } from '../../../middlewares/auth';

const router = express.Router();

router.get('/', auth, restrictTo('ADMIN'), userController.getAllUsers);

router.post(
  '/create-patient',
  multerUpload.single('profilePhoto'),
  validateRequest(userValidation.createPatientValidationSchema),
  userController.createPatient
);

router.post(
  '/create-doctor',
  auth, restrictTo('ADMIN'),
  multerUpload.single('profilePhoto'),
  validateRequest(userValidation.createDoctorValidationSchema),
  userController.createDoctor
);

router.post(
  '/create-admin',
  auth, restrictTo('ADMIN'),
  multerUpload.single('profilePhoto'),
  validateRequest(userValidation.createAdminValidationSchema),
  userController.createAdmin
);

export const userRouter = router;