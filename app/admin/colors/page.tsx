'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { COLORS, Color } from '@/lib/data';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

export default function ColorsAdminPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const [colors, setColors] = useState<Color[]>(COLORS);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!adminAuthed) {
    return <PinEntry title="Admin Access" correctPin={ADMIN_PIN} onSuccess={() => setAdminAuthed(true)} onCancel={() => router.push('/admin')} />;
  }

  const openEdit = (c: Color) => { setEditingColor({ ...c }); setShowModal(true); };
  const openNew = () => { setEditingColor({ id: `color-${Date.now()}`, name: '', hex: '#FFFFFF', active: true }); setShowModal(true); };

  const save = () => {
    if (!editingColor) return;
    setColors((prev) => {
      const exists = prev.find((c) => c.id === editingColor.id);
      if (exists) return prev.map((c) => (c.id === editingColor.id ? editingColor : c));
      return [...prev, editingColor];
    });
    setShowModal(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>← Back</button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Colors</h1>
          <button onClick={openNew} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--color-gold)', minHeight: 44 }}>
            + Add Color
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => openEdit(color)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: color.hex === 'transparent' ? 'white' : color.hex,
                    border: color.hex === 'transparent' ? '2px dashed var(--color-border)' : '1px solid rgba(0,0,0,0.1)',
                    opacity: color.active ? 1 : 0.4,
                  }}
                />
                <p className="text-xs text-center leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                  {color.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {color.hex === 'transparent' ? 'clear' : color.hex}
                </p>
              </button>
            ))}
          </div>
        </div>

        {showModal && editingColor && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {editingColor.name || 'New Color'}
              </h2>
              {/* Color preview */}
              <div
                className="w-16 h-16 rounded-full mb-5 mx-auto"
                style={{
                  backgroundColor: editingColor.hex === 'transparent' ? 'white' : editingColor.hex,
                  border: editingColor.hex === 'transparent' ? '2px dashed var(--color-border)' : '2px solid var(--color-border)',
                }}
              />
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Name</label>
                  <input
                    value={editingColor.name}
                    onChange={(e) => setEditingColor((c) => c ? { ...c, name: e.target.value } : c)}
                    className="w-full border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Hex Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingColor.hex === 'transparent' ? '#FFFFFF' : editingColor.hex}
                      onChange={(e) => setEditingColor((c) => c ? { ...c, hex: e.target.value } : c)}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                      style={{ border: '1px solid var(--color-border)' }}
                    />
                    <input
                      value={editingColor.hex}
                      onChange={(e) => setEditingColor((c) => c ? { ...c, hex: e.target.value } : c)}
                      className="flex-1 border rounded-xl px-4 py-3 text-sm"
                      style={{ borderColor: 'var(--color-border)' }}
                      placeholder="#FFFFFF or transparent"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingColor.active}
                    onChange={(e) => setEditingColor((c) => c ? { ...c, active: e.target.checked } : c)}
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={save} className="flex-1 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--color-gold)' }}>Save</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
