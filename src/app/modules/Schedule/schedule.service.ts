import { Prisma, Schedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { calculatePagination } from '../../../helpers/paginationHelper';

const insertIntoDB = async (payload: any): Promise<Schedule[]> => {
 
    const { startDate, endDate, startTime, endTime, sessionTime } = payload;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const schedules = [];

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        Number(startTime.split(':')[0]),
        Number(startTime.split(':')[1])
      )
    );

    const endDateTime = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        Number(endTime.split(':')[0]),
        Number(endTime.split(':')[1])
      )
    );

    while (startDateTime < endDateTime) {
      const s = new Date(startDateTime);
      const e = new Date(startDateTime.getTime() + sessionTime * 60000);

      if (e <= endDateTime) {
        schedules.push({
          startDateTime: s,
          endDateTime: e,
          sessionTime: sessionTime,
        });
      }

      startDateTime.setTime(startDateTime.getTime() + sessionTime * 60000);
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const existingSchedules = await prisma.schedule.findMany({
    where: {
      startDateTime: {
        gte: schedules[0].startDateTime,
      },
      endDateTime: {
        lte: schedules[schedules.length - 1].endDateTime,
      },
    },
  });

  const existingScheduleTimes = new Set(
    existingSchedules.map(
      (schedule) =>
        `${schedule.startDateTime.toISOString()}-${schedule.endDateTime.toISOString()}`
    )
  );

  const newSchedules = schedules.filter(
    (schedule) =>
      !existingScheduleTimes.has(
        `${schedule.startDateTime.toISOString()}-${schedule.endDateTime.toISOString()}`
      )
  );

  await prisma.schedule.createMany({
    data: newSchedules,
  });

  return await prisma.schedule.findMany({
    where: {
      startDateTime: {
        in: newSchedules.map((s) => s.startDateTime),
      },
    },
  });
};


const getAllFromDB = async (filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: new Date(startDate),
          },
        },
        {
          endDateTime: {
            lte: new Date(
              new Date(endDate).setHours(23, 59, 59, 999)
            ),
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.schedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });

  return result;
};

export const scheduleService = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
