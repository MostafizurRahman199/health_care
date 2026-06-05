import { Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { doctorSearchableFields } from './doctor.constants';
import ApiError from '../../../errors/ApiError';
import { cloudinaryHelper } from '../../../helpers/cloudinary';
import { openRouterHelper } from '../../../helpers/openRouterHelper';

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
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          patient: true,
          appointment: true,
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

const suggestDoctors = async (symptoms: string) => {
  const allDoctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  if (allDoctors.length === 0) {
    throw new ApiError(404, 'No doctors available for suggestion');
  }

  // extract minimal data for prompt
  const doctorListForAI = allDoctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    experienceYears: doc.experienceYears,
    qualification: doc.qualification,
    specialties: doc.doctorSpecialties.map((ds) => ds.specialties.title),
  }));

  const prompt = `You are a medical assistant matching a patient's symptoms to the most suitable doctors.
Patient's symptoms: "${symptoms}"

Here is the list of available doctors:
${JSON.stringify(doctorListForAI, null, 2)}

Suggest up to 3 most suitable doctors for this patient from the provided list based on their specialties and experience. 
You MUST return ONLY a JSON array containing the exact IDs (strings) of the recommended doctors, for example: ["doctor_id_1", "doctor_id_2"]. Do not include markdown formatting or any other text.`;

  const responseContent = await openRouterHelper.sendPrompt(prompt);
  
  const cleanContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
  
  let suggestedIds: string[];
  try {
    suggestedIds = JSON.parse(cleanContent) as string[];
  } catch (err) {
    throw new ApiError(500, 'Failed to parse AI response into JSON');
  }

  if (!suggestedIds || suggestedIds.length === 0) {
    throw new ApiError(404, 'AI could not suggest any doctors');
  }

  const suggestedDoctors = await prisma.doctor.findMany({
    where: {
      id: {
        in: suggestedIds,
      },
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return suggestedDoctors;
};

export const doctorService = {
  getAllFromDB,
  updateIntoDB,
  deleteFromDB,
  suggestDoctors,
};
