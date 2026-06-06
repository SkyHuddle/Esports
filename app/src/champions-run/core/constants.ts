import type { DraftPick, RosterSlot, StageId } from './types';

export const DRAFT_ROUNDS = 5;

export const SLOT_ORDER: RosterSlot[] = [
  'duelist',
  'initiator',
  'controller',
  'sentinel',
  'flex',
];

/** End-of-run roster lists: duelist → flex (not draft order). */
export function sortPicksBySlot(picks: DraftPick[]): DraftPick[] {
  return [...picks].sort(
    (a, b) => SLOT_ORDER.indexOf(a.role) - SLOT_ORDER.indexOf(b.role)
  );
}

/** Stage reveal timing (ms) */
export const STAGE_PAUSE = 350;
export const RUN_BEAT_DELAY = 380;

/** Slot machine timing */
export const SPIN_DURATION_MS = 2200;
export const SPIN_TICK_MS = 70;

/** Logistic midpoints for per-stage pass probability */
export const STAGE_PASS_MIDPOINTS: Record<StageId, number> = {
  swiss: 74,
  playoffs: 76,
  semifinal: 78,
  grand_final: 80,
  champions: 82,
};

export const STAGE_PASS_STEEPNESS: Record<StageId, number> = {
  swiss: 0.11,
  playoffs: 0.12,
  semifinal: 0.13,
  grand_final: 0.14,
  champions: 0.15,
};

export const STAGE_PASS_MIN = 0.08;
export const STAGE_PASS_MAX = 0.88;
export const MIN_CHAMPIONS_CHANCE = 0.01;

export const STAGE_FAILURE_LABELS: Record<StageId, string> = {
  swiss: 'Swiss Stage',
  playoffs: 'Playoffs',
  semifinal: 'Semifinal',
  grand_final: 'Grand Final',
  champions: 'Champions',
};

/** Chemistry evaluation thresholds */
export const CHEMISTRY_ELITE_CONTROLLER = 88;
export const CHEMISTRY_ELITE_INITIATOR = 88;
export const CHEMISTRY_ELITE_DUELIST = 90;
export const CHEMISTRY_ELITE_LAN = 88;
export const CHEMISTRY_ELITE_LEADERSHIP = 88;
export const CHEMISTRY_LOW_UTILITY = 80;
export const CHEMISTRY_HIGH_FIREPOWER = 92;
export const CHEMISTRY_EGO_SLAYER_COUNT = 3;

/** Total series beats across a full Champions run */
export const CHAMPIONS_RUN_TOTAL_SERIES = 16;

/** Tier weights for random team selection */
export const TIER_WEIGHTS: Record<string, number> = {
  legendary: 20,
  elite: 20,
  strong: 20,
  solid: 20,
  underdog: 20,
};

export const VALORANT_MAPS = [
  'Ascent',
  'Bind',
  'Breeze',
  'Fracture',
  'Haven',
  'Icebox',
  'Lotus',
  'Pearl',
  'Split',
  'Sunset',
] as const;
