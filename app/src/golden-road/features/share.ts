import type { SimulationResult } from '@/golden-road/core/types';
import { buildGoldenRoadSummary } from '@/golden-road/engine/run-summary';
import { getDailyChallengeNumber } from '@/golden-road/features/daily';

export function formatDailyShareLine(result: SimulationResult): string {
  const num = getDailyChallengeNumber();
  const summary = buildGoldenRoadSummary(result);
  return `Golden Era #${num}: ${summary.runTitle}\n${summary.record} · ${summary.stageRecord} stages · Score ${result.rosterScore.toFixed(0)}/100\nI built a better timeline than you.`;
}

export function formatShareText(result: SimulationResult, rosterLine: string, isDaily: boolean): string {
  const summary = buildGoldenRoadSummary(result);
  const headline = isDaily
    ? formatDailyShareLine(result)
    : `Golden Era: ${summary.runTitle}\n${summary.record} · Score ${result.rosterScore.toFixed(0)}/100\nCan you clear the road?`;
  return `${headline}\n\n${summary.narrative}\n\n${rosterLine}`;
}
