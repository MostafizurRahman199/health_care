import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { cloudinaryHelper } from '../../../helpers/cloudinary';

const createMedicalReport = async (user: any, payload: any, files: any) => {
  let patientId = payload.patientId;

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    patientId = patientData.id;
  } else if (user.role === 'ADMIN') {
    if (!patientId) {
      throw new ApiError(400, 'Admin must provide patientId');
    }
  }

  const reportImages: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await cloudinaryHelper.uploadToCloudinary(file.path, 'health-care/medical-reports');
      reportImages.push(uploadResult.secure_url);
    }
  }

  if (reportImages.length === 0 && !payload.reportLink) {
    throw new ApiError(400, 'You must provide either a report link or upload report images');
  }

  const result = await prisma.medicalReport.create({
    data: {
      patientId: patientId,
      reportName: payload.reportName,
      reportLink: payload.reportLink || null,
      reportImages: reportImages,
    },
  });

  return result;
};

const getMyMedicalReports = async (user: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const result = await prisma.medicalReport.findMany({
    where: { patientId: patientData.id },
  });

  return result;
};

const getAllMedicalReports = async () => {
  const result = await prisma.medicalReport.findMany({
    include: {
      patient: true,
    },
  });

  return result;
};

const getMedicalReportById = async (id: string, user: any) => {
  const result = await prisma.medicalReport.findUniqueOrThrow({
    where: { id },
  });

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    if (result.patientId !== patientData.id) {
      throw new ApiError(403, 'You are not authorized to view this report');
    }
  }

  return result;
};

const updateMedicalReport = async (id: string, user: any, payload: any) => {
  const reportData = await prisma.medicalReport.findUniqueOrThrow({
    where: { id },
  });

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    if (reportData.patientId !== patientData.id) {
      throw new ApiError(403, 'You can only update your own reports');
    }
  }

  const result = await prisma.medicalReport.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteMedicalReport = async (id: string, user: any) => {
  const reportData = await prisma.medicalReport.findUniqueOrThrow({
    where: { id },
  });

  if (user.role === 'PATIENT') {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
    if (reportData.patientId !== patientData.id) {
      throw new ApiError(403, 'You can only delete your own reports');
    }
  }

  const result = await prisma.medicalReport.delete({
    where: { id },
  });

  return result;
};

export const medicalReportService = {
  createMedicalReport,
  getMyMedicalReports,
  getAllMedicalReports,
  getMedicalReportById,
  updateMedicalReport,
  deleteMedicalReport,
};
