import prisma from '../../../shared/prisma';
import { bcryptHelper } from '../../../helpers/bcrypt';
import { cloudinaryHelper } from '../../../helpers/cloudinary';

const createPatientIntoDB = async (
  file: Express.Multer.File | undefined,
  payload: any
) => {
  const { password, email, ...patientData } = payload;

  // Hash password before storing
  const hashedPassword = await bcryptHelper.hashPassword(password);

  // Upload profile photo to Cloudinary if provided
  let profilePhotoUrl: string | undefined;
  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/patients'
    );
    profilePhotoUrl = uploaded.secure_url;
  }

  const userData = {
    email,
    password: hashedPassword,
    role: 'PATIENT' as const,
    needPasswordChange: true,
    status: 'ACTIVE' as const,
  };

  const result = await prisma.$transaction(async (transactionClient: any) => {
    // Create user
    const user = await transactionClient.user.create({
      data: userData,
    });

    // Create patient with user relation and optional photo
    const patient = await transactionClient.patient.create({
      data: {
        ...patientData,
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
        user: {
          connect: { email: user.email },
        },
      },
      include: {
        user: true,
      },
    });

    return patient;
  });

  return result;
};

const createDoctorIntoDB = async (
  file: Express.Multer.File | undefined,
  payload: any
) => {
  const { password, email, ...doctorData } = payload;

  const hashedPassword = await bcryptHelper.hashPassword(password);

  let profilePhotoUrl: string | undefined;
  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/doctors'
    );
    profilePhotoUrl = uploaded.secure_url;
  }

  const userData = {
    email,
    password: hashedPassword,
    role: 'DOCTOR' as const,
    needPasswordChange: true,
    status: 'ACTIVE' as const,
  };

  const result = await prisma.$transaction(async (transactionClient: any) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const doctor = await transactionClient.doctor.create({
      data: {
        ...doctorData,
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
        user: {
          connect: { email: user.email },
        },
      },
      include: {
        user: true,
      },
    });

    return doctor;
  });

  return result;
};

const createAdminIntoDB = async (
  file: Express.Multer.File | undefined,
  payload: any
) => {
  const { password, email, ...adminData } = payload;

  const hashedPassword = await bcryptHelper.hashPassword(password);

  let profilePhotoUrl: string | undefined;
  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/admins'
    );
    profilePhotoUrl = uploaded.secure_url;
  }

  const userData = {
    email,
    password: hashedPassword,
    role: 'ADMIN' as const,
    needPasswordChange: true,
    status: 'ACTIVE' as const,
  };

  const result = await prisma.$transaction(async (transactionClient: any) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const admin = await transactionClient.admin.create({
      data: {
        ...adminData,
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
        user: {
          connect: { email: user.email },
        },
      },
      include: {
        user: true,
      },
    });

    return admin;
  });

  return result;
};

export const userService = {
  createPatientIntoDB,
  createDoctorIntoDB,
  createAdminIntoDB,
};