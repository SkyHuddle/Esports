import type { SimulationResult, StageId } from '@/golden-road/core/types';

import { STAGE_LABELS } from '@/golden-road/core/types';

import { ROAD_TOTAL_SERIES } from '@/golden-road/core/constants';
import { isStageSkipped } from '@/golden-road/engine/tournament-run';



const STAGE_SHORT: Record<StageId, string> = {

  spring: 'Spring',

  msi: 'MSI',

  summer: 'Summer',

  worlds: 'Worlds',

};



export interface GoldenRoadSummary {

  /** Series W-L across all tournament beats (e.g. 15-1) */

  record: string;

  /** Stages cleared out of 4 (e.g. 0/4) */

  stageRecord: string;

  runTitle: string;

  headline: string;

  narrative: string;

  stageChips: { label: string; passed: boolean }[];

  goldenRoad: boolean;

  seriesWins: number;

  seriesLosses: number;

}



function stageChipLabel(stage: StageId, passed: boolean, skipped: boolean): string {

  if (skipped) return `Skipped · ${STAGE_SHORT[stage]}`;

  if (passed) {

    if (stage === 'msi') return 'Won MSI';

    if (stage === 'worlds') return 'Won Worlds';

    return `Won ${STAGE_SHORT[stage]}`;

  }

  return `Out · ${STAGE_SHORT[stage]}`;

}



function stageWasSkipped(stage: SimulationResult['stages'][number]): boolean {
  return isStageSkipped(stage);
}



function buildRunTitle(result: SimulationResult): string {
  if (result.goldenRoad) return 'Golden Era';

  const stagesCleared = result.stages.filter((s) => s.passed).length;
  const { msi, worlds } = result.titleCounts;

  if (stagesCleared >= 3 && (worlds > 0 || msi >= 2)) return 'Almost Legendary';
  if (worlds > 0 || msi >= 2) return 'Dynasty Core';
  if (msi > 0 && stagesCleared >= 2) return 'Prime Timeline';
  if (result.rosterScore >= 90 && stagesCleared <= 1) return 'One Patch Wonder';
  if (stagesCleared >= 2) return 'Playoff Merchants';
  if (result.rosterScore < 75) return 'Washed Era';
  return 'Era Defining';
}



export function buildGoldenRoadSummary(result: SimulationResult): GoldenRoadSummary {

  const record = result.seriesRecord;

  const stageRecord = result.stageRecord;



  const stageChips = result.stages.map((s) => ({

    label: stageChipLabel(s.stage, s.passed, stageWasSkipped(s)),

    passed: s.passed,

  }));



  const passedNames = result.stages

    .filter((s) => s.passed)

    .map((s) => STAGE_SHORT[s.stage]);

  const runTitle = buildRunTitle(result);



  let headline: string;

  if (result.goldenRoad) {

    headline = `${ROAD_TOTAL_SERIES}-0 · Cleared Spring, MSI, Summer, and Worlds`;

  } else if (passedNames.length > 0) {

    headline = `${record} · ${passedNames.join(' · ')} · ${result.failureMessage}`;

  } else {

    headline = `${record} · ${result.failureMessage}`;

  }



  let narrative: string;

  if (result.goldenRoad) {

    narrative = `Perfect Golden Road — ${record} through every series with a ${result.rosterScore.toFixed(1)} roster score.`;

  } else {

    const failLabel = result.failureStage ? STAGE_LABELS[result.failureStage] : 'the road';

    narrative = `You went ${record} in series before falling at ${failLabel}. Score ${result.rosterScore.toFixed(1)}.`;

  }



  return {

    record,

    stageRecord,

    runTitle,

    headline,

    narrative,

    stageChips,

    goldenRoad: result.goldenRoad,

    seriesWins: result.seriesWins,

    seriesLosses: result.seriesLosses,

  };

}

