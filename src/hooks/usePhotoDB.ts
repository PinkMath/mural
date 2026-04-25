import { uploadToCloudinary } from "@/lib/cloudinary";

export const isImageFile = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(filename);
};

export const compressImage = async (file: File): Promise<string> => {
  return await uploadToCloudinary(file);
};
