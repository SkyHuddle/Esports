import type { DraftPick, RosterSlot, StageId } from './types';

export const DRAFT_ROUNDS = 5;

export const SLOT_ORDER: RosterSlot[] = ['igl', 'awper', 'entry', 'lurker', 'support'];

/** End-of-run roster lists: IGL → support (not draft order). */
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
  opening: 76,
  elimination: 78,
  quarterfinal: 80,
  semifinal: 82,
  grand_final: 84,
};

export const STAGE_PASS_STEEPNESS: Record<StageId, number> = {
  opening: 0.12,
  elimination: 0.13,
  quarterfinal: 0.14,
  semifinal: 0.14,
  grand_final: 0.15,
};

export const STAGE_PASS_MIN = 0.08;
export const STAGE_PASS_MAX = 0.88;
export const MIN_MAJOR_CHANCE = 0.01;

export const STAGE_FAILURE_LABELS: Record<StageId, string> = {
  opening: 'Opening Stage',
  elimination: 'Elimination Stage',
  quarterfinal: 'Quarterfinal',
  semifinal: 'Semifinal',
  grand_final: 'Grand Final',
};

/** Chemistry evaluation thresholds */
export const CHEMISTRY_ELITE_LEADERSHIP = 88;
export const CHEMISTRY_ELITE_AWP = 90;
export const CHEMISTRY_ELITE_ENTRY = 88;
export const CHEMISTRY_ELITE_LAN = 88;
export const CHEMISTRY_LOW_LAN = 80;
export const CHEMISTRY_HIGH_FIREPOWER = 92;
export const CHEMISTRY_EGO_SLAYER_COUNT = 3;

/** Total series beats across a full major (17 = flawless run) */
export const MAJOR_RUN_TOTAL_SERIES = 17;

/** Tier weights for random team selection */
export const TIER_WEIGHTS: Record<string, number> = {
  legendary: 20,
  elite: 20,
  strong: 20,
  solid: 20,
  underdog: 20,
};
