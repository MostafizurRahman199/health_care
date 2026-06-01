import { z } from 'zod';

const createMedicalReport = z.object({
  body: z.object({
    reportName: z.string({
      message: 'Report name is required',
    }),
    patientId: z.string().optional(),
    reportLink: z.string().optional(),
  }),
});

const updateMedicalReport = z.object({
  body: z.object({
    reportName: z.string().optional(),
    reportLink: z.string().optional(),
  }),
});

export const medicalReportValidation = {
  createMedicalReport,
  updateMedicalReport,
};
