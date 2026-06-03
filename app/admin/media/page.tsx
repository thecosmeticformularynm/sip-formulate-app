'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { useStaffStore, PageMediaItem, PageMediaConfig, defaultPageMedia } from '@/lib/staffStore';
import PinEntry from '@/components/PinEntry';

const ADMIN_PIN = '0000';

const PAGES: { key: keyof PageMediaConfig; label: string; desc: string; dark: boolean }[] = [
  { key: 'landing', label: 'Landing Page', desc: 'The first screen guests see', dark: true },
  { key: 'start',   label: 'Check-In',     desc: 'Check-in & waiver screen',   dark: false },
  { key: 'create',  label: 'Create',       desc: 'Formula creation steps',     dark: false },
  { key: 'label',   label: 'Label',        desc: 'Label preview & approval',   dark: false },
  { key: 'done',    label: 'Done',         desc: 'Completion / celebration',   dark: true  },
];

const POSITIONS = [
  { value: 'center center', label: 'Center' },
  { value: 'center top',    label: 'Top' },
  { value: 'center bottom', label: 'Bottom' },
  { value: 'left center',   label: 'Left' },
  { value: 'right center',  label: 'Right' },
];

export default function MediaAdminPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const { pageMedia, setPageMedia } = useStaffStore();
  const [activeKey, setActiveKey] = useState<keyof PageMediaConfig>('landing');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!adminAuthed) {
    return (
      <PinEntry
        title="Admin Access"
        subtitle="Enter admin PIN"
        correctPin={ADMIN_PIN}
        onSuccess={() => setAdminAuthed(true)}
        onCancel={() => router.push('/admin')}
      />
    );
  }

  const current: PageMediaItem = pageMedia?.[activeKey] ?? defaultPageMedia[activeKey];
  const activePage = PAGES.find(p => p.key === activeKey)!;

  const update = (changes: Partial<PageMediaItem>) => {
    setPageMedia(activeKey, { ...current, ...changes });
    setSaved(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const isVideo = file.type.startsWith('video/');
      update({ type: isVideo ? 'video' : 'image', url: result });
      setUrlInput('');
      setUploading(false);
      flash();
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSave = () => {
    if (!urlInput.trim()) return;
    const isVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(urlInput);
    update({ type: isVideo ? 'video' : 'image', url: urlInput.trim() });
    setUrlInput('');
    flash();
  };

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleClear = () => {
    setPageMedia(activeKey, defaultPageMedia[activeKey]);
    setUrlInput('');
    flash();
  };

  const isActive = current.type !== 'none' && current.url;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: 0 }}>←</button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 26, color: 'var(--color-text-primary)', margin: 0 }}>Media Manager</h1>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', margin: 0 }}>Background photos & videos per page</p>
          </div>
        </div>
        {saved && (
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5BAF8A', backgroundColor: 'rgba(91,175,138,0.1)', padding: '8px 16px', borderRadius: 100 }}>
            Saved
          </div>
        )}
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <Image src="/tcf-logo-black.svg" alt="The Cosmetic Formulary" width={28} height={28} style={{ opacity: 0.35 }} />
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>

        {/* Left — page selector */}
        <div style={{ width: 220, borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', padding: '24px 16px', flexShrink: 0 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 12, padding: '0 8px' }}>Pages</p>
          {PAGES.map(p => {
            const med = pageMedia?.[p.key] ?? defaultPageMedia[p.key];
            const hasMedia = med.type !== 'none' && med.url;
            return (
              <button
                key={p.key}
                onClick={() => { setActiveKey(p.key); setUrlInput(''); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '12px 12px',
                  borderRadius: 12, marginBottom: 4, border: 'none', cursor: 'pointer',
                  backgroundColor: activeKey === p.key ? 'var(--color-background)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'var(--color-text-primary)', fontWeight: activeKey === p.key ? 500 : 400 }}>{p.label}</span>
                  {hasMedia && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B8962E', flexShrink: 0 }} />
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{p.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Right — editor */}
        <div style={{ flex: 1, padding: '32px 40px', maxWidth: 700 }}>

          {/* Preview box */}
          <div style={{
            width: '100%', aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', position: 'relative',
            backgroundColor: activePage.dark ? '#1C1917' : '#F4EFE6',
            border: '1px solid var(--color-border)', marginBottom: 32,
          }}>
            {isActive && current.type === 'image' && (
              <img
                src={current.url}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: current.position, opacity: current.opacity / 100 }}
              />
            )}
            {isActive && current.type === 'video' && (
              <video
                src={current.url}
                autoPlay muted loop playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: current.position, opacity: current.opacity / 100 }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)', fontSize: 32, fontWeight: 300,
                color: activePage.dark ? '#FAF7F2' : '#1C1917', opacity: 0.6, margin: 0
              }}>{activePage.label}</p>
              {!isActive && (
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: activePage.dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', marginTop: 8 }}>
                  No media set
                </p>
              )}
            </div>
          </div>

          {/* Upload section */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 12 }}>Upload from device</p>
            <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={handleFileUpload} style={{ display: 'none' }} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%', padding: '20px', borderRadius: 16, border: '1.5px dashed var(--color-border)',
                backgroundColor: 'var(--color-surface)', cursor: 'pointer', textAlign: 'center',
                color: 'var(--color-text-secondary)', fontSize: 14, transition: 'border-color 0.15s',
              }}
            >
              {uploading ? 'Processing...' : 'Click to upload photo or video'}
              <br />
              <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4, display: 'block' }}>
                JPG, PNG, GIF, MP4, MOV, WebM
              </span>
            </button>
          </div>

          {/* URL section */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 12 }}>Or paste a URL</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlSave()}
                placeholder="https://... (image or video URL)"
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 12, fontSize: 14,
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)', outline: 'none',
                }}
              />
              <button
                onClick={handleUrlSave}
                disabled={!urlInput.trim()}
                style={{
                  padding: '14px 24px', borderRadius: 12, fontSize: 12, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontWeight: 500, border: 'none', cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
                  backgroundColor: urlInput.trim() ? 'var(--color-gold)' : 'var(--color-border)',
                  color: urlInput.trim() ? '#1C1917' : 'var(--color-text-tertiary)',
                }}
              >
                Set
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
              Works with Dropbox, Google Drive (direct links), iCloud, Cloudinary, or any direct file URL
            </p>
          </div>

          {/* Adjustments — only show if media is set */}
          {isActive && (
            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 20 }}>Adjustments</p>

              {/* Opacity */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>Opacity</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{current.opacity}%</span>
                </div>
                <input
                  type="range" min={5} max={100} value={current.opacity}
                  onChange={e => update({ opacity: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#B8962E' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>Subtle</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>Full</span>
                </div>
              </div>

              {/* Position */}
              <div>
                <p style={{ fontSize: 13, color: 'var(--color-text-primary)', marginBottom: 10 }}>Focus Position</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {POSITIONS.map(pos => (
                    <button
                      key={pos.value}
                      onClick={() => update({ position: pos.value })}
                      style={{
                        padding: '8px 16px', borderRadius: 100, fontSize: 12, border: '1px solid',
                        cursor: 'pointer',
                        borderColor: current.position === pos.value ? 'var(--color-gold)' : 'var(--color-border)',
                        backgroundColor: current.position === pos.value ? 'rgba(184,150,46,0.1)' : 'transparent',
                        color: current.position === pos.value ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Current media info + clear */}
          {isActive && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold)' }}>
                  {current.type === 'video' ? 'Video' : 'Image'} active
                </span>
                <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2, wordBreak: 'break-all', maxWidth: 340 }}>
                  {current.url.startsWith('data:') ? `Uploaded file (${Math.round(current.url.length / 1024)}KB)` : current.url}
                </p>
              </div>
              <button
                onClick={handleClear}
                style={{ fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', flexShrink: 0 }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
