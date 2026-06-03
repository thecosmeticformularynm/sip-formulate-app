'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

export default function SettingsPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    businessName: 'Sip & Formulate',
    tagline: 'King Street, Charleston',
    maxCapacity: 24,
    tables: 4,
    seatsPerTable: 6,
    labelSize: '3 in × 4 in',
    manufacturerLine: 'The Cosmetic Formulary',
    disclaimer: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children.',
    qrDestination: 'https://sipandformulate.com',
    educationMode: false,
    timerEnforcement: false,
    staffPin: '1234',
    adminPin: '0000',
  });

  if (!adminAuthed) {
    return <PinEntry title="Admin Access" correctPin={ADMIN_PIN} onSuccess={() => setAdminAuthed(true)} onCancel={() => router.push('/admin')} />;
  }

  const update = (key: string, value: string | number | boolean) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    backgroundColor: 'var(--color-surface)',
    outline: 'none',
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>← Back</button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Settings</h1>
          <button
            onClick={handleSave}
            className="uppercase"
            style={{ backgroundColor: 'var(--color-gold)', color: '#1C1917', minHeight: 44, padding: '0 24px', borderRadius: 100, border: 'none', fontSize: 11, letterSpacing: '0.15em', fontWeight: 500, cursor: 'pointer' }}
          >
            {saved ? 'Saved' : 'Save Settings'}
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <Image src="/tcf-logo-black.svg" alt="The Cosmetic Formulary" width={28} height={28} style={{ opacity: 0.35 }} />
          </button>
        </div>

        <div className="px-6 py-6 max-w-lg mx-auto space-y-10">
          {/* Brand */}
          <Section title="Brand">
            <Field label="Business Name">
              <input value={settings.businessName} onChange={(e) => update('businessName', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Tagline">
              <input value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Logo">
              <button
                className="w-full py-3 rounded-xl text-sm"
                style={{ border: '2px dashed var(--color-border)', color: 'var(--color-text-secondary)', minHeight: 56 }}
              >
                Upload Logo (coming soon)
              </button>
            </Field>
          </Section>

          {/* Classes */}
          <Section title="Classes">
            <Field label="Max Capacity">
              <input type="number" value={settings.maxCapacity} onChange={(e) => update('maxCapacity', parseInt(e.target.value))} style={inputStyle} />
            </Field>
            <Field label="Tables">
              <input type="number" value={settings.tables} onChange={(e) => update('tables', parseInt(e.target.value))} style={inputStyle} />
            </Field>
            <Field label="Seats per Table">
              <input type="number" value={settings.seatsPerTable} onChange={(e) => update('seatsPerTable', parseInt(e.target.value))} style={inputStyle} />
            </Field>
          </Section>

          {/* Label */}
          <Section title="Label">
            <Field label="Default Size">
              <input value={settings.labelSize} onChange={(e) => update('labelSize', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Manufacturer Line">
              <input value={settings.manufacturerLine} onChange={(e) => update('manufacturerLine', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Disclaimer Text">
              <textarea
                value={settings.disclaimer}
                onChange={(e) => update('disclaimer', e.target.value)}
                style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              />
            </Field>
            <Field label="QR Code Destination URL">
              <input value={settings.qrDestination} onChange={(e) => update('qrDestination', e.target.value)} style={inputStyle} />
            </Field>
          </Section>

          {/* Modes */}
          <Section title="Modes">
            <ToggleSetting
              label="Education Mode"
              description="Shows INCI names alongside ingredient descriptions"
              checked={settings.educationMode}
              onChange={(v) => update('educationMode', v)}
            />
            <ToggleSetting
              label="Timer Enforcement"
              description="Timers are locked (guests must wait) vs decorative"
              checked={settings.timerEnforcement}
              onChange={(v) => update('timerEnforcement', v)}
            />
          </Section>

          {/* Staff PINs */}
          <Section title="Staff PINs">
            <Field label="Staff PIN">
              <input
                type="password"
                value={settings.staffPin}
                onChange={(e) => update('staffPin', e.target.value)}
                maxLength={6}
                className="text-center tracking-widest text-xl"
                style={{ ...inputStyle, letterSpacing: '0.3em' }}
              />
            </Field>
            <Field label="Admin PIN">
              <input
                type="password"
                value={settings.adminPin}
                onChange={(e) => update('adminPin', e.target.value)}
                maxLength={6}
                className="text-center tracking-widest text-xl"
                style={{ ...inputStyle, letterSpacing: '0.3em' }}
              />
            </Field>
          </Section>
        </div>
      </div>
    </PageTransition>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-2xl mb-4"
        style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--color-text-primary)' }}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs tracking-widest uppercase block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl cursor-pointer"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      </div>
      <div
        className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
        style={{ backgroundColor: checked ? 'var(--color-gold)' : 'var(--color-border)' }}
      >
        <div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
          style={{ left: checked ? '26px' : '4px' }}
        />
      </div>
    </div>
  );
}
