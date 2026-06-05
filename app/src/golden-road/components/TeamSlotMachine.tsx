import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { HistoricalTeam, SlotSpin } from '@/golden-road/core/types';
import { DRAFT_PHASE_LABELS } from '@/golden-road/core/types';
import type { DraftTournamentPhase } from '@/golden-road/core/types';
import { SPIN_TICK_MS } from '@/golden-road/core/constants';
import { hapticTap } from '@/utils/haptics';

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[54dvh] px-5 pb-10">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[10px] uppercase tracking-[0.45em] text-kb-gold/80 mb-2 font-semibold">
          {DRAFT_PHASE_LABELS[phase]}
        </p>
        <p className="text-kb-mute text-sm">Rolling your team…</p>
      </motion.div>

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
          ? `linear-gradient(160deg, ${accent}18 0%, var(--kb-bg-card) 100%)`
          : undefined,
        borderColor: highlight ? `${accent}40` : undefined,
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
