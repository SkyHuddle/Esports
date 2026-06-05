import type { DailyRunResult, PlayerStats } from '../core/types';

const STATS_KEY = 'major-run-stats';
const DAILY_KEY = 'major-run-daily';
const HISTORY_KEY = 'major-run-history';

const DEFAULT_STATS: PlayerStats = {
  majorsWon: 0,
  perfectRuns: 0,
  winStreak: 0,
  bestRosterScore: 0,
  attempts: 0,
  dailyCompletions: 0,
};

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: PlayerStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordAttempt(
  majorWon: boolean,
  perfectRun: boolean,
  score: number,
  isDaily: boolean
): void {
  const stats = loadStats();
  stats.attempts += 1;
  if (majorWon) {
    stats.majorsWon += 1;
    stats.winStreak += 1;
  } else {
    stats.winStreak = 0;
  }
  if (perfectRun) stats.perfectRuns += 1;
  if (score > stats.bestRosterScore) stats.bestRosterScore = score;
  if (isDaily) stats.dailyCompletions += 1;
  saveStats(stats);
}

export function loadDailyResult(dateKey: string): DailyRunResult | null {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, Partial<DailyRunResult>>;
    const row = map[dateKey];
    if (!row?.date) return null;
    return {
      date: row.date,
      score: row.score ?? 0,
      majorWon: row.majorWon ?? false,
      perfectRun: row.perfectRun ?? false,
      record: row.record ?? '—',
      headline: row.headline ?? 'Played today',
      percentile: row.percentile ?? null,
    };
  } catch {
    return null;
  }
}

export function saveDailyResult(result: DailyRunResult): void {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, DailyRunResult>) : {};
    map[result.date] = result;
    localStorage.setItem(DAILY_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export interface ShareHistoryEntry {
  majorWon: boolean;
  perfectRun: boolean;
  score: number;
  rosterNames: string[];
  timestamp: number;
}

export function addShareHistory(entry: Omit<ShareHistoryEntry, 'timestamp'>): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list: ShareHistoryEntry[] = raw ? JSON.parse(raw) : [];
    list.unshift({ ...entry, timestamp: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

export function loadShareHistory(): ShareHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
