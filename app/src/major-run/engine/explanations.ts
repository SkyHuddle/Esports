import type { CsPlayer, DraftPick, SimulationResult, StageId } from '../core/types';
import { STAGE_FAILURE_LABELS } from '../core/constants';
import { isStageSkipped } from './tournament-run';

function avgStat(players: CsPlayer[], key: keyof CsPlayer['ratings']): number {
  if (players.length === 0) return 0;
  return players.reduce((sum, p) => sum + p.ratings[key], 0) / players.length;
}

function isCloseLoss(outcome: string): boolean {
  return outcome === 'runner_up';
}

function stageStatWeakness(stage: StageId, players: CsPlayer[]): string | null {
  const lan = avgStat(players, 'lan');
  const clutch = avgStat(players, 'clutch');
  const leadership = avgStat(players, 'leadership');
  const awp = avgStat(players, 'awpAbility');
  const playoffs = avgStat(players, 'playoffs');

  if (stage === 'grand_final') {
    if (clutch < 86) return 'Clutch rounds fell apart in the Grand Final.';
    if (lan < 84) return 'LAN pressure cracked the squad in the Grand Final.';
    if (leadership < 85) return 'No one took control when the major got loud.';
    return null;
  }

  if (stage === 'semifinal' && clutch < 85) {
    return `Clutch rounds cost you at ${STAGE_FAILURE_LABELS[stage]}.`;
  }

  if (stage === 'quarterfinal' && playoffs < 84) {
    return `Playoff nerves showed at ${STAGE_FAILURE_LABELS[stage]}.`;
  }

  if ((stage === 'opening' || stage === 'elimination') && awp < 84) {
    return `AWP impact was missing at ${STAGE_FAILURE_LABELS[stage]}.`;
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
  if (issues.includes('No AWPer')) {
    return `No dedicated AWPer — map control slipped at ${stageLabel}.`;
  }
  if (issues.includes('Too many stars')) {
    return `Too many stars, not enough structure — egos collided at ${stageLabel}.`;
  }
  if (issues.includes('Era mismatch')) {
    return `Era mismatch — players from different CS generations never synced at ${stageLabel}.`;
  }
  if (issues.includes('No major experience')) {
    return `No major experience — the stage was too big at ${stageLabel}.`;
  }
  if (issues.includes('Weak leadership')) {
    return `Weak leadership — nobody called the right plays at ${stageLabel}.`;
  }
  if (issues.includes('Low LAN experience')) {
    return `Low LAN experience — the crowd got in their heads at ${stageLabel}.`;
  }
  if (issues.includes('No support')) {
    return `No support anchor — utility and trades broke down at ${stageLabel}.`;
  }
  return null;
}

export function buildExplanation(
  result: Omit<SimulationResult, 'explanation' | 'footer' | 'majorSummary' | 'historicalComparison'>,
  picks: DraftPick[]
): { explanation: string; footer: string } {
  const players = picks.map((p) => p.player);
  const { majorWon, perfectRun, failureStage, weakLink, chemistry, stages } = result;

  if (perfectRun) {
    return {
      explanation: chemistry.modifiers[0] ?? 'Perfect role balance. Untouchable all major.',
      footer: 'FLAWLESS MAJOR',
    };
  }

  if (majorWon) {
    const line = chemistry.modifiers[0] ?? 'Championship DNA won out.';
    return { explanation: line, footer: 'MAJOR WON' };
  }

  const failedStage = failureStage ? stages.find((s) => s.stage === failureStage) : null;

  if (!failedStage) {
    return {
      explanation: 'The run ended short of a major trophy.',
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
      explanation: `Coin-flip series at ${stageLabel} didn't break your way.`,
      footer: 'One map away.',
    };
  }

  if (close && weakLink) {
    return {
      explanation: `${weakLink.gamertag} got exposed in the ${stageLabel} finals.`,
      footer: 'One map away.',
    };
  }

  if (close) {
    return {
      explanation: `Fell one series short at ${stageLabel}.`,
      footer: 'One map away.',
    };
  }

  const statReason = stageStatWeakness(failedStage.stage, players);
  if (statReason) {
    return { explanation: statReason, footer: `Fell at ${stageLabel}` };
  }

  if (chemReason) {
    return { explanation: chemReason, footer: `Fell at ${stageLabel}` };
  }

  if (weakLink && failedStage.passChance < 40) {
    return {
      explanation: `${weakLink.gamertag} wasn't built for ${stageLabel} pressure.`,
      footer: `Fell at ${stageLabel}`,
    };
  }

  if (failedStage.passChance < 30) {
    return {
      explanation: `Roster rating wasn't high enough to hang at ${stageLabel}.`,
      footer: `Fell at ${stageLabel}`,
    };
  }

  return {
    explanation: `The run ended at ${stageLabel}.`,
    footer: `Cleared ${stages.filter((s) => s.passed && !isStageSkipped(s)).length}/5 stages`,
  };
}

export function formatPickLine(player: CsPlayer, teamName: string, season: number): string {
  return `${teamName.split(' ').pop()} ${season}: ${player.gamertag}`;
}
