import { cn } from '@/lib/utils';

const STOP_WORDS = new Set([
  'gaming',
  'clan',
  'nation',
  'esports',
  'team',
  'gg',
  'the',
]);

/** Derive a 2-3 letter org monogram from a team name (no fake assets). */
export function teamMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const significant = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
  const base = significant.length ? significant : words;

  if (base.length >= 2) {
    return base
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
  }

  return (base[0] ?? name).replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
}

interface TeamCrestProps {
  teamName: string;
  accent: string;
  /** Edge length in px. */
  size?: number;
  className?: string;
}

/**
 * Flat monogram crest in the team's accent color. A tasteful stand-in for a
 * real logo: accent tint over the inset well, accent hairline, Anton monogram.
 * No gradient, no glow, no fabricated image URLs.
 */
export function TeamCrest({ teamName, accent, size = 44, className }: TeamCrestProps) {
  const mono = teamMonogram(teamName);

  return (
    <div
      className={cn(
        'flex items-center justify-center font-display leading-none shrink-0 select-none',
        className
      )}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--kb-r-md)',
        background: `color-mix(in srgb, ${accent} 16%, var(--kb-bg-inset))`,
        border: `1px solid color-mix(in srgb, ${accent} 38%, transparent)`,
        boxShadow: 'var(--kb-shadow-sm)',
        color: accent,
        fontSize: Math.round(size * 0.36),
        letterSpacing: '0.02em',
      }}
      aria-hidden
    >
      {mono}
    </div>
  );
}
