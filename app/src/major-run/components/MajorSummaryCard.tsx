import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { SimulationResult } from '../core/types';
import { STAGES, STAGE_LABELS } from '../core/types';
import { isStageSkipped } from '../engine/tournament-run';

interface MajorSummaryCardProps {
  result: SimulationResult;
  variant?: 'sim' | 'result';
}

export function MajorSummaryCard({ result, variant = 'result' }: MajorSummaryCardProps) {
  const { majorSummary, majorWon, perfectRun } = result;
  const isWin = majorWon || perfectRun;

  return (
    <motion.div
      className={`kb-card rounded-[var(--kb-r-lg)] text-center px-6 py-6 ${
        isWin ? 'kb-card-accent-gold' : ''
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-kb-mute mb-2">
        {perfectRun ? 'Flawless Major' : 'Major Run · Series record'}
      </p>
      <p
        className={`font-display text-6xl tabular-nums leading-none ${
          isWin ? 'text-ring-gold' : 'text-kb-fg'
        }`}
      >
        {majorSummary.record}
      </p>

      <p className="text-sm font-display text-kb-gold/90 mt-3">{majorSummary.runTitle}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {STAGES.map((stageId, i) => {
          const stage = result.stages[i];
          const skipped = stage != null && isStageSkipped(stage);
          const passed = !skipped && (stage?.passed ?? false);
          return (
            <span
              key={stageId}
              className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-semibold ${
                skipped
                  ? 'bg-kb-glass text-kb-faint border-kb-hairline opacity-40'
                  : passed
                    ? 'bg-kb-gold/12 text-kb-gold border-kb-gold/25'
                    : 'bg-kb-glass text-kb-mute border-kb-border'
              }`}
            >
              {passed && i === STAGES.length - 1 && majorWon && (
                <Trophy className="w-3 h-3" />
              )}
              {skipped ? '—' : STAGE_LABELS[stageId].split(' ')[0]}
            </span>
          );
        })}
      </div>

      <p className="text-sm text-kb-soft mt-4 leading-relaxed max-w-[280px] mx-auto">
        {variant === 'sim' ? majorSummary.tagline : majorSummary.narrative}
      </p>
    </motion.div>
  );
}
