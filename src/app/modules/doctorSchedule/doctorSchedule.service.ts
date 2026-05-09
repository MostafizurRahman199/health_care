import prisma from '../../../shared/prisma';

const insertIntoDB = async (email: string, payload: { scheduleIds: string[] }) => {
  // Get the doctor by email
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email },
  });

  // Build the data array for createMany
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctor.id,
    scheduleId,
  }));

  // Create all doctor-schedule entries at once
  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

  return result;
};

export const doctorScheduleService = {
  insertIntoDB,
};