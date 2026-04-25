import { useState } from 'react';
import { MonthData, MonthPhoto } from '@/mocks/photoWall';
import PhotoLightbox from './PhotoLightbox';

interface Props {
  data: MonthData;
  index: number;
}

/** Classes de grid baseadas na contagem de fotos */
const gridClass = (count: number) => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
};

/** Classes para a primeira foto em destaque (se houver 3 fotos) */
const photoWrapClass = (count: number, index: number) => {
  if (count === 3 && index === 0) return 'col-span-2 sm:col-span-1';
  return '';
};

/** Controle de proporção (Aspect Ratio) */
const aspectClass = (count: number, index: number) => {
  if (count === 1) return 'aspect-[4/3] sm:aspect-[16/7]';
  if (count === 2) return 'aspect-square sm:aspect-[4/5]';
  if (count === 3 && index === 0) return 'aspect-[16/9] sm:aspect-square';
  return 'aspect-square';
};

const MonthSection = ({ data }: Props) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<MonthPhoto | null>(null);
  
  const lightboxIndex = data.photos.findIndex((p) => p.id === lightboxPhoto?.id);
  const isEmpty = data.photos.length === 0;
  const count = data.photos.length;

  const openPhoto = (photo: MonthPhoto) => setLightboxPhoto(photo);
  const closePhoto = () => setLightboxPhoto(null);

  const goPrev = lightboxIndex > 0 ? () => setLightboxPhoto(data.photos[lightboxIndex - 1]) : undefined;
  const goNext = lightboxIndex < data.photos.length - 1 ? () => setLightboxPhoto(data.photos[lightboxIndex + 1]) : undefined;

  return (
    <div className="mb-12 md:mb-20">
      <section>
        {/* Month Header - Removido transform e opacity */}
        <div className="flex items-end gap-3 sm:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="bebas text-white/8 text-5xl sm:text-6xl md:text-8xl tabular-nums select-none leading-none">
              {String(data.month).padStart(2, '0')}
            </span>
            <span className="bebas text-white/10 text-3xl sm:text-4xl md:text-6xl select-none leading-none">
              /
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="bebas text-white text-xl sm:text-2xl md:text-3xl tracking-[0.1em] uppercase leading-none truncate">
              {data.label}
            </h2>
            <span className="text-[#C2003E]/40 text-[10px] tracking-[0.35em] uppercase">{data.year}</span>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-white/20 text-xs tracking-widest whitespace-nowrap">
              {count} {count === 1 ? 'foto' : 'fotos'}
            </span>
          </div>
        </div>

        {/* Divider - Estático */}
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
                className={`group relative overflow-hidden cursor-pointer bg-neutral-900 ${photoWrapClass(count, pi)} ${aspectClass(count, pi)}`}
                onClick={() => openPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || data.label}
                  loading="eager" // Força o carregamento imediato
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-active:scale-105 sm:group-hover:scale-105"
                />
                
                {/* Overlay de gradiente sempre visível no mobile para leitura da legenda */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
                
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white/90 text-[10px] sm:text-xs tracking-[0.1em] uppercase leading-tight line-clamp-1">
                      {photo.caption}
                    </p>
                  </div>
                )}
                
                {/* Indicador de Zoom (Apenas Decorativo) */}
                <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="ri-zoom-in-line text-white text-xs" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom accent */}
        <div className="mt-4 md:mt-6 flex items-center gap-2">
          <div className="w-3 h-px bg-[#C2003E]/25" />
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
    </div>
  );
};

export default MonthSection;
