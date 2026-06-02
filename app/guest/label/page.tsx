'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useStaffStore } from '@/lib/staffStore';
import Image from 'next/image';

export default function LabelPage() {
  const router = useRouter();
  const { guest, productName, scentName, activeName, approvLabel } = useStore();
  const { addPrintJob } = useStaffStore();
  const [isDark, setIsDark] = useState(true);

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleApprove = () => {
    addPrintJob({
      guestName: guest?.firstName ? `${guest.firstName} ${guest.lastName || ''}`.trim() : 'Guest',
      productName: productName || 'My Formula',
      fragranceName: scentName || '—',
      colorName: activeName || '—',
      viscosity: '—',
      date: today,
    });
    approvLabel();
    router.push('/guest/done');
  };

  const bg = isDark ? '#1C1917' : '#ffffff';
  const fg = isDark ? '#FAF7F2' : '#1C1917';
  const fgMuted = isDark ? 'rgba(250,247,242,0.5)' : 'rgba(28,25,23,0.45)';
  const lineColor = isDark ? 'rgba(250,247,242,0.2)' : 'rgba(28,25,23,0.15)';
  const logoSrc = isDark ? '/tcf-logo-white.svg' : '/tcf-logo-black.svg';

  const stone = '#F4EFE6';
  const gold = '#B8962E';
  const dark = '#1C1917';
  const muted = '#78716C';
  const border = '#E2D9CE';
  const cream = '#FAF7F2';

  const labelField = (label: string, value: string | null, mb = 20) => (
    <div style={{ width: '100%', marginBottom: mb }}>
      <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: fgMuted, marginBottom: 6, fontFamily: 'var(--font-inter)' }}>
        {label} :
      </p>
      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 16, color: fg, borderBottom: `1px solid ${lineColor}`, paddingBottom: 5, minHeight: 26, margin: 0 }}>
        {value || ''}
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: stone, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 32px 40px' }}>

      <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: gold, marginBottom: 8 }}>Approve your label</p>
      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 36, color: dark, marginBottom: 32, textAlign: 'center' }}>Your Label</h2>

      {/* Black / White toggle */}
      <div style={{ display: 'flex', marginBottom: 32, border: `1px solid ${border}`, borderRadius: 100, overflow: 'hidden' }}>
        {[{ label: 'Black', val: true }, { label: 'White', val: false }].map(({ label, val }) => (
          <button
            key={label}
            onClick={() => setIsDark(val)}
            style={{
              padding: '10px 28px', border: 'none', cursor: 'pointer',
              backgroundColor: isDark === val ? dark : 'transparent',
              color: isDark === val ? cream : muted,
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Label card */}
      <div
        style={{
          width: 280,
          backgroundColor: bg,
          borderRadius: 4,
          padding: '32px 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: isDark
            ? '0 32px 64px -16px rgba(28,25,23,0.5), 0 8px 24px -8px rgba(28,25,23,0.3)'
            : '0 32px 64px -16px rgba(28,25,23,0.18), 0 8px 24px -8px rgba(28,25,23,0.1)',
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Real logo */}
        <Image
          src={logoSrc}
          alt="The Cosmetic Formulary"
          width={100}
          height={100}
          style={{ display: 'block' }}
        />

        {/* Divider */}
        <div style={{ width: '60%', height: 1, backgroundColor: lineColor, margin: '20px 0 16px' }} />

        {/* Product type */}
        <p style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: fgMuted, marginBottom: 6, textAlign: 'center', fontFamily: 'var(--font-inter)' }}>
          Bubble Bath
        </p>

        {/* No.1 */}
        <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 52, fontWeight: 400, color: fg, lineHeight: 1, marginBottom: 24, textAlign: 'center' }}>
          No.1
        </p>

        {labelField('Product Name', productName)}
        {labelField('Scent', scentName)}
        {labelField('Active', activeName, 28)}

        {/* Net weight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: lineColor }} />
          <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: fgMuted, whiteSpace: 'nowrap', fontFamily: 'var(--font-inter)', margin: 0 }}>
            Net Wt. 16 fl oz
          </p>
          <div style={{ flex: 1, height: 1, backgroundColor: lineColor }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ width: '100%', maxWidth: 320, marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleApprove}
          style={{ backgroundColor: gold, color: dark, border: 'none', borderRadius: 100, minHeight: 56, fontSize: 12, letterSpacing: '0.15em', fontWeight: 500, cursor: 'pointer', textTransform: 'uppercase', width: '100%' }}
        >
          Approve This Label
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
          <button onClick={() => router.push('/guest/create')} style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, background: 'none', border: 'none', cursor: 'pointer' }}>
            Edit details
          </button>
        </div>
      </div>
    </div>
  );
}
