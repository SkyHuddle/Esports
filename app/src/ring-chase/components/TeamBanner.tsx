import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { HistoricalCodTeam } from '../core/types';
import { cardCredentials } from '../engine/card-context';

const TIER_LABEL: Record<HistoricalCodTeam['tier'], string> = {
  legendary: 'Dynasty',
  elite: 'Elite',
  strong: 'Strong',
  solid: 'Solid',
  underdog: 'Trap card',
};

interface TeamBannerProps {
  team: HistoricalCodTeam;
  rosterAvgOvr?: number;
}

export function TeamBanner({ team, rosterAvgOvr }: TeamBannerProps) {
  const creds = cardCredentials(team);

  return (
    <motion.div
      key={team.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="kb-card rounded-[var(--kb-r-lg)] p-5 mb-5"
      style={{
        background: `linear-gradient(135deg, ${team.accent}14 0%, var(--kb-bg-card) 100%)`,
        border: `1px solid ${team.accent}26`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <p className="text-[10px] uppercase tracking-[0.25em] text-kb-mute">
              {team.region} · {team.gameTitle} · {team.season}
            </p>
          </div>
          <div className="flex items-baseline gap-2.5 mb-1 flex-wrap">
            <h3 className="font-display text-2xl sm:text-3xl text-kb-fg tracking-wide leading-none truncate">
              {team.teamName}
            </h3>
            <span
              className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-medium shrink-0 ${
                team.tier === 'legendary'
                  ? 'bg-ring-gold/15 text-ring-gold border border-ring-gold/25'
                  : team.tier === 'underdog'
                    ? 'bg-kb-amber/12 text-kb-amber border border-kb-amber/25'
                    : 'bg-kb-glass text-kb-soft border border-kb-border'
              }`}
            >
              {TIER_LABEL[team.tier]}
            </span>
            {creds.ringsThisYear > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase px-2 py-0.5 rounded-full font-medium bg-ring-gold/10 text-ring-gold/90 border border-ring-gold/20 shrink-0">
                <Trophy className="w-3 h-3" />
                Ring
              </span>
            )}
          </div>
          <p className="text-sm font-medium" style={{ color: team.accent }}>
            {team.eventContext}
          </p>
          <p className="text-[10px] text-kb-mute mt-0.5">{creds.detail}</p>
          {rosterAvgOvr != null && rosterAvgOvr > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-kb-glass border border-kb-border px-2.5 py-1.5">
              <span className="text-[10px] uppercase tracking-wider text-kb-mute">Avg</span>
              <span className="font-display text-xl tabular-nums leading-none text-kb-gold">
                {Math.round(rosterAvgOvr)}
              </span>
              <span className="text-[10px] text-kb-faint">OVR</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
