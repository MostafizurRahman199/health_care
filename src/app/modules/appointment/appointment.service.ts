import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import crypto from 'crypto';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { Prisma } from '@prisma/client';
import { paymentService } from '../payment/payment.service';




const createAppointment = async (user: any, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: { id: payload.doctorId },
  });

  const doctorScheduleData = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  if (!doctorScheduleData) {
    throw new ApiError(400, 'Schedule is already booked or not found');
  }

  const videoCallingId = crypto.randomUUID();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const today = new Date();
    const transactionId = `TXN-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${crypto.randomUUID().substring(0, 8)}`;

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appintmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  const paymentData = await paymentService.initPayment(result.id);

  return {
    ...result,
    paymentSession: paymentData,
  };
};

const getAllFromDB = async (filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

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

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  const total = await prisma.appointment.count({
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

const getMyAppointment = async (user: any, filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    andConditions.push({ patientId: patientData.id });
  } else if (user.role === 'DOCTOR') {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: { email: user.email },
    });
    andConditions.push({ doctorId: doctorData.id });
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

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      patient: true,
      schedule: true,
      payment: true,
    },
  });

  const total = await prisma.appointment.count({
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

export const appointmentService = {
  createAppointment,
  getAllFromDB,
  getMyAppointment,
};
