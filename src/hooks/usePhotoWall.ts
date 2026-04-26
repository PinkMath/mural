import { useState, useCallback, useEffect } from 'react';
import { initialPhotoWall, MonthData, MonthPhoto } from '@/mocks/photoWall';
import { db } from '@/lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';

export const usePhotoWall = () => {
  const [months, setMonths] = useState<MonthData[]>(initialPhotoWall);
  const [loading, setLoading] = useState(true);

  const muralRef = ref(db, 'mural_data');

  useEffect(() => {
    const unsubscribe = onValue(muralRef, async (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setMonths(data);
      } else {
        await set(muralRef, initialPhotoWall);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateFirebase = useCallback(async (updater: (prev: MonthData[]) => MonthData[]) => {
    const snapshot = await get(muralRef);
    const currentData = snapshot.val() || initialPhotoWall;
    const updatedData = updater(currentData);

    await set(muralRef, updatedData);
  }, []);

  const addPhoto = useCallback((monthIndex: number, photo: MonthPhoto) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: [...m.photos, photo] }
          : m
      )
    );
  }, [updateFirebase]);

  const addPhotos = useCallback((monthIndex: number, photos: MonthPhoto[]) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: [...m.photos, ...photos] }
          : m
      )
    );
  }, [updateFirebase]);

  const removePhoto = useCallback((monthIndex: number, photoId: string) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: m.photos.filter((p) => p.id !== photoId) }
          : m
      )
    );
  }, [updateFirebase]);

  const updatePhoto = useCallback((monthIndex: number, photoId: string, updates: Partial<MonthPhoto>) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? {
              ...m,
              photos: m.photos.map((p) =>
                p.id === photoId ? { ...p, ...updates } : p
              ),
            }
          : m
      )
    );
  }, [updateFirebase]);

  const resetToDefault = useCallback(() => {
    set(muralRef, initialPhotoWall);
  }, []);

  const restoreBackup = useCallback((data: MonthData[]) => {
    set(muralRef, data);
  }, []);

  return {
    months,
    loading,
    addPhoto,
    addPhotos,
    removePhoto,
    updatePhoto,
    resetToDefault,
    restoreBackup,
  };
};
