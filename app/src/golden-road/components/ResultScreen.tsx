import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from 'lucide-react';
import type { DraftPick, SimulationResult, GameMode } from '@/golden-road/core/types';
import { ShareCard } from './ShareCard';
import { GoldenRoadSummaryCard } from './GoldenRoadSummaryCard';
import { DailyLeaderboard } from './DailyLeaderboard';
import { KbCtaButton as RingCtaButton } from '@/components/kb/KbCtaButton';
import { addShareHistory } from '@/golden-road/features/storage';
import { buildGoldenRoadSummary } from '@/golden-road/engine/run-summary';
import { formatDailyShareLine, formatShareText } from '@/golden-road/features/share';
import { sortPicksByRole } from '@/golden-road/core/constants';
import { hapticSuccess } from '@/utils/haptics';

interface ResultScreenProps {
  picks: DraftPick[];
  result: SimulationResult;
  mode: GameMode;
  dailyTitle?: string;
  dailyPercentile: number | null;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function ResultScreen({
  picks,
  result,
  mode,
  dailyTitle,
  dailyPercentile,
  onPlayAgain,
  onHome,
}: ResultScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const summary = buildGoldenRoadSummary(result);

  useEffect(() => {
    setRevealed(false);
    hapticSuccess();
    const t = setTimeout(() => setRevealed(true), 750);
    return () => clearTimeout(t);
  }, [result]);

  const orderedPicks = sortPicksByRole(picks);

  const handleShare = useCallback(async () => {
    addShareHistory({
      goldenRoad: result.goldenRoad,
      score: result.rosterScore,
      rosterNames: orderedPicks.map((p) => p.player.name),
    });

    const rosterLine = orderedPicks.map((p) => p.player.name).join(' · ');
    const text = formatShareText(result, rosterLine, mode === 'daily');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Golden Road',
          text: mode === 'daily' ? formatDailyShareLine(result) : text,
        });
        return;
      } catch {
        /* fall through */
      }
    }

    await navigator.clipboard.writeText(
      mode === 'daily' ? formatDailyShareLine(result) : text
    );
  }, [orderedPicks, result, mode]);

  return (
    <div className="min-h-[100dvh] px-4 py-10 pb-14 max-w-lg mx-auto overflow-y-auto">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="reveal"
            className="min-h-[70dvh] flex flex-col items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-kb-mute mb-4">Your run</p>
            <motion.p
              className={`font-display text-7xl sm:text-8xl tabular-nums leading-none ${
                result.goldenRoad ? 'text-ring-gold' : 'text-kb-fg'
              }`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {summary.record}
            </motion.p>
            <p className="text-kb-soft text-sm mt-4 text-center max-w-[280px] leading-relaxed">
              {summary.runTitle}
            </p>
            <p className="text-kb-mute text-xs mt-2 text-center max-w-[300px]">
              {summary.headline}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-kb-mute mb-3">
              Golden Road
            </p>
            <p
              className="text-center font-display text-7xl sm:text-8xl tabular-nums leading-none mb-2"
              style={{
                color: result.goldenRoad ? 'var(--kb-gold)' : 'var(--kb-fg)',
                textShadow: result.goldenRoad ? '0 0 24px rgba(232,184,66,0.25)' : 'none',
              }}
            >
              {summary.record}
            </p>
            <p className="text-center text-[13px] italic text-kb-soft mb-5">{summary.runTitle}</p>

            <div className="mb-5">
              <GoldenRoadSummaryCard result={result} />
            </div>

            <div ref={cardRef} className="flex justify-center mb-2">
              <ShareCard picks={orderedPicks} result={result} mode={mode} dailyTitle={dailyTitle} />
            </div>

            {mode === 'daily' && dailyPercentile != null && (
              <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DailyLeaderboard percentile={dailyPercentile} score={result.rosterScore} />
              </motion.div>
            )}

            <motion.div className="space-y-2.5 mt-8">
              <RingCtaButton onClick={handleShare} variant="amber">
                Share Result
              </RingCtaButton>
              {mode === 'free' ? (
                <RingCtaButton onClick={onPlayAgain} variant="gold">
                  One More Run
                </RingCtaButton>
              ) : (
                <p className="text-center text-[11px] text-kb-mute py-2">
                  Daily locked — one run per day
                </p>
              )}
              <button
                type="button"
                onClick={onHome}
                className="w-full flex items-center justify-center gap-2 text-kb-mute text-sm py-3.5 hover:text-kb-soft transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
