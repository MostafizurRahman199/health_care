import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { metaService } from './meta.service';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await metaService.getDashboardStats(user);

  res.status(200).json({
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: result,
  });
});

export const metaController = {
  getDashboardStats,
};