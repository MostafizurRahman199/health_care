import express from 'express';
import { userController } from './user.controller';
import { multerUpload } from '../../../helpers/multer';
import validateRequest from '../../../middlewares/validateRequest';
import { userValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-patient',
  multerUpload.single('profilePhoto'),
  validateRequest(userValidation.createPatientValidationSchema),
  userController.createPatient
);

router.post(
  '/create-doctor',
  multerUpload.single('profilePhoto'),
  validateRequest(userValidation.createDoctorValidationSchema),
  userController.createDoctor
);

router.post(
  '/create-admin',
  multerUpload.single('profilePhoto'),
  validateRequest(userValidation.createAdminValidationSchema),
  userController.createAdmin
);

export const userRouter = router;