'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

interface GuestRecord {
  id: number;
  name: string;
  email: string;
  date: string;
  fragrance: string;
  color: string;
  productName: string;
  waiver: boolean;
  marketingOptIn: boolean;
}

const MOCK_GUESTS: GuestRecord[] = [
  { id: 1, name: 'Ava Mitchell', email: 'ava@example.com', date: '2026-06-01', fragrance: 'Charleston Jasmine', color: 'Pearl White', productName: 'Charleston Glow Bath', waiver: true, marketingOptIn: true },
  { id: 2, name: 'Bella Torres', email: 'bella@example.com', date: '2026-06-01', fragrance: 'Sea Salt Air', color: 'Ocean Blue', productName: 'Sea Salt Soak', waiver: true, marketingOptIn: false },
  { id: 3, name: 'Cara Nguyen', email: 'cara@example.com', date: '2026-06-01', fragrance: 'Vanilla Bean', color: 'Champagne Gold', productName: 'Vanilla Dream', waiver: true, marketingOptIn: true },
  { id: 4, name: 'Diana Lee', email: 'diana@example.com', date: '2026-05-28', fragrance: 'Lavender Cream', color: 'Lavender', productName: 'Lavender Luxe', waiver: true, marketingOptIn: true },
  { id: 5, name: 'Elena Ross', email: 'elena@example.com', date: '2026-05-28', fragrance: 'Coconut Milk', color: 'Pearl White', productName: 'Coconut Crush', waiver: true, marketingOptIn: false },
  { id: 6, name: 'Fiona Walsh', email: 'fiona@example.com', date: '2026-05-27', fragrance: 'Pink Grapefruit', color: 'Soft Pink', productName: 'Pink Escape', waiver: true, marketingOptIn: true },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', date: '2026-05-27', fragrance: 'Charleston Jasmine', color: 'Pearl White', productName: 'Sunday in Charleston', waiver: true, marketingOptIn: true },
  { id: 8, name: 'Hannah Park', email: 'hannah@example.com', date: '2026-05-26', fragrance: 'Black Orchid', color: 'Lavender', productName: 'Midnight Soak', waiver: true, marketingOptIn: false },
  { id: 9, name: 'Isla Brown', email: 'isla@example.com', date: '2026-05-26', fragrance: 'Amber Woods', color: 'Champagne Gold', productName: 'Amber Ritual', waiver: true, marketingOptIn: true },
  { id: 10, name: 'Jade Wilson', email: 'jade@example.com', date: '2026-05-25', fragrance: 'Mango Nectar', color: 'Coral', productName: 'Mango Glow', waiver: true, marketingOptIn: true },
  { id: 11, name: 'Kylie Chen', email: 'kylie@example.com', date: '2026-05-25', fragrance: 'Champagne Peach', color: 'Soft Pink', productName: 'King Street Bubbles', waiver: true, marketingOptIn: false },
  { id: 12, name: 'Luna Davis', email: 'luna@example.com', date: '2026-05-24', fragrance: 'Watermelon Sugar', color: 'Coral', productName: 'Summer Soak', waiver: true, marketingOptIn: true },
  { id: 13, name: 'Maya Jones', email: 'maya@example.com', date: '2026-05-24', fragrance: 'Spa Eucalyptus', color: 'Seafoam Green', productName: 'Spa Day Bath', waiver: true, marketingOptIn: true },
  { id: 14, name: 'Nora Taylor', email: 'nora@example.com', date: '2026-05-23', fragrance: 'Honeysuckle Vine', color: 'Soft Pink', productName: 'Garden Bloom Bath', waiver: true, marketingOptIn: true },
  { id: 15, name: 'Olivia White', email: 'olivia@example.com', date: '2026-05-23', fragrance: 'Fig & Cashmere', color: 'Pearl White', productName: 'Cashmere Evening', waiver: true, marketingOptIn: false },
  { id: 16, name: 'Piper Green', email: 'piper@example.com', date: '2026-05-22', fragrance: 'Coconut Lime Verbena', color: 'Seafoam Green', productName: 'Tropical Soak', waiver: true, marketingOptIn: true },
  { id: 17, name: 'Quinn Adams', email: 'quinn@example.com', date: '2026-05-22', fragrance: 'Pineapple Whip', color: 'Champagne Gold', productName: 'Pineapple Dreams', waiver: true, marketingOptIn: true },
  { id: 18, name: 'Rachel Scott', email: 'rachel@example.com', date: '2026-05-21', fragrance: 'Charleston Jasmine', color: 'Pearl White', productName: 'Pink Moon Bath', waiver: true, marketingOptIn: false },
  { id: 19, name: 'Sophia Harris', email: 'sophia@example.com', date: '2026-05-21', fragrance: 'Lavender Cream', color: 'Lavender', productName: 'Sunday Ritual', waiver: true, marketingOptIn: true },
  { id: 20, name: 'Tia Jackson', email: 'tia@example.com', date: '2026-05-20', fragrance: 'Vanilla Bean', color: 'Champagne Gold', productName: 'Vanilla Luxe Soak', waiver: true, marketingOptIn: true },
];

