'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ATTRACT_ITEMS = [
  { name: 'Charleston Jasmine', tagline: 'Southern. Floral. Elevated.' },
  { name: 'Sea Salt Air', tagline: 'The coast, distilled.' },
  { name: 'Vanilla Bean', tagline: 'Warm. Rich. Unmistakably luxe.' },
  { name: 'Coconut Milk', tagline: 'Tropical. Creamy. Nostalgic.' },
];

export default function GuestAttractPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % ATTRACT_ITEMS.length);
        setVisible(true);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between cursor-pointer select-none"
      style={{ backgroundColor: '#1A1A1A' }}
      onClick={() => router.push('/guest/welcome')}
    >
      {/* Top wordmark */}
      <div className="pt-16 text-center">
        <h1
          className="text-4xl tracking-widest"
          style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(201,168,76,0.8)' }}
        >
          Sip & Formulate
        </h1>
      </div>

      {/* Center fragrance display */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-8">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="text-center"
            >
              <p
                className="text-5xl md:text-6xl mb-4"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}
              >
                {ATTRACT_ITEMS[currentIndex].name}
              </p>
              <p
                className="text-xl tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-inter)', color: 'rgba(201,168,76,0.7)', letterSpacing: '0.2em' }}
              >
                {ATTRACT_ITEMS[currentIndex].tagline}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom tap prompt */}
      <div className="pb-16 text-center">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-sm tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Tap anywhere to begin
        </motion.p>
      </div>
    </div>
  );
}
