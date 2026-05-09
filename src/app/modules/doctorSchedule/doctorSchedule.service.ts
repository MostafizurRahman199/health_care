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

const getMySchedules = async (email: string) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email },
  });

  const result = await prisma.doctorSchedule.findMany({
    where: {
      doctorId: doctor.id,
    },
    include: {
      schedule: true,
    },
  });

  return result;
};

const deleteFromDB = async (
  email: string,
  payload: { scheduleIds: string[] }
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email },
  });

  const result = await prisma.doctorSchedule.deleteMany({
    where: {
      doctorId: doctor.id,
      scheduleId: {
        in: payload.scheduleIds,
      },
    },
  });

  return result;
};

const getAvailableSchedules = async (email: string) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email },
  });

  // Get schedule IDs the doctor already has
  const mySchedules = await prisma.doctorSchedule.findMany({
    where: { doctorId: doctor.id },
    select: { scheduleId: true },
  });

  const myScheduleIds = mySchedules.map((s) => s.scheduleId);

  // Get all schedules except the ones the doctor already occupied
  const result = await prisma.schedule.findMany({
    where: {
      id: {
        notIn: myScheduleIds,
      },
    },
  });

  return result;
};

const updateFromDB = async (
  email: string,
  scheduleId: string,
  payload: Partial<{ isBooked: boolean }>
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email },
  });

  const result = await prisma.doctorSchedule.update({
    where: {
      doctorId_scheduleId: {
        doctorId: doctor.id,
        scheduleId,
      },
    },
    data: payload,
  });

  return result;
};

export const doctorScheduleService = {
  insertIntoDB,
  getMySchedules,
  getAvailableSchedules,
  updateFromDB,
  deleteFromDB,
};