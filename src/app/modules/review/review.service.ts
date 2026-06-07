import { AppointmentStatus, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';

const updateDoctorAverageRating = async (doctorId: string) => {
  const aggResult = await prisma.review.aggregate({
    where: { doctorId },
    _avg: {
      rating: true,
    },
  });
  const avgRating = aggResult._avg.rating || 0;
  await prisma.doctor.update({
    where: { id: doctorId },
    data: { averageRating: avgRating },
  });
};

const createReview = async (user: any, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload.appointmentId },
  });

  if (appointmentData.patientId !== patientData.id) {
    throw new ApiError(403, 'This appointment does not belong to you');
  }

  if (appointmentData.status !== AppointmentStatus.COMPLETED) {
    throw new ApiError(400, 'Review can only be given for completed appointments');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { appointmentId: payload.appointmentId },
  });

  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this appointment');
  }

  const result = await prisma.review.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: patientData.id,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  await updateDoctorAverageRating(appointmentData.doctorId);

  return result;
};

const getMyReviews = async (user: any, filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  
  const andConditions: Prisma.ReviewWhereInput[] = [];

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

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:
      user.role === 'PATIENT'
        ? {
            doctor: true,
            appointment: true,
          }
        : {
            patient: true,
            appointment: true,
          },
  });

  const total = await prisma.review.count({
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

const getDoctorReviews = async (doctorId: string, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const whereConditions: Prisma.ReviewWhereInput = {
    doctorId,
  };

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.review.count({
    where: whereConditions,
  });

  // Calculate average rating
  const aggResult = await prisma.review.aggregate({
    where: whereConditions,
    _avg: {
      rating: true,
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      averageRating: aggResult._avg.rating || 0,
    },
    data: result,
  };
};

const getAllReviews = async (filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const result = await prisma.review.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.review.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateReview = async (id: string, user: any, payload: Partial<any>) => {
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: { id },
  });

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    if (reviewData.patientId !== patientData.id) {
      throw new ApiError(403, 'You can only update your own reviews');
    }
  }
  // Admin is allowed to bypass ownership check

  const result = await prisma.review.update({
    where: { id },
    data: payload,
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  await updateDoctorAverageRating(result.doctorId);

  return result;
};

const deleteReview = async (id: string, user: any) => {
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: { id },
  });

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    if (reviewData.patientId !== patientData.id) {
      throw new ApiError(403, 'You can only delete your own reviews');
    }
  }

  const result = await prisma.review.delete({
    where: { id },
  });

  await updateDoctorAverageRating(result.doctorId);

  return result;
};

export const reviewService = {
  createReview,
  getAllReviews,
  getMyReviews,
  getDoctorReviews,
  updateReview,
  deleteReview,
};
