/** Normalized Major Run data schema (mirrors planned DB tables). */

export interface DbPlayer {
  id: string;
  name: string;
  nationality: string;
  primaryRole: string;
  secondaryRole: string;
  peakTeam: string;
  peakYear: number;
  hltvRating?: number;
  majorWins: number;
  mvpAwards: number;
  top20Placements: number;
  headshotUrl?: string;
  active: boolean;
}

export interface DbHistoricalTeam {
  id: string;
  name: string;
  year: number;
  region: string;
  tagline: string;
  majorPlacement: string;
  roster: Record<string, string>;
}

export interface DbTeamYearRating {
  teamId: string;
  playerId: string;
  source: 'hltv' | 'curated' | 'estimated';
  stats: Record<string, number>;
  ratings: Record<string, number>;
  syncedAt: string;
}

export interface DbDailyChallenge {
  dateKey: string;
  constraintId: string;
  teamIds: string[];
  seed: string;
}

export interface DbSimulationResult {
  id: string;
  mode: 'free' | 'daily';
  majorWon: boolean;
  flawlessMajor: boolean;
  rosterScore: number;
  chemistryGrade: string;
  pickIds: string[];
  createdAt: string;
}
