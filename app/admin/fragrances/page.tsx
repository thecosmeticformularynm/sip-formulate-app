'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { FRAGRANCES, Fragrance } from '@/lib/data';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

const emptyFragrance: Fragrance = {
  id: '',
  name: '',
  category: 'Floral',
  mood: '',
  topNotes: '',
  heartNotes: '',
  baseNotes: '',
  pairsWith: [],
  active: true,
};

export default function FragrancesAdminPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const [fragrances, setFragrances] = useState<Fragrance[]>(FRAGRANCES);
  const [editingFrag, setEditingFrag] = useState<Fragrance | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!adminAuthed) {
    return <PinEntry title="Admin Access" correctPin={ADMIN_PIN} onSuccess={() => setAdminAuthed(true)} onCancel={() => router.push('/admin')} />;
  }

  const openEdit = (f: Fragrance) => { setEditingFrag({ ...f }); setShowModal(true); };
  const openNew = () => { setEditingFrag({ ...emptyFragrance, id: `frag-${Date.now()}` }); setShowModal(true); };

  const save = () => {
    if (!editingFrag) return;
    setFragrances((prev) => {
      const exists = prev.find((f) => f.id === editingFrag.id);
      if (exists) return prev.map((f) => (f.id === editingFrag.id ? editingFrag : f));
      return [...prev, editingFrag];
    });
    setShowModal(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>← Back</button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Fragrances</h1>
          <button onClick={openNew} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--color-gold)', minHeight: 44 }}>
            + Add Fragrance
          </button>
        </div>

        <div className="px-6 py-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Category', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fragrances.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="py-3 px-2" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 16 }}>{f.name}</td>
                  <td className="py-3 px-2" style={{ color: 'var(--color-text-secondary)' }}>{f.category}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: f.active ? '#D1FAE5' : '#F3F4F6', color: f.active ? '#065F46' : '#6B7280' }}>
                      {f.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button onClick={() => openEdit(f)} className="px-3 py-1.5 rounded-lg text-xs" style={{ border: '1px solid var(--color-border)', minHeight: 34 }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && editingFrag && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {editingFrag.name || 'New Fragrance'}
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'mood', label: 'Mood' },
                  { key: 'topNotes', label: 'Top Notes' },
                  { key: 'heartNotes', label: 'Heart Notes' },
                  { key: 'baseNotes', label: 'Base Notes' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>
                    <input
                      value={editingFrag[key as keyof Fragrance] as string}
                      onChange={(e) => setEditingFrag((f) => f ? { ...f, [key]: e.target.value } : f)}
                      className="w-full border rounded-xl px-4 py-3 text-sm"
                      style={{ borderColor: 'var(--color-border)' }}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Category</label>
                  <select
                    value={editingFrag.category}
                    onChange={(e) => setEditingFrag((f) => f ? { ...f, category: e.target.value as Fragrance['category'] } : f)}
                    className="w-full border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {['Tropical', 'Warm & Woody', 'Citrus', 'Floral', 'Fresh & Clean', 'Spa'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFrag.active}
                    onChange={(e) => setEditingFrag((f) => f ? { ...f, active: e.target.checked } : f)}
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
