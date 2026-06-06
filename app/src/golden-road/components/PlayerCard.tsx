import { motion } from 'framer-motion';
import type { Player } from '@/golden-road/core/types';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  onSelect: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export function PlayerCard({ player, onSelect, disabled, selected }: PlayerCardProps) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'kb-card relative w-full text-left rounded-[var(--kb-r-md)] p-4 transition-all duration-200',
        'active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none',
        selected
          ? 'border-kb-gold/45 ring-1 ring-kb-gold/20'
          : 'border-kb-border hover:border-kb-border-strong'
      )}
      style={{
        background: selected
          ? `color-mix(in srgb, ${player.accent} 9%, var(--kb-bg-card))`
          : 'var(--kb-bg-card)',
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      layout
    >
      <div className="flex gap-4 items-center relative z-10">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
          style={{
            background: `color-mix(in srgb, ${player.accent} 18%, var(--kb-bg-inset))`,
            border: `1px solid color-mix(in srgb, ${player.accent} 38%, transparent)`,
            color: player.accent,
          }}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl text-kb-fg truncate">{player.name}</h3>
          <p className="text-kb-gold/80 text-sm font-medium mt-0.5">
            {player.peakTeam} ({player.peakYear})
          </p>
          <p className="text-kb-mute text-xs mt-1 line-clamp-2 leading-relaxed">{player.achievements}</p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-display text-kb-gold tabular-nums">{player.ratings.overall}</span>
          <p className="text-[10px] uppercase tracking-widest text-kb-faint mt-0.5">OVR</p>
        </div>
      </div>
    </motion.button>
  );
}
