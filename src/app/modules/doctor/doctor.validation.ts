import { z } from 'zod';

const updateDoctor = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experienceYears: z.number().int().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    appintmentFee: z.number().int().optional(),
    qualification: z.string().optional(),
    cureentWorkingPlcae: z.string().optional(),
    designation: z.string().optional(),
    specialties: z.array(
      z.object({
        specialtiesId: z.string(),
        isDeleted: z.boolean().optional(),
      })
    ).optional()
  }).strict(),
});

const suggestDoctors = z.object({
  body: z.object({
    symptoms: z.string({
      message: 'Symptoms are required',
    }),
  }),
});

export const doctorValidation = {
  updateDoctor,
  suggestDoctors,
};
