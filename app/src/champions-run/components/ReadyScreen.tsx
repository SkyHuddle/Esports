import { motion } from 'framer-motion';
import type { DraftPick } from '../core/types';
import { SLOT_LABELS } from '../core/types';
import { sortPicksBySlot } from '../core/constants';
import { ChampionsPath } from './ChampionsPath';
import { evaluateChemistry } from '../engine/chemistry';
import { cardOverall } from '../engine/card-context';
import { KbCard } from '@/components/kb/KbCard';
import { KbCtaButton } from '@/components/kb/KbCtaButton';
import { hapticTap } from '@/utils/haptics';

interface ReadyScreenProps {
  picks: DraftPick[];
  isDaily?: boolean;
  onAttempt: () => void;
  onEdit: () => void;
}

function ovrColor(ovr: number): string {
  if (ovr >= 94) return 'var(--kb-gold)';
  if (ovr >= 90) return 'var(--kb-gold-deep)';
  return 'var(--kb-fg-soft)';
}

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ReadyScreen({ picks, isDaily, onAttempt, onEdit }: ReadyScreenProps) {
  const sorted = sortPicksBySlot(picks);
  const avgOvr =
    picks.reduce((s, p) => s + cardOverall(p.player, p.team), 0) / picks.length;
  const chemistry = evaluateChemistry(picks);

  const handleAttempt = () => {
    hapticTap();
    onAttempt();
  };

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 py-10 max-w-lg mx-auto justify-between">
      <div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: easeOut }}
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-kb-gold/80">Roster locked</p>
          <h2 className="font-display text-4xl text-kb-fg mt-2">MAJOR RUN</h2>
          <p className="text-kb-mute text-xs mt-2 max-w-[260px] mx-auto leading-relaxed">
            Clear Opening → Elimination → Quarters → Semis → Grand Final. Can this roster win a Major?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, ease: easeOut }}
        >
          <KbCard accent="gold" className="mt-5 p-5">
            <div className="mb-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-kb-mute">Card avg OVR</p>
              <p
                className="font-display text-4xl tabular-nums mt-1"
                style={{ color: ovrColor(avgOvr) }}
              >
                {avgOvr.toFixed(1)}
              </p>
              <p className="text-[10px] text-kb-gold/80 mt-2 font-semibold uppercase tracking-wider">
                Chemistry {chemistry.grade}
              </p>
            </div>
            <div className="mb-3">
              <ChampionsPath variant="full" />
            </div>
            {chemistry.modifiers.length > 0 && (
              <p className="text-[10px] text-kb-gold/70 text-center font-medium">
                {chemistry.modifiers.slice(0, 2).join(' · ')}
              </p>
            )}
            {chemistry.issues.length > 0 && (
              <p className="text-[10px] text-kb-amber/80 text-center mt-1">
                {chemistry.issues[0]}
              </p>
            )}
          </KbCard>
        </motion.div>

        <motion.div
          className="mt-5 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
        >
          {sorted.map(({ player, team, role }, i) => {
            const ovr = cardOverall(player, team);
            return (
              <motion.div
                key={`${team.id}-${player.id}`}
                className="kb-card flex items-center gap-3.5 p-3 rounded-[var(--kb-r-md)]"
                style={{
                  background: `color-mix(in srgb, ${team.accent} 7%, var(--kb-bg-card))`,
                  borderColor: `${team.accent}26`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14 + i * 0.04 }}
              >
                <div
                  className="w-12 h-12 rounded-[14px] overflow-hidden flex items-center justify-center text-sm font-bold shrink-0 leading-none"
                  style={{
                    background: `${team.accent}22`,
                    color: team.accent,
                    border: `1px solid ${team.accent}35`,
                  }}
                >
                  {player.gamertag.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-kb-mute uppercase tracking-wider">{SLOT_LABELS[role]}</p>
                  <p className="font-display text-base text-kb-fg truncate">{player.gamertag}</p>
                  <p className="text-[10px] text-kb-mute truncate">
                    {team.season} {team.teamName}
                  </p>
                </div>
                <span
                  className="font-display text-xl tabular-nums shrink-0"
                  style={{ color: ovrColor(ovr) }}
                >
                  {ovr}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        className="space-y-3 pb-4 pt-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: easeOut }}
      >
        <KbCtaButton onClick={handleAttempt} variant="gold" className="h-14 text-base">
          ATTEMPT MAJOR RUN
        </KbCtaButton>
        {!isDaily && (
          <button
            type="button"
            onClick={onEdit}
            className="w-full text-sm text-kb-mute hover:text-kb-soft py-2 transition-colors"
          >
            Redraft last pick
          </button>
        )}
        {isDaily && (
          <p className="text-center text-[10px] text-kb-faint py-1">
            Daily locked. No redrafts or respins.
          </p>
        )}
      </motion.div>
    </div>
  );
}
