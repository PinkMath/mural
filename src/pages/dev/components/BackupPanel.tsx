import { useState, useRef } from 'react';
import { MonthData } from '@/mocks/photoWall';

interface Props {
  months: MonthData[];
  onImport: (data: MonthData[]) => void;
}

const BackupPanel = ({ months, onImport }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [confirmImport, setConfirmImport] = useState<MonthData[] | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const totalPhotos = months.reduce((acc, m) => acc + m.photos.length, 0);
  const totalMonths = months.filter(m => m.photos.length > 0).length;

  // ─── Export ───────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    setExportDone(false);
    try {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        totalPhotos,
        data: months,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `terceirao-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 4000);
    } finally {
      setExporting(false);
    }
  };

  // ─── Import ───────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImportSuccess(false);
    setImporting(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        // Validate structure
        const data: MonthData[] = parsed.data ?? parsed;
        if (!Array.isArray(data) || !data.every(m => typeof m.month === 'number' && Array.isArray(m.photos))) {
          setImportError('Arquivo inválido. Use um backup gerado por este painel.');
          setImporting(false);
          return;
        }
        setConfirmImport(data);
      } catch {
        setImportError('Não foi possível ler o arquivo. Verifique se é um JSON válido.');
      }
      setImporting(false);
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!confirmImport) return;
    onImport(confirmImport);
    setConfirmImport(null);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 5000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h3 className="text-white/80 text-sm tracking-[0.25em] uppercase mb-1">Backup do Mural</h3>
        <p className="text-white/25 text-xs">
          Exporte todas as fotos salvas neste navegador como arquivo JSON. Use para fazer backup manual ou migrar para outro dispositivo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/3 border border-white/8 p-4 flex flex-col gap-1">
          <span className="text-[#C2003E]/60 text-xs tracking-[0.25em] uppercase">Fotos salvas</span>
          <span className="text-white text-2xl font-light tabular-nums">{totalPhotos.toLocaleString('pt-BR')}</span>
        </div>
        <div className="bg-white/3 border border-white/8 p-4 flex flex-col gap-1">
          <span className="text-[#C2003E]/60 text-xs tracking-[0.25em] uppercase">Meses com fotos</span>
          <span className="text-white text-2xl font-light tabular-nums">{totalMonths} / 12</span>
        </div>
      </div>

      {/* Export block */}
      <div className="bg-white/3 border border-white/8 p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center border border-[#C2003E]/20 flex-shrink-0">
            <i className="ri-download-cloud-2-line text-[#C2003E]/60 text-lg" />
          </div>
          <div>
            <p className="text-white/70 text-sm tracking-wide mb-0.5">Exportar backup</p>
            <p className="text-white/25 text-xs leading-relaxed">
              Baixa um arquivo <span className="text-white/40">.json</span> com todas as fotos (incluindo imagens em base64 e URLs). Guarde em local seguro.
            </p>
          </div>
        </div>

        {exportDone && (
          <div className="flex items-center gap-2 text-[#C2003E] text-xs bg-[#C2003E]/8 border border-[#C2003E]/20 px-3 py-2">
            <i className="ri-check-double-line" /> Download iniciado! Guarde o arquivo em lugar seguro.
          </div>
        )}

        <button
          onClick={handleExport}
          disabled={exporting || totalPhotos === 0}
          className="bg-[#C2003E] text-white text-xs font-bold uppercase tracking-[0.25em] px-6 py-3 hover:bg-white transition-colors cursor-pointer w-full sm:w-auto sm:self-start disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {exporting ? (
            <><i className="ri-loader-4-line animate-spin" /> Preparando...</>
          ) : (
            <><i className="ri-download-2-line" /> Baixar backup ({totalPhotos} fotos)</>
          )}
        </button>
        {totalPhotos === 0 && (
          <p className="text-white/20 text-xs -mt-2">Nenhuma foto para exportar ainda.</p>
        )}
      </div>

      {/* Import block */}
      <div className="bg-white/3 border border-white/8 p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center border border-amber-400/20 flex-shrink-0">
            <i className="ri-upload-cloud-2-line text-amber-400/60 text-lg" />
          </div>
          <div>
            <p className="text-white/70 text-sm tracking-wide mb-0.5">Restaurar backup</p>
            <p className="text-white/25 text-xs leading-relaxed">
              Carrega um arquivo de backup gerado por este painel. <span className="text-amber-400/50">Atenção: substitui todas as fotos atuais.</span>
            </p>
          </div>
        </div>

        {importError && (
          <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/8 border border-red-500/20 px-3 py-2">
            <i className="ri-error-warning-line" /> {importError}
          </div>
        )}

        {importSuccess && (
          <div className="flex items-center gap-2 text-[#C2003E] text-xs bg-[#C2003E]/8 border border-[#C2003E]/20 px-3 py-2">
            <i className="ri-check-double-line" /> Backup restaurado com sucesso!
          </div>
        )}

        {/* Confirm dialog */}
        {confirmImport && (
          <div className="border border-amber-400/30 bg-amber-400/5 p-4 flex flex-col gap-3">
            <p className="text-amber-400 text-xs leading-relaxed">
              <i className="ri-alert-line mr-1.5" />
              Arquivo contém <strong>{confirmImport.reduce((a, m) => a + m.photos.length, 0)}</strong> fotos em <strong>{confirmImport.filter(m => m.photos.length > 0).length}</strong> meses.
              Isso vai <strong>substituir</strong> os dados atuais.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={handleConfirmImport}
                className="bg-amber-400 text-black text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="ri-check-line" /> Confirmar restauração
              </button>
              <button
                onClick={() => setConfirmImport(null)}
                className="border border-white/15 text-white/40 hover:text-white/70 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors cursor-pointer flex items-center justify-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="border border-amber-400/30 text-amber-400/70 hover:text-amber-400 hover:border-amber-400/60 text-xs uppercase tracking-[0.2em] px-5 py-3 transition-colors cursor-pointer w-full sm:w-auto sm:self-start disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {importing ? (
            <><i className="ri-loader-4-line animate-spin" /> Lendo...</>
          ) : (
            <><i className="ri-folder-open-line" /> Selecionar backup</>
          )}
        </button>
      </div>

      {/* Safety note */}
      <div className="border border-white/5 bg-white/2 px-4 py-3 flex items-start gap-3">
        <i className="ri-shield-check-line text-white/20 text-sm mt-0.5" />
        <p className="text-white/20 text-xs leading-relaxed">
          O backup contém as fotos armazenadas <strong className="text-white/30">localmente neste navegador</strong>. Para proteção total em qualquer dispositivo, conecte o Supabase.
        </p>
      </div>
    </div>
  );
};

export default BackupPanel;
