import { PatientHealthData } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';

const upsertPatientHealthData = async (user: any, payload: Partial<PatientHealthData>) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const existingHealthData = await prisma.patientHealthData.findUnique({
    where: { patientId: patientData.id },
  });

  if (existingHealthData) {
    // update
    const result = await prisma.patientHealthData.update({
      where: { patientId: patientData.id },
      data: payload,
      include: {
        patient: true,
      },
    });
    return result;
  } else {
    // create
    // check required fields
    if (!payload.gender || !payload.dateOfBirth || !payload.bloodGroup || !payload.height || !payload.weight) {
        throw new ApiError(400, "Missing required fields for initial health data creation");
    }
    const result = await prisma.patientHealthData.create({
      data: {
        ...payload,
        patientId: patientData.id,
      } as any,
      include: {
        patient: true,
      },
    });
    return result;
  }
};

const getMyHealthData = async (user: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const result = await prisma.patientHealthData.findUnique({
    where: { patientId: patientData.id },
    include: {
      patient: true,
    },
  });

  return result;
};

export const patientHealthDataService = {
  upsertPatientHealthData,
  getMyHealthData,
};
