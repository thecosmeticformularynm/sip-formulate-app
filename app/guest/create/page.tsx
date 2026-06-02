'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence used in intro
import { FORMULA_STEPS } from '@/lib/steps';
import { useStore } from '@/lib/store';
import Image from 'next/image';

type Phase = 'intro' | 'steps' | 'name';

const INTRO_FRAMES = [
  { line1: 'Tonight, you are making', line2: 'a 16 oz Luxury Bubble Bath.' },
  { line1: 'It starts as a thin,', line2: 'crystal-clear base.' },
  { line1: 'You will add fragrance,', line2: 'color, and salt.' },
  { line1: 'And watch it', line2: 'transform.' },
];

export default function CreatePage() {
  const router = useRouter();
  const { setProductName, setScentName, setActiveName, completeStep } = useStore();

  const [phase, setPhase] = useState<Phase>('steps');
  const [introFrame, setIntroFrame] = useState(0);
  const [nameValue, setNameValue] = useState('');
  const [scentValue, setScentValue] = useState('');
  const [activeValue, setActiveValue] = useState('');

  const dark = '#1C1917', cream = '#FAF7F2', gold = '#B8962E', stone = '#F4EFE6';
  const muted = '#78716C', border = '#E2D9CE';

  const pillPrimary: React.CSSProperties = {
    backgroundColor: gold, color: dark, border: 'none',
    borderRadius: 100, minHeight: 56, fontSize: 12, letterSpacing: '0.15em',
    fontWeight: 500, cursor: 'pointer', textTransform: 'uppercase',
    width: '100%', padding: '0 24px',
  };
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 } };

  useEffect(() => {
    if (phase !== 'intro') return;
    if (introFrame >= INTRO_FRAMES.length) { setPhase('steps'); return; }
    const t = setTimeout(() => setIntroFrame(i => i + 1), 4000);
    return () => clearTimeout(t);
  }, [phase, introFrame]);

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const frame = INTRO_FRAMES[introFrame];
    if (!frame) return null;
    return (
      <div onClick={() => setIntroFrame(i => i + 1)} style={{ minHeight: '100vh', backgroundColor: dark, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', cursor: 'pointer' }}>
        <AnimatePresence mode="wait">
          <motion.div key={introFrame} {...fade} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(38px,7vw,64px)', fontWeight: 300, color: cream, lineHeight: 1.15, marginBottom: 16 }}>
              {frame.line1}
            </p>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(38px,7vw,64px)', fontWeight: 300, color: gold, lineHeight: 1.15, fontStyle: 'italic' }}>
              {frame.line2}
            </p>
          </motion.div>
        </AnimatePresence>
        <p style={{ position: 'absolute', bottom: 48, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
          Tap to continue
        </p>
      </div>
    );
  }

  // ── Steps ──────────────────────────────────────────────────────────────────
  if (phase === 'steps') {
    return (
      <RecipePage
        onComplete={() => setPhase('name')}
        completeStep={completeStep}
        router={router}
      />
    );
  }

  // ── Name + Scent ───────────────────────────────────────────────────────────
  if (phase === 'name') {
    const suggestions = ['Charleston Glow Bath', 'Sea Salt Soak', 'Sunday in Charleston', 'King Street Bubbles', 'Pink Moon Bath'];
    const scentSuggestions = ['Jasmine & Sandalwood', 'Rose & Bergamot', 'Lavender & Vanilla', 'Sea Salt & Driftwood', 'Citrus & Mint'];
    const activeSuggestions = ['Shea Butter', 'Vitamin E', 'Coconut Oil', 'Aloe Vera', 'Argan Oil'];
    const canContinue = nameValue.trim() && scentValue.trim();

    return (
      <div style={{ minHeight: '100vh', backgroundColor: dark, color: cream, display: 'flex', flexDirection: 'column', padding: '60px 40px 40px' }}>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 52, lineHeight: 1.05, marginBottom: 48 }}>Name your<br /><em style={{ fontStyle: 'italic', color: gold }}>formula.</em></h1>

        {/* Product name */}
        <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Product Name</p>
        <div style={{ borderBottom: `1px solid rgba(255,255,255,0.15)`, marginBottom: 8 }}>
          <input
            value={nameValue}
            onChange={e => setNameValue(e.target.value.slice(0, 32))}
            placeholder="Your formula name"
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-cormorant)', fontSize: 28, fontWeight: 300, color: cream, padding: '10px 0' }}
          />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginBottom: 12 }}>{nameValue.length}/32</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => setNameValue(s)} style={{ padding: '8px 16px', borderRadius: 100, background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontSize: 12, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* Scent */}
        <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Scent</p>
        <div style={{ borderBottom: `1px solid rgba(255,255,255,0.15)`, marginBottom: 8 }}>
          <input
            value={scentValue}
            onChange={e => setScentValue(e.target.value.slice(0, 40))}
            placeholder="Describe your fragrance"
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-cormorant)', fontSize: 28, fontWeight: 300, color: cream, padding: '10px 0' }}
          />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginBottom: 12 }}>{scentValue.length}/40</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {scentSuggestions.map(s => (
            <button key={s} onClick={() => setScentValue(s)} style={{ padding: '8px 16px', borderRadius: 100, background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontSize: 12, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* Active */}
        <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Active Ingredient</p>
        <div style={{ borderBottom: `1px solid rgba(255,255,255,0.15)`, marginBottom: 8 }}>
          <input
            value={activeValue}
            onChange={e => setActiveValue(e.target.value.slice(0, 40))}
            placeholder="e.g. Shea Butter"
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-cormorant)', fontSize: 28, fontWeight: 300, color: cream, padding: '10px 0' }}
          />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginBottom: 12 }}>{activeValue.length}/40</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
          {activeSuggestions.map(s => (
            <button key={s} onClick={() => setActiveValue(s)} style={{ padding: '8px 16px', borderRadius: 100, background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontSize: 12, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => {
              if (!canContinue) return;
              setProductName(nameValue.trim());
              setScentName(scentValue.trim());
              setActiveName(activeValue.trim());
              router.push('/guest/label');
            }}
            disabled={!canContinue}
            style={{ ...pillPrimary, opacity: canContinue ? 1 : 0.4 }}
          >
            Preview my label →
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Recipe Page Component ──────────────────────────────────────────────────

function RecipePage({ onComplete, completeStep, router }: {
  onComplete: () => void;
  completeStep: (step: number) => void;
  router: ReturnType<typeof import('next/navigation').useRouter>;
}) {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timers, setTimers] = useState<Record<number, number>>({});
  const [timersDone, setTimersDone] = useState<Record<number, boolean>>({});
  const [timerRunning, setTimerRunning] = useState<Record<number, boolean>>({});

  const dark = '#1C1917', gold = '#B8962E', stone = '#F4EFE6', muted = '#78716C', border = '#E2D9CE', cream = '#FAF7F2';

  useEffect(() => {
    const init: Record<number, number> = {};
    FORMULA_STEPS.forEach(s => { if (s.timerSeconds) init[s.id] = s.timerSeconds; });
    setTimers(init);
  }, []);

  useEffect(() => {
    if (activeTimer === null) return;
    if (!timerRunning[activeTimer]) return;
    if ((timers[activeTimer] ?? 0) <= 0) {
      setTimerRunning(r => ({ ...r, [activeTimer]: false }));
      setTimersDone(d => ({ ...d, [activeTimer]: true }));
      setActiveTimer(null);
      return;
    }
    const t = setTimeout(() => {
      setTimers(prev => ({ ...prev, [activeTimer]: (prev[activeTimer] ?? 0) - 1 }));
    }, 1000);
    return () => clearTimeout(t);
  }, [activeTimer, timerRunning, timers]);

  const startTimer = (id: number) => {
    setActiveTimer(id);
    setTimerRunning(r => ({ ...r, [id]: true }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleBegin = () => {
    FORMULA_STEPS.forEach(s => completeStep(s.id));
    onComplete();
  };

  const ACCENT_COLORS = ['#E8D5C4', '#D9CFC4', '#E0D4C8', '#C8BFB4', '#C4D9CC'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: stone, color: dark }}>
      <div style={{ backgroundColor: dark, padding: '40px 28px 36px', position: 'relative' }}>
        <button onClick={() => router.push('/')} style={{ position: 'absolute', top: 32, right: 28, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <Image src="/tcf-logo-white.svg" alt="TCF" width={32} height={32} style={{ opacity: 0.4 }} />
        </button>
        <p style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: gold, marginBottom: 10, fontFamily: 'var(--font-inter)' }}>
          The Cosmetic Formulary
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 'clamp(42px,9vw,68px)', color: cream, lineHeight: 1.0, marginBottom: 6 }}>
          16 oz Luxury<br /><em style={{ fontStyle: 'italic', color: gold }}>Bubble Bath</em>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
          Follow the recipe below — step by step
        </p>
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Begin when ready</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>

      <div style={{ padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0 40px' }}>
          {FORMULA_STEPS.map((step, idx) => {
            const hasTimer = !!step.timerSeconds;
            const tLeft = timers[step.id] ?? step.timerSeconds ?? 0;
            const tOrig = step.timerSeconds ?? 1;
            const tPct = ((tOrig - tLeft) / tOrig) * 100;
            const done = timersDone[step.id];
            const running = timerRunning[step.id];

            return (
              <div key={step.id}>
                <div style={{ paddingTop: 28, paddingBottom: 28 }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: ACCENT_COLORS[idx % ACCENT_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${border}` }}>
                        <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18, fontWeight: 400, color: dark }}>{idx + 1}</span>
                      </div>
                      {idx < FORMULA_STEPS.length - 1 && (
                        <div style={{ width: 1, flex: 1, minHeight: 40, backgroundColor: border }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: idx < FORMULA_STEPS.length - 1 ? 8 : 0 }}>
                      <h3 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 28, lineHeight: 1.1, color: dark, marginBottom: 10 }}>{step.title}</h3>
                      <p style={{ fontSize: 15, lineHeight: 1.85, color: muted, marginBottom: step.safetyNote || hasTimer ? 16 : 0 }}>{step.instruction}</p>
                      {step.safetyNote && (
                        <div style={{ borderLeft: `2px solid ${gold}`, paddingLeft: 14, marginBottom: hasTimer ? 16 : 0 }}>
                          <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 14, color: '#5C5550', lineHeight: 1.6 }}>{step.safetyNote}</p>
                        </div>
                      )}
                      {hasTimer && (
                        <div style={{ backgroundColor: cream, borderRadius: 16, padding: '16px 20px', border: `1px solid ${border}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: muted }}>{done ? 'Complete' : running ? 'Timing...' : 'Timer'}</span>
                            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: done ? gold : dark, fontWeight: 400 }}>{done ? 'Done' : formatTime(tLeft)}</span>
                          </div>
                          <div style={{ height: 2, backgroundColor: border, borderRadius: 100, overflow: 'hidden', marginBottom: 12 }}>
                            <motion.div animate={{ width: `${tPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', backgroundColor: gold, borderRadius: 100 }} />
                          </div>
                          {!running && !done && (
                            <button onClick={() => startTimer(step.id)} style={{ width: '100%', padding: '10px 0', borderRadius: 100, border: `1px solid ${border}`, backgroundColor: 'transparent', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: dark, cursor: 'pointer', fontWeight: 500 }}>
                              Start Timer
                            </button>
                          )}
                          {running && <p style={{ fontSize: 11, textAlign: 'center', color: muted, letterSpacing: '0.1em' }}>Stir slowly and steadily</p>}
                        </div>
                      )}
                      {step.lockUntilInstructor && (
                        <div style={{ backgroundColor: 'rgba(184,150,46,0.07)', borderRadius: 14, padding: '14px 18px', border: `1px solid rgba(184,150,46,0.2)`, marginTop: step.safetyNote ? 12 : 0 }}>
                          <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold }}>Instructor step</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {idx < FORMULA_STEPS.length - 1 && (
                  <div style={{ height: 1, backgroundColor: border, marginLeft: 60 }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: '28px 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: border }} />
          <span style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 14, color: 'rgba(28,25,23,0.3)' }}>Your formula is ready</span>
          <div style={{ flex: 1, height: 1, backgroundColor: border }} />
        </div>

        <div style={{ paddingBottom: 60 }}>
          <motion.button
            onClick={handleBegin}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '18px 0', borderRadius: 100, backgroundColor: gold, color: dark, border: 'none', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-inter)' }}
          >
            Name your formula →
          </motion.button>
          <p style={{ fontSize: 11, color: 'rgba(28,25,23,0.3)', textAlign: 'center', marginTop: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            All steps complete · Time to name your formula
          </p>
        </div>
      </div>
    </div>
  );
}
