import { uploadToCloudinary } from "@/lib/cloudinary";
import * as exifr from 'exifr';

export const isImageFile = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
};

export const getImageDate = async (file: File): Promise<string | null> => {
  try {
    const data = await exifr.parse(file);

    if (!data) return null;

    const date: Date | undefined = data.DateTimeOriginal || data.CreateDate;

    if (!date) return null;

    // Formato BR: DD/MM
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${day}/${month}/${date.getFullYear()}`;
  } catch {
    return null;
  }
};

const convertToWebP = (file: File, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");

      const maxWidth = 1600;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Erro ao criar canvas"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Erro ao converter imagem para WebP"));
            return;
          }

          const webpFile = new File(
            [blob],
            file.name.replace(/\.(jpg|jpeg|png|webp)$/i, ".webp"),
            { type: "image/webp" }
          );

          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Erro ao carregar imagem"));
    };

    img.src = url;
  });
};

export const compressImage = async (file: File): Promise<string> => {
  const webpFile = await convertToWebP(file, 0.8);
  return await uploadToCloudinary(webpFile);
};
