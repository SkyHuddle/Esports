import type { DraftPick, RunSummary, SimulationResult, StageOutcome } from '../core/types';
import { isStageSkipped } from './tournament-run';

function bracketRecord(stages: StageOutcome[]): { wins: number; losses: number } {
  let wins = 0;
  let losses = 0;
  for (const stage of stages) {
    if (isStageSkipped(stage)) continue;
    for (const beat of stage.run) {
      if (beat.passed) wins += 1;
      else {
        losses += 1;
        break;
      }
    }
  }
  return { wins, losses };
}

function splitRecord(stages: StageOutcome[]): {
  swissWins: number;
  swissLosses: number;
  playoffWins: number;
  playoffLosses: number;
} {
  let swissWins = 0;
  let swissLosses = 0;
  let playoffWins = 0;
  let playoffLosses = 0;

  for (const stage of stages) {
    if (isStageSkipped(stage)) continue;
    const isSwiss = stage.stage === 'swiss';
    for (const beat of stage.run) {
      if (beat.passed) {
        if (isSwiss) swissWins += 1;
        else playoffWins += 1;
      } else {
        if (isSwiss) swissLosses += 1;
        else playoffLosses += 1;
        break;
      }
    }
  }

  return { swissWins, swissLosses, playoffWins, playoffLosses };
}

function buildRunTitle(
  record: string,
  championsWon: boolean,
  perfectRun: boolean,
  stagesCleared: number,
  failureMessage: string,
  rosterScore: number
): string {
  if (perfectRun) return 'Perfect Map Pool';
  if (championsWon) return 'Champions Winners';
  if (failureMessage.includes('Grand Final')) return 'Champions Finalist';
  if (stagesCleared >= 3) return 'Top 4';
  if (stagesCleared >= 2) return 'Playoffs';
  if (stagesCleared === 1 && rosterScore >= 88) return 'Swiss Survivor';
  if (record.startsWith('0-')) return '0-2 Start';
  return 'Group Stage Exit';
}

export function buildRunSummary(
  result: Omit<SimulationResult, 'runSummary' | 'explanation' | 'footer' | 'historicalComparison'>,
  _picks: DraftPick[]
): RunSummary {
  const { stages, championsWon, perfectRun, failureMessage } = result;
  const bracket = bracketRecord(stages);
  const split = splitRecord(stages);
  const record = `${bracket.wins}-${bracket.losses}`;
  const stagesCleared = stages.filter((s) => s.passed).length;

  const headline = perfectRun
    ? `${record} · Perfect Run`
    : championsWon
      ? `${record} · Champions Winners`
      : `${record} · ${failureMessage}`;

  const tagline = perfectRun
    ? `${record} · Flawless`
    : championsWon
      ? `${record} · Champions`
      : `${record} · ${stagesCleared}/5 stages`;

  const narrative = championsWon
    ? `You went ${record} and lifted the Champions trophy.`
    : stagesCleared >= 3
      ? `You went ${record} and made a deep run before ${failureMessage.toLowerCase()}.`
      : `You went ${record} before ${failureMessage.toLowerCase()}.`;

  const runTitle = buildRunTitle(
    record,
    championsWon,
    perfectRun,
    stagesCleared,
    failureMessage,
    result.rosterScore
  );

  return {
    record,
    swissWins: split.swissWins,
    swissLosses: split.swissLosses,
    playoffWins: split.playoffWins,
    playoffLosses: split.playoffLosses,
    stagesCleared,
    runTitle,
    headline,
    tagline,
    narrative,
  };
}
