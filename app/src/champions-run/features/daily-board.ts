import type { DailyRunResult, RunSummary } from '../core/types';
import { getTeamById } from '../data';
import { getDailyTeams } from '../engine/draft';
import { hashString, mulberry32 } from '../engine/rng';

export interface DailyBoardEntry {
  id: string;
  date: string;
  record: string;
  stagesCleared: number;
  championsWon: boolean;
  perfectRun: boolean;
  headline: string;
  score: number;
  rosterNames: string[];
  isYou?: boolean;
  rankScore: number;
}

const BOARD_KEY = 'champions-run-daily-board';

const COMMUNITY_TAGS = [
  'aspas', 'TenZ', 'yay', 'Derke', 'Leo', 'Boaster', 'nAts', 'cNed',
  'something', 'f0rsakeN', 'zmjjKK', 'Meteor', 'Demon1', 'Less', 'saadhak',
];

function rankScore(entry: {
  perfectRun: boolean;
  championsWon: boolean;
  stagesCleared: number;
  score: number;
}): number {
  let s = entry.score;
  if (entry.perfectRun) s += 10_000;
  else if (entry.championsWon) s += 8_000;
  s += entry.stagesCleared * 400;
  return s;
}

function seedCommunityEntries(dateKey: string): DailyBoardEntry[] {
  const rng = mulberry32(hashString(`champions-daily-board-${dateKey}`));
  const entries: DailyBoardEntry[] = [];

  for (let i = 0; i < 12; i++) {
    const stagesCleared = Math.floor(rng() * 6);
    const championsWon = stagesCleared === 5 && rng() > 0.6;
    const perfect = championsWon && rng() > 0.4;
    const swissW = Math.min(3, Math.floor(rng() * 4));
    const record = perfect ? '16-0' : `${Math.max(0, stagesCleared * 3 + swissW)}-${Math.max(1, 5 - stagesCleared)}`;
    const headline = perfect
      ? 'Perfect Map Pool'
      : championsWon
        ? 'Champions Winners'
        : stagesCleared >= 4
          ? 'Champions Finalist'
          : stagesCleared >= 3
            ? 'Top 4'
            : 'Group Stage Exit';

    const roster = Array.from({ length: 5 }, () =>
      COMMUNITY_TAGS[Math.floor(rng() * COMMUNITY_TAGS.length)]!
    );

    const score = 78 + stagesCleared * 3.5 + (championsWon ? 8 : 0);

    entries.push({
      id: `bot-${dateKey}-${i}`,
      date: dateKey,
      record,
      stagesCleared,
      championsWon,
      perfectRun: perfect,
      headline,
      score,
      rosterNames: roster,
      rankScore: rankScore({ perfectRun: perfect, championsWon, stagesCleared, score }),
    });
  }

  return entries;
}

export function loadDailyBoard(dateKey: string): DailyBoardEntry[] {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, DailyBoardEntry[]>) : {};
    if (!map[dateKey]) {
      map[dateKey] = seedCommunityEntries(dateKey);
      localStorage.setItem(BOARD_KEY, JSON.stringify(map));
    }
    return map[dateKey] ?? [];
  } catch {
    return seedCommunityEntries(dateKey);
  }
}

export function submitDailyBoardEntry(
  dateKey: string,
  summary: RunSummary,
  result: Pick<DailyRunResult, 'score' | 'championsWon' | 'perfectRun' | 'record' | 'headline'>,
  rosterNames: string[]
): DailyBoardEntry[] {
  const board = loadDailyBoard(dateKey).filter((e) => !e.isYou);
  const you: DailyBoardEntry = {
    id: `you-${dateKey}`,
    date: dateKey,
    record: summary.record,
    stagesCleared: summary.stagesCleared,
    championsWon: result.championsWon,
    perfectRun: result.perfectRun,
    headline: summary.headline,
    score: result.score,
    rosterNames,
    isYou: true,
    rankScore: rankScore({
      perfectRun: result.perfectRun,
      championsWon: result.championsWon,
      stagesCleared: summary.stagesCleared,
      score: result.score,
    }),
  };

  const next = [...board, you].sort((a, b) => b.rankScore - a.rankScore);

  try {
    const raw = localStorage.getItem(BOARD_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, DailyBoardEntry[]>) : {};
    map[dateKey] = next;
    localStorage.setItem(BOARD_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }

  return next;
}

export function getDailyPlacement(dateKey: string, entryId: string): { rank: number; total: number } {
  const board = loadDailyBoard(dateKey);
  const sorted = [...board].sort((a, b) => b.rankScore - a.rankScore);
  const rank = sorted.findIndex((e) => e.id === entryId) + 1;
  return { rank: rank || sorted.length, total: sorted.length };
}

export function getDailyTeamLabels(dateKey: string): string[] {
  return getDailyTeams(dateKey).map((id) => {
    const team = getTeamById(id);
    return team ? `${team.teamName} ${team.season}` : id;
  });
}

export function canStartDailyToday(dailyPlayed: DailyRunResult | null): boolean {
  return dailyPlayed == null;
}
