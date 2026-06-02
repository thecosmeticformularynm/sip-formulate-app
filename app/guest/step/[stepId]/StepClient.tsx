'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function StepClient() {
  const router = useRouter();
  useEffect(() => { router.replace('/guest/create'); }, [router]);
  return null;
}
