import express from 'express';
import { auth, restrictTo } from '../../../middlewares/auth';
import { specialtiesController } from './specialties.controller';
import { multerUpload } from '../../../helpers/multer';
import validateRequest from '../../../middlewares/validateRequest';
import { specialtiesValidation } from './specialties.validation';

const router = express.Router();

router.post(
  '/',
  auth,
  restrictTo('ADMIN'),
  multerUpload.single('icon'),
  validateRequest(specialtiesValidation.createValidationSchema),
  specialtiesController.insertIntoDB
);

router.get('/', specialtiesController.getAllFromDB);

router.get('/:id', specialtiesController.getByIdFromDB);

router.patch(
  '/:id',
  auth,
  restrictTo('ADMIN'),
  multerUpload.single('icon'),
  validateRequest(specialtiesValidation.updateValidationSchema),
  specialtiesController.updateIntoDB
);

router.delete(
  '/:id',
  auth,
  restrictTo('ADMIN'),
  specialtiesController.deleteFromDB
);

export const specialtiesRoutes = router;
