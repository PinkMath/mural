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

const SAVE_BATCH_SIZE = 10;
const MAX_FILES = 500;
const MAX_TOTAL_SIZE_GB = 2;
const MAX_ZIP_SIZE_GB = 2;

const bytesToGB = (bytes: number) => bytes / 1024 / 1024 / 1024;

const PhotoUploader = ({ monthLabel, onPhotosReady }: Props) => {
  const folderRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const updateProgress = (index: number, status: ProgressItem['status']) => {
    setProgress((prev) =>
      prev.map((p, i) => (i === index ? { ...p, status } : p))
    );
  };

  const saveBatch = (batch: MonthPhoto[]) => {
    if (batch.length > 0) {
      onPhotosReady(batch);
    }
  };

  const validateFiles = (files: File[]) => {
    const imageFiles = files.filter((f) => isImageFile(f.name));

    if (imageFiles.length === 0) {
      return {
        ok: false,
        imageFiles: [],
        message: 'Nenhuma imagem encontrada. Formatos aceitos: JPG, PNG, WEBP, GIF.',
      };
    }

    if (imageFiles.length > MAX_FILES) {
      return {
        ok: false,
        imageFiles: [],
        message: `Muitas imagens. Envie no máximo ${MAX_FILES} fotos por vez.`,
      };
    }

    const totalSizeGB = bytesToGB(
      imageFiles.reduce((acc, file) => acc + file.size, 0)
    );

    if (totalSizeGB > MAX_TOTAL_SIZE_GB) {
      return {
        ok: false,
        imageFiles: [],
        message: `A pasta tem ${totalSizeGB.toFixed(2)}GB. O limite é ${MAX_TOTAL_SIZE_GB}GB por envio.`,
      };
    }

    return {
      ok: true,
      imageFiles,
      message: '',
    };
  };

  const processFiles = async (files: File[]) => {
    const validation = validateFiles(files);

    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    const imageFiles = validation.imageFiles;

    setProcessing(true);
    setDone(false);
    setError('');
    setProgress(imageFiles.map((f) => ({ name: f.name, status: 'pending' })));

    let batch: MonthPhoto[] = [];
    let successCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      updateProgress(i, 'processing');

      try {
        const url = await compressImage(imageFiles[i]);
        const date = await getImageDate(imageFiles[i]);

        const nameBase = date
          ? `Foto do dia ${date}`
          : imageFiles[i].name.replace(/\.[^.]+$/, '');

        batch.push({
          id: crypto.randomUUID(),
          url,
          caption: nameBase,
        });

        successCount++;
        updateProgress(i, 'done');

        if (batch.length >= SAVE_BATCH_SIZE) {
          saveBatch(batch);
          batch = [];
        }
      } catch (err) {
        console.error(err);
        updateProgress(i, 'error');
      }

      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    saveBatch(batch);

    if (successCount > 0) {
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

    if (bytesToGB(file.size) > MAX_ZIP_SIZE_GB) {
      setError(`ZIP muito grande. O limite é ${MAX_ZIP_SIZE_GB}GB por envio.`);
      return;
    }

    setProcessing(true);
    setDone(false);
    setError('');
    setProgress([]);

    try {
      const zip = await JSZip.loadAsync(file);

      const imageEntries = Object.entries(zip.files).filter(([name, entry]) => {
        const filename = name.split('/').pop() ?? '';
        return !entry.dir && isImageFile(filename);
      });

      if (imageEntries.length === 0) {
        setError('Nenhuma imagem encontrada no ZIP.');
        setProcessing(false);
        return;
      }

      if (imageEntries.length > MAX_FILES) {
        setError(`O ZIP tem ${imageEntries.length} imagens. Envie no máximo ${MAX_FILES} por vez.`);
        setProcessing(false);
        return;
      }

      setProgress(
        imageEntries.map(([name]) => ({
          name: name.split('/').pop() ?? name,
          status: 'pending',
        }))
      );

      let batch: MonthPhoto[] = [];
      let successCount = 0;

      for (let i = 0; i < imageEntries.length; i++) {
        const [name, entry] = imageEntries[i];
        const filename = name.split('/').pop() ?? name;

        updateProgress(i, 'processing');

        try {
          const blob = await entry.async('blob');
          const imageFile = new File([blob], filename, { type: blob.type || 'image/jpeg' });

          const url = await compressImage(imageFile);
          const nameBase = filename.replace(/\.[^.]+$/, '');

          batch.push({
            id: crypto.randomUUID(),
            url,
            caption: nameBase,
          });

          successCount++;
          updateProgress(i, 'done');

          if (batch.length >= SAVE_BATCH_SIZE) {
            saveBatch(batch);
            batch = [];
          }
        } catch (err) {
          console.error(err);
          updateProgress(i, 'error');
        }

        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      saveBatch(batch);

      if (successCount > 0) {
        setDone(true);
      } else {
        setError('Não foi possível processar nenhuma imagem do ZIP.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao ler o arquivo ZIP. Certifique-se que é um ZIP válido.');
    }

    setProcessing(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);

    const zipFile = files.find((file) => file.name.toLowerCase().endsWith('.zip'));

    if (zipFile) {
      const fakeEvent = {
        target: {
          files: [zipFile],
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await handleZipChange(fakeEvent);
      return;
    }

    await processFiles(files);
  };

  const reset = () => {
    setProgress([]);
    setDone(false);
    setError('');
  };

  const doneCount = progress.filter((p) => p.status === 'done').length;
  const errorCount = progress.filter((p) => p.status === 'error').length;
  const totalCount = progress.length;
  const processedCount = doneCount + errorCount;

  return (
    <div className="bg-white/3 border border-[#C2003E]/15 p-5">
      <p className="text-[#C2003E]/60 text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
        <i className="ri-folder-upload-line text-base" />
        Enviar pasta ou ZIP — {monthLabel}
      </p>

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
            <p className="text-white/20 text-xs">
              Suporta pastas grandes, processando uma foto por vez
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-2">
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

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 px-3 py-2 mb-3">
          <i className="ri-error-warning-line text-red-400 text-sm mt-0.5" />
          <p className="text-red-400 text-xs flex-1">{error}</p>
          <button
            onClick={reset}
            className="text-red-400/50 hover:text-red-400 cursor-pointer"
          >
            <i className="ri-close-line text-sm" />
          </button>
        </div>
      )}

      {progress.length > 0 && (
        <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto mb-3">
          {progress.map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex items-center gap-2 px-2 py-1">
              <span
                className={`flex-shrink-0 w-4 h-4 flex items-center justify-center text-xs ${
                  item.status === 'done'
                    ? 'text-[#C2003E]'
                    : item.status === 'error'
                      ? 'text-red-400'
                      : item.status === 'processing'
                        ? 'text-yellow-400'
                        : 'text-white/20'
                }`}
              >
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

      {processing && progress.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/30 mb-1">
            <span>Processando e enviando...</span>
            <span>
              {processedCount}/{totalCount}
            </span>
          </div>

          <div className="h-1 bg-white/5 w-full">
            <div
              className="h-full bg-[#C2003E] transition-all duration-300"
              style={{
                width: `${totalCount > 0 ? (processedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>

          <p className="text-white/15 text-[10px] mt-2">
            Não feche esta página até terminar. As fotos são salvas em blocos de {SAVE_BATCH_SIZE}.
          </p>
        </div>
      )}

      {done && !processing && (
        <div className="flex items-center justify-between bg-[#C2003E]/10 border border-[#C2003E]/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <i className="ri-check-double-line text-[#C2003E] text-sm" />
            <p className="text-[#C2003E] text-xs">
              {doneCount} foto{doneCount !== 1 ? 's' : ''} adicionada{doneCount !== 1 ? 's' : ''} em{' '}
              <strong>{monthLabel}</strong>!
              {errorCount > 0 && (
                <span className="text-red-400 ml-1">({errorCount} com erro)</span>
              )}
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
        Formatos aceitos: JPG, PNG, WEBP, GIF &nbsp;·&nbsp; Limite: até {MAX_FILES} imagens ou {MAX_TOTAL_SIZE_GB}GB por envio &nbsp;·&nbsp; Convertidas automaticamente para WebP &nbsp;·&nbsp; Salvas aos poucos para evitar travar
      </p>
    </div>
  );
};

export default PhotoUploader;
