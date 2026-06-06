import type { DraftPick, SimulationResult, StageId, ValorantPlayer } from '../core/types';
import { STAGE_FAILURE_LABELS } from '../core/constants';
import { isStageSkipped } from './tournament-run';

function avgStat(players: ValorantPlayer[], key: keyof ValorantPlayer['ratings']): number {
  if (players.length === 0) return 0;
  return players.reduce((sum, p) => sum + p.ratings[key], 0) / players.length;
}

function isCloseLoss(outcome: string): boolean {
  return outcome === 'runner_up';
}

function stageStatWeakness(stage: StageId, players: ValorantPlayer[]): string | null {
  const lan = avgStat(players, 'lan');
  const clutch = avgStat(players, 'clutch');
  const leadership = avgStat(players, 'leadership');
  const utility = avgStat(players, 'utility');
  const playoffs = avgStat(players, 'playoffs');

  if (stage === 'champions' || stage === 'grand_final') {
    if (clutch < 86) return 'Clutch rounds fell apart in the Grand Final.';
    if (lan < 84) return 'LAN pressure cracked the squad in the Grand Final.';
    if (leadership < 85) return 'No one took control when Champions got loud.';
    return null;
  }

  if (stage === 'semifinal' && clutch < 85) {
    return `Clutch rounds cost you at ${STAGE_FAILURE_LABELS[stage]}.`;
  }

  if (stage === 'playoffs' && playoffs < 84) {
    return `Playoff nerves showed at ${STAGE_FAILURE_LABELS[stage]}.`;
  }

  if (stage === 'swiss' && utility < 84) {
    return `Utility was missing at ${STAGE_FAILURE_LABELS[stage]}.`;
  }

  if (leadership < 84) {
    return `No IGL stepped up at ${STAGE_FAILURE_LABELS[stage]}.`;
  }

  return null;
}

function chemistryFailureReason(issues: string[], stageLabel: string): string | null {
  if (issues.includes('No IGL')) {
    return `No shot-caller — the roster had no IGL when ${stageLabel} got chaotic.`;
  }
  if (issues.includes('No controller')) {
    return `No controller — map control slipped at ${stageLabel}.`;
  }
  if (issues.includes('Too many star players')) {
    return `Too many stars, not enough structure at ${stageLabel}.`;
  }
  if (issues.includes('No sentinel')) {
    return `No sentinel anchor — site holds broke at ${stageLabel}.`;
  }
  if (issues.includes('Utility gap')) {
    return `Utility gap — executes fell apart at ${stageLabel}.`;
  }
  return null;
}

export function buildExplanation(
  result: Omit<SimulationResult, 'explanation' | 'footer' | 'runSummary' | 'historicalComparison'>,
  picks: DraftPick[]
): { explanation: string; footer: string } {
  const players = picks.map((p) => p.player);
  const { championsWon, perfectRun, failureStage, weakLink, chemistry, stages } = result;

  if (perfectRun) {
    return {
      explanation: chemistry.modifiers[0] ?? 'Perfect role balance. Untouchable all tournament.',
      footer: 'PERFECT RUN',
    };
  }

  if (championsWon) {
    const line = chemistry.strength ?? chemistry.modifiers[0] ?? 'Championship DNA won out.';
    return { explanation: line, footer: 'CHAMPIONS WON' };
  }

  const failedStage = failureStage ? stages.find((s) => s.stage === failureStage) : null;

  if (!failedStage) {
    return {
      explanation: 'The run ended short of a Champions trophy.',
      footer: 'Run ended',
    };
  }

  const stageLabel = STAGE_FAILURE_LABELS[failedStage.stage];
  const close = isCloseLoss(failedStage.outcome);
  const coinFlip = failedStage.passChance >= 42 && failedStage.passChance <= 58;

  const chemReason = chemistryFailureReason(chemistry.issues, stageLabel);
  if (chemReason && failedStage.passChance < 50) {
    return { explanation: chemReason, footer: `Fell at ${stageLabel}` };
  }

  if (close && coinFlip) {
    return {
      explanation: `Coin-flip series at ${stageLabel} did not break your way.`,
      footer: 'One map away.',
    };
  }

  if (close && weakLink) {
    return {
      explanation: `${weakLink.gamertag} got exposed in the ${stageLabel} finals.`,
      footer: 'One map away.',
    };
  }

  const statReason = stageStatWeakness(failedStage.stage, players);
  if (statReason) {
    return { explanation: statReason, footer: `Fell at ${stageLabel}` };
  }

  if (weakLink && failedStage.passChance < 40) {
    return {
      explanation: `${weakLink.gamertag} was not built for ${stageLabel} pressure.`,
      footer: `Fell at ${stageLabel}`,
    };
  }

  return {
    explanation: chemistry.weakness ?? `The run ended at ${stageLabel}.`,
    footer: `Cleared ${stages.filter((s) => s.passed && !isStageSkipped(s)).length}/5 stages`,
  };
}
