import { motion } from 'framer-motion';
import type { Player, Role } from '@/golden-road/core/types';
import { ROLE_LABELS } from '@/golden-road/core/types';

interface PositionAssignSheetProps {
  player: Player;
  naturalRole: Role;
  openRoles: Role[];
  onAssign: (role: Role) => void;
  onCancel: () => void;
}

export function PositionAssignSheet({
  player,
  naturalRole,
  openRoles,
  onAssign,
  onCancel,
}: PositionAssignSheetProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm px-4 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="kb-card w-full max-w-lg rounded-[var(--kb-r-xl)] p-5 border border-kb-gold/20"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] uppercase tracking-widest text-kb-gold/80">Assign position</p>
        <h3 className="font-display text-2xl text-kb-fg mt-1">{player.name}</h3>
        <p className="text-kb-mute text-xs mt-1">
          Played {ROLE_LABELS[naturalRole]} on this team · pick an open slot
        </p>

        <div className="grid grid-cols-2 gap-2 mt-5">
          {openRoles.map((role) => {
            const isNatural = role === naturalRole;
            return (
              <button
                key={role}
                type="button"
                onClick={() => onAssign(role)}
                className={`h-14 rounded-[var(--kb-r-md)] font-display text-lg transition-colors ${
                  isNatural
                    ? 'bg-kb-gold/15 border border-kb-gold/50 text-kb-gold'
                    : 'bg-kb-glass border border-kb-border text-kb-fg hover:border-kb-border-strong'
                }`}
              >
                {ROLE_LABELS[role]}
                {isNatural && (
                  <span className="block text-[9px] font-sans font-normal text-kb-gold/70 uppercase tracking-wider">
                    Natural
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-4 text-sm text-kb-mute py-2 hover:text-kb-soft transition-colors"
        >
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}
