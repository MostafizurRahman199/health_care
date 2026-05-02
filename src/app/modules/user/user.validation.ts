import { z } from 'zod';

const createPatientValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
    address: z.string().optional(),
  }),
});

const createDoctorValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
    address: z.string().optional(),
    registrationNumber: z.string({ message: 'Registration number is required' }),
    experienceYears: z.coerce.number().int().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    appintmentFee: z.coerce.number().int({ message: 'Appointment fee is required' }),
    qualification: z.string({ message: 'Qualification is required' }),
    cureentWorkingPlcae: z.string({ message: 'Current working place is required' }),
    designation: z.string({ message: 'Designation is required' }),
    specialization: z.string().optional(),
  }),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  }),
});

export const userValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema,
};
