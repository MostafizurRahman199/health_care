import prisma from '../../../shared/prisma';
import { cloudinaryHelper } from '../../../helpers/cloudinary';

const insertIntoDB = async (
  file: Express.Multer.File | undefined,
  payload: { title: string }
) => {
  // Upload icon to Cloudinary if provided
  let iconUrl: string | undefined;
  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/specialties'
    );
    iconUrl = uploaded.secure_url;
  }

  const result = await prisma.specialties.create({
    data: {
      title: payload.title,
      ...(iconUrl && { icon: iconUrl }),
    },
  });

  return result;
};

const getAllFromDB = async () => {
  const result = await prisma.specialties.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.specialties.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  file: Express.Multer.File | undefined,
  payload: { title?: string }
) => {
  // Ensure the specialty exists
  await prisma.specialties.findUniqueOrThrow({
    where: { id },
  });

  // Upload new icon if provided
  let iconUrl: string | undefined;
  if (file) {
    const uploaded = await cloudinaryHelper.uploadToCloudinary(
      file.path,
      'health-care/specialties'
    );
    iconUrl = uploaded.secure_url;
  }

  const result = await prisma.specialties.update({
    where: { id },
    data: {
      ...payload,
      ...(iconUrl && { icon: iconUrl }),
    },
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  // Ensure the specialty exists
  await prisma.specialties.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.specialties.delete({
    where: { id },
  });

  return result;
};

export const specialtiesService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
