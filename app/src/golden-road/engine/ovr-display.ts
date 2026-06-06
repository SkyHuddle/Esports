/** Visual helpers for team-year OVR on cards */

export type OvrTier = 'elite' | 'strong' | 'solid' | 'fringe';

export function getOvrTier(ovr: number): OvrTier {
  if (ovr >= 88) return 'elite';
  if (ovr >= 80) return 'strong';
  if (ovr >= 72) return 'solid';
  return 'fringe';
}

const TIER_COLORS: Record<OvrTier, string> = {
  elite: 'var(--kb-gold)',
  strong: 'var(--kb-amber)',
  solid: 'var(--kb-fg-soft)',
  fringe: 'var(--kb-fg-mute)',
};

const TIER_LABELS: Record<OvrTier, string> = {
  elite: 'Legend',
  strong: 'Elite',
  solid: 'Star',
  fringe: 'Solid',
};

export function ovrAccentColor(ovr: number): string {
  return TIER_COLORS[getOvrTier(ovr)];
}

export function ovrTierLabel(ovr: number): string {
  return TIER_LABELS[getOvrTier(ovr)];
}

/** 0–100 power meter fill for roster summaries */
export function ovrMeterPercent(ovr: number): number {
  return Math.min(100, Math.max(8, ((ovr - 52) / 45) * 100));
}
