import type { CardStatBreakdown } from '@/golden-road/engine/player-power';
import { formatKda } from '@/golden-road/engine/player-power';

interface StatBreakdownProps {
  stats: CardStatBreakdown;
  compact?: boolean;
}

export function StatBreakdown({ stats, compact }: StatBreakdownProps) {
  const chips = [
    { label: 'KDA', value: formatKda(stats.kda) },
    { label: 'KP', value: `${Math.round(stats.killParticipation)}%` },
    { label: 'DMG', value: `${stats.damagePct.toFixed(0)}%` },
    { label: 'WR', value: `${Math.round(stats.winRate)}%` },
    { label: 'GP', value: String(Math.round(stats.games)) },
  ];

  return (
    <div
      className={`flex flex-wrap gap-1.5 ${compact ? '' : 'pt-2.5 border-t border-kb-hairline mt-2.5'}`}
    >
      {chips.map(({ label, value }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded-md bg-kb-glass border border-kb-border px-2 py-0.5 text-[10px] tabular-nums"
        >
          <span className="text-kb-faint uppercase tracking-wider">{label}</span>
          <span className="text-kb-soft font-medium">{value}</span>
        </span>
      ))}
      {stats.confidence === 'estimated' && (
        <span className="inline-flex items-center rounded-md bg-kb-amber/10 border border-kb-amber/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-kb-amber/90">
          ~est.
        </span>
      )}
    </div>
  );
}
