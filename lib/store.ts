'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthdayMonth?: number;
  instagramHandle?: string;
  referralSource?: string;
  celebrationNote?: string;
  marketingOptIn: boolean;
  photoOptIn: boolean;
  allergyDisclosed: boolean;
}

export interface AppStore {
  // Device config
  deviceRole: 'guest' | 'table-shared' | 'staff' | 'instructor' | 'admin' | null;
  tableNumber: number | null;
  seatNumber: number | null;

  // Guest session
  guest: GuestData | null;

  // Choices
  fragranceId: string | null;
  colorId: string | null;
  viscosity: 'light' | 'medium' | 'thick' | null;
  productName: string | null;
  scentName: string | null;
  activeName: string | null;

  // Progress
  currentStep: number;
  completedSteps: number[];
  waiverSigned: boolean;
  labelApproved: boolean;

  // Auth
  staffAuthed: boolean;
  adminAuthed: boolean;

  // Actions
  setDeviceConfig: (role: string, table?: number, seat?: number) => void;
  setGuest: (guest: GuestData) => void;
  setFragrance: (id: string) => void;
  setColor: (id: string) => void;
  setViscosity: (v: 'light' | 'medium' | 'thick') => void;
  setProductName: (name: string) => void;
  setScentName: (name: string) => void;
  setActiveName: (name: string) => void;
  advanceStep: () => void;
  completeStep: (step: number) => void;
  signWaiver: () => void;
  approvLabel: () => void;
  setStaffAuthed: (v: boolean) => void;
  setAdminAuthed: (v: boolean) => void;
  resetGuestSession: () => void;
  resetDevice: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      deviceRole: null,
      tableNumber: null,
      seatNumber: null,
      guest: null,
      fragranceId: null,
      colorId: null,
      viscosity: null,
      productName: null,
      scentName: null,
      activeName: null,
      currentStep: 1,
      completedSteps: [],
      waiverSigned: false,
      labelApproved: false,
      staffAuthed: false,
      adminAuthed: false,

      // Actions
      setDeviceConfig: (role, table, seat) =>
        set({
          deviceRole: role as AppStore['deviceRole'],
          tableNumber: table ?? null,
          seatNumber: seat ?? null,
        }),

      setGuest: (guest) => set({ guest }),

      setFragrance: (id) => set({ fragranceId: id }),

      setColor: (id) => set({ colorId: id }),

      setViscosity: (v) => set({ viscosity: v }),

      setProductName: (name) => set({ productName: name }),

      setScentName: (name) => set({ scentName: name }),

      setActiveName: (name) => set({ activeName: name }),

      advanceStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 12),
          completedSteps: state.completedSteps.includes(state.currentStep)
            ? state.completedSteps
            : [...state.completedSteps, state.currentStep],
        })),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      signWaiver: () => set({ waiverSigned: true }),

      approvLabel: () => set({ labelApproved: true }),

      setStaffAuthed: (v) => set({ staffAuthed: v }),

      setAdminAuthed: (v) => set({ adminAuthed: v }),

      resetGuestSession: () =>
        set({
          guest: null,
          fragranceId: null,
          colorId: null,
          viscosity: null,
          productName: null,
          scentName: null,
          activeName: null,
          currentStep: 1,
          completedSteps: [],
          waiverSigned: false,
          labelApproved: false,
        }),

      resetDevice: () =>
        set({
          deviceRole: null,
          tableNumber: null,
          seatNumber: null,
          guest: null,
          fragranceId: null,
          colorId: null,
          viscosity: null,
          productName: null,
          scentName: null,
          activeName: null,
          currentStep: 1,
          completedSteps: [],
          waiverSigned: false,
          labelApproved: false,
          staffAuthed: false,
          adminAuthed: false,
        }),
    }),
    {
      name: 'sip-formulate-store',
    }
  )
);
