import type { StageId, StageOutcome, TournamentRunStep } from '@/golden-road/core/types';

/** Five series per stage — 20 total across the Golden Road (same scale as Ring Chase) */
export const STAGE_RUN_BEATS: Record<StageId, string[]> = {
  spring: [
    'Regular Season — Week 1',
    'Regular Season — Week 5',
    'Regular Season — Week 9',
    'Playoffs — Semifinals',
    'Spring Final',
  ],
  msi: [
    'Group Stage — Round 1',
    'Group Stage — Round 2',
    'Quarterfinal',
    'Semifinal',
    'MSI Final',
  ],
  summer: [
    'Regular Season — Week 1',
    'Regular Season — Week 5',
    'Regular Season — Week 9',
    'Playoffs — Semifinals',
    'Summer Final',
  ],
  worlds: [
    'Swiss Stage — Round 1',
    'Swiss Stage — Round 2',
    'Quarterfinal',
    'Semifinal',
    'Grand Final',
  ],
};

const SKIPPED_BEAT: TournamentRunStep = { label: 'Did not qualify', passed: false };

export function isStageSkipped(stage: Pick<StageOutcome, 'run'>): boolean {
  return stage.run.length === 1 && stage.run[0]?.label === 'Did not qualify';
}

function failIndexForStage(
  stage: StageId,
  passed: boolean,
  passChancePct: number,
  rng: () => number
): number {
  if (passed) return STAGE_RUN_BEATS[stage].length;

  const miss = 1 - passChancePct / 100;
  const beats = STAGE_RUN_BEATS[stage].length;

  if (stage === 'worlds') {
    if (miss > 0.7) return 1;
    if (miss > 0.5) return 2;
    if (miss > 0.32) return 3;
    if (miss > 0.18) return 4;
    return beats;
  }

  if (stage === 'msi') {
    if (miss > 0.65) return 1;
    if (miss > 0.45) return 2;
    if (miss > 0.28) return 3;
    if (miss > 0.14) return 4;
    return beats;
  }

  if (miss > 0.6) return 1;
  if (miss > 0.42) return 2;
  if (miss > 0.26) return 3;
  if (miss > 0.12 || rng() < 0.5) return 4;
  return beats;
}

export function buildTournamentRun(
  stage: StageId,
  passed: boolean,
  passChancePct: number,
  rng: () => number
): TournamentRunStep[] {
  const labels = STAGE_RUN_BEATS[stage];
  const failAt = failIndexForStage(stage, passed, passChancePct, rng);

  return labels.map((label, i) => ({
    label,
    passed: i < failAt,
  }));
}

export function buildSkippedStageRun(): TournamentRunStep[] {
  return [SKIPPED_BEAT];
}

export function enrichStageWithRun(
  outcome: Omit<StageOutcome, 'run'>,
  rng: () => number
): StageOutcome {
  const run = buildTournamentRun(
    outcome.stage,
    outcome.passed,
    outcome.threshold,
    rng
  );
  return { ...outcome, run };
}

export function bracketSeriesRecord(stages: StageOutcome[]): { wins: number; losses: number } {
  let wins = 0;
  let losses = 0;
  for (const stage of stages) {
    if (isStageSkipped(stage)) {
      continue;
    }
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

export function formatSeriesRecord(wins: number, losses: number): string {
  return `${wins}-${losses}`;
}

export function stageFailureHeadline(stage: StageId, detail?: string): string {
  if (stage === 'worlds' && detail) {
    return detail;
  }
  const labels: Record<StageId, string> = {
    spring: 'Eliminated in Spring Split',
    msi: 'Eliminated at MSI',
    summer: 'Eliminated in Summer Split',
    worlds: 'Eliminated at Worlds',
  };
  return labels[stage];
}
