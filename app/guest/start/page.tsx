'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import Image from 'next/image';

type Phase = 'details' | 'waiver';

export default function StartPage() {
  const router = useRouter();
  const { setGuest, signWaiver } = useStore();
  const [phase, setPhase] = useState<Phase>('details');
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', instagramHandle: '', celebrationNote: '',
    marketingOptIn: false, photoOptIn: false, allergyDisclosed: false,
  });
  const [agreed, setAgreed] = useState(false);
  const [noAllergy, setNoAllergy] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const detailsValid = form.firstName.trim() && form.lastName.trim() && form.email.includes('@');
  const waiverValid = agreed && noAllergy && hasSig;

  const getPos = (e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    drawing.current = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#1C1917';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSig(true);
  };

  const endDraw = () => { drawing.current = false; };

  const clearSig = () => {
    const canvas = canvasRef.current!;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const handleNext = () => {
    if (phase === 'details') {
      setGuest({ ...form });
      setPhase('waiver');
    } else {
      signWaiver();
      router.push('/guest/create');
    }
  };

  const dark = '#1C1917';
  const cream = '#FAF7F2';
  const gold = '#B8962E';
  const stone = '#F4EFE6';
  const muted = '#78716C';
  const border = '#E2D9CE';

  const Toggle = ({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) => (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer' }}>
      <div
        onClick={onToggle}
        style={{
          width: 44, height: 26, borderRadius: 100, flexShrink: 0, marginTop: 2,
          backgroundColor: on ? gold : border,
          position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: on ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          backgroundColor: on ? dark : '#A8A29E',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ fontSize: 15, color: dark, lineHeight: 1.5 }}>{label}</span>
    </label>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: stone, color: dark }}>
      <div style={{ padding: '44px 32px 0' }}>
        {/* Logo — taps home */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <Image src="/tcf-logo-black.svg" alt="The Cosmetic Formulary" width={44} height={44} style={{ opacity: 0.6 }} />
          </button>
        </div>
        <button onClick={() => phase === 'waiver' ? setPhase('details') : router.push('/')}
          style={{ background: 'none', border: 'none', fontSize: 20, color: muted, cursor: 'pointer', marginBottom: 20, padding: 0 }}>
          ←
        </button>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {(['details', 'waiver'] as Phase[]).map((p, i) => (
            <div key={p} style={{ height: 2, flex: 1, borderRadius: 100, backgroundColor: phase === p || (i === 0) ? gold : border, transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'details' ? (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            style={{ padding: '0 32px' }}>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 52, lineHeight: 1.0, marginBottom: 8 }}>
              Tell us<br />about you
            </h1>
            <p style={{ fontSize: 14, color: muted, marginBottom: 36, letterSpacing: '0.02em' }}>
              We&apos;ll send your formula and reorder link after class.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[['First name', 'firstName'], ['Last name', 'lastName']].map(([label, field]) => (
                <div key={field}>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>{label}</p>
                  <input
                    value={(form as any)[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{
                      width: '100%', padding: '16px 0', fontSize: 22,
                      fontFamily: 'var(--font-cormorant)', fontWeight: 300,
                      background: 'none', border: 'none', borderBottom: `1px solid ${border}`,
                      outline: 'none', color: dark, boxSizing: 'border-box',
                    }}
                    autoCapitalize="words"
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Email</p>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{
                  width: '100%', padding: '16px 0', fontSize: 16,
                  background: 'none', border: 'none', borderBottom: `1px solid ${border}`,
                  outline: 'none', color: dark, boxSizing: 'border-box',
                }}
                autoCapitalize="none"
              />
            </div>

            <button onClick={() => setExpanded(!expanded)}
              style={{ background: 'none', border: 'none', color: muted, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', padding: '16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: gold, fontSize: 18 }}>{expanded ? '−' : '+'}</span>
              {expanded ? 'Less' : 'More about you'}
            </button>

            {expanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['Phone', 'phone', 'tel'], ['Instagram', 'instagramHandle', 'text']].map(([label, field, type]) => (
                  <div key={field}>
                    <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>{label}</p>
                    <input
                      type={type}
                      value={(form as any)[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '14px 0', fontSize: 16, background: 'none', border: 'none', borderBottom: `1px solid ${border}`, outline: 'none', color: dark, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>Celebrating something?</p>
                  <input
                    placeholder="Birthday, bachelorette, anniversary…"
                    value={form.celebrationNote}
                    onChange={e => setForm(f => ({ ...f, celebrationNote: e.target.value }))}
                    style={{ width: '100%', padding: '14px 0', fontSize: 16, background: 'none', border: 'none', borderBottom: `1px solid ${border}`, outline: 'none', color: dark, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="waiver" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            style={{ padding: '0 32px' }}>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 52, lineHeight: 1.0, marginBottom: 8 }}>
              Before<br />we begin
            </h1>
            <p style={{ fontSize: 14, color: muted, marginBottom: 36 }}>A few things to know</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              {[
                { title: 'What you are making', body: 'This product is formulated for personal use and is not intended to diagnose, treat, or cure any condition.' },
                { title: 'Allergies', body: 'Please tell a staff member now if you have any known skin sensitivities, allergies, or conditions.' },
                { title: 'During the class', body: 'You agree to follow instructor guidance. Some ingredients are concentrated — your instructor will handle or guide those steps.' },
                { title: 'Photography', body: 'We love documenting the experience. Your preference is noted below.' },
              ].map(({ title, body }) => (
                <div key={title} style={{ borderTop: `1px solid ${border}`, paddingTop: 20 }}>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: gold, marginBottom: 8 }}>{title}</p>
                  <p style={{ fontSize: 14, color: muted, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <Toggle on={agreed} onToggle={() => setAgreed(!agreed)} label="I have read and agree to the above" />
              <Toggle on={noAllergy} onToggle={() => setNoAllergy(!noAllergy)} label="No known allergies, or I have disclosed them to staff" />
              <Toggle on={form.photoOptIn} onToggle={() => setForm(f => ({ ...f, photoOptIn: !f.photoOptIn }))} label="I consent to photos for Sip & Formulate marketing" />
              <Toggle on={form.marketingOptIn} onToggle={() => setForm(f => ({ ...f, marketingOptIn: !f.marketingOptIn }))} label="Send me future class invites and offers" />
            </div>

            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: muted, marginBottom: 12 }}>Sign below</p>
              <div style={{ backgroundColor: cream, borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}` }}>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={140}
                  style={{ width: '100%', height: 140, display: 'block', touchAction: 'none' }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                <div style={{ borderTop: `1px solid ${border}`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted }}>
                    {hasSig ? 'Signed' : 'Draw your signature'}
                  </span>
                  <button onClick={clearSig} style={{ background: 'none', border: 'none', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, cursor: 'pointer' }}>Clear</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'sticky', bottom: 0, padding: '16px 32px 40px', backgroundColor: stone, borderTop: `1px solid ${border}` }}>
        <button
          onClick={handleNext}
          disabled={phase === 'details' ? !detailsValid : !waiverValid}
          style={{
            width: '100%', padding: '18px 32px', borderRadius: 100, border: 'none',
            fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500,
            backgroundColor: (phase === 'details' ? detailsValid : waiverValid) ? gold : border,
            color: (phase === 'details' ? detailsValid : waiverValid) ? dark : '#A8A29E',
            cursor: (phase === 'details' ? detailsValid : waiverValid) ? 'pointer' : 'not-allowed',
            minHeight: 60, transition: 'all 0.2s',
          }}
        >
          {phase === 'details' ? 'Continue →' : 'Begin my experience →'}
        </button>
      </div>
    </div>
  );
}
