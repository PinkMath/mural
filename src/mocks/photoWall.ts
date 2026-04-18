export interface MonthPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface MonthData {
  month: number;
  label: string;
  year: number;
  photos: MonthPhoto[];
}

export const monthLabels = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const monthSlugs = [
  'janeiro', 'fevereiro', 'marco', 'abril',
  'maio', 'junho', 'julho', 'agosto',
  'setembro', 'outubro', 'novembro', 'dezembro',
];

/** Returns slug for a given month number (1-12) */
export const getMonthSlug = (month: number): string => monthSlugs[month - 1] ?? 'janeiro';

/** Returns month number (1-12) for a given slug, or null if not found */
export const getMonthBySlug = (slug: string): number | null => {
  const idx = monthSlugs.indexOf(slug.toLowerCase());
  return idx >= 0 ? idx + 1 : null;
};

export const initialPhotoWall: MonthData[] = [
  {
    month: 1,
    label: 'Janeiro',
    year: 2026,
    photos: [
      { id: 'jan-1', url: 'https://readdy.ai/api/search-image?query=beautiful%20winter%20January%20sunrise%20golden%20hour%20frost%20nature%20peaceful%20serene%20landscape%20misty%20morning%20light%20soft%20warm%20tones%20open%20field%20with%20delicate%20ice%20crystals%20on%20grass&width=800&height=1000&seq=jan1&orientation=portrait', caption: 'Amanhecer de inverno' },
      { id: 'jan-2', url: 'https://readdy.ai/api/search-image?query=January%20winter%20cozy%20indoor%20warm%20candlelight%20bokeh%20blurred%20background%20intimate%20atmosphere%20soft%20light%20warm%20brown%20tones%20steaming%20coffee%20cup%20on%20wooden%20table&width=900&height=700&seq=jan2&orientation=landscape', caption: 'Conforto do lar' },
    ],
  },
  {
    month: 2,
    label: 'Fevereiro',
    year: 2026,
    photos: [
      { id: 'feb-1', url: 'https://readdy.ai/api/search-image?query=February%20romantic%20pink%20flowers%20blooming%20cherry%20blossom%20soft%20pastel%20tones%20dreamy%20bokeh%20background%20Valentine%20spring%20beginning%20delicate%20petals%20falling%20light%20breeze%20artistic&width=800&height=1000&seq=feb1&orientation=portrait', caption: 'Flores de fevereiro' },
    ],
  },
  {
    month: 3,
    label: 'Março',
    year: 2026,
    photos: [
      { id: 'mar-1', url: 'https://readdy.ai/api/search-image?query=March%20spring%20beginning%20green%20field%20vibrant%20colors%20fresh%20grass%20blooming%20wildflowers%20golden%20afternoon%20light%20wide%20landscape%20meadow%20countryside%20bright%20cheerful%20warm&width=1000&height=700&seq=mar1&orientation=landscape', caption: 'Primavera chegando' },
      { id: 'mar-2', url: 'https://readdy.ai/api/search-image?query=spring%20rain%20drops%20on%20green%20leaves%20macro%20close%20up%20fresh%20nature%20March%20morning%20light%20transparent%20drops%20artistic%20fine%20art%20photography&width=800&height=1000&seq=mar2&orientation=portrait', caption: 'Chuva de março' },
    ],
  },
  {
    month: 4,
    label: 'Abril',
    year: 2026,
    photos: [
      { id: 'apr-1', url: 'https://readdy.ai/api/search-image?query=April%20colorful%20tulips%20garden%20vibrant%20red%20orange%20yellow%20spring%20flowers%20blooming%20beautiful%20botanical%20garden%20sunny%20day%20artistic%20photography%20shallow%20depth%20of%20field&width=900&height=700&seq=apr1&orientation=landscape', caption: 'Jardim de abril' },
    ],
  },
  {
    month: 5,
    label: 'Maio',
    year: 2026,
    photos: [
      { id: 'may-1', url: 'https://readdy.ai/api/search-image?query=May%20golden%20sunset%20long%20grass%20silhouette%20nature%20warm%20orange%20sky%20peaceful%20serene%20landscape%20cinematic%20horizon%20dramatic%20light%20rays%20hills%20countryside&width=1000&height=700&seq=may1&orientation=landscape', caption: 'Por do sol em maio' },
      { id: 'may-2', url: 'https://readdy.ai/api/search-image?query=May%20flowers%20lavender%20purple%20field%20aerial%20view%20top%20down%20abstract%20pattern%20vibrant%20color%20countryside%20France%20artistic&width=800&height=800&seq=may2&orientation=squarish', caption: 'Campos de lavanda' },
    ],
  },
  {
    month: 6,
    label: 'Junho',
    year: 2026,
    photos: [
      { id: 'jun-1', url: 'https://readdy.ai/api/search-image?query=June%20summer%20beach%20ocean%20waves%20sunset%20dramatic%20sky%20pink%20purple%20orange%20reflection%20calm%20water%20horizon%20minimalist%20fine%20art%20landscape%20photography&width=1000&height=700&seq=jun1&orientation=landscape', caption: 'Praia de junho' },
    ],
  },
  {
    month: 7,
    label: 'Julho',
    year: 2026,
    photos: [
      { id: 'jul-1', url: 'https://readdy.ai/api/search-image?query=July%20summer%20forest%20light%20rays%20through%20trees%20magical%20golden%20hour%20sunbeams%20green%20canopy%20peaceful%20serene%20woodland%20nature%20photography%20warm%20atmosphere%20ethereal&width=800&height=1000&seq=jul1&orientation=portrait', caption: 'Floresta de julho' },
      { id: 'jul-2', url: 'https://readdy.ai/api/search-image?query=summer%20July%20mountain%20lake%20reflection%20crystal%20clear%20water%20dramatic%20peaks%20surrounding%20nature%20landscape%20adventure%20travel&width=1000&height=700&seq=jul2&orientation=landscape', caption: 'Lago na montanha' },
    ],
  },
  {
    month: 8,
    label: 'Agosto',
    year: 2026,
    photos: [
      { id: 'aug-1', url: 'https://readdy.ai/api/search-image?query=August%20sunflower%20field%20golden%20yellow%20warm%20bright%20summer%20light%20rows%20of%20sunflowers%20countryside%20agricultural%20landscape%20blue%20sky%20clouds%20artistic%20photography&width=1000&height=700&seq=aug1&orientation=landscape', caption: 'Girassóis de agosto' },
    ],
  },
  {
    month: 9,
    label: 'Setembro',
    year: 2026,
    photos: [
      { id: 'sep-1', url: 'https://readdy.ai/api/search-image?query=September%20autumn%20beginning%20fallen%20leaves%20warm%20orange%20red%20tones%20morning%20light%20fog%20forest%20path%20magical%20atmospheric%20fine%20art%20photography&width=800&height=1000&seq=sep1&orientation=portrait', caption: 'Outono chegando' },
      { id: 'sep-2', url: 'https://readdy.ai/api/search-image?query=September%20harvest%20season%20golden%20wheat%20field%20countryside%20warm%20tones%20sunset%20agricultural%20landscape%20serene%20peaceful&width=1000&height=700&seq=sep2&orientation=landscape', caption: 'Colheita' },
    ],
  },
  {
    month: 10,
    label: 'Outubro',
    year: 2026,
    photos: [
      { id: 'oct-1', url: 'https://readdy.ai/api/search-image?query=October%20autumn%20foliage%20vibrant%20red%20orange%20yellow%20leaves%20forest%20canopy%20aerial%20view%20dramatic%20colors%20fall%20season%20landscape%20fine%20art&width=1000&height=700&seq=oct1&orientation=landscape', caption: 'Outono pleno' },
    ],
  },
  {
    month: 11,
    label: 'Novembro',
    year: 2026,
    photos: [
      { id: 'nov-1', url: 'https://readdy.ai/api/search-image?query=November%20late%20autumn%20bare%20trees%20dark%20moody%20fog%20misty%20morning%20light%20through%20branches%20atmospheric%20melancholic%20beautiful%20poetic%20landscape%20fine%20art%20photography&width=800&height=1000&seq=nov1&orientation=portrait', caption: 'Névoa de novembro' },
      { id: 'nov-2', url: 'https://readdy.ai/api/search-image?query=November%20rain%20window%20droplets%20city%20lights%20bokeh%20blurred%20background%20moody%20atmospheric%20indoor%20cozy%20urban%20photography&width=900&height=700&seq=nov2&orientation=landscape', caption: 'Chuva na janela' },
    ],
  },
  {
    month: 12,
    label: 'Dezembro',
    year: 2026,
    photos: [
      { id: 'dec-1', url: 'https://readdy.ai/api/search-image?query=December%20winter%20night%20starry%20sky%20milky%20way%20dark%20forest%20silhouettes%20snow%20ground%20astrophotography%20dramatic%20beautiful%20long%20exposure%20magical%20atmosphere&width=1000&height=700&seq=dec1&orientation=landscape', caption: 'Noite estrelada' },
      { id: 'dec-2', url: 'https://readdy.ai/api/search-image?query=December%20winter%20cozy%20warm%20lights%20bokeh%20snow%20falling%20night%20calm%20peaceful%20festive%20atmosphere%20soft%20glow%20magical%20quiet%20scene&width=800&height=1000&seq=dec2&orientation=portrait', caption: 'Fim de ano' },
    ],
  },
];
