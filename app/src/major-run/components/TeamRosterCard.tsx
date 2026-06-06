import { motion } from 'framer-motion';
import type { CsPlayer, HistoricalCsTeam, RosterSlot } from '../core/types';
import { SLOT_LABELS } from '../core/types';
import { cardOverall } from '../engine/card-context';
import { cn } from '@/lib/utils';

interface TeamRosterCardProps {
  player: CsPlayer;
  team: HistoricalCsTeam;
  teamRole: RosterSlot;
  onSelect: () => void;
  disabled?: boolean;
  roleTaken?: boolean;
}

function ovrAccent(overall: number): string {
  if (overall >= 88) return 'var(--kb-gold)';
  if (overall >= 80) return 'var(--kb-amber)';
  return 'var(--kb-fg-mute)';
}

function ovrTier(overall: number): string {
  if (overall >= 88) return 'Legend';
  if (overall >= 80) return 'Elite';
  if (overall >= 72) return 'Star';
  return 'Solid';
}

export function TeamRosterCard({
  player,
  team,
  teamRole,
  onSelect,
  disabled,
  roleTaken,
}: TeamRosterCardProps) {
  const overall = cardOverall(player, team);
  const ovrColor = ovrAccent(overall);
  const tier = ovrTier(overall);
  const initials = player.gamertag.slice(0, 2).toUpperCase();

  return (
    <motion.div
      layout
      className={cn(
        'kb-card relative w-full rounded-[var(--kb-r-md)] transition-all duration-200',
        disabled
          ? 'border-kb-hairline opacity-40 pointer-events-none'
          : 'border-kb-border hover:border-kb-border-strong',
        roleTaken && 'opacity-35'
      )}
      style={{
        background: `linear-gradient(145deg, ${player.accent}1e 0%, ${player.accent}08 45%, var(--kb-bg-card) 100%)`,
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        style={{ touchAction: 'manipulation' }}
        className="w-full text-left p-3.5 pl-4 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: `${player.accent}18`,
              border: `1px solid ${player.accent}30`,
              color: player.accent,
            }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span
                className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  color: player.accent,
                  backgroundColor: `${player.accent}12`,
                  border: `1px solid ${player.accent}22`,
                }}
              >
                {SLOT_LABELS[teamRole]}
              </span>
              <span
                className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                style={{
                  color: ovrColor,
                  borderColor: `${ovrColor}35`,
                  backgroundColor: `${ovrColor}10`,
                }}
              >
                {tier}
              </span>
              {player.majorWins > 0 && (
                <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-kb-gold/25 bg-kb-gold/10 text-kb-gold/90">
                  {player.majorWins === 1 ? '1 Major' : `${player.majorWins} Majors`}
                </span>
              )}
            </div>
            <p className="font-display text-lg text-kb-fg truncate leading-tight">{player.gamertag}</p>
            <p className="text-[10px] text-kb-mute mt-0.5">
              {team.season} {team.teamName}
            </p>
          </div>

          <div className="text-right shrink-0 pl-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-kb-faint mb-0.5">OVR</p>
            <span className="font-display text-3xl tabular-nums leading-none" style={{ color: ovrColor }}>
              {overall}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

interface TeamBannerProps {
  team: HistoricalCsTeam;
  rosterAvgOvr?: number;
}

const TIER_BADGE: Record<string, string> = {
  legendary: 'Legend',
  elite: 'Elite',
  strong: 'Strong',
  solid: 'Solid',
  underdog: 'Underdog',
};

export function TeamBanner({ team, rosterAvgOvr }: TeamBannerProps) {
  return (
    <motion.div
      key={team.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="kb-card rounded-[var(--kb-r-lg)] p-5 mb-4"
      style={{
        background: `linear-gradient(135deg, ${team.accent}14 0%, var(--kb-bg-card) 100%)`,
        border: `1px solid ${team.accent}26`,
      }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <p className="text-[10px] uppercase tracking-[0.25em] text-kb-mute">
            {team.region} · {team.season}
          </p>
          <span
            className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-medium ${
              team.tier === 'underdog'
                ? 'bg-kb-crimson/12 text-kb-crimson border border-kb-crimson/25'
                : team.tier === 'legendary'
                  ? 'bg-kb-gold/15 text-kb-gold border border-kb-gold/25'
                  : 'bg-kb-glass text-kb-soft border border-kb-border'
            }`}
          >
            {TIER_BADGE[team.tier]}
          </span>
          {team.isMajorWinner && (
            <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-medium bg-kb-gold/10 text-kb-gold/90 border border-kb-gold/20">
              Major Winner
            </span>
          )}
        </div>
        <h3 className="font-display text-3xl text-kb-fg leading-none truncate">{team.teamName}</h3>
        <p className="text-sm mt-1.5 font-medium" style={{ color: team.accent }}>
          {team.tagline}
        </p>
        {rosterAvgOvr != null && rosterAvgOvr > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-kb-glass border border-kb-border px-2.5 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-kb-mute">Avg</span>
            <span
              className="font-display text-xl tabular-nums leading-none"
              style={{ color: ovrAccent(rosterAvgOvr) }}
            >
              {Math.round(rosterAvgOvr)}
            </span>
            <span className="text-[10px] text-kb-faint">OVR</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
