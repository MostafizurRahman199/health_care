import { AppointmentStatus, PaymentStatus, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { buildWhereConditions } from '../../../shared/buildWhereConditions';

const createPrescription = async (user: any, payload: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: { email: user.email },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload.appointmentId },
    include: {
      patient: true,
    },
  });

  if (appointmentData.doctorId !== doctorData.id) {
    throw new ApiError(403, 'This appointment does not belong to you');
  }

  if (appointmentData.status !== AppointmentStatus.COMPLETED) {
    throw new ApiError(400, 'Prescription can only be created for completed appointments');
  }

  if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
    throw new ApiError(400, 'Prescription can only be created for paid appointments');
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: doctorData.id,
      patientId: appointmentData.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : null,
    },
    include: {
      patient: true,
      doctor: true,
      appointment: true,
    },
  });

  return result;
};

const getMyPrescriptions = async (user: any, filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PrescriptionWhereInput[] = [];

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

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          instructions: {
            contains: searchTerm,
            mode: 'insensitive',
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

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
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

  const total = await prisma.prescription.count({
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

const updatePrescription = async (id: string, user: any, payload: Partial<any>) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: { email: user.email },
  });

  const prescriptionData = await prisma.prescription.findUniqueOrThrow({
    where: { id },
  });

  if (prescriptionData.doctorId !== doctorData.id) {
    throw new ApiError(403, 'You can only update your own prescriptions');
  }

  const result = await prisma.prescription.update({
    where: { id },
    data: {
      ...payload,
      followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : undefined,
    },
    include: {
      patient: true,
      doctor: true,
      appointment: true,
    },
  });

  return result;
};

export const prescriptionService = {
  createPrescription,
  getMyPrescriptions,
  updatePrescription,
};
