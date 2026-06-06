/** Champions Run — VALORANT esports roster game */

export type ValorantRole = 'duelist' | 'initiator' | 'controller' | 'sentinel' | 'flex';

/** Lineup slot on a historical team card (five-player roster) */
export type RosterSlot = 'duelist' | 'initiator' | 'controller' | 'sentinel' | 'flex';

export type StageId =
  | 'swiss'
  | 'playoffs'
  | 'semifinal'
  | 'grand_final'
  | 'champions';

export const STAGES: StageId[] = [
  'swiss',
  'playoffs',
  'semifinal',
  'grand_final',
  'champions',
];

export const STAGE_LABELS: Record<StageId, string> = {
  swiss: 'Swiss Stage',
  playoffs: 'Playoffs',
  semifinal: 'Semifinal',
  grand_final: 'Grand Final',
  champions: 'Champions',
};

/** Draft round mirrors the VCT path — one pick per stage leg */
export const DRAFT_ROUND_LABELS: Record<number, string> = {
  0: 'Swiss Stage',
  1: 'Playoffs',
  2: 'Semifinal',
  3: 'Grand Final',
  4: 'Champions',
};

export interface TournamentRunStep {
  label: string;
  passed: boolean;
}

export type ChampionsOutcome =
  | 'cleared'
  | 'champion'
  | 'runner_up'
  | 'top4'
  | 'top8'
  | 'top16'
  | 'eliminated';

export type StageOutcomeLabel = ChampionsOutcome;

export const CHAMPIONS_OUTCOME_LABELS: Record<ChampionsOutcome, string> = {
  cleared: 'Advanced',
  champion: 'Champions Winner',
  runner_up: 'Grand Finalist',
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

export interface RoleConfidence {
  duelist: number;
  initiator: number;
  controller: number;
  sentinel: number;
  flex: number;
}

export interface PlayerRatings {
  overall: number;
  firepower: number;
  utility: number;
  clutch: number;
  lan: number;
  playoffs: number;
  international: number;
  consistency: number;
  communication: number;
  leadership: number;
  firstKillPressure: number;
  roleFlexibility: number;
  championshipFactor: number;
}

export interface ValorantPlayer {
  id: string;
  gamertag: string;
  realName?: string;
  primaryRole: ValorantRole;
  secondaryRole: ValorantRole;
  roleConfidence: RoleConfidence;
  country: string;
  region: string;
  organization: string;
  championsWins: number;
  mastersWins: number;
  internationalTitles: number;
  notableAchievement: string;
  badge?: string;
  ratings: PlayerRatings;
  accent: string;
  sourceUrl?: string;
}

export type TeamTier = 'legendary' | 'elite' | 'strong' | 'solid' | 'underdog';

export interface HistoricalValorantTeam {
  id: string;
  teamName: string;
  season: number;
  eventContext: string;
  tagline: string;
  region: string;
  roster: Record<RosterSlot, string>;
  teamRating: number;
  placement: string;
  championsWins: number;
  mastersWins: number;
  placementTier: string;
  isChampionsWinner: boolean;
  isIconicRoster: boolean;
  accent: string;
  tier: TeamTier;
  sourceUrl?: string;
}

export interface DraftRound {
  roundIndex: number;
  team: HistoricalValorantTeam;
  roster: ValorantPlayer[];
  spin: SlotSpin;
}

export interface DraftPick {
  roundIndex: number;
  /** Slot on your Champions Run roster */
  role: RosterSlot;
  /** Slot they played on the rolled team card */
  naturalRole: RosterSlot;
  player: ValorantPlayer;
  team: HistoricalValorantTeam;
}

export interface StageOutcome {
  stage: StageId;
  outcome: StageOutcomeLabel;
  passed: boolean;
  passChance: number;
  power: number;
  run: TournamentRunStep[];
}

export type ChemistryGrade = 'S+' | 'S' | 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export interface GradeBreakdown {
  roleFit: ChemistryGrade;
  firepower: ChemistryGrade;
  utility: ChemistryGrade;
  iglStructure: ChemistryGrade;
  mapPool: ChemistryGrade;
  clutch: ChemistryGrade;
}

export interface ChemistryReport {
  score: number;
  modifiers: string[];
  issues: string[];
  grade: ChemistryGrade;
  grades: GradeBreakdown;
  strength: string;
  weakness: string;
  bestMap: string;
  permaBan: string;
}

export interface RunSummary {
  record: string;
  swissWins: number;
  swissLosses: number;
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
  championsWon: boolean;
  perfectRun: boolean;
  failureStage: StageId | null;
  failureMessage: string;
  rosterScore: number;
  championsOdds: number;
  chemistry: ChemistryReport;
  mvp: ValorantPlayer;
  weakLink: ValorantPlayer | null;
  runSummary: RunSummary;
  historicalComparison: HistoricalComparison;
  explanation: string;
  footer: string;
}

export interface DailyConstraint {
  id: string;
  title: string;
  description: string;
  filter?: (ctx: DailyFilterContext) => boolean;
  pickFilter?: (player: ValorantPlayer, picks: DraftPick[], team?: HistoricalValorantTeam) => boolean;
}

export interface DailyFilterContext {
  team: HistoricalValorantTeam;
  roster: ValorantPlayer[];
}

export interface PlayerStats {
  championsWon: number;
  perfectRuns: number;
  winStreak: number;
  bestRosterScore: number;
  attempts: number;
  dailyCompletions: number;
}

export interface DailyRunResult {
  date: string;
  score: number;
  championsWon: boolean;
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
    champions: number;
    titleLine: string;
    wonThatYear: boolean;
  }[];
  anchorLine: string;
  contrastLine: string;
}

export const ROLE_LABELS: Record<ValorantRole, string> = {
  duelist: 'Duelist',
  initiator: 'Initiator',
  controller: 'Controller',
  sentinel: 'Sentinel',
  flex: 'Flex / IGL',
};

export const SLOT_LABELS: Record<RosterSlot, string> = {
  duelist: 'Duelist',
  initiator: 'Initiator',
  controller: 'Controller',
  sentinel: 'Sentinel',
  flex: 'Flex / IGL',
};
