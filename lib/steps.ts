export interface FormulaStep {
  id: number;
  title: string;
  instruction: string;
  safetyNote?: string;
  timerSeconds?: number;
  lockUntilInstructor?: boolean;
  visual?: string;
  visualColor?: string;
}

export const FORMULA_STEPS: FormulaStep[] = [
  {
    id: 1,
    title: 'Prepare your beaker',
    instruction: 'Place your 16 oz beaker on the scale and zero it out. You are about to create something entirely yours.',
    visual: '',
    visualColor: 'linear-gradient(135deg, #E8E0D5, #D4C9BC)',
  },
  {
    id: 2,
    title: 'Add your base',
    instruction: 'Pour the pre-measured Bubble Bath Base into your beaker. This is the foundation of your formula — silky, skin-loving, and ready for your touch.',
    safetyNote: 'Do not inhale directly.',
    visual: '',
    visualColor: 'linear-gradient(135deg, #DDD5C8, #C9BFB0)',
  },
  {
    id: 3,
    title: 'Add your fragrance',
    instruction: 'Uncap your fragrance vial and pour the entire contents into the beaker. Tilt slowly and let the scent unfold.',
    safetyNote: 'One vial only — concentration is pre-measured for your formula.',
    visual: '',
    visualColor: 'linear-gradient(135deg, #E8D5CC, #D4B8A8)',
  },
  {
    id: 4,
    title: 'Stir & observe',
    instruction: 'Stir gently for 30 seconds. Long, slow strokes. Watch the fragrance incorporate and feel the formula come together.',
    timerSeconds: 30,
    visual: '',
    visualColor: 'linear-gradient(135deg, #C3B1D1, #B09ABF)',
  },
  {
    id: 5,
    title: 'Final blend',
    instruction: 'Your instructor will finalize the formula with the preservative system. Then one last stir — your formula is complete.',
    safetyNote: 'This final step is guided by your instructor.',
    lockUntilInstructor: true,
    visual: '',
    visualColor: 'linear-gradient(135deg, #B8E8D0, #9DCFB8)',
  },
];
