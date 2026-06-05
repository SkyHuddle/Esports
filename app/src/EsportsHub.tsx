import { Link } from 'react-router';
import { ArrowUpRight, Circle, Trophy } from 'lucide-react';

const games = [
  {
    id: 'ring-chase',
    title: 'Ring Chase',
    tagline: 'CoD esports roster draft',
    description: 'Draft four legends from iconic team-years. Chase the ring through Majors and Champs.',
    href: '/ring-chase',
    accent: '#c9a227',
    live: true,
  },
  {
    id: 'golden-road',
    title: 'Golden Road',
    tagline: 'LoL esports roster draft',
    description: 'Build a Worlds run from pro teams and player cards. Daily challenges and share cards.',
    href: '/golden-road',
    accent: '#d4af37',
    live: true,
  },
];

export default function EsportsHub() {
  return (
    <div className="min-h-[100dvh] bg-[#060608] text-[#e8e4d4] px-5 py-12">
      <div className="max-w-lg mx-auto">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a227]/80 mb-3 font-semibold">
          SkyHuddle Esports
        </p>
        <h1 className="font-display text-4xl tracking-tight mb-2">Draft games</h1>
        <p className="text-sm text-white/50 mb-10 leading-relaxed">
          CoD and LoL esports roster builders — separate from the main portfolio site.
        </p>

        <div className="space-y-4">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.href}
              className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Circle className="w-3 h-3" style={{ color: game.accent, fill: `${game.accent}33` }} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: game.accent }}>
                      {game.live ? 'Live' : 'Soon'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{game.title}</h2>
                  <p className="text-xs mt-0.5" style={{ color: game.accent }}>
                    {game.tagline}
                  </p>
                  <p className="text-sm text-white/55 mt-3 leading-relaxed">{game.description}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white/70 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/30">
          <Trophy className="w-3.5 h-3.5" />
          <span>Stats · Daily modes · Share cards</span>
        </div>
      </div>
    </div>
  );
}
