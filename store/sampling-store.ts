"use client"

import { create } from "zustand"

interface SamplingState {
  currentStep: number
  timelineProgress: number
  setCurrentStep: (step: number) => void
  setTimelineProgress: (progress: number | ((prev: number) => number)) => void
}

export const useSamplingStore = create<SamplingState>((set) => ({
  currentStep: 0,
  timelineProgress: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  setTimelineProgress: (progress) =>
    set((state) => ({
      timelineProgress: typeof progress === "function" ? progress(state.timelineProgress) : progress,
    })),
}))
