import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HistoricalTeam, SlotSpin } from '@/golden-road/core/types';
import { DRAFT_PHASE_LABELS } from '@/golden-road/core/types';
import type { DraftTournamentPhase } from '@/golden-road/core/types';
import { SPIN_TICK_MS } from '@/golden-road/core/constants';
import { hapticTap } from '@/utils/haptics';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Short team monogram for the spinning crest fallback (no real logo assets ship). */
function teamMonogram(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0]!.slice(0, 3).toUpperCase();
  return words
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

interface TeamSlotMachineProps {
  phase: DraftTournamentPhase;
  team: HistoricalTeam;
  spin: SlotSpin;
  spinKey: number;
  onComplete: () => void;
}

export function TeamSlotMachine({
  phase,
  team,
  spin,
  spinKey,
  onComplete,
}: TeamSlotMachineProps) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIndex(0);
    setDone(false);
  }, [spinKey, spin]);

  useEffect(() => {
    const totalTicks = spin.yearSequence.length;
    if (totalTicks === 0) return;

    let tick = 0;
    let cancelled = false;

    const interval = setInterval(() => {
      if (cancelled) return;
      tick += 1;
      setIndex(tick - 1);

      if (tick >= totalTicks) {
        clearInterval(interval);
        hapticTap();
        setDone(true);
        setTimeout(() => {
          if (!cancelled) onCompleteRef.current();
        }, 450);
      }
    }, SPIN_TICK_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [spinKey, spin.yearSequence.length]);

  const year = spin.yearSequence[index] ?? team.year;
  const name = spin.nameSequence[index] ?? team.name;
  const region = spin.regionSequence[index] ?? team.region;
  const progress = spin.yearSequence.length ? (index + 1) / spin.yearSequence.length : 1;
  const monogram = teamMonogram(done ? team.name : name);

  return (
    <div className="flex flex-col items-center justify-center min-h-[54dvh] px-5 pb-10">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[10px] uppercase tracking-[0.45em] text-kb-gold/80 mb-2 font-semibold">
          {DRAFT_PHASE_LABELS[phase]}
        </p>
        <p className="text-kb-mute text-sm">{done ? 'Locked in' : 'Rolling your team…'}</p>
      </motion.div>

      <TeamCrest
        monogram={monogram}
        accent={team.accent}
        done={done}
        tick={index}
        reduceMotion={!!reduceMotion}
      />

      <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
        <Reel label="Year" value={String(year)} highlight={done} accent={team.accent} />
        <Reel label="Team" value={name} sub={region} highlight={done} accent={team.accent} small />
      </div>

      <div className="kb-card w-full max-w-sm rounded-[var(--kb-r-lg)] border border-kb-border px-5 py-5">
        {!done ? (
          <div className="h-1.5 rounded-full bg-kb-glass-strong overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-kb-gold/70"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-kb-mute mb-1">You landed</p>
            <p className="text-base font-medium" style={{ color: team.accent }}>
              {team.tagline}
            </p>
          </motion.div>
        )}
      </div>

      {!done && (
        <p className="text-kb-faint text-[10px] uppercase tracking-[0.35em] mt-8">Spinning</p>
      )}
    </div>
  );
}

/**
 * Team crest that flashes a fresh monogram on every reel tick, then settles on
 * the landed team. No real logo assets exist, so this is a tasteful accent-tinted
 * fallback badge. Flashing is disabled under prefers-reduced-motion.
 */
function TeamCrest({
  monogram,
  accent,
  done,
  tick,
  reduceMotion,
}: {
  monogram: string;
  accent: string;
  done: boolean;
  tick: number;
  reduceMotion: boolean;
}) {
  return (
    <div className="mb-7 flex items-center justify-center">
      <motion.div
        className="relative flex items-center justify-center rounded-[var(--kb-r-lg)] overflow-hidden"
        style={{
          width: 92,
          height: 92,
          background: `color-mix(in srgb, ${accent} ${done ? 18 : 11}%, var(--kb-bg-card))`,
          border: `1px solid color-mix(in srgb, ${accent} ${done ? 58 : 30}%, transparent)`,
          boxShadow: 'var(--kb-shadow-card)',
        }}
        animate={
          done && !reduceMotion ? { scale: [0.92, 1.05, 1] } : { scale: 1 }
        }
        transition={{ duration: 0.36, ease: EASE_OUT }}
      >
        <motion.span
          key={reduceMotion ? 'crest-static' : `${monogram}-${tick}`}
          className="font-display leading-none tabular-nums"
          style={{ color: accent, fontSize: 36, letterSpacing: '0.03em' }}
          initial={reduceMotion ? false : { opacity: 0.3, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.07, ease: 'easeOut' }}
        >
          {monogram}
        </motion.span>
      </motion.div>
    </div>
  );
}

function Reel({
  label,
  value,
  sub,
  highlight,
  accent,
  small,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight: boolean;
  accent: string;
  small?: boolean;
}) {
  return (
    <motion.div
      className={`kb-card rounded-[var(--kb-r-md)] border p-4 text-center overflow-hidden min-h-[112px] flex flex-col justify-center ${
        highlight ? 'border-kb-gold/35' : 'border-kb-border'
      }`}
      style={{
        background: highlight
          ? `color-mix(in srgb, ${accent} 10%, var(--kb-bg-card))`
          : undefined,
        borderColor: highlight ? `color-mix(in srgb, ${accent} 45%, transparent)` : undefined,
      }}
    >
      <p className="text-[9px] uppercase tracking-[0.3em] text-kb-mute mb-2 font-semibold">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.3, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.05 }}
        className={`font-display tracking-wide leading-tight ${
          small ? 'text-[0.95rem] px-1' : 'text-4xl'
        } ${highlight ? '' : 'text-kb-fg'}`}
        style={highlight ? { color: accent } : undefined}
      >
        {value}
      </motion.p>
      {sub && (
        <p className="text-[10px] text-kb-faint mt-1.5 uppercase tracking-wider">{sub}</p>
      )}
    </motion.div>
  );
}
