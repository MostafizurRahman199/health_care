import prisma from '../../../shared/prisma';
import { bcryptHelper } from '../../../helpers/bcrypt';
import { cloudinaryHelper } from '../../../helpers/cloudinary';
import { Prisma } from '@prisma/client';
import { buildWhereConditions } from '../../../shared/buildWhereConditions';

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



const getAllUsersFromDB = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = options;
  const { searchTerm, ...filterData } = params;

  // Define all the fields we want to search against
  const searchableFields = ['email', 'admin.name', 'doctor.name', 'patient.name'];

  // Use the reusable buildWhereConditions helper
  const whereConditions = buildWhereConditions(
    searchTerm,
    searchableFields,
    filterData
  ) as Prisma.UserWhereInput;

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const userService = {
  createPatientIntoDB,
  createDoctorIntoDB,
  createAdminIntoDB,
  getAllUsersFromDB,
};