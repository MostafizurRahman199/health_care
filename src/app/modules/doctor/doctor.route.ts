import express from 'express';
import { doctorController } from './doctor.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { doctorValidation } from './doctor.validation';
import { multerUpload } from '../../../helpers/multer';

const router = express.Router();

router.get('/', doctorController.getAllFromDB);
router.patch(
  '/:id',
  auth,
  restrictTo('ADMIN', 'DOCTOR'),
  multerUpload.single('profilePhoto'),
  validateRequest(doctorValidation.updateDoctor),
  doctorController.updateIntoDB
);
router.delete('/:id', auth, restrictTo('ADMIN'), doctorController.deleteFromDB);

router.post(
  '/suggest-doctors',
  auth,
  restrictTo('PATIENT', 'ADMIN'),
  validateRequest(doctorValidation.suggestDoctors),
  doctorController.suggestDoctors
);

export const doctorRoutes = router;