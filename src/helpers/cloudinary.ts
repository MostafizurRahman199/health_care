import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret,
});

const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'health-care'
): Promise<{ secure_url: string; public_id: string }> => {
  const result = await cloudinary.uploader.upload(filePath, { folder });

  // Remove temp file after successful upload
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};

export const cloudinaryHelper = {
  uploadToCloudinary,
};
