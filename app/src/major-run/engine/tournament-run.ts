import type { StageId, StageOutcome, StageOutcomeLabel, TournamentRunStep } from '../core/types';

export const STAGE_RUN_BEATS: Record<StageId, string[]> = {
  opening: ['Swiss Round 1', 'Swiss Round 3', 'Swiss Round 5', 'Opening Advance'],
  elimination: ['Elimination Round 1', 'Elimination Round 2', 'Decider Match', 'Playoff Qualifier'],
  quarterfinal: ['Quarterfinal — Map 1', 'Quarterfinal — Map 2', 'Quarterfinal — Decider'],
  semifinal: ['Semifinal — Map 1', 'Semifinal — Map 2', 'Semifinal — Decider'],
  grand_final: ['Grand Final — Map 1', 'Grand Final — Map 2', 'Grand Final — Decider'],
};

const SKIPPED_BEAT: TournamentRunStep = { label: 'Did not qualify', passed: false };

export function isStageSkipped(stage: Pick<StageOutcome, 'run'>): boolean {
  return stage.run.length === 1 && stage.run[0]?.label === 'Did not qualify';
}

export function buildSkippedStageRun(): TournamentRunStep[] {
  return [SKIPPED_BEAT];
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

  if (stage === 'grand_final') {
    if (miss > 0.75) return 1;
    if (miss > 0.55) return 2;
    return beats;
  }

  if (stage === 'semifinal') {
    if (miss > 0.7) return 1;
    if (miss > 0.5) return 2;
    return beats;
  }

  if (stage === 'quarterfinal') {
    if (miss > 0.65) return 1;
    if (miss > 0.45) return 2;
    return beats;
  }

  if (miss > 0.7) return 1;
  if (miss > 0.5) return 2;
  if (miss > 0.3 || rng() < 0.55) return 3;
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

export function enrichStageWithRun(
  outcome: Omit<StageOutcome, 'run'>,
  rng: () => number
): StageOutcome {
  const run = buildTournamentRun(outcome.stage, outcome.passed, outcome.passChance, rng);
  return { ...outcome, run };
}

export function stageFailureHeadline(stage: StageId, outcome: StageOutcomeLabel): string {
  if (stage === 'grand_final') {
    if (outcome === 'runner_up') return 'Lost Major Grand Final';
    return 'Eliminated at Grand Final';
  }
  if (outcome === 'runner_up') {
    return `Lost ${STAGE_RUN_BEATS[stage].at(-1) ?? 'Final'}`;
  }
  if (stage === 'semifinal') return 'Eliminated at Semifinal';
  if (stage === 'quarterfinal') return 'Eliminated at Quarterfinal';
  if (stage === 'elimination') return 'Eliminated at Elimination Stage';
  return 'Eliminated at Opening Stage';
}
