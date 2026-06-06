import type { ChemistryReport, DraftPick, RosterSlot } from '../core/types';
import {
  CHEMISTRY_ELITE_CONTROLLER,
  CHEMISTRY_ELITE_LAN,
  CHEMISTRY_EGO_SLAYER_COUNT,
  CHEMISTRY_HIGH_FIREPOWER,
  CHEMISTRY_LOW_UTILITY,
} from '../core/constants';
import { simulationPlayers, roleFitForSlot } from './card-context';
import {
  chemistryGrade,
  computeRoleFitGrade,
  inferMapScores,
  statGrade,
} from './ratings';

function avg(players: ReturnType<typeof simulationPlayers>, key: keyof import('../core/types').PlayerRatings): number {
  if (players.length === 0) return 0;
  return players.reduce((s, p) => s + p.ratings[key], 0) / players.length;
}

function hasRole(picks: DraftPick[], slot: RosterSlot): boolean {
  return picks.some((p) => p.role === slot);
}

function hasIgl(picks: DraftPick[]): boolean {
  return picks.some(
    (p) => p.role === 'flex' || p.player.primaryRole === 'flex' || p.player.ratings.leadership >= 88
  );
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

export function evaluateChemistry(picks: DraftPick[]): ChemistryReport {
  const modifiers: string[] = [];
  const issues: string[] = [];
  let score = 0;

  const players = simulationPlayers(picks);

  if (picks.length < 5) {
    return {
      score: -5,
      modifiers,
      issues: ['Incomplete roster'],
      grade: chemistryGrade(-5),
      grades: {
        roleFit: 'C',
        firepower: 'C',
        utility: 'C',
        iglStructure: 'C',
        mapPool: 'C',
        clutch: 'C',
      },
      strength: 'Incomplete',
      weakness: 'Roster not filled',
      bestMap: 'Haven',
      permaBan: 'Icebox',
    };
  }

  if (hasRole(picks, 'duelist')) {
    score += 2;
    modifiers.push('Primary duelist');
  } else {
    score -= 4;
    issues.push('No duelist');
  }

  if (hasRole(picks, 'controller')) {
    score += 2;
    modifiers.push('Controller anchor');
  } else {
    score -= 4;
    issues.push('No controller');
  }

  if (hasRole(picks, 'sentinel')) {
    score += 1.5;
    modifiers.push('Sentinel lock');
  } else {
    score -= 3;
    issues.push('No sentinel');
  }

  if (hasRole(picks, 'initiator')) {
    score += 1.5;
    modifiers.push('Initiation');
  } else {
    score -= 2;
    issues.push('Low initiation');
  }

  if (hasIgl(picks)) {
    score += 2.5;
    modifiers.push('IGL structure');
  } else {
    score -= 3;
    issues.push('No IGL');
  }

  const duelists = picks.filter((p) => p.role === 'duelist').length;
  if (duelists >= 3) {
    score -= 3;
    issues.push('Too many duelists');
  }

  const avgUtility = avg(players, 'utility');
  if (avgUtility >= CHEMISTRY_ELITE_CONTROLLER) {
    score += 1.5;
    modifiers.push('Elite utility');
  } else if (avgUtility < CHEMISTRY_LOW_UTILITY) {
    score -= 2;
    issues.push('Utility gap');
  }

  const avgFire = avg(players, 'firepower');
  if (avgFire >= CHEMISTRY_HIGH_FIREPOWER) {
    score += 2;
    modifiers.push('Aim demon roster');
  }

  const avgLan = avg(players, 'lan');
  if (avgLan >= CHEMISTRY_ELITE_LAN) {
    score += 1.5;
    modifiers.push('LAN demons');
  } else if (avgLan < 82) {
    score -= 1.5;
    issues.push('LAN inconsistency');
  }

  const egoSlayers = players.filter((p) => p.ratings.firepower >= 93).length;
  if (egoSlayers >= CHEMISTRY_EGO_SLAYER_COUNT) {
    score -= 2;
    issues.push('Too many star players');
  }

  const synergy = teammateSynergy(players);
  if (synergy > 0) {
    score += synergy;
    modifiers.push('Proven synergy');
  }

  const roleFits = picks.map((p) => roleFitForSlot(p.player, p.role));
  const minFit = Math.min(...roleFits);
  if (minFit < 60) {
    score -= 2;
    issues.push('Forced role');
  } else if (roleFits.every((f) => f >= 85)) {
    score += 2;
    modifiers.push('Perfect role balance');
  }

  const maps = inferMapScores(players);
  const grade = chemistryGrade(score);

  const strength =
    modifiers.length > 0
      ? modifiers.slice(0, 2).join(' and ')
      : 'Balanced roster foundation';

  const weakness = issues.length > 0 ? issues[0]! : 'Slightly low first-kill pressure';

  return {
    score,
    modifiers,
    issues,
    grade,
    grades: {
      roleFit: computeRoleFitGrade(picks),
      firepower: statGrade(avgFire),
      utility: statGrade(avgUtility),
      iglStructure: statGrade(avg(players, 'leadership')),
      mapPool: statGrade(avg(players, 'roleFlexibility')),
      clutch: statGrade(avg(players, 'clutch')),
    },
    strength,
    weakness,
    bestMap: maps.best,
    permaBan: maps.worst,
  };
}
