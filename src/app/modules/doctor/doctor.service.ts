import { Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { doctorSearchableFields } from './doctor.constants';
import ApiError from '../../../errors/ApiError';
import { cloudinaryHelper } from '../../../helpers/cloudinary';

const getAllFromDB = async (filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
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

  // Not deleted doctors only
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
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

const updateIntoDB = async (
  id: string,
  payload: any,
  user: any,
  file?: Express.Multer.File
) => {
  const { specialties, ...doctorData } = payload;

  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/doctors'
    );
    doctorData.profilePhoto = uploaded.secure_url;
  }

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.role === 'DOCTOR' && doctorInfo.email !== user.email) {
    throw ApiError.forbidden('You can only update your own profile');
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // delete specialties
      const deleteSpecialtiesIds = specialties
        .filter((specialty: any) => specialty.isDeleted)
        .map((specialty: any) => specialty.specialtiesId);

      if (deleteSpecialtiesIds.length > 0) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: {
              in: deleteSpecialtiesIds,
            },
          },
        });
      }

      // create specialties
      const createSpecialtiesIds = specialties
        .filter((specialty: any) => !specialty.isDeleted)
        .map((specialty: any) => specialty.specialtiesId);

      if (createSpecialtiesIds.length > 0) {
        const createSpecialtiesPayload = createSpecialtiesIds.map(
          (specialtiesId: string) => ({
            doctorId: id,
            specialtiesId,
          })
        );

        await transactionClient.doctorSpecialties.createMany({
          data: createSpecialtiesPayload,
          skipDuplicates: true,
        });
      }
    }
  });

  const responseData = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return responseData;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const doctorService = {
  getAllFromDB,
  updateIntoDB,
  deleteFromDB,
};