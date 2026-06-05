import type { DraftPick, MajorSummary, SimulationResult, StageOutcome } from '../core/types';
import { isStageSkipped } from './tournament-run';

export type { MajorSummary };

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
  openingWins: number;
  openingLosses: number;
  playoffWins: number;
  playoffLosses: number;
} {
  const openingStages: StageOutcome['stage'][] = ['opening', 'elimination'];

  let openingWins = 0;
  let openingLosses = 0;
  let playoffWins = 0;
  let playoffLosses = 0;

  for (const stage of stages) {
    if (isStageSkipped(stage)) continue;
    const isOpening = openingStages.includes(stage.stage);
    for (const beat of stage.run) {
      if (beat.passed) {
        if (isOpening) openingWins += 1;
        else playoffWins += 1;
      } else {
        if (isOpening) openingLosses += 1;
        else playoffLosses += 1;
        break;
      }
    }
  }

  return { openingWins, openingLosses, playoffWins, playoffLosses };
}

function formatRecord(wins: number, losses: number): string {
  return `${wins}-${losses}`;
}

function buildNarrative(
  record: string,
  majorWon: boolean,
  perfectRun: boolean,
  stagesCleared: number,
  failureMessage: string
): string {
  if (perfectRun) {
    return `You went ${record} through the entire major without dropping a series. Flawless major.`;
  }
  if (majorWon) {
    return `You went ${record} and lifted the trophy at the Grand Final.`;
  }
  if (stagesCleared >= 3) {
    return `You went ${record} and made a deep run before ${failureMessage.toLowerCase()}.`;
  }
  if (stagesCleared > 0) {
    return `You went ${record} before ${failureMessage.toLowerCase()}.`;
  }
  return `You went ${record} and went out at ${failureMessage.toLowerCase()}.`;
}

function buildRunTitle(
  record: string,
  majorWon: boolean,
  perfectRun: boolean,
  stagesCleared: number,
  failureMessage: string,
  rosterScore: number
): string {
  if (perfectRun) return 'Flawless Major';
  if (majorWon) return 'Major Champion';
  if (failureMessage.includes('Grand Final')) return 'Grand Finalist';
  if (stagesCleared >= 3) return 'Semifinal Curse';
  if (stagesCleared >= 2) return 'Legendary Run';
  if (stagesCleared === 1 && rosterScore >= 88) return 'Swiss Stage Survivor';
  if (record.startsWith('0-')) return '0-3 Disaster';
  if (failureMessage.includes('Opening')) return 'Heartbreak Run';
  return 'Heartbreak Run';
}

export function buildMajorSummary(
  result: Omit<SimulationResult, 'majorSummary' | 'explanation' | 'footer' | 'historicalComparison'>,
  _picks: DraftPick[]
): MajorSummary {
  const { stages, majorWon, perfectRun, failureMessage } = result;
  const bracket = bracketRecord(stages);
  const split = splitRecord(stages);
  const record = formatRecord(bracket.wins, bracket.losses);
  const stagesCleared = stages.filter((s) => s.passed).length;

  const headline = perfectRun
    ? `${record} · Flawless Major`
    : majorWon
      ? `${record} · Major Champion`
      : `${record} · ${failureMessage}`;

  const tagline = perfectRun
    ? `${record} · Flawless`
    : majorWon
      ? `${record} · Champion`
      : `${record} · ${stagesCleared}/5 stages`;

  const narrative = buildNarrative(
    record,
    majorWon,
    perfectRun,
    stagesCleared,
    failureMessage
  );

  const runTitle = buildRunTitle(
    record,
    majorWon,
    perfectRun,
    stagesCleared,
    failureMessage,
    result.rosterScore
  );

  return {
    record,
    openingWins: split.openingWins,
    openingLosses: split.openingLosses,
    playoffWins: split.playoffWins,
    playoffLosses: split.playoffLosses,
    stagesCleared,
    runTitle,
    headline,
    tagline,
    narrative,
  };
}
