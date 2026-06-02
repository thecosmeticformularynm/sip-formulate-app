'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

const DEFAULT_WAIVER = `WAIVER AND RELEASE OF LIABILITY

Sip & Formulate — King Street, Charleston

By participating in this cosmetic formulation class, you acknowledge and agree to the following:

WHAT YOU ARE MAKING
Tonight you will formulate a 16 fl oz luxury bubble bath using cosmetic-grade ingredients under the guidance of our certified instructor. All ingredients are sourced from reputable cosmetic suppliers and are compliant with FDA cosmetic guidelines.

ALLERGIES AND SENSITIVITIES
You acknowledge that you have disclosed any known allergies or sensitivities to staff prior to class. Sip & Formulate is not responsible for adverse reactions resulting from undisclosed allergies. If you experience any irritation during or after class, discontinue use and consult a medical professional.

DURING THE CLASS
You agree to follow all instructor directions carefully. Ingredients are to be used only as directed. Do not ingest any products. Keep all ingredients away from eyes. Sip & Formulate staff reserves the right to pause or end a class session at any time for safety reasons.

PHOTOS AND VIDEO
Class sessions may be photographed or filmed for marketing purposes. Participation in photos/video is optional and noted during check-in.

PRODUCT DISCLAIMER
Your finished product is for personal use only. Not for resale. Keep out of reach of children. For external use only. Discontinue use if irritation occurs.

By signing this waiver, you confirm that you have read, understood, and agree to all terms above.`;

const ADMIN_PIN_CONST = '0000';

export default function WaiverAdminPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const [waiverText, setWaiverText] = useState(DEFAULT_WAIVER);
  const [saved, setSaved] = useState(false);

  if (!adminAuthed) {
    return <PinEntry title="Admin Access" correctPin={ADMIN_PIN_CONST} onSuccess={() => setAdminAuthed(true)} onCancel={() => router.push('/admin')} />;
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Format the waiver text for preview
  const formattedLines = waiverText.split('\n').map((line, i) => {
    if (line === line.toUpperCase() && line.trim()) {
      return <p key={i} className="font-bold mt-4 mb-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{line}</p>;
    }
    if (!line.trim()) return <br key={i} />;
    return <p key={i} className="text-sm mb-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{line}</p>;
  });

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>← Back</button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Waiver Editor</h1>
          <button
            onClick={handleSave}
            className="uppercase"
            style={{ backgroundColor: 'var(--color-gold)', color: '#1C1917', minHeight: 44, padding: '0 24px', borderRadius: 100, border: 'none', fontSize: 11, letterSpacing: '0.15em', fontWeight: 500, cursor: 'pointer' }}
          >
            {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>

        {/* Warning */}
        <div className="px-6 py-3 text-sm italic" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-cormorant)' }}>
          Note — Changes apply to future sessions. Past waivers are locked.
        </div>

        <div className="flex gap-0 h-[calc(100vh-120px)]">
          {/* Editor */}
          <div className="flex-1 p-6 flex flex-col">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Editor</p>
            <textarea
              value={waiverText}
              onChange={(e) => setWaiverText(e.target.value)}
              className="flex-1 w-full border rounded-xl px-4 py-3 text-sm font-mono leading-relaxed resize-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            />
          </div>

          {/* Preview */}
          <div className="flex-1 p-6 overflow-y-auto" style={{ borderLeft: '1px solid var(--color-border)' }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Preview</p>
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              {formattedLines}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
