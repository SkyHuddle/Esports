import type { SimulationResult } from '../core/types';

export function formatShareText(
  result: SimulationResult,
  rosterLine: string,
  isDaily: boolean
): string {
  const headline = result.runSummary.runTitle;
  const record = result.runSummary.record;
  const grade = result.chemistry.grade;

  const lines = [
    `Champions Run`,
    `Built a Champions roster.`,
    `Result: ${headline}`,
    `Grade: ${grade}`,
    `Record: ${record}`,
    rosterLine,
    isDaily ? 'Daily board run.' : '',
    'Can you build better?',
  ].filter(Boolean);

  return lines.join('\n');
}

export function formatDailyShareLine(result: SimulationResult): string {
  return `Champions Run · ${result.runSummary.runTitle} · ${result.runSummary.record} · Grade ${result.chemistry.grade}`;
}
