'use client';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useStaffStore, defaultPageMedia } from '@/lib/staffStore';
import { FRAGRANCES } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function DonePage() {
  const router = useRouter();
  const { guest, productName, fragranceId, resetGuestSession } = useStore();
  const { pageMedia } = useStaffStore();
  const doneMedia = pageMedia?.done ?? defaultPageMedia.done;
  const hasDoneMedia = doneMedia.type !== 'none' && doneMedia.url;
  const fragrance = FRAGRANCES.find(f => f.id === fragranceId);
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const celebration = guest?.celebrationNote?.toLowerCase() || '';
  const isBday = celebration.includes('birthday');
  const isBach = celebration.includes('bachelorette');
  const isAnniv = celebration.includes('anniversary');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1C1917', color: '#FAF7F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {hasDoneMedia && doneMedia.type === 'image' && (
        <img src={doneMedia.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: doneMedia.position, opacity: doneMedia.opacity / 100, pointerEvents: 'none' }} />
      )}
      {hasDoneMedia && doneMedia.type === 'video' && (
        <video src={doneMedia.url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: doneMedia.position, opacity: doneMedia.opacity / 100, pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <Image src="/tcf-logo-white.svg" alt="The Cosmetic Formulary" width={40} height={40} style={{ opacity: 0.4 }} />
        </button>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.25,0,0,1] }} style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 'clamp(52px,10vw,80px)', lineHeight: 1.05, marginBottom: 24 }}>
          You made something<br /><em style={{ fontStyle: 'italic', color: '#B8962E' }}>beautiful.</em>
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: 48 }}>
          {productName} — {fragrance?.name} — {today}
        </p>
        {(isBday || isBach || isAnniv) && (
          <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 28, color: '#B8962E', marginBottom: 48 }}>
            {isBday && `Happy Birthday, ${guest?.firstName}.`}
            {isBach && 'Congratulations to the bride-to-be.'}
            {isAnniv && 'Happy Anniversary.'}
          </p>
        )}
        <div style={{ width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 auto 40px' }} />
        <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>@sipandformulate</p>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', marginBottom: 60 }}>#SipAndFormulate · #KingStreetBeauty</p>
        <button
          onClick={() => { resetGuestSession(); router.push('/'); }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, padding: '16px 40px', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
}
