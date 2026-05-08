import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { scheduleService } from './schedule.service';
import { scheduleFilterableFields } from './schedule.constants';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.insertIntoDB(req.body);

  res.status(200).json({
    success: true,
    message: 'Schedules created successfully',
    data: result,
  });
});


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await scheduleService.getAllFromDB(filters, options);

  res.status(200).json({
    success: true,
    message: 'Schedules fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const scheduleController = {
  insertIntoDB,
  getAllFromDB,
};
