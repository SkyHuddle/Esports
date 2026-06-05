import type { DraftPick, Role } from './types';

export const DRAFT_ROUNDS = 5;

export const ROLE_ORDER: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];

/** End-of-run roster lists: top → support (ADC above support, not draft order). */
export function sortPicksByRole(picks: DraftPick[]): DraftPick[] {
  return [...picks].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
  );
}

/** Total series across the Golden Road (5 per stage × 4 stages — mirrors Ring Chase's 20) */
export const ROAD_TOTAL_SERIES = 20;

/** Series per tournament stage */
export const SERIES_PER_STAGE = 5;

/** Per bracket beat inside a tournament stage */
export const RUN_BEAT_DELAY = 380;

/**
 * Logistic midpoints — difficulty climbs through the year (Spring → Worlds).
 * Worlds is the hardest gate; MSI sits above domestic splits.
 */
export const STAGE_PASS_MIDPOINTS = {
  spring: 73,
  summer: 74,
  msi: 77,
  worlds: 82,
} as const;

/** How quickly pass % rises as roster stage power exceeds the midpoint */
export const STAGE_PASS_STEEPNESS = {
  spring: 0.11,
  summer: 0.11,
  msi: 0.13,
  worlds: 0.16,
} as const;

/** Stage reveal timing (ms) */
export const STAGE_REVEAL_DELAY = 1200;
export const STAGE_PAUSE = 400;

/** Every roster keeps a real shot at each stage (upsets happen) */
export const STAGE_PASS_MIN = 0.1;
export const STAGE_PASS_MAX = 0.92;

/** Floor shown/calculated for full-roster Golden Road odds */
export const MIN_GOLDEN_ROAD_CHANCE = 0.01;

export const WORLDS_FAILURE_LABELS = {
  groups: 'Lost in Worlds Groups',
  quarterfinals: 'Lost Worlds Quarterfinals',
  semifinals: 'Lost Worlds Semifinals',
  finals: 'Lost Worlds Finals',
} as const;

/** Slot machine timing */
export const SPIN_DURATION_MS = 2600;
export const SPIN_TICK_MS = 75;
