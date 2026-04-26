import { uploadToCloudinary } from "@/lib/cloudinary";
import heic2any from "heic2any";
import * as exifr from 'exifr';

export const isImageFile = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(filename);
};

const isHeicFile = (file: File): boolean => {
  return /\.(heic|heif)$/i.test(file.name);
};

export const convertHeicToJpeg = async (file: File): Promise<File> => {
  const convertedBlob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.85,
  });

  const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

  return new File(
    [blob],
    file.name.replace(/\.(heic|heif)$/i, ".jpg"),
    { type: "image/jpeg" }
  );
};

export const getImageDate = async (file: File): Promise<string | null> => {
  try {
    const data = await exifr.parse(file, ["DateTimeOriginal", "CreateDate"]);

    const date: Date | undefined = data?.DateTimeOriginal || data?.CreateDate;

    if (!date) return null;

    return date.toLocaleDateString("pt-BR");
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
            file.name.replace(/\.(jpg|jpeg|png|webp|gif|heic|heif)$/i, ".webp"),
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
  const fileToProcess = isHeicFile(file)
    ? await convertHeicToJpeg(file)
    : file;

  const webpFile = await convertToWebP(fileToProcess, 0.8);

  return await uploadToCloudinary(webpFile);
};
