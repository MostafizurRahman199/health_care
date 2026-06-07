import express from 'express';
import { reviewController } from './review.controller';
import { auth, restrictTo } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { reviewValidation } from './review.validation';

const router = express.Router();

router.get(
  '/',
  reviewController.getAllReviews
);

router.post(
  '/',
  auth,
  restrictTo('PATIENT'),
  validateRequest(reviewValidation.createReview),
  reviewController.createReview
);

router.get(
  '/my-reviews',
  auth,
  restrictTo('DOCTOR', 'PATIENT'),
  reviewController.getMyReviews
);

router.get(
  '/doctor/:doctorId',
  reviewController.getDoctorReviews
);

router.patch(
  '/:id',
  auth,
  restrictTo('PATIENT'),
  validateRequest(reviewValidation.updateReview),
  reviewController.updateReview
);

router.delete(
  '/:id',
  auth,
  restrictTo('PATIENT', 'ADMIN'),
  reviewController.deleteReview
);

export const reviewRoutes = router;
