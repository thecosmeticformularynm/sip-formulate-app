'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

const NAV_ITEMS = [
  { href: '/admin/media', label: 'Media Manager', desc: 'Background photos & videos per page' },
  { href: '/admin/formula', label: 'Formula Editor', desc: 'Manage the 12 formula steps' },
  { href: '/admin/fragrances', label: 'Fragrances', desc: 'Edit fragrance catalog' },
  { href: '/admin/colors', label: 'Colors', desc: 'Manage color palette' },
  { href: '/admin/waiver', label: 'Waiver', desc: 'Edit waiver text' },
  { href: '/admin/guests', label: 'Guest Database', desc: 'View all guests & formulas' },
  { href: '/admin/settings', label: 'Settings', desc: 'Configure app settings' },
];

const STATS = [
  { label: 'Total Guests', value: '248' },
  { label: 'This Week', value: '42' },
  { label: 'Most Popular', value: 'Charleston Jasmine' },
  { label: 'Active Classes', value: '1' },
];

export default function AdminPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();

  if (!adminAuthed) {
    return (
      <PinEntry
        title="Admin Access"
        subtitle="Enter admin PIN to continue"
        correctPin={ADMIN_PIN}
        onSuccess={() => setAdminAuthed(true)}
        onCancel={() => router.push('/')}
      />
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <h1 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>
              Admin
            </h1>
            <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Sip & Formulate</p>
          </div>
          <button
            onClick={() => setAdminAuthed(false)}
            className="text-sm px-5 py-2.5 rounded-full"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer', background: 'transparent', minHeight: 40 }}
          >
            Sign Out
          </button>
        </div>

        <div className="px-8 py-8 max-w-2xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  {stat.label}
                </p>
                <p className="text-2xl" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--color-text-primary)', fontWeight: 400 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Nav */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex items-center justify-between px-6 py-5 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  minHeight: 80,
                  cursor: 'pointer',
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-cormorant)', fontSize: 20 }}>{item.label}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: 18 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
