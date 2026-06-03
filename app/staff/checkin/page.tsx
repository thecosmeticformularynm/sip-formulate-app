'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

interface MockGuest {
  id: number;
  name: string;
  table: number;
  seat: number;
  waiver: boolean;
  paid: boolean;
  status: 'Checked In' | 'Pending' | 'Walk-In';
}

const MOCK_GUESTS: MockGuest[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ['Ava Mitchell', 'Bella Torres', 'Cara Nguyen', 'Diana Lee', 'Elena Ross', 'Fiona Walsh', 'Grace Kim', 'Hannah Park', 'Isla Brown', 'Jade Wilson', 'Kylie Chen', 'Luna Davis', 'Maya Jones', 'Nora Taylor', 'Olivia White', 'Piper Green', 'Quinn Adams', 'Rachel Scott', 'Sophia Harris', 'Tia Jackson'][i],
  table: Math.ceil((i + 1) / 6),
  seat: ((i) % 6) + 1,
  waiver: i % 5 !== 4,
  paid: i % 4 !== 3,
  status: i < 12 ? 'Checked In' : i < 16 ? 'Pending' : 'Walk-In',
}));

const STAFF_PIN = '1234';

export default function StaffCheckinPage() {
  const router = useRouter();
  const { staffAuthed, setStaffAuthed } = useStore();
  const [search, setSearch] = useState('');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({ firstName: '', lastName: '', email: '', table: '1', seat: '1' });

  if (!staffAuthed) {
    return <PinEntry title="Staff Access" correctPin={STAFF_PIN} onSuccess={() => setStaffAuthed(true)} onCancel={() => router.push('/')} />;
  }

  const filtered = MOCK_GUESTS.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/staff')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            ← Back
          </button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Check-In Panel</h1>
          <button
            onClick={() => setShowAddGuest(true)}
            className="text-xs uppercase"
            style={{ backgroundColor: 'var(--color-gold)', color: '#1C1917', minHeight: 44, padding: '0 24px', borderRadius: 100, border: 'none', letterSpacing: '0.15em', fontWeight: 500, cursor: 'pointer' }}
          >
            + Walk-In Guest
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <Image src="/tcf-logo-black.svg" alt="The Cosmetic Formulary" width={28} height={28} style={{ opacity: 0.35 }} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          />
        </div>

        {/* Table */}
        <div className="px-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Table', 'Seat', 'Waiver', 'Paid', 'Status'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="py-3 px-2 font-medium">{g.name}</td>
                  <td className="py-3 px-2" style={{ color: 'var(--color-text-secondary)' }}>T{g.table}</td>
                  <td className="py-3 px-2" style={{ color: 'var(--color-text-secondary)' }}>S{g.seat}</td>
                  <td className="py-3 px-2">
                    <span style={{ color: g.waiver ? 'var(--color-gold)' : 'var(--color-text-tertiary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{g.waiver ? 'Signed' : 'No'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span style={{ color: g.paid ? 'var(--color-gold)' : 'var(--color-text-tertiary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{g.paid ? 'Paid' : 'No'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: g.status === 'Checked In' ? 'rgba(168,197,176,0.25)' : g.status === 'Pending' ? 'rgba(184,150,46,0.15)' : 'rgba(195,177,209,0.25)',
                        color: g.status === 'Checked In' ? '#4A6B53' : g.status === 'Pending' ? '#B8962E' : '#6B5A82',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontSize: 10,
                      }}
                    >
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add guest modal */}
        {showAddGuest && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(28,25,23,0.7)' }}>
            <div className="rounded-3xl p-8 w-96 mx-4" style={{ backgroundColor: 'var(--color-surface)' }}>
              <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>Walk-In Guest</h2>
              <div className="space-y-3 mb-6">
                {[
                  { key: 'firstName', placeholder: 'First name' },
                  { key: 'lastName', placeholder: 'Last name' },
                  { key: 'email', placeholder: 'Email' },
                ].map(({ key, placeholder }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={placeholder}
                    value={newGuest[key as keyof typeof newGuest]}
                    onChange={(e) => setNewGuest((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newGuest.table}
                    onChange={(e) => setNewGuest((p) => ({ ...p, table: e.target.value }))}
                    className="border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {[1, 2, 3, 4].map((t) => <option key={t} value={t}>Table {t}</option>)}
                  </select>
                  <select
                    value={newGuest.seat}
                    onChange={(e) => setNewGuest((p) => ({ ...p, seat: e.target.value }))}
                    className="border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((s) => <option key={s} value={s}>Seat {s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAddGuest(false)} className="flex-1 uppercase" style={{ backgroundColor: 'var(--color-gold)', color: '#1C1917', borderRadius: 100, minHeight: 56, fontSize: 12, letterSpacing: '0.15em', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                  Add Guest
                </button>
                <button onClick={() => setShowAddGuest(false)} className="flex-1 uppercase" style={{ border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-secondary)', borderRadius: 100, minHeight: 56, fontSize: 12, letterSpacing: '0.15em', fontWeight: 500, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
