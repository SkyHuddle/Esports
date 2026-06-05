import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { SimulationResult } from '@/golden-road/core/types';
import { buildGoldenRoadSummary } from '@/golden-road/engine/run-summary';

interface GoldenRoadSummaryCardProps {
  result: SimulationResult;
}

export function GoldenRoadSummaryCard({ result }: GoldenRoadSummaryCardProps) {
  const summary = buildGoldenRoadSummary(result);
  const isWin = summary.goldenRoad;

  return (
    <motion.div
      className={`kb-card rounded-[var(--kb-r-lg)] text-center px-6 py-6 ${
        isWin ? 'kb-card-accent-gold' : ''
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-kb-mute mb-2">
        Golden Road · {summary.stageRecord} stages cleared
      </p>
      <p
        className={`font-display text-6xl tabular-nums leading-none ${
          isWin ? 'text-ring-gold' : 'text-kb-fg'
        }`}
      >
        {summary.record}
      </p>

      <p className="text-sm font-display text-kb-gold/90 mt-3">{summary.runTitle}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {summary.stageChips.map((chip) => (
          <span
            key={chip.label}
            className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-semibold ${
              chip.passed
                ? 'bg-kb-gold/12 text-kb-gold border-kb-gold/25'
                : 'bg-kb-glass text-kb-mute border-kb-border'
            }`}
          >
            {chip.passed && chip.label.startsWith('Won Worlds') && (
              <Trophy className="w-3 h-3" />
            )}
            {chip.label}
          </span>
        ))}
      </div>

      <p className="text-sm text-kb-soft mt-4 leading-relaxed max-w-[280px] mx-auto">
        {summary.narrative}
      </p>
    </motion.div>
  );
}
