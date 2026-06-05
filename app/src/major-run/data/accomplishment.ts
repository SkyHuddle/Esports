/** That-year team result — used to tune OVR beyond raw stats */

import type { HistoricalCsTeam } from '../core/types';

export type TeamYearAccomplishment =
  | 'major_champion'
  | 'major_finalist'
  | 'major_semifinal'
  | 'major_quarterfinal'
  | 'contender'
  | 'standard';

export interface AccomplishmentTuning {
  /** Added to stat-based OVR */
  bonus: number;
  /** Minimum OVR for any player on this team-year */
  floor: number;
  /** Extra major-stage rating */
  majorBonus: number;
}

export const ACCOMPLISHMENT_TUNING: Record<TeamYearAccomplishment, AccomplishmentTuning> = {
  major_champion: { bonus: 5, floor: 74, majorBonus: 4 },
  major_finalist: { bonus: 3, floor: 72, majorBonus: 3 },
  major_semifinal: { bonus: 2, floor: 70, majorBonus: 2 },
  major_quarterfinal: { bonus: 1, floor: 68, majorBonus: 1 },
  contender: { bonus: 0, floor: 65, majorBonus: 0 },
  standard: { bonus: 0, floor: 52, majorBonus: 0 },
};

export function accomplishmentFromTeam(team: HistoricalCsTeam): TeamYearAccomplishment {
  if (team.isMajorWinner) return 'major_champion';

  const placement = team.placement.toLowerCase();
  const major = team.majorPlacement.toLowerCase();

  if (major.includes('grand final') || major.includes('runner')) return 'major_finalist';
  if (team.majorWins > 0 || placement.includes('major champion')) return 'major_champion';
  if (placement.includes('finalist')) return 'major_finalist';
  if (placement.includes('semifinal') || major.includes('top 4')) return 'major_semifinal';
  if (placement.includes('quarterfinal') || major.includes('top 8')) return 'major_quarterfinal';
  if (placement.includes('legends') || major.includes('top 16')) return 'contender';

  return 'standard';
}

export function getAccomplishmentTuning(team: HistoricalCsTeam): AccomplishmentTuning {
  return ACCOMPLISHMENT_TUNING[accomplishmentFromTeam(team)];
}

export function accomplishmentFromTagline(tagline: string): TeamYearAccomplishment {
  const t = tagline.toLowerCase();

  if (/back-to-back|three.?peat|3.?peat|dynasty|4 majors/.test(t)) return 'major_champion';
  if (/major champion|stockholm|antwerp|copenhagen|paris major winner|boston major winner|rio major winner/.test(t)) {
    return 'major_champion';
  }
  if (/major finalist|runner-up|runners-up|lost grand final/.test(t)) return 'major_finalist';
  if (/major semifinal|top 4|semi.?finalist/.test(t)) return 'major_semifinal';
  if (/major quarterfinal|playoff run|deep run/.test(t)) return 'major_quarterfinal';
  if (/contender|legends stage|playoff bubble|breakthrough/.test(t)) return 'contender';

  return 'standard';
}

export function accomplishmentFromPlacement(placement: string): TeamYearAccomplishment {
  const p = placement.toLowerCase();

  if (/champion|winner|1st/.test(p)) return 'major_champion';
  if (/finalist|runner-up|2nd/.test(p)) return 'major_finalist';
  if (/semifinal|top 4|3rd|4th/.test(p)) return 'major_semifinal';
  if (/quarterfinal|top 8/.test(p)) return 'major_quarterfinal';
  if (/legends|playoffs|top 16/.test(p)) return 'contender';

  return 'standard';
}

export const ACCOMPLISHMENT_LABEL: Record<TeamYearAccomplishment, string> = {
  major_champion: 'Major Champions',
  major_finalist: 'Major Finalists',
  major_semifinal: 'Major Semifinalists',
  major_quarterfinal: 'Major Quarterfinalists',
  contender: 'Major Contenders',
  standard: '',
};
