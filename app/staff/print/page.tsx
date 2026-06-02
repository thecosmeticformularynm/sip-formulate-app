'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useStaffStore, PrintJob } from '@/lib/staffStore';
import PinEntry from '@/components/PinEntry';

const STAFF_PIN = '1234';

function PrintLabel({ job }: { job: PrintJob }) {
  const lineColor = 'rgba(28,25,23,0.15)';
  const fg = '#1C1917';
  const fgMuted = 'rgba(28,25,23,0.45)';

  return (
    <div
      style={{
        width: '3in', height: '4in',
        backgroundColor: '#ffffff',
        padding: '0.28in 0.26in',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tcf-logo-black.svg" alt="The Cosmetic Formulary" width="88" height="88" style={{ display: 'block' }} />

      <div style={{ width: '60%', height: '0.4pt', backgroundColor: lineColor, margin: '0.16in 0 0.12in' }} />

      <p style={{ fontSize: '7pt', letterSpacing: '0.26em', textTransform: 'uppercase', color: fgMuted, marginBottom: '4pt', fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center' }}>
        Bubble Bath
      </p>
      <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '38pt', fontWeight: 400, color: fg, lineHeight: 1, marginBottom: '0.16in', textAlign: 'center' }}>
        No.1
      </p>

      <div style={{ width: '100%', marginBottom: '0.14in' }}>
        <p style={{ fontSize: '6pt', letterSpacing: '0.2em', textTransform: 'uppercase', color: fgMuted, marginBottom: '5pt', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Product Name :
        </p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '11pt', color: fg, borderBottom: `0.5pt solid ${lineColor}`, paddingBottom: '5pt', margin: 0, minHeight: '15pt' }}>
          {job.productName}
        </p>
      </div>

      <div style={{ width: '100%', marginBottom: '0.14in' }}>
        <p style={{ fontSize: '6pt', letterSpacing: '0.2em', textTransform: 'uppercase', color: fgMuted, marginBottom: '5pt', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Scent :
        </p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '11pt', color: fg, borderBottom: `0.5pt solid ${lineColor}`, paddingBottom: '5pt', margin: 0, minHeight: '15pt' }}>
          {job.fragranceName !== '—' ? job.fragranceName : ''}
        </p>
      </div>

      <div style={{ width: '100%', marginBottom: '0.2in' }}>
        <p style={{ fontSize: '6pt', letterSpacing: '0.2em', textTransform: 'uppercase', color: fgMuted, marginBottom: '5pt', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Active :
        </p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '11pt', color: fg, borderBottom: `0.5pt solid ${lineColor}`, paddingBottom: '5pt', margin: 0, minHeight: '15pt' }}>
          {job.colorName !== '—' ? job.colorName : ''}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', width: '100%', justifyContent: 'center', marginBottom: '0.12in' }}>
        <div style={{ flex: 1, height: '0.4pt', backgroundColor: lineColor }} />
        <p style={{ fontSize: '6pt', letterSpacing: '0.2em', textTransform: 'uppercase', color: fgMuted, whiteSpace: 'nowrap', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0 }}>
          Net Wt. 16 fl oz
        </p>
        <div style={{ flex: 1, height: '0.4pt', backgroundColor: lineColor }} />
      </div>

      <p style={{ fontSize: '5.5pt', lineHeight: 1.5, color: fgMuted, textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', margin: '0 0 4pt' }}>
        For external use only. Avoid contact with eyes. Discontinue use if irritation occurs.
      </p>
      <p style={{ fontSize: '5.5pt', color: fgMuted, fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, textAlign: 'center' }}>
        {job.guestName} · {job.date}
      </p>
    </div>
  );
}

export default function PrintQueuePage() {
  const router = useRouter();
  const { staffAuthed, setStaffAuthed } = useStore();
  const { printQueue, markPrinted, deletePrintJob, clearPrintedJobs } = useStaffStore();
  const [filter, setFilter] = useState<'pending' | 'printed' | 'all'>('pending');
  const [printingJobs, setPrintingJobs] = useState<PrintJob[]>([]);

  if (!staffAuthed) {
    return (
      <PinEntry
        title="Staff Access"
        subtitle="Enter staff PIN"
        correctPin={STAFF_PIN}
        onSuccess={() => setStaffAuthed(true)}
        onCancel={() => router.push('/')}
      />
    );
  }

  const pending = printQueue.filter(j => j.status === 'pending');
  const filtered = filter === 'all' ? printQueue : printQueue.filter(j => j.status === filter);

  const handlePrint = (jobs: PrintJob[]) => {
    setPrintingJobs(jobs);
    setTimeout(() => {
      window.print();
      jobs.forEach(j => markPrinted(j.id));
      setTimeout(() => setPrintingJobs([]), 1000);
    }, 250);
  };

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const gold = '#B8962E';
  const dark = '#1C1917';
  const border = '#E2D9CE';
  const muted = '#78716C';

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-sheet { display: block !important; }
        }
        #print-sheet { display: none; }
        @page { margin: 0; size: auto; }
      `}</style>

      {/* Print sheet */}
      <div id="print-sheet">
        {printingJobs.map((job, i) => (
          <div key={job.id} style={{ pageBreakAfter: i < printingJobs.length - 1 ? 'always' : 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '4in' }}>
            <PrintLabel job={job} />
          </div>
        ))}
      </div>

      {/* Screen UI */}
      <div style={{ minHeight: '100vh', backgroundColor: '#F4EFE6' }}>

        {/* Header */}
        <div style={{ backgroundColor: '#FAF7F2', borderBottom: `1px solid ${border}`, padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/staff')} style={{ background: 'none', border: 'none', fontSize: 20, color: muted, cursor: 'pointer', padding: 0 }}>←</button>
            <div>
              <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 26, margin: 0, color: dark }}>Print Queue</h1>
              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: pending.length > 0 ? gold : muted, margin: 0 }}>
                {pending.length > 0 ? `${pending.length} label${pending.length !== 1 ? 's' : ''} ready to print` : 'All caught up'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {printQueue.some(j => j.status === 'printed') && (
              <button onClick={clearPrintedJobs} style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, background: 'none', border: `1px solid ${border}`, borderRadius: 100, padding: '8px 16px', cursor: 'pointer' }}>
                Clear printed
              </button>
            )}
            {pending.length > 1 && (
              <button
                onClick={() => handlePrint(pending)}
                style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: gold, color: dark, border: 'none', borderRadius: 100, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}
              >
                Print All ({pending.length})
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ padding: '14px 28px', display: 'flex', gap: 8, borderBottom: `1px solid ${border}`, backgroundColor: '#FAF7F2' }}>
          {([
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'printed', label: `Printed (${printQueue.filter(j => j.status === 'printed').length})` },
            { key: 'all',     label: `All (${printQueue.length})` },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '7px 18px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
              border: '1px solid',
              borderColor: filter === key ? gold : border,
              backgroundColor: filter === key ? 'rgba(184,150,46,0.08)' : 'transparent',
              color: filter === key ? gold : muted,
              fontWeight: filter === key ? 500 : 400,
            }}>{label}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ padding: '20px 28px', maxWidth: 900, margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: muted, fontWeight: 300, marginBottom: 12 }}>
                {filter === 'pending' ? 'No labels waiting' : 'Nothing here yet'}
              </p>
              <p style={{ fontSize: 13, color: muted }}>Labels appear automatically when guests approve them</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((job) => (
                <div key={job.id} style={{
                  backgroundColor: '#FAF7F2',
                  border: `1px solid ${border}`,
                  borderLeft: job.status === 'pending' ? `3px solid ${gold}` : '3px solid transparent',
                  borderRadius: 18,
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 20,
                  opacity: job.status === 'printed' ? 0.55 : 1,
                }}>

                  {/* Mini label thumbnail */}
                  <div style={{ width: 48, height: 64, flexShrink: 0, borderRadius: 4, backgroundColor: dark, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FAF7F2' }} />
                    </div>
                    <p style={{ fontSize: 7, color: '#FAF7F2', fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>No.1</p>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 21, fontWeight: 400, color: dark }}>{job.productName}</span>
                      <span style={{ fontSize: 12, color: muted }}>— {job.guestName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: dark }}>
                        <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginRight: 5 }}>Scent</span>
                        {job.fragranceName !== '—' ? job.fragranceName : '—'}
                      </span>
                      {job.colorName && job.colorName !== '—' && (
                        <span style={{ fontSize: 12, color: dark }}>
                          <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginRight: 5 }}>Active</span>
                          {job.colorName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, color: dark, fontWeight: 500 }}>{fmt(job.approvedAt)}</div>
                    <div style={{ fontSize: 11, color: muted }}>{fmtDate(job.approvedAt)}</div>
                    {job.status === 'printed' && job.printedAt && (
                      <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>Printed {fmt(job.printedAt)}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => handlePrint([job])}
                      style={{
                        padding: '10px 22px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                        letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                        backgroundColor: job.status === 'pending' ? gold : 'transparent',
                        color: job.status === 'pending' ? dark : muted,
                        border: job.status === 'pending' ? 'none' : `1px solid ${border}`,
                      }}
                    >
                      {job.status === 'pending' ? 'Print' : 'Reprint'}
                    </button>
                    <button
                      onClick={() => deletePrintJob(job.id)}
                      style={{ padding: '10px 14px', borderRadius: 100, fontSize: 14, cursor: 'pointer', backgroundColor: 'transparent', color: muted, border: `1px solid ${border}` }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ padding: '0 28px 48px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 20 }}>
            <p style={{ fontSize: 12, color: muted, lineHeight: 1.8 }}>
              <strong style={{ color: dark, fontWeight: 500 }}>How to print:</strong> Click <em>Print</em> on any label to open the print dialog, or use <em>Print All</em> to batch-print every pending label at once. Set paper size to <strong>3&quot; × 4&quot;</strong> in the print dialog to match standard label stock. Compatible with Dymo, Zebra, Brother label printers, and standard printers. Labels are auto-marked as printed after each job.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
