import { useState, useCallback, useEffect } from 'react';
import { initialPhotoWall, MonthData, MonthPhoto } from '@/mocks/photoWall';
import { db } from '@/firebase';
import { ref, onValue, set } from 'firebase/database';

export const usePhotoWall = () => {
  const [months, setMonths] = useState<MonthData[]>(initialPhotoWall);
  const [loading, setLoading] = useState(true);

  // Referência do banco de dados (o nó principal onde as fotos ficarão)
  const muralRef = ref(db, 'mural_data');

  // LER DO FIREBASE: Sincroniza em tempo real ao carregar o app
  useEffect(() => {
    const unsubscribe = onValue(muralRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMonths(data);
      } else {
        // Se o Firebase estiver vazio, inicializa com os dados padrão
        set(muralRef, initialPhotoWall);
      }
      setLoading(false);
    });

    // Limpa a conexão ao fechar o app
    return () => unsubscribe();
  }, []);

  // FUNÇÃO DE PERSISTÊNCIA: Agora salva no Firebase
  const persist = useCallback((updated: MonthData[]) => {
    set(muralRef, updated).catch(console.error);
    return updated;
  }, []);

  // ADICIONAR UMA FOTO
  const addPhoto = useCallback((monthIndex: number, photo: MonthPhoto) => {
    setMonths((prev) => persist(
      prev.map((m, i) => i === monthIndex ? { ...m, photos: [...m.photos, photo] } : m)
    ));
  }, [persist]);

  // ADICIONAR VÁRIAS FOTOS (Upload de pasta/ZIP)
  const addPhotos = useCallback((monthIndex: number, photos: MonthPhoto[]) => {
    setMonths((prev) => persist(
      prev.map((m, i) => i === monthIndex ? { ...m, photos: [...m.photos, ...photos] } : m)
    ));
  }, [persist]);

  // REMOVER FOTO
  const removePhoto = useCallback((monthIndex: number, photoId: string) => {
    setMonths((prev) => persist(
      prev.map((m, i) =>
        i === monthIndex ? { ...m, photos: m.photos.filter((p) => p.id !== photoId) } : m
      )
    ));
  }, [persist]);

  // EDITAR LEGENDA OU DADOS DA FOTO
  const updatePhoto = useCallback((monthIndex: number, photoId: string, updates: Partial<MonthPhoto>) => {
    setMonths((prev) => persist(
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: m.photos.map((p) => p.id === photoId ? { ...p, ...updates } : p) }
          : m
      )
    ));
  }, [persist]);

  // RESETAR PARA O PADRÃO (CUIDADO: Isso apaga tudo no Firebase e volta ao início)
  const resetToDefault = useCallback(() => {
    setMonths(persist(initialPhotoWall));
  }, [persist]);

  // RESTAURAR UM BACKUP JSON
  const restoreBackup = useCallback((data: MonthData[]) => {
    setMonths(persist(data));
  }, [persist]);

  return { months, loading, addPhoto, addPhotos, removePhoto, updatePhoto, resetToDefault, restoreBackup };
};
