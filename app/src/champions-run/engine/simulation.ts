import type {
  ChampionsOutcome,
  DraftPick,
  SimulationResult,
  StageId,
  StageOutcome,
} from '../core/types';
import { STAGES } from '../core/types';
import {
  STAGE_PASS_MIDPOINTS,
  STAGE_PASS_STEEPNESS,
  STAGE_PASS_MIN,
  STAGE_PASS_MAX,
  MIN_CHAMPIONS_CHANCE,
} from '../core/constants';
import { simulationPlayers } from './card-context';
import { evaluateChemistry } from './chemistry';
import { computeRosterScore, stageTeamPower, findMvp, findWeakLink } from './ratings';
import { buildExplanation } from './explanations';
import { buildRunSummary } from './run-summary';
import { buildHistoricalComparison } from './run-compare';
import { enrichStageWithRun, buildSkippedStageRun, stageFailureHeadline, isStageSkipped } from './tournament-run';
import { hashString, mulberry32 } from './rng';

function clampPass(chance: number): number {
  return Math.min(STAGE_PASS_MAX, Math.max(STAGE_PASS_MIN, chance));
}

export function stagePassProbability(power: number, stage: StageId): number {
  const mid = STAGE_PASS_MIDPOINTS[stage];
  const steepness = STAGE_PASS_STEEPNESS[stage];
  const logistic = 1 / (1 + Math.exp(-steepness * (power - mid)));
  return clampPass(logistic);
}

function jitter(power: number, stage: StageId, avgClutch: number, rng: () => number): number {
  const spread = stage === 'champions' ? 3 + avgClutch / 28 : 2.2;
  return power + (rng() - 0.5) * spread;
}

function failureOutcome(stage: StageId, roll: number, passChance: number): ChampionsOutcome {
  const gap = roll - passChance;

  if (stage === 'champions' || stage === 'grand_final') {
    if (gap < 0.08) return 'runner_up';
    return 'top4';
  }
  if (stage === 'semifinal') {
    if (gap < 0.1) return 'top4';
    return 'top8';
  }
  if (stage === 'playoffs') {
    if (gap < 0.12) return 'top8';
    return 'top16';
  }
  return 'eliminated';
}

function passedOutcome(stage: StageId): ChampionsOutcome {
  return stage === 'champions' ? 'champion' : 'cleared';
}

export function championsProbability(picks: DraftPick[]): number {
  const players = simulationPlayers(picks);
  const chemistry = evaluateChemistry(picks);
  const trapSlots = picks.filter((p) => p.team.tier === 'underdog').length;
  const trapPenalty = trapSlots * 1.4 + Math.max(0, trapSlots - 1) * 1.0;
  let odds = 1;
  for (const stage of STAGES) {
    const power = stageTeamPower(players, stage, chemistry.score) - trapPenalty;
    odds *= stagePassProbability(power, stage);
  }
  return Math.max(odds, MIN_CHAMPIONS_CHANCE);
}

export function simulateChampionsRun(
  picks: DraftPick[],
  options?: { seed?: string }
): SimulationResult {
  const players = simulationPlayers(picks);
  const chemistry = evaluateChemistry(picks);
  const seed = options?.seed
    ? hashString(options.seed)
    : (Date.now() ^ (Math.random() * 1e9)) >>> 0;
  const rng = mulberry32(seed);
  const avgClutch = players.reduce((s, p) => s + p.ratings.clutch, 0) / players.length;
  const trapSlots = picks.filter((p) => p.team.tier === 'underdog').length;
  const trapPenalty = trapSlots * 1.4 + Math.max(0, trapSlots - 1) * 1.0;

  const stages: StageOutcome[] = [];
  let failureStage: StageId | null = null;
  let failureMessageText = '';
  let anySeriesLost = false;
  let roadBroken = false;

  for (const stage of STAGES) {
    if (roadBroken) {
      stages.push({
        stage,
        outcome: 'eliminated',
        passed: false,
        passChance: 0,
        power: 0,
        run: buildSkippedStageRun(),
      });
      continue;
    }

    const power = stageTeamPower(players, stage, chemistry.score) - trapPenalty;
    const effective = jitter(power, stage, avgClutch, rng);
    const passChance = stagePassProbability(effective, stage);
    const roll = rng();
    const passed = roll < passChance;

    const outcome: ChampionsOutcome = passed ? passedOutcome(stage) : failureOutcome(stage, roll, passChance);

    if (!passed && failureStage == null) {
      failureStage = stage;
      failureMessageText = stageFailureHeadline(stage, outcome);
      roadBroken = true;
    }

    const stageOutcome = enrichStageWithRun(
      {
        stage,
        outcome,
        passed,
        passChance: Math.round(passChance * 1000) / 10,
        power: Math.round(effective * 10) / 10,
      },
      rng
    );

    if (!isStageSkipped(stageOutcome) && stageOutcome.run.some((beat) => !beat.passed)) {
      anySeriesLost = true;
    }

    stages.push(stageOutcome);
  }

  const championsStage = stages.find((s) => s.stage === 'champions')!;
  const championsWon = championsStage.passed && championsStage.outcome === 'champion';
  const perfectRun = championsWon && !anySeriesLost;

  const rosterScore = computeRosterScore(players);
  const championsOdds = championsProbability(picks);
  const mvp = findMvp(players);
  const weakLink = findWeakLink(players);

  const partial: Omit<
    SimulationResult,
    'explanation' | 'footer' | 'runSummary' | 'historicalComparison'
  > = {
    stages,
    championsWon,
    perfectRun,
    failureStage: championsWon ? null : failureStage,
    failureMessage: perfectRun
      ? 'Perfect Run'
      : championsWon
        ? 'Champions Won'
        : failureMessageText || 'Run ended',
    rosterScore,
    championsOdds,
    chemistry,
    mvp,
    weakLink,
  };

  const runSummary = buildRunSummary(partial, picks);
  const historicalComparison = buildHistoricalComparison(picks, runSummary);
  const { explanation, footer } = buildExplanation(partial, picks);

  return { ...partial, runSummary, historicalComparison, explanation, footer };
}
