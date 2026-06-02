import StepClient from './StepClient';

export function generateStaticParams() {
  return Array.from({ length: 5 }, (_, i) => ({ stepId: String(i + 1) }));
}

export default function Page() {
  return <StepClient />;
}
