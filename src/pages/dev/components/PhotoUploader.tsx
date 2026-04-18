import { useRef, useState, DragEvent } from 'react';
import JSZip from 'jszip';
import { compressImage, isImageFile } from '@/hooks/usePhotoDB';
import { MonthPhoto } from '@/mocks/photoWall';

interface Props {
  monthLabel: string;
  onPhotosReady: (photos: MonthPhoto[]) => void;
}

interface ProgressItem {
  name: string;
  status: 'pending' | 'processing' | 'done' | 'error';
}

const PhotoUploader = ({ monthLabel, onPhotosReady }: Props) => {
  const folderRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const updateProgress = (index: number, status: ProgressItem['status']) => {
    setProgress((prev) => prev.map((p, i) => i === index ? { ...p, status } : p));
  };

  const processFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => isImageFile(f.name));
    if (imageFiles.length === 0) {
      setError('Nenhuma imagem encontrada. Formatos aceitos: JPG, PNG, WEBP, GIF.');
      return;
    }

    setProcessing(true);
    setDone(false);
    setError('');
    setProgress(imageFiles.map((f) => ({ name: f.name, status: 'pending' })));

    const photos: MonthPhoto[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      updateProgress(i, 'processing');
      try {
        const dataUrl = await compressImage(imageFiles[i]);
        const nameBase = imageFiles[i].name.replace(/\.[^.]+$/, '');
        photos.push({
          id: `upload-${Date.now()}-${i}`,
          url: dataUrl,
          caption: nameBase,
        });
        updateProgress(i, 'done');
      } catch {
        updateProgress(i, 'error');
      }
    }

    if (photos.length > 0) {
      onPhotosReady(photos);
      setDone(true);
    } else {
      setError('Não foi possível processar nenhuma imagem.');
    }
    setProcessing(false);
  };

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    await processFiles(files);
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setProcessing(true);
    setError('');
    setProgress([]);
    try {
      const zip = await JSZip.loadAsync(file);
      const entries: { name: string; blob: Blob }[] = [];

      const promises = Object.entries(zip.files)
        .filter(([name, entry]) => !entry.dir && isImageFile(name.split('/').pop() ?? ''))
        .map(async ([name, entry]) => {
          const blob = await entry.async('blob');
          entries.push({ name: name.split('/').pop() ?? name, blob });
        });

      await Promise.all(promises);

      if (entries.length === 0) {
        setError('Nenhuma imagem encontrada no ZIP.');
        setProcessing(false);
        return;
      }

      setProgress(entries.map((e) => ({ name: e.name, status: 'pending' })));

      const photos: MonthPhoto[] = [];
      for (let i = 0; i < entries.length; i++) {
        updateProgress(i, 'processing');
        try {
          const imageFile = new File([entries[i].blob], entries[i].name, { type: 'image/jpeg' });
          const dataUrl = await compressImage(imageFile);
          const nameBase = entries[i].name.replace(/\.[^.]+$/, '');
          photos.push({
            id: `upload-${Date.now()}-${i}`,
            url: dataUrl,
            caption: nameBase,
          });
          updateProgress(i, 'done');
        } catch {
          updateProgress(i, 'error');
        }
      }

      if (photos.length > 0) {
        onPhotosReady(photos);
        setDone(true);
      } else {
        setError('Não foi possível processar nenhuma imagem do ZIP.');
      }
    } catch {
      setError('Erro ao ler o arquivo ZIP. Certifique-se que é um ZIP válido.');
    }
    setProcessing(false);
  };

  // Drag and drop
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const items = Array.from(e.dataTransfer.items);

    // Check for zip
    const zipItem = items.find((it) => it.kind === 'file' && it.getAsFile()?.name.endsWith('.zip'));
    if (zipItem) {
      const zipFile = zipItem.getAsFile();
      if (zipFile) {
        const fakeEvent = { target: { files: [zipFile], value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
        await handleZipChange(fakeEvent);
        return;
      }
    }

    // Regular files
    const files = items
      .filter((it) => it.kind === 'file')
      .map((it) => it.getAsFile())
      .filter((f): f is File => f !== null && isImageFile(f.name));

    if (files.length > 0) await processFiles(files);
  };

  const reset = () => {
    setProgress([]);
    setDone(false);
    setError('');
  };

  const doneCount = progress.filter((p) => p.status === 'done').length;
  const errorCount = progress.filter((p) => p.status === 'error').length;

  return (
    <div className="bg-white/3 border border-[#C2003E]/15 p-5">
      <p className="text-[#C2003E]/60 text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
        <i className="ri-folder-upload-line text-base" />
        Enviar pasta ou ZIP — {monthLabel}
      </p>

      {/* Drop zone */}
      {!processing && !done && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed transition-all duration-300 p-8 flex flex-col items-center gap-4 mb-4 ${
            dragging
              ? 'border-[#C2003E]/60 bg-[#C2003E]/5'
              : 'border-white/10 hover:border-white/25'
          }`}
        >
          <div className="w-14 h-14 flex items-center justify-center border border-white/10">
            <i className="ri-folder-3-line text-white/30 text-3xl" />
          </div>
          <div className="text-center">
            <p className="text-white/50 text-sm mb-1">
              {dragging ? 'Solte aqui!' : 'Arraste uma pasta ou arquivo ZIP aqui'}
            </p>
            <p className="text-white/20 text-xs">ou use os botões abaixo</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-2">
            {/* Hidden inputs */}
            <input
              ref={folderRef}
              type="file"
              multiple
              accept="image/*"
              // @ts-expect-error non-standard attribute
              webkitdirectory=""
              // @ts-expect-error non-standard attribute
              directory=""
              className="hidden"
              onChange={handleFolderChange}
            />
            <input
              ref={zipRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={handleZipChange}
            />

            <button
              type="button"
              onClick={() => folderRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 border border-white/15 text-white/50 hover:border-[#C2003E]/40 hover:text-[#C2003E] text-xs uppercase tracking-[0.2em] py-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <i className="ri-folder-open-line text-sm" /> Pasta
            </button>
            <button
              type="button"
              onClick={() => zipRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 border border-white/15 text-white/50 hover:border-[#C2003E]/40 hover:text-[#C2003E] text-xs uppercase tracking-[0.2em] py-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <i className="ri-file-zip-line text-sm" /> ZIP
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 px-3 py-2 mb-3">
          <i className="ri-error-warning-line text-red-400 text-sm mt-0.5" />
          <p className="text-red-400 text-xs flex-1">{error}</p>
          <button onClick={reset} className="text-red-400/50 hover:text-red-400 cursor-pointer">
            <i className="ri-close-line text-sm" />
          </button>
        </div>
      )}

      {/* Progress list */}
      {progress.length > 0 && (
        <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto mb-3">
          {progress.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1">
              <span className={`flex-shrink-0 w-4 h-4 flex items-center justify-center text-xs ${
                item.status === 'done' ? 'text-[#C2003E]'
                : item.status === 'error' ? 'text-red-400'
                : item.status === 'processing' ? 'text-yellow-400'
                : 'text-white/20'
              }`}>
                {item.status === 'done' && <i className="ri-check-line" />}
                {item.status === 'error' && <i className="ri-close-line" />}
                {item.status === 'processing' && <i className="ri-loader-4-line animate-spin" />}
                {item.status === 'pending' && <i className="ri-time-line" />}
              </span>
              <p className="text-white/40 text-xs truncate flex-1">{item.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Processing bar */}
      {processing && progress.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/30 mb-1">
            <span>Processando...</span>
            <span>{doneCount + errorCount}/{progress.length}</span>
          </div>
          <div className="h-1 bg-white/5 w-full">
            <div
              className="h-full bg-[#C2003E] transition-all duration-300"
              style={{ width: `${progress.length > 0 ? ((doneCount + errorCount) / progress.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {done && !processing && (
        <div className="flex items-center justify-between bg-[#C2003E]/10 border border-[#C2003E]/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <i className="ri-check-double-line text-[#C2003E] text-sm" />
            <p className="text-[#C2003E] text-xs">
              {doneCount} foto{doneCount !== 1 ? 's' : ''} adicionada{doneCount !== 1 ? 's' : ''} em{' '}
              <strong>{monthLabel}</strong>!
              {errorCount > 0 && <span className="text-red-400 ml-1">({errorCount} com erro)</span>}
            </p>
          </div>
          <button
            onClick={reset}
            className="text-[#C2003E]/40 hover:text-[#C2003E] cursor-pointer whitespace-nowrap text-xs tracking-widest uppercase ml-4"
          >
            Enviar mais
          </button>
        </div>
      )}

      <p className="text-white/10 text-[10px] mt-3 leading-relaxed">
        Formatos aceitos: JPG, PNG, GIF &nbsp;·&nbsp; Convertidas automaticamente para WebP (menor tamanho, mesma qualidade) &nbsp;·&nbsp; ZIP será descompactado
      </p>
    </div>
  );
};

export default PhotoUploader;
