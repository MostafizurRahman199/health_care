import { Prisma, Patient } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { patientSearchableFields } from './patient.constants';
import ApiError from '../../../errors/ApiError';
import { cloudinaryHelper } from '../../../helpers/cloudinary';

const getAllFromDB = async (filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  // Not deleted patients only
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.patient.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string, user: any) => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
    },
  });

  if (result && user.role === 'PATIENT' && result.email !== user.email) {
    throw ApiError.forbidden('You can only view your own profile');
  }

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: any,
  user: any,
  file?: Express.Multer.File
) => {
  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/patients'
    );
    payload.profilePhoto = uploaded.secure_url;
  }

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.role === 'PATIENT' && patientInfo.email !== user.email) {
    throw ApiError.forbidden('You can only update your own profile');
  }

  const result = await prisma.patient.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.patient.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const patientService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
