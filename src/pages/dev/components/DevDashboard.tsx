import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePhotoWall } from '@/hooks/usePhotoWall';
import { MonthData, MonthPhoto } from '@/mocks/photoWall';
import PhotoUploader from './PhotoUploader';
import BackupPanel from './BackupPanel';

interface Props {
  logout: () => void;
}

type Tab = 'upload' | 'manage' | 'add-url' | 'backup';

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'upload',  icon: 'ri-folder-upload-line', label: 'Pasta/ZIP'  },
  { key: 'add-url', icon: 'ri-link',               label: 'Link URL'   },
  { key: 'manage',  icon: 'ri-image-line',          label: 'Gerenciar' },
  { key: 'backup',  icon: 'ri-archive-2-line',      label: 'Backup'    },
];

const DevDashboard = ({ logout }: Props) => {
  const { months, loading, addPhotos, addPhoto, removePhoto, updatePhoto, resetToDefault, restoreBackup } = usePhotoWall();
  const [activeMonth, setActiveMonth] = useState<number>(0);
  const [tab, setTab] = useState<Tab>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add URL state
  const [addUrl, setAddUrl] = useState('');
  const [addCaption, setAddCaption] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Manage state
  const [confirmReset, setConfirmReset] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');

  // Month strip ref (for scroll-to-active)
  const stripRef = useRef<HTMLDivElement>(null);

  const currentMonth = months[activeMonth];
  const totalPhotos = months.reduce((acc, m) => acc + m.photos.length, 0);

  const selectMonth = (i: number) => {
    setActiveMonth(i);
    setTab('upload');
    setSidebarOpen(false);
  };

  const handleUploadReady = (photos: MonthPhoto[]) => addPhotos(activeMonth, photos);

  const handleAddUrl = () => {
    setAddError('');

    if (!addUrl.trim()) {
      setAddError('Insira a URL da foto.');
      return;
    }

    try {
      new URL(addUrl.trim());
    } catch {
      setAddError('URL inválida. Use um link completo (https://...).');
      return;
    }

    addPhoto(activeMonth, {
      id: crypto.randomUUID(),
      url: addUrl.trim(),
      caption: addCaption.trim() || undefined,
    });

    setAddUrl('');
    setAddCaption('');
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  const handleStartEdit = (photo: MonthPhoto) => { setEditingId(photo.id); setEditCaption(photo.caption ?? ''); };
  const handleSaveEdit = (photoId: string) => {
    updatePhoto(activeMonth, photoId, { caption: editCaption.trim() || undefined });
    setEditingId(null);
  };
  const handleReset = () => {
    if (confirmReset) { resetToDefault(); setConfirmReset(false); }
    else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 5000); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
      <i className="ri-loader-4-line text-[#C2003E] text-3xl animate-spin" />
      <p className="text-white/30 text-xs tracking-widest uppercase">Carregando mural...</p>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

    {/* ── Top bar ─────────────────────────────────────────────── */}
    <header className="border-b border-white/8 px-4 md:px-8 h-14 flex items-center justify-between bg-[#0d0d0d] sticky top-0 z-40 flex-shrink-0">
    {/* Left */}
    <div className="flex items-center gap-3">
    <button
    onClick={() => setSidebarOpen(true)}
    className="md:hidden w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#C2003E] transition-colors cursor-pointer"
    >
    <i className="ri-menu-3-line text-base" />
    </button>
    <div className="w-6 h-6 flex items-center justify-center border border-[#C2003E]/20 flex-shrink-0">
    <i className="ri-shield-keyhole-line text-[#C2003E]/50 text-xs" />
    </div>
    <span className="bebas text-[#C2003E]/70 tracking-[0.3em] text-base">Painel Dev</span>
    <span className="hidden sm:inline text-white/15 text-xs">|</span>
    <span className="hidden sm:inline text-white/25 text-xs tabular-nums">{totalPhotos} fotos</span>
    </div>
    <div className="flex items-center gap-3">
    <Link
    to="/"
    className="text-white/30 hover:text-[#C2003E] text-xs tracking-widest uppercase transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
    >
    <i className="ri-eye-line text-sm" />
    <span className="hidden sm:inline">Ver site</span>
    </Link>
    <div className="w-px h-4 bg-white/10" />
    <button
    onClick={logout}
    className="text-red-400/40 hover:text-red-400 text-xs tracking-widest uppercase transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
    >
    <i className="ri-logout-box-line text-sm" />
    <span className="hidden sm:inline">Sair</span>
    </button>
    </div>
    </header>

    {/* ── Mobile sidebar drawer overlay ───────────────────────── */}
    {sidebarOpen && (
      <div
      className="fixed inset-0 bg-black/70 z-50 md:hidden"
      onClick={() => setSidebarOpen(false)}
      >
      <div
      className="absolute left-0 top-0 bottom-0 w-64 bg-[#0c0c0c] border-r border-white/8 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      >
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/8">
      <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase">Meses 2026</p>
      <button
      onClick={() => setSidebarOpen(false)}
      className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 cursor-pointer"
      >
      <i className="ri-close-line" />
      </button>
      </div>
      <div className="py-2">
      {months.map((m, i) => (
        <button
        key={m.month}
        onClick={() => selectMonth(i)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all cursor-pointer ${
          activeMonth === i
            ? 'bg-[#C2003E]/8 text-white border-r-2 border-[#C2003E]/50'
            : 'text-white/35 hover:text-white/60 hover:bg-white/3'
        }`}
        >
        <div className="flex items-center gap-2">
        <span className="text-white/20 text-[10px] tabular-nums">{String(m.month).padStart(2, '0')}</span>
        <span className="text-white/15 text-[10px]">/</span>
        <span className="text-xs tracking-wide">{m.label}</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          m.photos.length > 0 ? 'bg-[#C2003E]/10 text-[#C2003E]/60' : 'text-white/15'
        }`}>
        {m.photos.length}
        </span>
        </button>
      ))}
      </div>
      </div>
      </div>
    )}

    {/* ── Body ────────────────────────────────────────────────── */}
    <div className="flex flex-1 overflow-hidden">

    {/* Desktop sidebar */}
    <aside className="hidden md:flex w-52 border-r border-white/5 flex-shrink-0 bg-[#0c0c0c] overflow-y-auto flex-col">
    <div className="py-4">
    <p className="text-white/20 text-[10px] tracking-[0.35em] uppercase px-4 mb-3">Meses 2026</p>
    {months.map((m, i) => (
      <button
      key={m.month}
      onClick={() => selectMonth(i)}
      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all cursor-pointer ${
        activeMonth === i
          ? 'bg-[#C2003E]/8 text-white border-r border-[#C2003E]/40'
          : 'text-white/35 hover:text-white/60 hover:bg-white/3'
      }`}
      >
      <div className="flex items-center gap-2">
      <span className="text-white/20 text-[10px] tabular-nums">{String(m.month).padStart(2, '0')}</span>
      <span className="text-white/15 text-[10px]">/</span>
      <span className="text-xs tracking-wide">{m.label}</span>
      </div>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
        m.photos.length > 0 ? 'bg-[#C2003E]/10 text-[#C2003E]/50' : 'text-white/15'
      }`}>
      {m.photos.length}
      </span>
      </button>
    ))}
    </div>
    </aside>

    {/* Main content */}
    <main className="flex-1 overflow-y-auto flex flex-col min-w-0">

    {/* Mobile: horizontal month strip */}
    <div
    ref={stripRef}
    className="md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-b border-white/5 bg-[#0c0c0c] flex-shrink-0 scrollbar-hide"
    >
    {months.map((m, i) => (
      <button
      key={m.month}
      onClick={() => selectMonth(i)}
      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-[11px] uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
        activeMonth === i
          ? 'bg-[#C2003E]/15 text-[#C2003E] border border-[#C2003E]/30'
          : 'text-white/30 border border-white/8 hover:text-white/60'
      }`}
      >
      <span className="text-[9px] tabular-nums opacity-60">{String(m.month).padStart(2, '0')}</span>
      <span className="opacity-30 text-[9px]">/</span>
      <span>{m.label}</span>
      {m.photos.length > 0 && (
        <span className="text-[9px] bg-[#C2003E]/20 text-[#C2003E]/70 px-1 rounded-full">
        {m.photos.length}
        </span>
      )}
      </button>
    ))}
    </div>

    {/* Content area */}
    <div className="flex-1 p-4 md:p-8">

    {/* Month header */}
    <div className="flex items-start justify-between gap-3 mb-5">
    <div className="min-w-0">
    <h2 className="bebas text-white text-2xl md:text-3xl tracking-[0.05em] leading-none flex items-baseline gap-2">
    <span className="text-white/25">{String(currentMonth.month).padStart(2, '0')}</span>
    <span className="text-white/20 text-xl">/</span>
    {currentMonth.label}
    <span className="text-white/20 ml-1 text-xl md:text-2xl">2026</span>
    </h2>
    <p className="text-white/25 text-xs mt-1 tracking-widest">
    {currentMonth.photos.length === 0
      ? 'Nenhuma foto ainda'
      : `${currentMonth.photos.length} foto${currentMonth.photos.length > 1 ? 's' : ''}`}
      </p>
      </div>
      <button
      onClick={handleReset}
      className={`flex-shrink-0 text-xs px-3 py-2 border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
        confirmReset
          ? 'border-red-500/50 text-red-400 bg-red-500/10'
          : 'border-white/10 text-white/25 hover:border-white/25 hover:text-white/50'
      }`}
      >
      <i className="ri-refresh-line" />
      <span className="hidden sm:inline">{confirmReset ? 'Confirmar?' : 'Restaurar padrão'}</span>
      <span className="sm:hidden">{confirmReset ? 'Ok?' : 'Reset'}</span>
      </button>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto mb-5 -mx-4 md:mx-0 px-4 md:px-0">
      <div className="flex items-center gap-1 bg-white/3 p-1 w-max min-w-full md:min-w-0 md:w-fit">
      {TABS.map((t) => (
        <button
        key={t.key}
        onClick={() => setTab(t.key)}
        className={`flex items-center gap-1.5 px-3 md:px-4 py-2 text-[11px] md:text-xs uppercase tracking-[0.12em] transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
          tab === t.key
            ? t.key === 'backup'
            ? 'bg-amber-400 text-black font-bold'
            : 'bg-[#C2003E] text-white font-bold'
              : 'text-white/40 hover:text-white/70'
        }`}
        >
        <i className={`${t.icon} text-sm`} />
        <span>{t.label}</span>
        </button>
      ))}
      </div>
      </div>

      {/* Tab content */}
      <div className="animate-tab-enter">

      <div className={tab === 'upload' ? 'block' : 'hidden'}>
      <PhotoUploader
      monthLabel={currentMonth.label}
      onPhotosReady={handleUploadReady}
      />
      </div>

      {tab === 'add-url' && (
        <div className="bg-white/3 border border-white/8 p-4 md:p-5">
        <p className="text-[#C2003E]/50 text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
        <i className="ri-add-circle-line" /> Adicionar por URL
        </p>
        <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
        <label className="text-white/25 text-xs">URL da imagem *</label>
        <input
        type="url"
        value={addUrl}
        onChange={(e) => { setAddUrl(e.target.value); setAddError(''); }}
        placeholder="https://..."
        className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-[#C2003E]/40 transition-colors placeholder:text-white/15 w-full"
        />
        </div>
        <div className="flex flex-col gap-1.5">
        <label className="text-white/25 text-xs">Legenda (opcional)</label>
        <input
        type="text"
        value={addCaption}
        onChange={(e) => setAddCaption(e.target.value)}
        placeholder="Ex: Rolê do Carnaval..."
        className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-[#C2003E]/40 transition-colors placeholder:text-white/15 w-full"
        />
        </div>
        {addError && (
          <div className="flex items-start gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2">
          <i className="ri-error-warning-line flex-shrink-0 mt-0.5" /> <span>{addError}</span>
          </div>
        )}
        {addSuccess && (
          <div className="flex items-center gap-2 text-[#C2003E] text-xs bg-[#C2003E]/10 border border-[#C2003E]/20 px-3 py-2">
          <i className="ri-check-line" /> Foto adicionada!
          </div>
        )}
        <button
        onClick={handleAddUrl}
        className="bg-[#C2003E] text-white text-xs font-bold uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 self-start"
        >
        <i className="ri-image-add-line" /> Adicionar
        </button>
        </div>
        </div>
      )}

      {tab === 'manage' && (
        <div>
        <p className="text-white/30 text-xs tracking-[0.25em] uppercase mb-4">
        Fotos em {currentMonth.label}
        </p>
        {currentMonth.photos.length === 0 ? (
          <div className="border border-dashed border-white/8 py-14 flex flex-col items-center gap-3 text-white/20">
          <i className="ri-image-line text-4xl" />
          <p className="text-xs tracking-widest uppercase">Nenhuma foto adicionada</p>
          <button
          onClick={() => setTab('upload')}
          className="mt-2 text-[#C2003E]/40 hover:text-[#C2003E] text-xs tracking-widest uppercase transition-colors cursor-pointer"
          >
          <i className="ri-folder-upload-line mr-1.5" />
          Enviar pasta
          </button>
          </div>
        ) : (
        <div className="flex flex-col gap-2">
        {currentMonth.photos.map((photo) => (
          <div key={photo.id} className="flex items-center gap-3 bg-white/3 border border-white/5 p-3">
          <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 overflow-hidden bg-white/5">
          <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-full object-cover object-top"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />
          </div>
          <div className="flex-1 min-w-0">
          {editingId === photo.id ? (
            <div className="flex items-center gap-2">
            <input
            type="text"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Legenda..."
            className="flex-1 min-w-0 bg-white/5 border border-white/20 text-white text-xs px-2 py-1.5 outline-none focus:border-[#C2003E]/40"
            />
            <button onClick={() => handleSaveEdit(photo.id)} className="text-[#C2003E] cursor-pointer w-7 h-7 flex-shrink-0 flex items-center justify-center">
            <i className="ri-check-line text-sm" />
            </button>
            <button onClick={() => setEditingId(null)} className="text-white/30 hover:text-white/60 cursor-pointer w-7 h-7 flex-shrink-0 flex items-center justify-center">
            <i className="ri-close-line text-sm" />
            </button>
            </div>
          ) : (
          <>
          <p className="text-white/60 text-xs truncate mb-0.5">
          {photo.caption || <span className="text-white/20 italic">sem legenda</span>}
          </p>
          <p className="text-white/15 text-[10px] truncate">
          {photo.url.startsWith('data:') ? 'Arquivo local' : photo.url}
          </p>
          </>
          )}
          </div>
          {editingId !== photo.id && (
            <div className="flex items-center gap-1 flex-shrink-0">
            <button
            onClick={() => handleStartEdit(photo)}
            className="w-8 h-8 flex items-center justify-center text-white/25 hover:text-[#C2003E] transition-colors cursor-pointer"
            >
            <i className="ri-pencil-line text-sm" />
            </button>
            <button
            onClick={() => removePhoto(activeMonth, photo.id)}
            className="w-8 h-8 flex items-center justify-center text-red-400/30 hover:text-red-400 transition-colors cursor-pointer"
            >
            <i className="ri-delete-bin-line text-sm" />
            </button>
            </div>
          )}
          </div>
        ))}
        </div>
        )}
        </div>
      )}

      {tab === 'backup' && (
        <BackupPanel months={months} onImport={restoreBackup} />
      )}



      </div>
      </div>
      </main>
      </div>
      </div>
  );
};

export default DevDashboard;
