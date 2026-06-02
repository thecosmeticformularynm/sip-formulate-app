'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useStaffStore, defaultPageMedia } from '@/lib/staffStore';
import Image from 'next/image';

// Update to your actual Shopify store URL
const SHOPIFY_STORE_URL = 'https://thecosmeticformulary.com';
// Update to your booking/class registration URL (Eventbrite, Mindbody, etc.)
const BOOKING_URL = 'https://thecosmeticformulary.com/pages/classes';

export default function Home() {
  const router = useRouter();
  const [logoTaps, setLogoTaps] = useState(0);
  const [showSetup, setShowSetup] = useState(false);
  const { setDeviceConfig } = useStore();
  const { pageMedia } = useStaffStore();
  const landingMedia = pageMedia?.landing ?? defaultPageMedia.landing;
  const hasMedia = landingMedia.type !== 'none' && landingMedia.url;

  const handleLogoTap = () => {
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (next >= 7) { setShowSetup(true); setLogoTaps(0); }
  };

  if (showSetup) {
    return <SetupScreen onClose={() => setShowSetup(false)} setDeviceConfig={setDeviceConfig} router={router} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden select-none" style={{ backgroundColor: '#1C1917' }}>

      {/* Background media */}
      {hasMedia && landingMedia.type === 'image' && (
        <img src={landingMedia.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: landingMedia.position, opacity: landingMedia.opacity / 100, pointerEvents: 'none' }} />
      )}
      {hasMedia && landingMedia.type === 'video' && (
        <video src={landingMedia.url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: landingMedia.position, opacity: landingMedia.opacity / 100, pointerEvents: 'none' }} />
      )}

      {/* Ambient gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 90%, rgba(184,150,46,0.12) 0%, transparent 65%)',
      }} />

      {/* ── HERO SECTION ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10" style={{ paddingTop: '60px', paddingBottom: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Logo — centered, clickable home */}
          <button
            onClick={handleLogoTap}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: 28 }}
          >
            <Image
              src="/tcf-logo-white.svg"
              alt="The Cosmetic Formulary"
              width={68}
              height={68}
              style={{ opacity: 0.88 }}
            />
          </button>

          {/* Wordmark */}
          <h1 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(52px, 12vw, 104px)',
            fontWeight: 300,
            color: '#FAF7F2',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            marginBottom: 14,
          }}>
            Sip &<br />Formulate
          </h1>
          <p style={{
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            fontFamily: 'var(--font-inter)',
          }}>
            The Cosmetic Formulary · King Street
          </p>
        </motion.div>
      </div>

      {/* ── CARDS SECTION ── */}
      <motion.div
        className="relative z-10 px-6 pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
      >
        {/* 3-card row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10, maxWidth: 480, margin: '0 auto 10px' }}>

          {/* Check In card */}
          <motion.button
            onClick={() => router.push('/guest/start')}
            whileTap={{ scale: 0.97 }}
            style={{
              backgroundColor: 'var(--color-gold)',
              borderRadius: 20,
              padding: '20px 12px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 20 }}>✦</span>
            <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-inter)', fontWeight: 600, color: '#1C1917', lineHeight: 1.3 }}>
              Check{'\n'}In
            </span>
          </motion.button>

          {/* Book a Class card */}
          <motion.a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 20,
              padding: '20px 12px',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 20, color: '#FAF7F2' }}>◇</span>
            <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-inter)', fontWeight: 500, color: 'rgba(250,247,242,0.75)', lineHeight: 1.3 }}>
              Book{'\n'}a Class
            </span>
          </motion.a>

          {/* Shop card */}
          <motion.a
            href={SHOPIFY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 20,
              padding: '20px 12px',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 20, color: '#FAF7F2' }}>◈</span>
            <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-inter)', fontWeight: 500, color: 'rgba(250,247,242,0.75)', lineHeight: 1.3 }}>
              Shop{'\n'}Online
            </span>
          </motion.a>
        </div>

        {/* Booking detail banner */}
        <motion.a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.99 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 480,
            margin: '0 auto',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18,
            padding: '16px 20px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#FAF7F2', fontFamily: 'var(--font-cormorant)', fontWeight: 300, marginBottom: 2, letterSpacing: '0.02em' }}>
              Bubble Bath Atelier — King Street
            </p>
            <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>
              Reserve your seat
            </p>
          </div>
          <span style={{ fontSize: 16, color: 'var(--color-gold)', marginLeft: 12 }}>→</span>
        </motion.a>
      </motion.div>

      {/* Bottom bar — staff & admin access */}
      <div className="relative z-10 pb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 28px 28px' }}>
        <button
          onClick={() => router.push('/admin')}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '10px 22px', color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Admin
        </button>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Luxury atelier · Charleston, SC
        </p>
        <button
          onClick={() => router.push('/staff')}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '10px 22px', color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Staff
        </button>
      </div>
    </div>
  );
}

function SetupScreen({ onClose, setDeviceConfig, router }: { onClose: () => void; setDeviceConfig: (role: string, table?: number, seat?: number) => void; router: ReturnType<typeof useRouter> }) {
  const [table] = useState(1);
  const [seat] = useState(1);
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSelect = (selectedRole: string) => {
    if (['staff', 'instructor', 'admin'].includes(selectedRole)) {
      setRole(selectedRole);
    } else {
      setDeviceConfig(selectedRole, table, seat);
      onClose();
    }
  };

  const handlePinSubmit = () => {
    const correct = role === 'admin' ? '0000' : '1234';
    if (pin === correct) {
      setDeviceConfig(role);
      if (role === 'admin') router.push('/admin');
      else router.push('/staff');
      onClose();
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 relative" style={{ backgroundColor: 'var(--color-background)' }}>
      <button onClick={onClose} className="absolute top-8 right-8 text-sm" style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none' }}>✕</button>
      <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>Device Setup</h2>
      <p className="text-sm mb-10" style={{ color: 'var(--color-text-secondary)' }}>Configure this station</p>
      {!role ? (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {['guest', 'table-shared', 'staff', 'instructor', 'admin'].map(r => (
            <button key={r} onClick={() => handleSelect(r)} className="py-4 px-6 rounded-2xl text-sm text-left capitalize"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
              {r === 'table-shared' ? 'Shared Table Station' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-xs items-center">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Enter {role} PIN</p>
          <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
            maxLength={4} placeholder="• • • •" className="w-full py-4 text-center text-xl rounded-2xl"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', outline: 'none', letterSpacing: '0.5em' }} autoFocus />
          {error && <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>}
          <button onClick={handlePinSubmit} className="w-full py-4 rounded-2xl text-sm"
            style={{ backgroundColor: 'var(--color-gold)', color: '#1C1917', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            Continue
          </button>
          <button onClick={() => { setRole(''); setPin(''); setError(''); }} className="text-xs"
            style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none' }}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
