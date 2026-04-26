import { uploadToCloudinary } from "@/lib/cloudinary";

export const isImageFile = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
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
