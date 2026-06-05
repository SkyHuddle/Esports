import { forwardRef } from 'react';
import type { DraftPick, GameMode, SimulationResult } from '../core/types';
import { sortPicksBySlot } from '../core/constants';
import { cardOverall } from '../engine/card-context';

interface ShareCardProps {
  picks: DraftPick[];
  result: SimulationResult;
  mode: GameMode;
  dailyTitle?: string;
}

function ovrColor(ovr: number): string {
  if (ovr >= 94) return 'var(--kb-gold)';
  if (ovr >= 90) return 'var(--kb-gold-deep)';
  return 'var(--kb-fg-soft)';
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ picks, result, mode, dailyTitle }, ref) {
    const sorted = sortPicksBySlot(picks);
    const avgOvr = picks.reduce((s, p) => s + cardOverall(p.player, p.team), 0) / picks.length;
    const isWin = result.majorWon || result.perfectRun;
    const grade = result.chemistry.grade;
    const headline = result.majorSummary.runTitle;

    return (
      <div
        ref={ref}
        className="w-full max-w-[360px] rounded-[var(--kb-r-xl)] overflow-hidden border border-kb-border kb-card"
      >
        <div className="p-5 flex flex-col gap-4">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-kb-gold/70 mb-1 font-semibold">
              Major Run {mode === 'daily' && dailyTitle ? `· ${dailyTitle}` : ''}
            </p>
            <p
              className={`font-display text-xl tracking-wide ${
                isWin ? 'text-ring-gold' : 'text-kb-fg'
              }`}
            >
              {headline}
            </p>
          </div>

          <div
            className={`rounded-[var(--kb-r-md)] border px-4 py-4 text-center ${
              isWin
                ? 'border-kb-gold/35 bg-kb-gold/8'
                : 'border-kb-border bg-kb-glass'
            }`}
          >
            <p
              className={`font-display text-4xl tabular-nums leading-none ${
                isWin ? 'text-ring-gold' : 'text-kb-fg'
              }`}
            >
              {result.majorSummary.record}
            </p>
            <p className="text-[11px] text-kb-soft mt-2 leading-relaxed">
              {result.majorSummary.tagline}
            </p>
            {!isWin && result.failureMessage && (
              <p className="text-[10px] text-kb-amber/80 mt-2">{result.failureMessage}</p>
            )}
          </div>

          <div className="space-y-0 border-t border-kb-hairline pt-3">
            {sorted.map((pick) => {
              const ovr = cardOverall(pick.player, pick.team);
              return (
                <div
                  key={`${pick.team.id}-${pick.player.id}`}
                  className="flex items-center gap-2.5 py-2 border-b border-kb-hairline last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: `${pick.team.accent}22`,
                      color: pick.team.accent,
                      border: `1px solid ${pick.team.accent}33`,
                    }}
                  >
                    {pick.player.gamertag.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-kb-fg truncate font-medium">
                      {pick.player.gamertag}
                    </p>
                    <p className="text-[9px] text-kb-mute truncate">
                      {pick.team.season} {pick.team.teamName}
                    </p>
                  </div>
                  <span
                    className="font-display text-lg tabular-nums shrink-0"
                    style={{ color: ovrColor(ovr) }}
                  >
                    {ovr}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center border-t border-kb-hairline pt-3">
            <StatBlock label="MVP" value={result.mvp.gamertag} />
            <StatBlock label="OVR" value={avgOvr.toFixed(1)} highlight />
            <StatBlock label="Chem" value={grade} highlight />
          </div>

          <p className="text-center text-[9px] uppercase tracking-[0.35em] text-kb-faint">
            Major Run · CS2 Esports
          </p>
        </div>
      </div>
    );
  }
);

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
    <div className="min-w-0">
      <p className="text-[8px] uppercase tracking-wider text-kb-mute">{label}</p>
      <p
        className={`font-display text-sm mt-0.5 tabular-nums truncate ${
          highlight ? 'text-kb-gold' : 'text-kb-fg'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
