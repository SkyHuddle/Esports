import type { ChemistryReport, DraftPick } from '../core/types';
import {
  CHEMISTRY_ELITE_AWP,
  CHEMISTRY_ELITE_ENTRY,
  CHEMISTRY_ELITE_LAN,
  CHEMISTRY_ELITE_LEADERSHIP,
  CHEMISTRY_EGO_SLAYER_COUNT,
  CHEMISTRY_HIGH_FIREPOWER,
  CHEMISTRY_LOW_LAN,
} from '../core/constants';
import { simulationPlayers } from './card-context';
import { chemistryGrade } from './ratings';

function hasIgl(picks: DraftPick[]): boolean {
  return picks.some((p) => p.role === 'igl');
}

function hasAwper(picks: DraftPick[]): boolean {
  return picks.some((p) => p.role === 'awper');
}

function hasSupport(picks: DraftPick[]): boolean {
  return picks.some((p) => p.role === 'support');
}

function teammateSynergy(players: ReturnType<typeof simulationPlayers>): number {
  const orgs = players.map((p) => p.organization);
  const clusters = new Map<string, number>();
  for (const org of orgs) clusters.set(org, (clusters.get(org) ?? 0) + 1);
  const max = Math.max(...clusters.values());
  if (max >= 3) return 2;
  if (max >= 2) return 1;
  return 0;
}

function eraSpread(picks: DraftPick[]): number {
  const seasons = picks.map((p) => p.team.season);
  return Math.max(...seasons) - Math.min(...seasons);
}

/** Chemistry uses drafted lineup slots, not player card primary roles */
export function evaluateChemistry(picks: DraftPick[]): ChemistryReport {
  const modifiers: string[] = [];
  const issues: string[] = [];
  let score = 0;

  const simById = new Map(simulationPlayers(picks).map((p) => [p.id, p]));
  const players = picks.map((p) => simById.get(p.player.id) ?? p.player);

  if (picks.length < 5) {
    return {
      score: -5,
      modifiers,
      issues: ['Incomplete roster'],
      grade: chemistryGrade(-5),
    };
  }

  if (hasIgl(picks)) {
    score += 2.5;
    modifiers.push('True IGL');
  } else {
    score -= 4;
    issues.push('No IGL');
  }

  if (hasAwper(picks)) {
    score += 2;
    modifiers.push('Dedicated AWPer');
  } else {
    score -= 3;
    issues.push('No AWPer');
  }

  if (hasSupport(picks)) {
    score += 1.5;
    modifiers.push('Support anchor');
  } else {
    score -= 2;
    issues.push('No support');
  }

  const iglPlayer = picks.find((p) => p.role === 'igl');
  if (iglPlayer && iglPlayer.player.ratings.leadership >= CHEMISTRY_ELITE_LEADERSHIP) {
    score += 2;
    modifiers.push('Proven shot-caller');
  } else if (!hasIgl(picks)) {
    score -= 1;
  } else {
    score -= 1.5;
    issues.push('Weak leadership');
  }

  const awpPlayer = picks.find((p) => p.role === 'awper');
  if (awpPlayer && awpPlayer.player.ratings.awpAbility >= CHEMISTRY_ELITE_AWP) {
    score += 1.5;
    modifiers.push('Elite AWP');
  }

  const entryPlayer = picks.find((p) => p.role === 'entry');
  if (entryPlayer && entryPlayer.player.ratings.entryAbility >= CHEMISTRY_ELITE_ENTRY) {
    score += 1;
    modifiers.push('Elite entry');
  }

  const avgLan = players.reduce((s, p) => s + p.ratings.lan, 0) / players.length;
  if (avgLan >= CHEMISTRY_ELITE_LAN) {
    score += 1.5;
    modifiers.push('LAN experience');
  } else if (avgLan < CHEMISTRY_LOW_LAN) {
    score -= 1.5;
    issues.push('Low LAN experience');
  }

  const majorTitles = players.reduce((s, p) => s + p.majorWins, 0);
  if (majorTitles >= 4) {
    score += 2;
    modifiers.push('Major experience');
  } else if (majorTitles === 0) {
    score -= 1;
    issues.push('No major experience');
  }

  const synergy = teammateSynergy(players);
  if (synergy > 0) {
    score += synergy;
    modifiers.push('Org synergy');
  }

  const starCount = players.filter((p) => p.ratings.firepower >= CHEMISTRY_HIGH_FIREPOWER).length;
  if (starCount >= CHEMISTRY_EGO_SLAYER_COUNT && !hasIgl(picks)) {
    score -= 2.5;
    issues.push('Too many stars');
  } else if (starCount >= CHEMISTRY_EGO_SLAYER_COUNT) {
    score -= 1;
    issues.push('Ego clash risk');
  }

  const spread = eraSpread(picks);
  if (spread > 8) {
    score -= 1.5;
    issues.push('Era mismatch');
  } else if (spread <= 3) {
    score += 0.5;
    modifiers.push('Era cohesion');
  }

  const rounded = Math.round(score * 10) / 10;
  return {
    score: rounded,
    modifiers,
    issues,
    grade: chemistryGrade(rounded),
  };
}
