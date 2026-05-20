import express from 'express';
import { patientController } from './patient.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { patientValidation } from './patient.validation';
import { multerUpload } from '../../../helpers/multer';

const router = express.Router();

router.get('/', auth, restrictTo('ADMIN', 'DOCTOR'), patientController.getAllFromDB);

router.get(
  '/:id',
  auth,
  restrictTo('ADMIN', 'DOCTOR', 'PATIENT'),
  patientController.getByIdFromDB
);

router.patch(
  '/:id',
  auth,
  restrictTo('ADMIN', 'PATIENT'),
  multerUpload.single('profilePhoto'),
  validateRequest(patientValidation.updatePatient),
  patientController.updateIntoDB
);

router.delete('/:id', auth, restrictTo('ADMIN'), patientController.deleteFromDB);

export const patientRoutes = router;
