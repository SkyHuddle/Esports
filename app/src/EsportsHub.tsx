import { Link } from 'react-router';
import { Flame, Trophy, Crosshair, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  sport: string;
  tagline: string;
  picks: number;
  prize: string;
  href: string;
  accent: string;
  Icon: LucideIcon;
}

const games: Game[] = [
  {
    id: 'ring-chase',
    title: 'Ring Chase',
    sport: 'Call of Duty',
    tagline: 'Draft four legends from iconic team-years. Chase the ring.',
    picks: 4,
    prize: 'Championship ring',
    href: '/ring-chase',
    accent: '#f5631a',
    Icon: Flame,
  },
  {
    id: 'golden-road',
    title: 'Golden Road',
    sport: 'League of Legends',
    tagline: 'Build a Worlds run from legendary eras. Lift the trophy.',
    picks: 5,
    prize: 'Worlds champion',
    href: '/golden-road',
    accent: '#e8b842',
    Icon: Trophy,
  },
  {
    id: 'major-run',
    title: 'Major Run',
    sport: 'Counter-Strike 2',
    tagline: 'Draft five pros and survive the bracket to the grand final.',
    picks: 5,
    prize: 'Major trophy',
    href: '/major-run',
    accent: '#7fa5c9',
    Icon: Crosshair,
  },
];

const steps: { n: string; title: string; body: string }[] = [
  { n: '01', title: 'Spin a team-year', body: 'A real roster from esports history lands on the board.' },
  { n: '02', title: 'Draft one per round', body: 'Pick the player who fills your slot. Build the lineup.' },
  { n: '03', title: 'Get the result, share it', body: 'A season plays out. Screenshot the card. Settle it.' },
];

export default function EsportsHub() {
  return (
    <div className="kb-root min-h-[100dvh] flex flex-col mesh-bg-ring relative">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top wordmark */}
        <header className="px-5 pt-6 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <span className="kb-label text-kb-soft">Esports Draft</span>
            <span className="flex items-center gap-1.5 text-kb-mute text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full kb-live-dot" style={{ background: 'var(--kb-green)' }} />
              New board daily
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="px-5 pt-12 pb-10 max-w-2xl mx-auto w-full">
          <p className="kb-eyebrow text-kb-mute mb-5">Draft the past. Settle the debate.</p>
          <h1
            className="font-display text-kb-fg leading-[0.86]"
            style={{ fontSize: 'clamp(48px, 13vw, 84px)' }}
          >
            Draft legends.
            <br />
            <span style={{ color: 'var(--kb-gold)' }}>Share the result.</span>
          </h1>
          <p className="text-kb-soft text-[15px] leading-relaxed mt-6 max-w-[44ch]">
            Three daily draft games across CoD, League, and CS2. One perfect
            lineup, one result worth arguing about, one screenshot.
          </p>
          <a
            href="#games"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full kb-cta-gold h-12 pl-6 pr-5 text-sm"
          >
            Choose your game
            <span className="kb-cta-icon">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </section>

        {/* Games */}
        <section id="games" className="px-5 max-w-2xl mx-auto w-full scroll-mt-6">
          <div className="flex items-baseline justify-between border-b border-kb-hairline pb-2.5 mb-3">
            <h2 className="kb-label text-kb-soft">Three games</h2>
            <span className="kb-label text-kb-faint">Pick one</span>
          </div>

          <div className="space-y-2.5">
            {games.map((game) => {
              const { Icon } = game;
              return (
                <Link
                  key={game.id}
                  to={game.href}
                  className="kb-card kb-card-hover group block rounded-[var(--kb-r-lg)] active:translate-y-px"
                >
                  <div className="p-4 sm:p-5 flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-[var(--kb-r-md)] flex items-center justify-center shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${game.accent} 14%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${game.accent} 32%, transparent)`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: game.accent }} strokeWidth={1.75} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="kb-eyebrow mb-1"
                        style={{ color: game.accent }}
                      >
                        {game.sport}
                      </p>
                      <h3 className="font-display text-2xl sm:text-[28px] text-kb-fg leading-none">
                        {game.title}
                      </h3>
                      <p className="text-[13px] text-kb-soft leading-snug mt-2 max-w-[40ch]">
                        {game.tagline}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-kb-mute">
                        <span className="kb-mono tabular-nums">{game.picks} picks</span>
                        <span className="w-px h-3 bg-kb-hairline" />
                        <span>{game.prize}</span>
                      </div>
                    </div>

                    <ArrowUpRight
                      className="w-5 h-5 shrink-0 self-start text-kb-faint transition-all duration-200 group-hover:text-kb-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="px-5 mt-12 max-w-2xl mx-auto w-full">
          <div className="flex items-baseline justify-between border-b border-kb-hairline pb-2.5 mb-5">
            <h2 className="kb-label text-kb-soft">How it works</h2>
            <span className="kb-label text-kb-faint">Under two minutes</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-x-5 gap-y-6">
            {steps.map((step) => (
              <div key={step.n}>
                <p className="font-display text-2xl text-kb-faint tabular-nums leading-none">{step.n}</p>
                <p className="text-kb-fg text-sm font-semibold mt-2.5">{step.title}</p>
                <p className="text-[13px] text-kb-mute leading-relaxed mt-1">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-5 mt-12 mb-4 max-w-2xl mx-auto w-full">
          <div className="kb-card rounded-[var(--kb-r-lg)] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-display text-xl text-kb-fg leading-tight">Today&apos;s board is live</p>
              <p className="text-[13px] text-kb-mute mt-1">One run per game, per day. Best lineup wins.</p>
            </div>
            <a
              href="#games"
              className="group inline-flex items-center gap-2.5 rounded-full kb-cta-glass h-11 pl-5 pr-4 text-sm shrink-0 self-start sm:self-auto"
            >
              Start drafting
              <span className="kb-cta-icon">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </section>

        <footer className="px-5 pb-8 mt-auto max-w-2xl mx-auto w-full">
          <div className="pt-5 flex items-center justify-between border-t border-kb-hairline">
            <span className="kb-label text-kb-faint">Daily · Share · Replay</span>
            <span className="text-[11px] text-kb-faint">Esports Draft Games</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
