import { useState } from 'react';
import { MonthData, MonthPhoto } from '@/mocks/photoWall';
import PhotoLightbox from './PhotoLightbox';

interface Props {
  data: MonthData;
  index: number;
}

/** Grid class based on total photo count */
const gridClass = (count: number) => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
};

/** Per-photo wrapper classes — handles col-span for featured first photo */
const photoWrapClass = (count: number, index: number) => {
  // For 3 photos: first photo is full-width on mobile (spans 2 cols), normal on sm+
  if (count === 3 && index === 0) return 'col-span-2 sm:col-span-1';
  return '';
};

/** Aspect ratio class per photo */
const aspectClass = (count: number, index: number) => {
  if (count === 1) return 'aspect-[4/3] sm:aspect-[16/7]';
  if (count === 2) return 'aspect-square sm:aspect-[4/5]';
  if (count === 3 && index === 0) return 'aspect-[16/9] sm:aspect-square';
  return 'aspect-square';
};

const MonthSection = ({ data, index }: Props) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<MonthPhoto | null>(null);
  const lightboxIndex = data.photos.findIndex((p) => p.id === lightboxPhoto?.id);

  const openPhoto = (photo: MonthPhoto) => setLightboxPhoto(photo);
  const closePhoto = () => setLightboxPhoto(null);

  const goPrev = lightboxIndex > 0 ? () => setLightboxPhoto(data.photos[lightboxIndex - 1]) : undefined;
  const goNext = lightboxIndex < data.photos.length - 1 ? () => setLightboxPhoto(data.photos[lightboxIndex + 1]) : undefined;

  const isEmpty = data.photos.length === 0;
  const count = data.photos.length;

  return (
    <>
      <section className="mb-12 md:mb-20 animate-fade-in" style={{ animationDelay: `${index * 0.04}s` }}>

        {/* Month Header */}
        <div className="flex items-end gap-3 sm:gap-4 mb-4 md:mb-6">
          <span className="bebas text-white/8 text-5xl sm:text-6xl md:text-8xl tabular-nums select-none leading-none flex-shrink-0">
            {String(data.month).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="bebas text-white text-xl sm:text-2xl md:text-3xl tracking-[0.1em] uppercase leading-none truncate">
              {data.label}
            </h2>
            <span className="text-[#00ffcc]/40 text-[10px] tracking-[0.35em] uppercase">{data.year}</span>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-white/20 text-xs tracking-widest whitespace-nowrap">
              {count} {count === 1 ? 'foto' : 'fotos'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6 mb-4 md:mb-5" />

        {/* Photos grid */}
        {isEmpty ? (
          <div className="border border-dashed border-white/8 h-32 sm:h-40 flex items-center justify-center text-white/15 text-xs sm:text-sm tracking-widest uppercase">
            Sem fotos neste mês
          </div>
        ) : (
          <div className={`grid gap-1.5 sm:gap-2 ${gridClass(count)}`}>
            {data.photos.map((photo, pi) => (
              <div
                key={photo.id}
                className={`group relative overflow-hidden cursor-pointer ${photoWrapClass(count, pi)} ${aspectClass(count, pi)}`}
                onClick={() => openPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || data.label}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-active:scale-105 sm:group-hover:scale-105"
                />

                {/* Gradient always visible on mobile, hover on desktop */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Caption — always shown on mobile, hover on desktop */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white/80 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase leading-tight line-clamp-1">
                      {photo.caption}
                    </p>
                  </div>
                )}

                {/* Cyan top line on hover (desktop) */}
                <div className="absolute top-0 left-0 w-0 sm:group-hover:w-full h-px bg-[#00ffcc]/60 transition-all duration-500" />

                {/* Expand icon — always on mobile, hover on desktop */}
                <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-black/60 border border-white/10 sm:border-[#00ffcc]/20 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <i className="ri-zoom-in-line text-white/70 sm:text-[#00ffcc] text-xs sm:text-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom accent */}
        <div className="mt-4 md:mt-6 flex items-center gap-2">
          <div className="w-3 h-px bg-[#00ffcc]/25" />
          <div className="flex-1 h-px bg-white/4" />
        </div>
      </section>

      <PhotoLightbox
        photo={lightboxPhoto}
        monthLabel={`${data.label} ${data.year}`}
        photoIndex={lightboxIndex >= 0 ? lightboxIndex : 0}
        totalPhotos={data.photos.length}
        onClose={closePhoto}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  );
};

export default MonthSection;