export default function GuestsAdminPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const [guests, setGuests] = useState(MOCK_GUESTS);
  const [fragFilter, setFragFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewGuest, setViewGuest] = useState<GuestRecord | null>(null);

  if (!adminAuthed) {
    return <PinEntry title="Admin Access" correctPin={ADMIN_PIN} onSuccess={() => setAdminAuthed(true)} onCancel={() => router.push('/admin')} />;
  }

  const filtered = guests.filter((g) => {
    if (fragFilter && !g.fragrance.toLowerCase().includes(fragFilter.toLowerCase())) return false;
    if (colorFilter && !g.color.toLowerCase().includes(colorFilter.toLowerCase())) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Date', 'Fragrance', 'Color', 'Product Name', 'Waiver', 'Marketing'];
    const rows = filtered.map((g) => [g.name, g.email, g.date, g.fragrance, g.color, g.productName, g.waiver ? 'Yes' : 'No', g.marketingOptIn ? 'Yes' : 'No']);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sip-formulate-guests.csv';
    a.click();
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>← Back</button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Guest Database</h1>
          <button onClick={handleExportCSV} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--color-gold)', minHeight: 44 }}>
            Export CSV
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <Image src="/tcf-logo-black.svg" alt="The Cosmetic Formulary" width={28} height={28} style={{ opacity: 0.35 }} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 px-6 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <input
            placeholder="Filter by fragrance..."
            value={fragFilter}
            onChange={(e) => setFragFilter(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <input
            placeholder="Filter by color..."
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        <div className="px-6 py-4 overflow-x-auto">
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>{filtered.length} guests</p>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Email', 'Date', 'Fragrance', 'Color', 'Product', 'Waiver', 'Mktg', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs tracking-widest uppercase whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="py-3 px-2 font-medium whitespace-nowrap">{g.name}</td>
                  <td className="py-3 px-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{g.email}</td>
                  <td className="py-3 px-2 text-xs whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>{g.date}</td>
                  <td className="py-3 px-2 text-xs whitespace-nowrap">{g.fragrance}</td>
                  <td className="py-3 px-2 text-xs whitespace-nowrap">{g.color}</td>
                  <td className="py-3 px-2 text-xs" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 14, whiteSpace: 'nowrap' }}>{g.productName}</td>
                  <td className="py-3 px-2"><span className="text-xs uppercase" style={{ color: g.waiver ? 'var(--color-gold)' : 'var(--color-text-tertiary)', letterSpacing: '0.15em' }}>{g.waiver ? 'Yes' : 'No'}</span></td>
                  <td className="py-3 px-2"><span className="text-xs uppercase" style={{ color: g.marketingOptIn ? 'var(--color-gold)' : 'var(--color-text-tertiary)', letterSpacing: '0.15em' }}>{g.marketingOptIn ? 'Yes' : '—'}</span></td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button onClick={() => setViewGuest(g)} className="px-2 py-1.5 rounded-lg text-xs" style={{ border: '1px solid var(--color-border)', minHeight: 30 }}>View</button>
                      <button onClick={() => setDeleteId(g.id)} className="px-2 py-1.5 rounded-lg text-xs" style={{ border: '1px solid #FCA5A5', color: '#DC2626', minHeight: 30 }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View guest modal */}
        {viewGuest && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>{viewGuest.name}</h2>
              <div className="space-y-2 text-sm mb-6">
                {[
                  { label: 'Email', value: viewGuest.email },
                  { label: 'Date', value: viewGuest.date },
                  { label: 'Fragrance', value: viewGuest.fragrance },
                  { label: 'Color', value: viewGuest.color },
                  { label: 'Product', value: viewGuest.productName },
                  { label: 'Waiver', value: viewGuest.waiver ? 'Signed' : 'Not signed' },
                  { label: 'Marketing', value: viewGuest.marketingOptIn ? 'Opted in' : 'Opted out' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setViewGuest(null)} className="w-full py-3 rounded-xl font-medium" style={{ border: '1px solid var(--color-border)' }}>Close</button>
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {deleteId !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl p-6 w-80">
              <h2 className="text-xl mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>Delete Guest?</h2>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => { setGuests((g) => g.filter((x) => x.id !== deleteId)); setDeleteId(null); }} className="flex-1 py-3 rounded-xl text-white" style={{ backgroundColor: '#EF4444' }}>Delete</button>
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
