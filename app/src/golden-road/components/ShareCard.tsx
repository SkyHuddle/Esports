import { forwardRef } from 'react';
import type { DraftPick, SimulationResult } from '@/golden-road/core/types';
import { ROLE_LABELS } from '@/golden-road/core/types';
import { sortPicksByRole } from '@/golden-road/core/constants';
import { cardOverall } from '@/golden-road/engine/player-power';
import { ovrAccentColor } from '@/golden-road/engine/ovr-display';
import { buildGoldenRoadSummary } from '@/golden-road/engine/run-summary';

interface ShareCardProps {
  picks: DraftPick[];
  result: SimulationResult;
  mode: 'free' | 'daily';
  dailyTitle?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { picks, result, mode, dailyTitle },
  ref
) {
  const achieved = result.goldenRoad;
  const orderedPicks = sortPicksByRole(picks);
  const summary = buildGoldenRoadSummary(result);
  const avgOvr = orderedPicks.reduce((s, p) => s + cardOverall(p.player, p.team), 0) / orderedPicks.length;

  return (
    <div
      ref={ref}
        className="w-full max-w-[360px] rounded-[var(--kb-r-xl)] overflow-hidden border border-kb-border kb-card"
      >
        <div className="p-5 flex flex-col gap-4">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-kb-gold/70 mb-1 font-semibold">
            Golden Road {mode === 'daily' && dailyTitle ? `· ${dailyTitle}` : ''}
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-kb-mute mb-2">
            {summary.runTitle}
          </p>
          <p
            className={`font-display text-2xl sm:text-[1.65rem] leading-tight ${
              achieved ? 'text-ring-gold' : 'text-kb-fg'
            }`}
          >
            {achieved ? 'GOLDEN ROAD' : result.failureMessage.toUpperCase()}
          </p>
          <p className="font-display text-lg tabular-nums mt-1 text-kb-gold">
            {result.seriesRecord}
          </p>
          <p className="font-display text-sm tabular-nums mt-1 text-kb-mute">
            {result.stageRecord} stages cleared · {avgOvr.toFixed(0)} avg OVR
          </p>
        </div>

        <div className="space-y-0 border-t border-kb-hairline pt-3">
          {orderedPicks.map(({ role, player, team }) => {
            const ovr = cardOverall(player, team);
            return (
              <div
                key={role}
                className="flex items-center gap-2.5 py-2 border-b border-kb-hairline last:border-0"
              >
                <span className="text-[9px] uppercase tracking-widest text-kb-faint w-12 shrink-0">
                  {ROLE_LABELS[role]}
                </span>
                <span className="font-display text-sm text-kb-fg flex-1 truncate">{player.name}</span>
                <span className="font-display text-lg tabular-nums shrink-0" style={{ color: ovrAccentColor(ovr) }}>
                  {ovr}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center border-t border-kb-hairline pt-4">
          <StatBlock label="Record" value={result.seriesRecord} highlight />
          <StatBlock label="MSI" value={String(result.titleCounts.msi)} />
          <StatBlock label="Worlds" value={String(result.titleCounts.worlds)} />
          <StatBlock label="Score" value={result.rosterScore.toFixed(1)} />
        </div>

        <p className="text-center text-[9px] uppercase tracking-[0.35em] text-kb-faint">
          Golden Road · LoL Esports
        </p>
      </div>
    </div>
  );
});

function StatBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-kb-faint">{label}</p>
      <p className={`font-display text-lg mt-0.5 tabular-nums ${highlight ? 'text-kb-gold' : 'text-kb-fg'}`}>
        {value}
      </p>
    </div>
  );
}
