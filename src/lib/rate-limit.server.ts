import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";

// Lightweight in-process sliding-window throttle for public form submissions.
// It runs inside the request worker (no database round-trip), which is enough
// to stop scripted spam bursts from a single address.

type Window = { max: number; seconds: number };

const hits = new Map<string, number[]>();

function callerKey(scope: string): string {
  const ip =
    getRequestIP({ xForwardedFor: true }) ||
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-real-ip") ||
    "unknown";
  return `${scope}:${ip}`;
}

function prune(list: number[], now: number, oldestWindowMs: number) {
  return list.filter((t) => now - t < oldestWindowMs);
}

export function humanDuration(seconds: number): string {
  if (seconds < 90) return `${Math.max(1, Math.round(seconds))} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

/**
 * Returns null when the submission is allowed, or the number of seconds the
 * caller has to wait before trying again.
 */
export function throttle(scope: string, windows: Window[]): number | null {
  const now = Date.now();
  const key = callerKey(scope);
  const longestMs = Math.max(...windows.map((w) => w.seconds)) * 1000;
  const list = prune(hits.get(key) ?? [], now, longestMs);

  for (const w of windows) {
    const windowMs = w.seconds * 1000;
    const inWindow = list.filter((t) => now - t < windowMs);
    if (inWindow.length >= w.max) {
      const oldest = Math.min(...inWindow);
      hits.set(key, list);
      return Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    }
  }

  list.push(now);
  hits.set(key, list);
  // Keep the map from growing without bound on long-lived workers.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > longestMs)) hits.delete(k);
    }
  }
  return null;
}

export const ORDER_WINDOWS: Window[] = [
  { max: 3, seconds: 15 * 60 },
  { max: 8, seconds: 24 * 60 * 60 },
];

export const REVIEW_WINDOWS: Window[] = [
  { max: 2, seconds: 60 * 60 },
  { max: 6, seconds: 24 * 60 * 60 },
];
