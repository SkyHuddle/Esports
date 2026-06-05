import type { SimulationResult } from '../core/types';
import { getDailyChallengeNumber } from './daily';

export function formatDailyShareLine(result: SimulationResult): string {
  const num = getDailyChallengeNumber();
  const { majorSummary, rosterScore } = result;
  return `Major Run #${num}: ${majorSummary.runTitle}\nRecord: ${majorSummary.record} · Score ${rosterScore.toFixed(0)}/100\nThink you can win the Major?`;
}

export function formatShareText(
  result: SimulationResult,
  rosterLine: string,
  isDaily: boolean
): string {
  const { majorSummary, rosterScore } = result;
  const headline = isDaily
    ? formatDailyShareLine(result)
    : `Major Run: ${majorSummary.runTitle}\nRecord: ${majorSummary.record} · Score ${rosterScore.toFixed(0)}/100\nThink you can win the Major?`;
  return `${headline}\n\n${majorSummary.narrative}\n\n${rosterLine}`;
}
