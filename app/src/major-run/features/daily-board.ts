import type { DailyRunResult, MajorSummary } from '../core/types';
import { getTeamById } from '../data';
import { getDailyTeams } from '../engine/draft';
import { hashString, mulberry32 } from '../engine/rng';

export interface DailyBoardEntry {
  id: string;
  date: string;
  record: string;
  stagesCleared: number;
  majorWon: boolean;
  perfectRun: boolean;
  headline: string;
  score: number;
  rosterNames: string[];
  isYou?: boolean;
  rankScore: number;
}

const BOARD_KEY = 'major-run-daily-board';

const COMMUNITY_TAGS = [
  's1mple', 'ZywOo', 'donk', 'NiKo', 'ropz', 'device', 'gla1ve', 'sh1ro',
  'Twistzz', 'rain', 'broky', 'apEX', 'Spinx', 'electronic', 'b1t', 'm0NESY',
];

function rankScore(entry: {
  perfectRun: boolean;
  majorWon: boolean;
  stagesCleared: number;
  score: number;
}): number {
  let s = entry.score;
  if (entry.perfectRun) s += 10_000;
  else if (entry.majorWon) s += 8_000;
  s += entry.stagesCleared * 400;
  return s;
}

function seedCommunityEntries(dateKey: string): DailyBoardEntry[] {
  const rng = mulberry32(hashString(`major-daily-board-${dateKey}`));
  const entries: DailyBoardEntry[] = [];

  for (let i = 0; i < 12; i++) {
    const stagesCleared = Math.floor(rng() * 6);
    const majorWon = stagesCleared === 5 && rng() > 0.6;
    const perfect = majorWon && rng() > 0.4;
    const openingW = Math.min(3, Math.floor(rng() * 4));
    const record = perfect ? '17-0' : `${Math.max(0, stagesCleared * 3 + openingW)}-${Math.max(1, 5 - stagesCleared)}`;
    const headline = perfect
      ? 'Flawless Major'
      : majorWon
        ? 'Major Champion'
        : stagesCleared >= 4
          ? 'Major Finalist'
          : stagesCleared >= 3
            ? 'Semifinal Exit'
            : 'Group Stage Exit';

    const roster = Array.from({ length: 5 }, () =>
      COMMUNITY_TAGS[Math.floor(rng() * COMMUNITY_TAGS.length)]!
    );

    const score = 78 + stagesCleared * 3.5 + (majorWon ? 8 : 0);

    entries.push({
      id: `bot-${dateKey}-${i}`,
      date: dateKey,
      record,
      stagesCleared,
      majorWon,
      perfectRun: perfect,
      headline,
      score,
      rosterNames: roster,
      rankScore: rankScore({ perfectRun: perfect, majorWon, stagesCleared, score }),
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
  summary: MajorSummary,
  result: Pick<DailyRunResult, 'score' | 'majorWon' | 'perfectRun' | 'record' | 'headline'>,
  rosterNames: string[]
): DailyBoardEntry[] {
  const board = loadDailyBoard(dateKey).filter((e) => !e.isYou);
  const you: DailyBoardEntry = {
    id: `you-${dateKey}`,
    date: dateKey,
    record: summary.record,
    stagesCleared: summary.stagesCleared,
    majorWon: result.majorWon,
    perfectRun: result.perfectRun,
    headline: summary.headline,
    score: result.score,
    rosterNames,
    isYou: true,
    rankScore: rankScore({
      perfectRun: result.perfectRun,
      majorWon: result.majorWon,
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
