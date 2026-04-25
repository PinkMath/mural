// src/hooks/usePhotoDB.ts

// Verifica se o arquivo é uma imagem
export const isImageFile = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(filename);
};

// Comprime a imagem e retorna uma string Base64
export const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Define um tamanho máximo para não estourar o limite do Firebase (Base64 é pesado)
        const MAX_WIDTH = 1000; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Retorna em JPEG com qualidade 0.7 (70%) para economizar espaço
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('Erro ao carregar imagem para compressão'));
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
  });
};
