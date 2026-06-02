'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

interface HelpRequest {
  id: number;
  guest: string;
  table: number;
  seat: number;
  step: number;
  note: string;
  minutesAgo: number;
  allergyPriority: boolean;
  status: 'open' | 'acknowledged' | 'resolved';
}

const MOCK_HELP: HelpRequest[] = [
  {
    id: 1,
    guest: 'Cara Nguyen',
    table: 1,
    seat: 3,
    step: 3,
    note: 'My vial seems empty — is that normal?',
    minutesAgo: 2,
    allergyPriority: false,
    status: 'open',
  },
  {
    id: 2,
    guest: 'Hannah Park',
    table: 2,
    seat: 2,
    step: 4,
    note: 'I disclosed a nut allergy during check-in. Just want to confirm the ingredients are safe.',
    minutesAgo: 5,
    allergyPriority: true,
    status: 'open',
  },
  {
    id: 3,
    guest: 'Rachel Scott',
    table: 3,
    seat: 6,
    step: 7,
    note: 'My colorant dropper is clogged',
    minutesAgo: 8,
    allergyPriority: false,
    status: 'acknowledged',
  },
];

const STAFF_PIN = '1234';

export default function StaffHelpPage() {
  const router = useRouter();
  const { staffAuthed, setStaffAuthed } = useStore();
  const [requests, setRequests] = useState(MOCK_HELP);

  if (!staffAuthed) {
    return <PinEntry title="Staff Access" correctPin={STAFF_PIN} onSuccess={() => setStaffAuthed(true)} onCancel={() => router.push('/')} />;
  }

  const updateStatus = (id: number, status: HelpRequest['status']) => {
    setRequests((r) => r.map((req) => (req.id === id ? { ...req, status } : req)));
  };

  const open = requests.filter((r) => r.status !== 'resolved');

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/staff')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            ← Back
          </button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Help Requests</h1>
          <span
            className="px-3 py-1 rounded-full text-xs uppercase"
            style={{ backgroundColor: open.length > 0 ? 'rgba(184,150,46,0.15)' : 'rgba(168,197,176,0.25)', color: open.length > 0 ? '#B8962E' : '#4A6B53', letterSpacing: '0.15em', fontWeight: 500 }}
          >
            {open.length} open
          </span>
        </div>

        {/* Requests */}
        <div className="px-6 py-6 space-y-4">
          <AnimatePresence>
            {requests.filter((r) => r.status !== 'resolved').map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28 }}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderLeft: req.allergyPriority ? '3px solid var(--color-gold)' : '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{req.guest}</h3>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                        T{req.table}·S{req.seat}
                      </span>
                      {req.allergyPriority && (
                        <span className="text-xs uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.2em', fontWeight: 500 }}>
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      Step {req.step} of 12 · {req.minutesAgo}m ago
                    </p>
                  </div>
                  <span
                    className="text-xs uppercase px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: req.status === 'open' ? 'rgba(184,150,46,0.12)' : 'rgba(195,177,209,0.2)',
                      color: req.status === 'open' ? '#B8962E' : '#6B5A82',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {req.status === 'open' ? 'Open' : 'In Progress'}
                  </span>
                </div>

                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  &ldquo;{req.note}&rdquo;
                </p>

                <div className="flex gap-2">
                  {req.status === 'open' && (
                    <button
                      onClick={() => updateStatus(req.id, 'acknowledged')}
                      className="uppercase"
                      style={{ border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', borderRadius: 100, minHeight: 44, padding: '0 24px', fontSize: 11, letterSpacing: '0.15em', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(req.id, 'resolved')}
                    className="uppercase"
                    style={{ backgroundColor: 'var(--color-gold)', color: '#1C1917', borderRadius: 100, minHeight: 44, padding: '0 24px', fontSize: 11, letterSpacing: '0.15em', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                  >
                    Resolved
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {open.length === 0 && (
            <div className="text-center py-20">
              <div style={{ height: 1, width: 60, backgroundColor: 'var(--color-gold)', margin: '0 auto 24px' }} />
              <p className="text-xs uppercase" style={{ letterSpacing: '0.2em', color: 'var(--color-text-secondary)' }}>No open help requests</p>
            </div>
          )}

          {/* Resolved */}
          {requests.filter((r) => r.status === 'resolved').length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Resolved
              </p>
              {requests.filter((r) => r.status === 'resolved').map((req) => (
                <div key={req.id} className="rounded-xl px-4 py-3 mb-2 flex items-center justify-between" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {req.guest} · T{req.table}·S{req.seat}
                  </span>
                  <span className="text-xs uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}>Resolved</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
