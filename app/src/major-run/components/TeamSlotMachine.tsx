import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SlotSpin } from '../core/types';
import { DRAFT_ROUNDS, SPIN_TICK_MS } from '../core/constants';
import { CS_TEAMS } from '../data/teams';
import { hapticTap } from '@/utils/haptics';

/** Real team accents keyed by team name (first occurrence wins). */
const ACCENT_BY_NAME: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const t of CS_TEAMS) {
    if (!map.has(t.teamName)) map.set(t.teamName, t.accent);
  }
  return map;
})();

/** Tasteful monogram from a real team name: initials of words, else first 3 chars. */
function teamMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

interface TeamSlotMachineProps {
  spin: SlotSpin;
  spinKey: number;
  roundIndex: number;
  onComplete: () => void;
}

export function TeamSlotMachine({
  spin,
  spinKey,
  roundIndex,
  onComplete,
}: TeamSlotMachineProps) {
  const pickNumber = roundIndex + 1;
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setIndex(0);
  }, [spinKey, spin]);

  useEffect(() => {
    const totalTicks = spin.yearSequence.length;
    if (totalTicks === 0) {
      onCompleteRef.current();
      return;
    }

    let tick = 0;
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    interval = setInterval(() => {
      if (cancelled) return;
      tick += 1;
      setIndex(tick - 1);

      if (tick >= totalTicks) {
        if (interval) clearInterval(interval);
        hapticTap();
        onCompleteRef.current();
      }
    }, SPIN_TICK_MS);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [spinKey, spin.yearSequence.length]);

  const year = spin.yearSequence[index] ?? spin.yearSequence.at(-1) ?? '';
  const name = spin.nameSequence[index] ?? '';
  const region = spin.regionSequence[index] ?? '';
  const progress = spin.yearSequence.length ? (index + 1) / spin.yearSequence.length : 1;
  const accent = ACCENT_BY_NAME.get(name) ?? 'var(--kb-steel)';
  const mono = name ? teamMonogram(name) : '';

  return (
    <div className="flex flex-col items-center justify-center min-h-[54dvh] px-5 pb-10 relative w-full">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[10px] uppercase tracking-[0.45em] text-kb-gold/80 mb-2 font-semibold">
          Pick {pickNumber} of {DRAFT_ROUNDS}
        </p>
      </motion.div>

      <div className="mb-6 flex flex-col items-center">
        <p className="text-[9px] uppercase tracking-[0.32em] text-kb-mute mb-3 font-semibold">
          Rolling teams
        </p>
        <motion.div
          key={reduceMotion ? 'crest' : `${index}-${name}`}
          initial={reduceMotion ? false : { scale: 0.84, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.13, ease: [0.22, 1, 0.36, 1] }}
          className="w-[88px] h-[88px] rounded-[var(--kb-r-lg)] flex items-center justify-center font-display text-3xl tracking-wide select-none"
          style={{
            background: `color-mix(in srgb, ${accent} 18%, var(--kb-bg-inset))`,
            border: `1px solid color-mix(in srgb, ${accent} 42%, transparent)`,
            color: accent,
            boxShadow: 'var(--kb-shadow-card)',
          }}
        >
          {mono}
        </motion.div>
      </div>

      <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
        <Reel label="Year" value={String(year)} />
        <Reel label="Team" value={name} sub={region} small />
      </div>

      <div className="kb-card w-full max-w-sm rounded-[var(--kb-r-lg)] border border-kb-border px-5 py-5">
        <div className="h-1.5 rounded-full bg-kb-glass-strong overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-kb-border"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Reel({
  label,
  value,
  sub,
  small,
}: {
  label: string;
  value: string;
  sub?: string;
  small?: boolean;
}) {
  return (
    <motion.div className="kb-card rounded-[var(--kb-r-md)] border border-kb-border p-4 text-center overflow-hidden min-h-[112px] flex flex-col justify-center">
      <p className="text-[9px] uppercase tracking-[0.3em] text-kb-mute mb-2 font-semibold">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.35, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.05 }}
        className={`font-display tracking-wide leading-tight text-kb-fg ${
          small ? 'text-[0.95rem] px-1' : 'text-4xl'
        }`}
      >
        {value}
      </motion.p>
      {sub && <p className="text-[10px] text-kb-mute mt-1.5 uppercase tracking-wider">{sub}</p>}
    </motion.div>
  );
}
