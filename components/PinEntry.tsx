'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PinEntryProps {
  title: string;
  subtitle?: string;
  correctPin: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function PinEntry({ title, subtitle, correctPin, onSuccess, onCancel }: PinEntryProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      if (newPin === correctPin) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="w-full max-w-sm mx-auto px-8"
      >
        <h1 className="font-serif text-4xl text-center mb-2" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--color-text-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-center text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            {subtitle}
          </p>
        )}

        {/* PIN display */}
        <div className="flex justify-center gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 transition-all"
              style={{
                borderColor: error ? '#EF4444' : 'var(--color-gold)',
                backgroundColor: pin.length > i ? (error ? '#EF4444' : 'var(--color-gold)') : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((d) => (
            <button
              key={d}
              onClick={() => d === '⌫' ? handleBackspace() : d !== '' ? handleDigit(d) : undefined}
              disabled={d === ''}
              className="h-16 rounded-xl text-xl font-medium transition-all active:scale-95"
              style={{
                backgroundColor: d === '' ? 'transparent' : 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: d === '' ? 'none' : '1px solid var(--color-border)',
                cursor: d === '' ? 'default' : 'pointer',
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm mt-4"
            style={{ color: '#EF4444' }}
          >
            Incorrect PIN
          </motion.p>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full mt-6 text-sm text-center py-3"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>
        )}
      </motion.div>
    </div>
  );
}
