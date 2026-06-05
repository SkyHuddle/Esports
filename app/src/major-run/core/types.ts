/** Major Run — Counter-Strike esports roster game */

export type CsRole = 'igl' | 'awper' | 'entry' | 'lurker' | 'support';

/** Lineup slot on a historical team card (five-man roster) */
export type RosterSlot = 'igl' | 'awper' | 'entry' | 'lurker' | 'support';

export type StageId =
  | 'opening'
  | 'elimination'
  | 'quarterfinal'
  | 'semifinal'
  | 'grand_final';

export const STAGES: StageId[] = [
  'opening',
  'elimination',
  'quarterfinal',
  'semifinal',
  'grand_final',
];

export const STAGE_LABELS: Record<StageId, string> = {
  opening: 'Opening Stage',
  elimination: 'Elimination Stage',
  quarterfinal: 'Quarterfinal',
  semifinal: 'Semifinal',
  grand_final: 'Grand Final',
};

/** Draft round mirrors the major path — one pick per bracket leg */
export const DRAFT_ROUND_LABELS: Record<number, string> = {
  0: 'Opening Stage',
  1: 'Elimination Stage',
  2: 'Quarterfinal',
  3: 'Semifinal',
  4: 'Grand Final',
};

export interface TournamentRunStep {
  label: string;
  passed: boolean;
}

export type MajorOutcome =
  | 'cleared'
  | 'champion'
  | 'runner_up'
  | 'top3'
  | 'top4'
  | 'top8'
  | 'top16'
  | 'eliminated';

export type StageOutcomeLabel = MajorOutcome;

export const MAJOR_OUTCOME_LABELS: Record<MajorOutcome, string> = {
  cleared: 'Advanced',
  champion: 'Champion',
  runner_up: 'Runner-Up',
  top3: 'Top 3',
  top4: 'Top 4',
  top8: 'Top 8',
  top16: 'Top 16',
  eliminated: 'Eliminated',
};

export type GamePhase = 'home' | 'draft' | 'ready' | 'simulation' | 'result';
export type GameMode = 'free' | 'daily';
export type DraftSubphase = 'spin' | 'pick';

export interface SlotSpin {
  yearSequence: number[];
  nameSequence: string[];
  regionSequence: string[];
}

export interface PlayerRatings {
  overall: number;
  firepower: number;
  mechanical: number;
  clutch: number;
  lan: number;
  playoffs: number;
  majorExperience: number;
  consistency: number;
  communication: number;
  leadership: number;
  entryAbility: number;
  awpAbility: number;
  supportValue: number;
  anchorAbility: number;
  championshipFactor: number;
}

export interface CsPlayer {
  id: string;
  gamertag: string;
  realName?: string;
  primaryRole: CsRole;
  secondaryRole: CsRole;
  country: string;
  organization: string;
  majorWins: number;
  mvps: number;
  notableAchievement: string;
  badge?: string;
  ratings: PlayerRatings;
  accent: string;
}

export type TeamTier = 'legendary' | 'elite' | 'strong' | 'solid' | 'underdog';

export interface HistoricalCsTeam {
  id: string;
  teamName: string;
  season: number;
  eventContext: string;
  tagline: string;
  region: string;
  roster: Record<RosterSlot, string>;
  teamRating: number;
  placement: string;
  majorWins: number;
  majorPlacement: string;
  isMajorWinner: boolean;
  isIconicRoster: boolean;
  accent: string;
  tier: TeamTier;
}

export interface DraftRound {
  roundIndex: number;
  team: HistoricalCsTeam;
  roster: CsPlayer[];
  spin: SlotSpin;
}

export interface DraftPick {
  roundIndex: number;
  /** Slot on your Major Run roster */
  role: RosterSlot;
  /** Slot they played on the rolled team card */
  naturalRole: RosterSlot;
  player: CsPlayer;
  team: HistoricalCsTeam;
}

export interface StageOutcome {
  stage: StageId;
  outcome: StageOutcomeLabel;
  passed: boolean;
  passChance: number;
  power: number;
  /** Bracket beats revealed during simulation */
  run: TournamentRunStep[];
}

export type ChemistryGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export interface ChemistryReport {
  score: number;
  modifiers: string[];
  issues: string[];
  grade: ChemistryGrade;
}

export interface MajorSummary {
  record: string;
  openingWins: number;
  openingLosses: number;
  playoffWins: number;
  playoffLosses: number;
  stagesCleared: number;
  runTitle: string;
  headline: string;
  tagline: string;
  narrative: string;
}

export interface SimulationResult {
  stages: StageOutcome[];
  majorWon: boolean;
  perfectRun: boolean;
  failureStage: StageId | null;
  failureMessage: string;
  rosterScore: number;
  majorOdds: number;
  chemistry: ChemistryReport;
  mvp: CsPlayer;
  weakLink: CsPlayer | null;
  majorSummary: MajorSummary;
  historicalComparison: HistoricalComparison;
  explanation: string;
  footer: string;
}

export interface DailyConstraint {
  id: string;
  title: string;
  description: string;
  filter?: (ctx: DailyFilterContext) => boolean;
  pickFilter?: (player: CsPlayer, picks: DraftPick[], team?: HistoricalCsTeam) => boolean;
}

export interface DailyFilterContext {
  team: HistoricalCsTeam;
  roster: CsPlayer[];
}

export interface PlayerStats {
  majorsWon: number;
  perfectRuns: number;
  winStreak: number;
  bestRosterScore: number;
  attempts: number;
  dailyCompletions: number;
}

export interface DailyRunResult {
  date: string;
  score: number;
  majorWon: boolean;
  perfectRun: boolean;
  record: string;
  headline: string;
  percentile: number | null;
}

export interface HistoricalComparison {
  yourHeadline: string;
  facts: {
    teamLabel: string;
    playerTag: string;
    placement: string;
    majors: number;
    majorLine: string;
    wonThatYear: boolean;
  }[];
  anchorLine: string;
  contrastLine: string;
}

export const ROLE_LABELS: Record<CsRole, string> = {
  igl: 'IGL',
  awper: 'AWPER',
  entry: 'ENTRY',
  lurker: 'LURKER',
  support: 'SUPPORT',
};

export const SLOT_LABELS: Record<RosterSlot, string> = {
  igl: 'IGL',
  awper: 'AWPER',
  entry: 'ENTRY',
  lurker: 'LURKER',
  support: 'SUPPORT',
};
