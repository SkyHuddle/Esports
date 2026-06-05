import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SimulationResult, StageId } from '@/golden-road/core/types';
import { STAGES, STAGE_LABELS } from '@/golden-road/core/types';
import { STAGE_PAUSE, RUN_BEAT_DELAY } from '@/golden-road/core/constants';
import { buildGoldenRoadSummary } from '@/golden-road/engine/run-summary';
import { Check, X, Minus } from 'lucide-react';

interface SimulationScreenProps {
  result: SimulationResult;
  onComplete: () => void;
}

export function SimulationScreen({ result, onComplete }: SimulationScreenProps) {
  const [stageIndex, setStageIndex] = useState(-1);
  const [beatIndex, setBeatIndex] = useState(-1);
  const [showFinal, setShowFinal] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const summary = buildGoldenRoadSummary(result);

  useEffect(() => {
    setStageIndex(-1);
    setBeatIndex(-1);
    setShowFinal(false);
    const t = setTimeout(() => setStageIndex(0), 400);
    return () => clearTimeout(t);
  }, [result]);

  useEffect(() => {
    if (stageIndex < 0 || stageIndex >= STAGES.length) return;

    const stage = result.stages[stageIndex];
    if (!stage) return;

    const skipped =
      stage.run.length === 1 && stage.run[0]?.label === 'Did not qualify';

    if (skipped) {
      const t = setTimeout(() => {
        if (stageIndex < STAGES.length - 1) {
          setStageIndex(stageIndex + 1);
        } else {
          setShowFinal(true);
          setTimeout(() => onCompleteRef.current(), 2200);
        }
      }, STAGE_PAUSE);
      return () => clearTimeout(t);
    }

    let beat = 0;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(fn, ms));
    };

    const finishStage = () => {
      if (cancelled) return;
      setBeatIndex(-1);
      schedule(() => {
        if (cancelled) return;
        if (stageIndex < STAGES.length - 1) {
          setStageIndex(stageIndex + 1);
        } else {
          setShowFinal(true);
          schedule(() => {
            if (!cancelled) onCompleteRef.current();
          }, 2200);
        }
      }, STAGE_PAUSE);
    };

    const runBeat = () => {
      if (cancelled) return;
      setBeatIndex(beat);
      const step = stage.run[beat];

      schedule(() => {
        if (cancelled) return;
        if (!step.passed) {
          finishStage();
          return;
        }
        beat += 1;
        if (beat < stage.run.length) {
          runBeat();
        } else {
          finishStage();
        }
      }, RUN_BEAT_DELAY);
    };

    runBeat();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [stageIndex, result.stages]);

  return (
    <div className="flex flex-col min-h-[100dvh] items-center justify-center px-5 max-w-lg mx-auto py-10">
      <motion.p
        className="text-[10px] uppercase tracking-[0.45em] text-kb-gold/70 mb-2 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Golden Road Run
      </motion.p>
      <motion.p
        className="text-kb-mute text-xs mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        Spring → MSI → Summer → Worlds · 20 series
      </motion.p>

      <div className="w-full space-y-3">
        {STAGES.map((stageId, i) => {
          const outcome = result.stages[i];
          if (!outcome) return null;

          return (
            <StageBlock
              key={stageId}
              stage={stageId}
              outcome={outcome}
              isPast={i < stageIndex}
              isCurrent={i === stageIndex}
              isFuture={i > stageIndex}
              activeBeatIndex={i === stageIndex ? beatIndex : -1}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {showFinal && (
          <motion.div
            className="mt-8 w-full px-1 text-center"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <p
              className={`font-display text-5xl tabular-nums leading-none ${
                result.goldenRoad ? 'text-ring-gold' : 'text-kb-fg'
              }`}
            >
              {summary.record}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-kb-mute mt-2">
              {summary.stageRecord} stages · {summary.headline.split('·').slice(-1)[0]?.trim()}
            </p>
            <p className="text-center text-kb-mute text-xs mt-3 leading-relaxed px-2">
              {summary.narrative}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StageBlock({
  stage,
  outcome,
  isPast,
  isCurrent,
  isFuture,
  activeBeatIndex,
}: {
  stage: StageId;
  outcome: SimulationResult['stages'][number];
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  activeBeatIndex: number;
}) {
  const skipped =
    outcome.run.length === 1 && outcome.run[0]?.label === 'Did not qualify';
  const stageDone = isPast || (isCurrent && activeBeatIndex < 0 && !isFuture);
  const stagePassed = outcome.passed && stageDone;

  return (
    <motion.div
      layout
      className={`rounded-[var(--kb-r-lg)] border overflow-hidden transition-all duration-300 ${
        isFuture || skipped
          ? 'border-kb-hairline bg-kb-card/40 opacity-30'
          : stageDone
            ? stagePassed
              ? 'kb-card-accent-gold border-kb-gold/30 bg-kb-gold/[0.05]'
              : 'border-kb-crimson/25 bg-kb-crimson/[0.06]'
            : 'border-kb-gold/15 bg-kb-card ring-1 ring-kb-gold/10'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-kb-hairline gap-3">
        <span className="font-display text-lg text-kb-fg">{STAGE_LABELS[stage]}</span>
        {skipped ? (
          <span className="text-[10px] text-kb-faint uppercase tracking-wider">Skipped</span>
        ) : stageDone ? (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${
              stagePassed ? 'text-kb-gold' : 'text-kb-crimson'
            }`}
          >
            {stagePassed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            {stagePassed ? 'Cleared' : 'Out'}
          </span>
        ) : isCurrent ? (
          <span className="text-[10px] text-kb-amber uppercase tracking-widest animate-pulse font-semibold">
            Live
          </span>
        ) : (
          <span className="text-kb-faint text-xs">—</span>
        )}
      </div>

      {!skipped && (isCurrent || isPast) && (
        <ul className="px-3 py-2 space-y-0.5">
          {outcome.run.map((beat, i) => {
            const revealed = isPast || (isCurrent && activeBeatIndex >= 0 && i <= activeBeatIndex);
            const isFailBeat = revealed && !beat.passed;
            const isPassBeat = revealed && beat.passed;

            if (!revealed) {
              return (
                <li
                  key={beat.label}
                  className="flex items-center gap-2 py-1.5 text-kb-faint text-xs px-2"
                >
                  <Minus className="w-3 h-3" />
                  <span>···</span>
                </li>
              );
            }

            return (
              <motion.li
                key={beat.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 py-1.5 text-xs rounded-lg px-2.5 ${
                  isFailBeat
                    ? 'text-kb-crimson/90 bg-kb-crimson/12'
                    : isPassBeat
                      ? 'text-kb-soft'
                      : 'text-kb-mute'
                }`}
              >
                {isFailBeat ? (
                  <X className="w-3 h-3 shrink-0" />
                ) : isPassBeat ? (
                  <Check className="w-3 h-3 shrink-0 text-kb-gold/80" />
                ) : (
                  <Minus className="w-3 h-3 shrink-0" />
                )}
                <span className="truncate">{beat.label}</span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
