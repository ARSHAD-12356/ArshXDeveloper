import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Shared easing so every reveal feels like part of the same system. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
