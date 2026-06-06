import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SlotSpin } from '../core/types';
import { SPIN_TICK_MS } from '../core/constants';
import { getAllTeams } from '../data';
import { hapticTap } from '../utils/haptics';
import { TeamCrest } from './TeamCrest';

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
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const reduceMotion = useReducedMotion();

  const accentByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of getAllTeams()) map.set(t.teamName, t.accent);
    return map;
  }, []);

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
  const accent = (name && accentByName.get(name)) || 'var(--kb-fg-mute)';
  const progress = spin.yearSequence.length ? (index + 1) / spin.yearSequence.length : 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[54dvh] px-5 pb-10 relative w-full">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[10px] uppercase tracking-[0.45em] text-kb-gold/80 mb-1.5 font-semibold">
          Pick {pickNumber} of 4
        </p>
        <p className="text-[9px] uppercase tracking-[0.3em] text-kb-mute font-semibold">
          Rolling a team-year
        </p>
      </motion.div>

      {/* Flashing team crest — cycles logos in sync with the names */}
      <div className="mb-7 flex items-center justify-center" style={{ minHeight: 84 }}>
        <motion.div
          key={reduceMotion ? 'crest' : `${name}:${index}`}
          initial={reduceMotion ? false : { opacity: 0.45, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <TeamCrest teamName={name || '?'} accent={accent} size={84} />
        </motion.div>
      </div>

      <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
        <Reel label="Year" value={String(year)} />
        <Reel label="Team" value={name} sub={region} small />
      </div>

      <div className="kb-card w-full max-w-sm rounded-[var(--kb-r-lg)] border border-kb-border px-5 py-5">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--kb-bg-inset)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: 'color-mix(in srgb, var(--kb-gold) 65%, transparent)',
            }}
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
