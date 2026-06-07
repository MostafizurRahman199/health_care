import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { reviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await reviewService.createReview(user, req.body);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const filters = pick(req.query, []);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await reviewService.getMyReviews(user, filters, options);

  res.status(200).json({
    success: true,
    message: 'My reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDoctorReviews = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId as string;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await reviewService.getDoctorReviews(doctorId, options);

  res.status(200).json({
    success: true,
    message: 'Doctor reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, []);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await reviewService.getAllReviews(filters, options);

  res.status(200).json({
    success: true,
    message: 'All reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user;
  const result = await reviewService.updateReview(id, user, req.body);

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user;
  const result = await reviewService.deleteReview(id, user);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
  getMyReviews,
  getDoctorReviews,
  updateReview,
  deleteReview,
};
