import type { DailyConstraint, DraftRound, HistoricalValorantTeam, SlotSpin } from '../core/types';
import { DRAFT_ROUNDS, TIER_WEIGHTS, SPIN_DURATION_MS, SPIN_TICK_MS } from '../core/constants';
import { getTeamPool, resolveTeamRoster } from '../data';
import { teamHasPickablePlayer } from '../features/daily';
import { hashString, mulberry32 } from './rng';

export function createRunSeed(mode: 'free' | 'daily', dateKey?: string): string {
  if (mode === 'daily' && dateKey) return `champions-daily-${dateKey}`;
  return `champions-free-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function weightedPick(teams: HistoricalValorantTeam[], rng: () => number): HistoricalValorantTeam {
  const weights = teams.map((t) => TIER_WEIGHTS[t.tier] ?? 10);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (let i = 0; i < teams.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return teams[i];
  }
  return teams[teams.length - 1];
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildDualSpin(
  finalTeam: HistoricalValorantTeam,
  seed: string,
  roundIndex: number,
  durationMs = SPIN_DURATION_MS,
  tickMs = SPIN_TICK_MS
): SlotSpin {
  const rng = mulberry32(hashString(`${seed}-spin-${roundIndex}`));
  const ticks = Math.floor(durationMs / tickMs);
  const pool = shuffle(getTeamPool(), rng);
  const years = pool.map((t) => t.season);
  const names = pool.map((t) => t.teamName);
  const regions = pool.map((t) => t.region);

  const yearSequence: number[] = [];
  const nameSequence: string[] = [];
  const regionSequence: string[] = [];

  for (let i = 0; i < ticks - 1; i++) {
    const decoy = pool[Math.floor(rng() * pool.length)];
    yearSequence.push(years[Math.floor(rng() * years.length)] ?? decoy.season);
    nameSequence.push(names[Math.floor(rng() * names.length)] ?? decoy.teamName);
    regionSequence.push(regions[Math.floor(rng() * regions.length)] ?? decoy.region);
  }

  yearSequence.push(finalTeam.season);
  nameSequence.push(finalTeam.teamName);
  regionSequence.push(finalTeam.region);

  return { yearSequence, nameSequence, regionSequence };
}

function buildRound(
  roundIndex: number,
  team: HistoricalValorantTeam,
  seed: string,
  rng: () => number
): DraftRound {
  const roster = shuffle(resolveTeamRoster(team), rng);
  return {
    roundIndex,
    team,
    roster,
    spin: buildDualSpin(team, seed, roundIndex),
  };
}

export function generateDraftRounds(
  seed: string,
  filter?: (team: HistoricalValorantTeam) => boolean
): DraftRound[] {
  const rng = mulberry32(hashString(seed));
  const pool = getTeamPool(filter);
  const rounds: DraftRound[] = [];
  const usedTeamIds = new Set<string>();

  for (let i = 0; i < DRAFT_ROUNDS; i++) {
    const available = pool.filter((t) => !usedTeamIds.has(t.id));
    if (available.length === 0) break;

    const team = weightedPick(available, rng);
    usedTeamIds.add(team.id);
    rounds.push(buildRound(i, team, seed, rng));
  }

  return rounds;
}

export function rerollRound(
  seed: string,
  roundIndex: number,
  usedTeamIds: string[],
  filter?: (team: HistoricalValorantTeam) => boolean
): DraftRound {
  const rng = mulberry32(hashString(`${seed}-respin-${roundIndex}-${Date.now()}`));
  const used = new Set(usedTeamIds);
  const pool = getTeamPool(filter).filter((t) => !used.has(t.id));
  const team = pool.length > 0 ? weightedPick(pool, rng) : weightedPick(getTeamPool(), rng);
  return buildRound(roundIndex, team, seed, rng);
}

export function getDailyTeams(dateKey: string): string[] {
  const dynasties = [
    'sentinels-2021',
    'loud-2022',
    'fnatic-2023',
    'eg-2023',
    'optic-2022',
    'drx-2022',
    'acend-2021',
    'gambit-2021',
    'paper-rex-2023',
    'edg-2024',
    'geng-2024',
    'heretics-2024',
    'nrg-2023',
    'leviatan-2023',
    'liquid-2023',
    'navi-2023',
    'kc-2024',
    'fut-2024',
  ];
  const trapCards = [
    'liquid-2023',
    'navi-2023',
    'kc-2024',
    'fut-2024',
    'nrg-2023',
    'leviatan-2023',
  ];
  const rng = mulberry32(hashString(`champions-daily-teams-${dateKey}`));
  const traps = shuffle(trapCards, rng).slice(0, 2);
  const icons = shuffle(dynasties, rng).slice(0, DRAFT_ROUNDS - traps.length);
  return shuffle([...icons, ...traps], rng);
}

export function generateDailyRounds(
  dateKey: string,
  filter?: (team: HistoricalValorantTeam) => boolean,
  constraint?: DailyConstraint
): DraftRound[] {
  const seed = `champions-daily-${dateKey}`;
  const rng = mulberry32(hashString(seed));
  const rounds: DraftRound[] = [];
  const pool = getTeamPool(filter);
  const usedTeamIds = new Set<string>();
  const preferredIds = getDailyTeams(dateKey);

  const pickFallbackTeam = (): HistoricalValorantTeam | null => {
    const available = pool.filter((t) => !usedTeamIds.has(t.id));
    if (available.length === 0) return null;
    return weightedPick(available, rng);
  };

  const acceptTeam = (team: HistoricalValorantTeam): boolean => {
    if (usedTeamIds.has(team.id)) return false;
    const roster = resolveTeamRoster(team);
    if (constraint && !teamHasPickablePlayer(team, roster, constraint)) return false;
    return true;
  };

  for (let i = 0; i < DRAFT_ROUNDS; i++) {
    let team =
      pool.find((t) => t.id === preferredIds[i] && acceptTeam(t)) ?? pickFallbackTeam();
    if (!team) break;

    usedTeamIds.add(team.id);
    rounds.push(buildRound(i, team, seed, rng));
  }

  return rounds;
}
