'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { FORMULA_STEPS, FormulaStep } from '@/lib/steps';
import PinEntry from '@/components/PinEntry';
import PageTransition from '@/components/PageTransition';

const ADMIN_PIN = '0000';

export default function FormulaEditorPage() {
  const router = useRouter();
  const { adminAuthed, setAdminAuthed } = useStore();
  const [steps, setSteps] = useState<FormulaStep[]>(FORMULA_STEPS);
  const [editingStep, setEditingStep] = useState<FormulaStep | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (!adminAuthed) {
    return <PinEntry title="Admin Access" correctPin={ADMIN_PIN} onSuccess={() => setAdminAuthed(true)} onCancel={() => router.push('/admin')} />;
  }

  const openEdit = (step: FormulaStep) => {
    setEditingStep({ ...step });
    setShowModal(true);
  };

  const openNew = () => {
    setEditingStep({
      id: Math.max(...steps.map((s) => s.id)) + 1,
      title: '',
      instruction: '',
    });
    setShowModal(true);
  };

  const saveStep = () => {
    if (!editingStep) return;
    setSteps((prev) => {
      const exists = prev.find((s) => s.id === editingStep.id);
      if (exists) return prev.map((s) => (s.id === editingStep.id ? editingStep : s));
      return [...prev, editingStep];
    });
    setShowModal(false);
    setEditingStep(null);
  };

  const deleteStep = (id: number) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>← Back</button>
          <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Formula Step Editor</h1>
          <button onClick={openNew} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--color-gold)', minHeight: 44 }}>
            + Add Step
          </button>
        </div>

        <div className="px-6 py-6 max-w-2xl mx-auto space-y-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="rounded-xl p-5 flex gap-4 items-start"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: 'var(--color-gold)', color: 'white' }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed mb-2 truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  {step.instruction}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {step.timerSeconds && (
                    <span className="text-xs uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(184,150,46,0.12)', color: 'var(--color-gold)', letterSpacing: '0.15em', fontWeight: 500 }}>
                      Timer {step.timerSeconds}s
                    </span>
                  )}
                  {step.safetyNote && (
                    <span className="text-xs uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(184,150,46,0.08)', color: 'var(--color-gold)', letterSpacing: '0.15em', fontWeight: 500 }}>
                      Safety note
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(step)}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ border: '1px solid var(--color-border)', minHeight: 34 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(step.id)}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ border: '1px solid #FCA5A5', color: '#DC2626', minHeight: 34 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit modal */}
        {showModal && editingStep && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
              <h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {editingStep.title || 'New Step'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Step Title</label>
                  <input
                    value={editingStep.title}
                    onChange={(e) => setEditingStep((s) => s ? { ...s, title: e.target.value } : s)}
                    className="w-full border rounded-xl px-4 py-3"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Instruction</label>
                  <textarea
                    value={editingStep.instruction}
                    onChange={(e) => setEditingStep((s) => s ? { ...s, instruction: e.target.value } : s)}
                    className="w-full border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)', minHeight: 100 }}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Safety Note (optional)</label>
                  <input
                    value={editingStep.safetyNote || ''}
                    onChange={(e) => setEditingStep((s) => s ? { ...s, safetyNote: e.target.value } : s)}
                    className="w-full border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Timer (seconds, blank = none)</label>
                  <input
                    type="number"
                    value={editingStep.timerSeconds || ''}
                    onChange={(e) => setEditingStep((s) => s ? { ...s, timerSeconds: e.target.value ? parseInt(e.target.value) : undefined } : s)}
                    className="w-full border rounded-xl px-4 py-3 text-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStep.lockUntilInstructor || false}
                    onChange={(e) => setEditingStep((s) => s ? { ...s, lockUntilInstructor: e.target.checked } : s)}
                  />
                  <span className="text-sm">Lock until instructor advances</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={saveStep} className="flex-1 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--color-gold)' }}>
                  Save
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid var(--color-border)' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {deleteId !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl p-6 w-80">
              <h2 className="text-xl mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>Delete Step?</h2>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => deleteStep(deleteId)} className="flex-1 py-3 rounded-xl text-white" style={{ backgroundColor: '#EF4444' }}>Delete</button>
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
