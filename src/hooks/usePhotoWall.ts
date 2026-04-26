import { useState, useCallback, useEffect } from 'react';
import { initialPhotoWall, MonthData, MonthPhoto } from '@/mocks/photoWall';
import { db } from '@/lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';

export const usePhotoWall = () => {
  const [months, setMonths] = useState<MonthData[]>(initialPhotoWall);
  const [loading, setLoading] = useState(true);

  const muralRef = ref(db, 'mural_data');

  const normalizeMonths = (data: any): MonthData[] => {
    const source = Array.isArray(data) ? data : initialPhotoWall;

    return initialPhotoWall.map((defaultMonth, index) => {
      const firebaseMonth = source[index];

      return {
        ...defaultMonth,
        ...firebaseMonth,
        photos: Array.isArray(firebaseMonth?.photos)
          ? firebaseMonth.photos
          : [],
      };
    });
  };

  useEffect(() => {
    const unsubscribe = onValue(muralRef, async (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setMonths(normalizeMonths(data));
      } else {
        await set(muralRef, initialPhotoWall);
        setMonths(initialPhotoWall);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateFirebase = useCallback(async (updater: (prev: MonthData[]) => MonthData[]) => {
    const snapshot = await get(muralRef);
    const currentData = normalizeMonths(snapshot.val());
    const updatedData = normalizeMonths(updater(currentData));

    await set(muralRef, updatedData);
  }, []);

  const addPhoto = useCallback((monthIndex: number, photo: MonthPhoto) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: [...(m.photos ?? []), photo] }
          : m
      )
    );
  }, [updateFirebase]);

  const addPhotos = useCallback((monthIndex: number, photos: MonthPhoto[]) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: [...(m.photos ?? []), ...photos] }
          : m
      )
    );
  }, [updateFirebase]);

  const removePhoto = useCallback((monthIndex: number, photoId: string) => {
    updateFirebase((prev) =>
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: (m.photos ?? []).filter((p) => p.id !== photoId) }
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
              photos: (m.photos ?? []).map((p) =>
                p.id === photoId ? { ...p, ...updates } : p
              ),
            }
          : m
      )
    );
  }, [updateFirebase]);

  const resetToDefault = useCallback(() => {
    set(muralRef, normalizeMonths(initialPhotoWall));
  }, []);

  const restoreBackup = useCallback((data: MonthData[]) => {
    set(muralRef, normalizeMonths(data));
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
