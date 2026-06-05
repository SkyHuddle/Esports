import type { PlayerRatings } from '../core/types';

interface StatBreakdownProps {
  ratings: PlayerRatings;
  compact?: boolean;
}

export function StatBreakdown({ ratings, compact }: StatBreakdownProps) {
  const chips = [
    { label: 'FP', value: String(ratings.firepower) },
    { label: 'MECH', value: String(ratings.mechanical) },
    { label: 'CLT', value: String(ratings.clutch) },
    { label: 'LAN', value: String(ratings.lan) },
    { label: 'PO', value: String(ratings.playoffs) },
    { label: 'MAJ', value: String(ratings.majorExperience) },
    { label: 'IGL', value: String(ratings.leadership) },
    { label: 'AWP', value: String(ratings.awpAbility) },
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
    </div>
  );
}
