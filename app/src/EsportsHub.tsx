import { Link } from 'react-router';
import { Flame, Trophy, Crosshair, ArrowRight, Users } from 'lucide-react';

const games = [
  {
    id: 'ring-chase',
    title: 'Ring Chase',
    sport: 'Call of Duty',
    tagline: 'Draft 4 legends. Chase the championship.',
    stat: '4 picks · Championship ring',
    drafting: '23.4K',
    href: '/ring-chase',
    accent: '#f5631a',
    accentRgb: '245, 99, 26',
    Icon: Flame,
  },
  {
    id: 'golden-road',
    title: 'Golden Road',
    sport: 'League of Legends',
    tagline: 'Build a Worlds run from legendary eras.',
    stat: '5 picks · Worlds champion',
    drafting: '18.7K',
    href: '/golden-road',
    accent: '#e8b842',
    accentRgb: '232, 184, 66',
    Icon: Trophy,
  },
  {
    id: 'major-run',
    title: 'Major Run',
    sport: 'Counter-Strike 2',
    tagline: 'Draft 5 pros. Survive the bracket.',
    stat: '5 picks · Major trophy',
    drafting: '16.2K',
    href: '/major-run',
    accent: '#7fa5c9',
    accentRgb: '127, 165, 201',
    Icon: Crosshair,
  },
];

export default function EsportsHub() {
  return (
    <div
      className="min-h-[100dvh] text-[#f0ecdf] flex flex-col"
      style={{ background: '#07060a' }}
    >
      {/* Atmospheric top glow */}
      <div
        className="fixed top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% -20%, rgba(232,184,66,0.06) 0%, transparent 70%)',
        }}
      />

      <header className="relative z-10 px-5 pt-12 pb-6 max-w-lg mx-auto w-full">
        <p
          className="text-[10px] uppercase tracking-[0.35em] font-semibold mb-3"
          style={{ color: 'rgba(232,184,66,0.5)' }}
        >
          Esports Draft
        </p>
        <h1
          className="leading-[0.86] tracking-tight text-[#f0ecdf]"
          style={{
            fontFamily: "'Anton', 'Arial Narrow', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(52px, 14vw, 72px)',
            textTransform: 'uppercase',
          }}
        >
          Draft<br />
          <span style={{ color: '#e8b842' }}>Games</span>
        </h1>
        <p
          className="text-[13px] mt-4 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk', system-ui" }}
        >
          CoD · LoL · CS2 — draft legends, get a result, share it.
        </p>
      </header>

      <main className="relative z-10 flex-1 px-5 pb-12 max-w-lg mx-auto w-full space-y-3">
        {games.map((game) => {
          const { Icon } = game;
          return (
            <Link
              key={game.id}
              to={game.href}
              className="group block overflow-hidden transition-all duration-200 active:scale-[0.985]"
              style={{
                background: `linear-gradient(145deg, rgba(${game.accentRgb}, 0.14) 0%, #161320 55%, #161320 100%)`,
                border: `1px solid rgba(${game.accentRgb}, 0.28)`,
                borderRadius: '14px',
                boxShadow: `0 1px 2px rgba(0,0,0,0.6), 0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(${game.accentRgb}, 0.08)`,
              }}
            >
              {/* Top accent line — thicker, more visible */}
              <div style={{ height: '2px', background: game.accent, opacity: 0.85 }} />

              {/* Atmospheric radial glow top-right */}
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 90% 0%, rgba(${game.accentRgb}, 0.12) 0%, transparent 70%)`,
                  borderRadius: '14px',
                }}
              />

              <div className="relative px-5 pt-4 pb-4">
                {/* Top row: sport label + LIVE badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `rgba(${game.accentRgb}, 0.18)`,
                        border: `1px solid rgba(${game.accentRgb}, 0.35)`,
                      }}
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: game.accent }}
                        strokeWidth={2}
                      />
                    </div>
                    <p
                      className="text-[10px] uppercase tracking-[0.28em] font-semibold"
                      style={{ color: game.accent, fontFamily: "'Space Grotesk', system-ui" }}
                    >
                      {game.sport}
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full"
                    style={{
                      color: game.accent,
                      background: `rgba(${game.accentRgb}, 0.14)`,
                      border: `1px solid rgba(${game.accentRgb}, 0.3)`,
                      fontFamily: "'Space Grotesk', system-ui",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full kb-live-dot"
                      style={{ background: game.accent }}
                    />
                    Daily Live
                  </span>
                </div>

                {/* Game title */}
                <h2
                  className="text-[#f0ecdf] leading-none mb-2"
                  style={{
                    fontFamily: "'Anton', 'Arial Narrow', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: 'clamp(28px, 8vw, 36px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.01em',
                  }}
                >
                  {game.title}
                </h2>

                {/* Tagline */}
                <p
                  className="text-[13px] leading-relaxed mb-3.5"
                  style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Space Grotesk', system-ui" }}
                >
                  {game.tagline}
                </p>

                {/* Bottom row: stat + drafting count + arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Grotesk', system-ui" }}
                    >
                      {game.stat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1"
                      style={{ color: 'rgba(255,255,255,0.25)' }}
                    >
                      <Users className="w-3 h-3" />
                      <span
                        className="text-[10px] tabular-nums"
                        style={{ fontFamily: "'Space Grotesk', system-ui" }}
                      >
                        {game.drafting}
                      </span>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 transition-all duration-200 group-hover:translate-x-0.5"
                      style={{ color: `rgba(${game.accentRgb}, 0.5)` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </main>

      <footer className="relative z-10 px-5 pb-8 max-w-lg mx-auto w-full">
        <div
          className="pt-5 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.18)', fontFamily: "'Space Grotesk', system-ui" }}
          >
            Daily · Share · Replay
          </span>
          <span
            className="text-[10px]"
            style={{ color: 'rgba(255,255,255,0.12)', fontFamily: "'Space Grotesk', system-ui" }}
          >
            Esports Draft Games
          </span>
        </div>
      </footer>
    </div>
  );
}
