import type { SimulationResult } from '../core/types';
import { getDailyChallengeNumber } from './daily';

export function formatDailyShareLine(result: SimulationResult): string {
  const num = getDailyChallengeNumber();
  const { seasonSummary, majorWins, rosterScore, ringWon, perfectSeason } = result;
  const ring = perfectSeason ? ' · 20-0' : ringWon ? ' · Ring' : '';
  return `Ring Chase #${num}: ${seasonSummary.runTitle}\n${seasonSummary.record} · ${majorWins} major${majorWins === 1 ? '' : 's'} · Score ${rosterScore.toFixed(0)}/100${ring}\nCan you build a better squad?`;
}

export function formatShareText(
  result: SimulationResult,
  rosterLine: string,
  isDaily: boolean
): string {
  const { seasonSummary, rosterScore } = result;
  const headline = isDaily
    ? formatDailyShareLine(result)
    : `Ring Chase: ${seasonSummary.runTitle}\nResult: ${seasonSummary.record} · Score ${rosterScore.toFixed(0)}/100\nCan you build a better squad?`;
  return `${headline}\n\n${seasonSummary.narrative}\n\n${rosterLine}`;
}
