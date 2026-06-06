import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { HistoricalTeam, Player, Role } from '@/golden-road/core/types';
import { ROLE_LABELS } from '@/golden-road/core/types';
import {
  cardKda,
  cardOverall,
  cardStatBreakdown,
  cardStatConfidence,
  formatKda,
} from '@/golden-road/engine/player-power';
import { getOvrTier, ovrAccentColor } from '@/golden-road/engine/ovr-display';
import { accomplishmentFromTagline, ACCOMPLISHMENT_LABEL } from '@/golden-road/data/teams/accomplishment';
import { StatBreakdown } from './StatBreakdown';
import { cn } from '@/lib/utils';

interface TeamRosterCardProps {
  player: Player;
  team: HistoricalTeam;
  teamRole: Role;
  onSelect: () => void;
  disabled?: boolean;
  roleTaken?: boolean;
}

export function TeamRosterCard({
  player,
  team,
  teamRole,
  onSelect,
  disabled,
  roleTaken,
}: TeamRosterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const kda = cardKda(player, team);
  const overall = cardOverall(player, team);
  const stats = cardStatBreakdown(player, team);
  const confidence = cardStatConfidence(player, team);
  const ovrColor = ovrAccentColor(overall);
  const tier = getOvrTier(overall);
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <motion.div
      layout
      className={cn(
        'kb-card relative w-full rounded-[var(--kb-r-md)] overflow-hidden transition-all duration-200',
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
              background: `linear-gradient(145deg, ${player.accent}35 0%, ${player.accent}08 100%)`,
              border: `1px solid ${player.accent}40`,
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
                  backgroundColor: `${player.accent}15`,
                  border: `1px solid ${player.accent}25`,
                }}
              >
                {ROLE_LABELS[teamRole]}
              </span>
              <span
                className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                style={{
                  color: ovrColor,
                  borderColor: `${ovrColor}40`,
                  backgroundColor: `${ovrColor}12`,
                }}
              >
                {tier}
              </span>
            </div>
            <p className="font-display text-lg text-kb-fg truncate leading-tight">{player.name}</p>
            <p className="text-[10px] text-kb-mute mt-0.5">
              {team.year} {team.name}
            </p>
          </div>

          <div className="text-right shrink-0 pl-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-kb-faint mb-0.5">OVR</p>
            <span className="font-display text-3xl tabular-nums leading-none" style={{ color: ovrColor }}>
              {confidence === 'estimated' ? '~' : ''}
              {overall}
            </span>
            {kda != null && (
              <p className="text-[10px] text-kb-faint tabular-nums mt-1">{formatKda(kda)} KDA</p>
            )}
          </div>
        </div>
      </button>

      {stats && (
        <div className="px-4 pb-3 -mt-0.5">
          <button
            type="button"
            onClick={handleExpand}
            className="flex items-center gap-1 text-[10px] text-kb-mute hover:text-kb-soft transition-colors"
          >
            <ChevronDown className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
            {expanded ? 'Hide stats' : 'View stats'}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <StatBreakdown stats={stats} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

interface TeamBannerProps {
  team: HistoricalTeam;
  rosterAvgOvr?: number;
}

const TIER_BADGE: Record<string, string> = {
  legend: 'Legend',
  contender: 'Contender',
  average: 'Average',
  weak: 'Underdog',
};

export function TeamBanner({ team, rosterAvgOvr }: TeamBannerProps) {
  const accomplishment = accomplishmentFromTagline(team.tagline);
  const accomplishmentLabel = ACCOMPLISHMENT_LABEL[accomplishment];

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
            {team.region} · {team.year}
          </p>
          <span
            className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-medium ${
              team.tier === 'weak'
                ? 'bg-kb-crimson/12 text-kb-crimson border border-kb-crimson/25'
                : team.tier === 'legend'
                  ? 'bg-kb-gold/15 text-kb-gold border border-kb-gold/25'
                  : 'bg-kb-glass text-kb-soft border border-kb-border'
            }`}
          >
            {TIER_BADGE[team.tier]}
          </span>
          {accomplishmentLabel && (
            <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-medium bg-kb-gold/10 text-kb-gold/90 border border-kb-gold/20">
              {accomplishmentLabel}
            </span>
          )}
        </div>
        <h3 className="font-display text-3xl text-kb-fg leading-none truncate">{team.name}</h3>
        <p className="text-sm mt-1.5 font-medium" style={{ color: team.accent }}>
          {team.tagline}
        </p>
        {rosterAvgOvr != null && rosterAvgOvr > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-kb-glass border border-kb-border px-2.5 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-kb-mute">Avg</span>
            <span
              className="font-display text-xl tabular-nums leading-none"
              style={{ color: ovrAccentColor(rosterAvgOvr) }}
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
