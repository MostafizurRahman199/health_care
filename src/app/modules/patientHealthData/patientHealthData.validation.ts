import { z } from 'zod';

const createPatientHealthData = z.object({
  body: z.object({
    gender: z.enum(['MALE', 'FEMALE']),
    dateOfBirth: z.string({
      message: 'Date of birth is required',
    }),
    bloodGroup: z.string({
      message: 'Blood group is required',
    }),
    hasAllergies: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    height: z.string({
      message: 'Height is required',
    }),
    weight: z.string({
      message: 'Weight is required',
    }),
    smokingStatus: z.boolean().optional(),
    dietaryPreferences: z.string().optional(),
    pregnancyStatus: z.boolean().optional(),
    mentalHealthHistory: z.string().optional(),
    immunizationStatus: z.string().optional(),
    hasPastSurgeries: z.boolean().optional(),
    recentAnxiety: z.boolean().optional(),
    recentDepression: z.boolean().optional(),
    maritalStatus: z.string().optional(),
  }),
});

const updatePatientHealthData = z.object({
  body: z.object({
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    dateOfBirth: z.string().optional(),
    bloodGroup: z.string().optional(),
    hasAllergies: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    smokingStatus: z.boolean().optional(),
    dietaryPreferences: z.string().optional(),
    pregnancyStatus: z.boolean().optional(),
    mentalHealthHistory: z.string().optional(),
    immunizationStatus: z.string().optional(),
    hasPastSurgeries: z.boolean().optional(),
    recentAnxiety: z.boolean().optional(),
    recentDepression: z.boolean().optional(),
    maritalStatus: z.string().optional(),
  }),
});

export const patientHealthDataValidation = {
  createPatientHealthData,
  updatePatientHealthData,
};
