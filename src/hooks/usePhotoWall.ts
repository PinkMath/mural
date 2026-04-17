import { useState, useCallback, useEffect } from 'react';
import { initialPhotoWall, MonthData, MonthPhoto } from '@/mocks/photoWall';
import { loadWallData, saveWallData } from './usePhotoDB';

export const usePhotoWall = () => {
  const [months, setMonths] = useState<MonthData[]>(initialPhotoWall);
  const [loading, setLoading] = useState(true);

  // Load from IndexedDB on mount
  useEffect(() => {
    loadWallData()
      .then((data) => {
        if (data) setMonths(data);
      })
      .catch(() => {/* keep initial data */})
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((updated: MonthData[]) => {
    saveWallData(updated).catch(console.error);
    return updated;
  }, []);

  const addPhoto = useCallback((monthIndex: number, photo: MonthPhoto) => {
    setMonths((prev) => persist(
      prev.map((m, i) => i === monthIndex ? { ...m, photos: [...m.photos, photo] } : m)
    ));
  }, [persist]);

  const addPhotos = useCallback((monthIndex: number, photos: MonthPhoto[]) => {
    setMonths((prev) => persist(
      prev.map((m, i) => i === monthIndex ? { ...m, photos: [...m.photos, ...photos] } : m)
    ));
  }, [persist]);

  const removePhoto = useCallback((monthIndex: number, photoId: string) => {
    setMonths((prev) => persist(
      prev.map((m, i) =>
        i === monthIndex ? { ...m, photos: m.photos.filter((p) => p.id !== photoId) } : m
      )
    ));
  }, [persist]);

  const updatePhoto = useCallback((monthIndex: number, photoId: string, updates: Partial<MonthPhoto>) => {
    setMonths((prev) => persist(
      prev.map((m, i) =>
        i === monthIndex
          ? { ...m, photos: m.photos.map((p) => p.id === photoId ? { ...p, ...updates } : p) }
          : m
      )
    ));
  }, [persist]);

  const resetToDefault = useCallback(() => {
    setMonths(persist(initialPhotoWall));
  }, [persist]);

  const restoreBackup = useCallback((data: MonthData[]) => {
    setMonths(persist(data));
  }, [persist]);

  return { months, loading, addPhoto, addPhotos, removePhoto, updatePhoto, resetToDefault, restoreBackup };
};
