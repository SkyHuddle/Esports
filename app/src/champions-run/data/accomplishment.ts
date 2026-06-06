/** That-year team result — used to tune OVR beyond raw stats */

import type { HistoricalValorantTeam } from '../core/types';

export type TeamYearAccomplishment =
  | 'champions_winner'
  | 'champions_finalist'
  | 'masters_winner'
  | 'playoff_run'
  | 'contender'
  | 'standard';

export interface AccomplishmentTuning {
  bonus: number;
  floor: number;
  internationalBonus: number;
}

export const ACCOMPLISHMENT_TUNING: Record<TeamYearAccomplishment, AccomplishmentTuning> = {
  champions_winner: { bonus: 5, floor: 74, internationalBonus: 4 },
  champions_finalist: { bonus: 3, floor: 72, internationalBonus: 3 },
  masters_winner: { bonus: 2, floor: 70, internationalBonus: 2 },
  playoff_run: { bonus: 1, floor: 68, internationalBonus: 1 },
  contender: { bonus: 0, floor: 65, internationalBonus: 0 },
  standard: { bonus: 0, floor: 52, internationalBonus: 0 },
};

export function accomplishmentFromTeam(team: HistoricalValorantTeam): TeamYearAccomplishment {
  if (team.isChampionsWinner) return 'champions_winner';

  const placement = team.placement.toLowerCase();

  if (placement.includes('finalist')) return 'champions_finalist';
  if (team.mastersWins > 0 || placement.includes('masters winner')) return 'masters_winner';
  if (placement.includes('playoff') || placement.includes('top 8')) return 'playoff_run';
  if (placement.includes('groups') || placement.includes('top 16')) return 'contender';

  return 'standard';
}

export function getAccomplishmentTuning(team: HistoricalValorantTeam): AccomplishmentTuning {
  return ACCOMPLISHMENT_TUNING[accomplishmentFromTeam(team)];
}

export function accomplishmentFromTagline(tagline: string): TeamYearAccomplishment {
  const t = tagline.toLowerCase();

  if (/champions winner|lifted champions|champions 20/.test(t)) return 'champions_winner';
  if (/finalist|runner-up/.test(t)) return 'champions_finalist';
  if (/masters winner|masters tokyo|masters madrid|masters shanghai|masters reykjav/.test(t)) {
    return 'masters_winner';
  }
  if (/playoff|deep run/.test(t)) return 'playoff_run';

  return 'standard';
}

export function accomplishmentFromPlacement(placement: string): TeamYearAccomplishment {
  const p = placement.toLowerCase();
  if (p.includes('champion')) return 'champions_winner';
  if (p.includes('finalist')) return 'champions_finalist';
  if (p.includes('masters')) return 'masters_winner';
  if (p.includes('playoff') || p.includes('top 8')) return 'playoff_run';
  if (p.includes('group') || p.includes('top 16')) return 'contender';
  return 'standard';
}

export const ACCOMPLISHMENT_LABEL: Record<TeamYearAccomplishment, string> = {
  champions_winner: 'Champions Winner',
  champions_finalist: 'Champions Finalist',
  masters_winner: 'Masters Winner',
  playoff_run: 'Playoff Run',
  contender: 'Contender',
  standard: 'Standard',
};
