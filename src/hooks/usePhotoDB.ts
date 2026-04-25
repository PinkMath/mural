// src/hooks/usePhotoDB.ts

export const isImageFile = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(filename);
};

export const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Reduzimos um pouco mais o limite para garantir fluidez no mobile
        const MAX_WIDTH = 600; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Falha ao obter contexto do Canvas'));

        // Suavização de imagem para não perder qualidade ao reduzir
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // A MÁGICA: Convertendo explicitamente para image/webp
        // Qualidade 0.6 é o "ponto doce" entre nitidez e peso de arquivo
        const webpDataUrl = canvas.toDataURL('image/webp', 0.5);
        
        resolve(webpDataUrl);
      };
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
  });
};
