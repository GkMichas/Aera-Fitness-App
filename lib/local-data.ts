"use client";

import type { Macros, MealItem } from "@/types/nutrition";
import type { MeasurementPoint } from "@/types/progress";

const STORAGE_KEY = "aera.local.v1";
const CHANGE_EVENT = "aera:local-data-change";

export interface LocalMealRecord {
  id: string;
  recordedAt: string;
  sourceText: string;
  items: MealItem[];
  macros: Macros;
}

export interface LocalCheckIn {
  date: string;
  energy: number;
  sleepHours: number;
  soreness: number;
  mood: number;
  note: string;
}

export interface LocalAeraData {
  version: 1;
  updatedAt: string;
  measurements: MeasurementPoint[];
  meals: LocalMealRecord[];
  checkIns: LocalCheckIn[];
  acceptedProgram?: { acceptedAt: string; goal: string; experience: string; daysPerWeek: number; sessionDurationMinutes: number; equipmentIds: string[]; workoutCount: number; rulesVersion: string };
  acceptedWeeklyReview?: { weekStart: string; acceptedAt: string };
  preferences: { notifications: boolean; healthStorageConsent: boolean; analytics: boolean };
  workout: { completedSets: number; paused: boolean; completedAt?: string };
}

export function emptyLocalData(): LocalAeraData {
  return { version: 1, updatedAt: new Date(0).toISOString(), measurements: [], meals: [], checkIns: [], preferences: { notifications: true, healthStorageConsent: false, analytics: false }, workout: { completedSets: 0, paused: false } };
}

export function readLocalData(): LocalAeraData {
  if (typeof window === "undefined") return emptyLocalData();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<LocalAeraData> | null;
    if (!parsed || parsed.version !== 1) return emptyLocalData();
    return { ...emptyLocalData(), ...parsed, measurements: Array.isArray(parsed.measurements) ? parsed.measurements : [], meals: Array.isArray(parsed.meals) ? parsed.meals : [], checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [], preferences: { ...emptyLocalData().preferences, ...parsed.preferences }, workout: { ...emptyLocalData().workout, ...parsed.workout } };
  } catch {
    return emptyLocalData();
  }
}

export function updateLocalData(update: (current: LocalAeraData) => LocalAeraData) {
  if (typeof window === "undefined") return;
  const next = { ...update(readLocalData()), version: 1 as const, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return next;
}

export function clearLocalData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function exportLocalData() {
  const blob = new Blob([JSON.stringify(readLocalData(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `aera-data-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
