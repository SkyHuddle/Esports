import type { StageId, StageOutcome, StageOutcomeLabel, TournamentRunStep } from '../core/types';

export const STAGE_RUN_BEATS: Record<StageId, string[]> = {
  swiss: ['Swiss Round 1', 'Swiss Round 3', 'Swiss Round 5', 'Swiss Advance'],
  playoffs: ['Playoff Round 1', 'Playoff Round 2', 'Upper Final', 'Playoff Qualifier'],
  semifinal: ['Semifinal — Map 1', 'Semifinal — Map 2', 'Semifinal — Decider'],
  grand_final: ['Grand Final — Map 1', 'Grand Final — Map 2', 'Grand Final — Decider'],
  champions: ['Champions — Map 1', 'Champions — Map 2', 'Champions — Decider'],
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

  if (stage === 'champions' || stage === 'grand_final') {
    if (miss > 0.75) return 1;
    if (miss > 0.55) return 2;
    return beats;
  }

  if (stage === 'semifinal') {
    if (miss > 0.7) return 1;
    if (miss > 0.5) return 2;
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
  if (stage === 'champions' || stage === 'grand_final') {
    if (outcome === 'runner_up') return 'Grand Finalist';
    if (outcome === 'top4') return 'Top 4 Exit';
    return 'Grand Final Collapse';
  }
  if (stage === 'semifinal') return 'Semifinal Exit';
  if (stage === 'playoffs') return 'Playoff Exit';
  if (stage === 'swiss') return 'Swiss Stage Exit';
  return 'Eliminated';
}
