import { Link } from 'react-router';
import { Flame, Trophy, Crosshair, ArrowRight } from 'lucide-react';

const games = [
  {
    id: 'ring-chase',
    title: 'Ring Chase',
    sport: 'Call of Duty',
    tagline: 'Draft 4 legends. Chase the championship.',
    href: '/ring-chase',
    accent: '#ff6a1f',
    accentDim: 'rgba(255, 106, 31, 0.08)',
    accentBorder: 'rgba(255, 106, 31, 0.25)',
    Icon: Flame,
  },
  {
    id: 'golden-road',
    title: 'Golden Road',
    sport: 'League of Legends',
    tagline: 'Build a Worlds run from legendary eras.',
    href: '/golden-road',
    accent: '#e8b842',
    accentDim: 'rgba(232, 184, 66, 0.07)',
    accentBorder: 'rgba(232, 184, 66, 0.22)',
    Icon: Trophy,
  },
  {
    id: 'major-run',
    title: 'Major Run',
    sport: 'Counter-Strike 2',
    tagline: 'Draft 5 pros. Survive the bracket.',
    href: '/major-run',
    accent: '#8ba7c7',
    accentDim: 'rgba(139, 167, 199, 0.07)',
    accentBorder: 'rgba(139, 167, 199, 0.22)',
    Icon: Crosshair,
  },
];

export default function EsportsHub() {
  return (
    <div className="min-h-[100dvh] bg-[#07060a] text-[#f4f0e6] flex flex-col">
      <header className="px-5 pt-10 pb-8 max-w-lg mx-auto w-full">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2 font-semibold">
          Esports Draft
        </p>
        <h1
          className="text-5xl sm:text-6xl leading-[0.88] tracking-tight"
          style={{ fontFamily: "'Anton', 'Arial Narrow', system-ui, sans-serif", fontWeight: 400 }}
        >
          Draft
          <br />
          <span style={{ color: '#e8b842' }}>Games</span>
        </h1>
        <p className="text-sm text-white/40 mt-3 leading-relaxed">
          CoD · LoL · CS2 — daily modes, share cards, instant results.
        </p>
      </header>

      <main className="flex-1 px-5 pb-12 max-w-lg mx-auto w-full space-y-3">
        {games.map((game) => {
          const { Icon } = game;
          return (
            <Link
              key={game.id}
              to={game.href}
              className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: game.accentDim,
                border: `1px solid ${game.accentBorder}`,
              }}
            >
              <div
                className="h-0.5 w-full"
                style={{ background: game.accent }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: `${game.accent}18`,
                        border: `1px solid ${game.accent}30`,
                      }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: game.accent }} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-1"
                        style={{ color: `${game.accent}cc` }}
                      >
                        {game.sport}
                      </p>
                      <h2
                        className="text-2xl sm:text-3xl leading-none text-white"
                        style={{ fontFamily: "'Anton', 'Arial Narrow', system-ui, sans-serif", fontWeight: 400 }}
                      >
                        {game.title}
                      </h2>
                      <p className="text-sm text-white/50 mt-2 leading-relaxed">{game.tagline}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        color: game.accent,
                        background: `${game.accent}18`,
                        border: `1px solid ${game.accent}30`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: game.accent,
                          animation: 'kb-pulse 1.6s ease-in-out infinite',
                        }}
                      />
                      Live
                    </span>
                    <ArrowRight
                      className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors mt-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </main>

      <footer className="px-5 pb-8 max-w-lg mx-auto w-full">
        <div className="border-t border-white/[0.06] pt-5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-white/20">
            Daily · Share · Replay
          </span>
          <span className="text-[10px] text-white/15">
            Esports Draft Games
          </span>
        </div>
      </footer>
    </div>
  );
}
