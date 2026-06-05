import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Target, Calendar, Lock, ChevronDown } from 'lucide-react';
import type { DailyConstraint, DailyRunResult, PlayerStats } from '@/golden-road/core/types';
import { GoldenRoadPath } from './GoldenRoadPath';
import { DailyLeaderboard } from './DailyLeaderboard';
import { KbCtaButton as RingCtaButton } from '@/components/kb/KbCtaButton';
import { KbCard } from '@/components/kb/KbCard';
import { getDailyChallengeNumber } from '@/golden-road/features/daily';
import { isReturningPlayer } from '@/golden-road/features/onboarding';
import { getTeamYearMeta } from '@/golden-road/data/merge-team-year-ratings';

interface HomeScreenProps {
  stats: PlayerStats;
  dailyConstraint: DailyConstraint;
  dailyPlayed: DailyRunResult | null;
  onStartFree: () => void;
  onStartDaily: () => void;
}

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

function canStartDailyToday(dailyPlayed: DailyRunResult | null): boolean {
  return dailyPlayed == null;
}

export function HomeScreen({
  stats,
  dailyConstraint,
  dailyPlayed,
  onStartFree,
  onStartDaily,
}: HomeScreenProps) {
  const dailyNum = getDailyChallengeNumber();
  const dailyOpen = canStartDailyToday(dailyPlayed);
  const returning = isReturningPlayer();
  const [showMore, setShowMore] = useState(!returning);
  const teamYearMeta = getTeamYearMeta();

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 pb-10 pt-8 max-w-lg mx-auto">
      <motion.header
        className="text-center mb-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeOut }}
      >
        {!returning && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-kb-gold/25 bg-kb-gold/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-kb-amber kb-live-dot" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-kb-soft font-semibold">
              LoL esports · Golden Era
            </span>
          </div>
        )}

        <h1 className="font-display text-[3.25rem] sm:text-5xl text-kb-fg leading-[0.92]">
          Golden
          <br />
          <span className="text-ring-gold">Road</span>
        </h1>

        {!returning && (
          <p className="text-kb-soft text-sm mt-4 max-w-[320px] mx-auto leading-relaxed">
            Pick the best players from legendary LoL eras. Clear Spring, MSI, Summer, and Worlds.
          </p>
        )}

        {teamYearMeta && !returning && (
          <p className="text-[10px] uppercase tracking-wider text-kb-mute mt-4">
            {teamYearMeta.count} pro season cards · live stats
          </p>
        )}
      </motion.header>

      <motion.div
        className="space-y-3 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, ease: easeOut }}
      >
        <RingCtaButton onClick={onStartFree} variant="gold" className="h-14">
          Start Golden Road
        </RingCtaButton>

        <RingCtaButton
          onClick={dailyOpen ? onStartDaily : undefined}
          disabled={!dailyOpen}
          variant={dailyOpen ? 'amber' : 'glass'}
          showArrow={dailyOpen}
          className="h-14"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {dailyOpen ? <Calendar className="w-4 h-4" /> : <Lock className="w-4 h-4 opacity-50" />}
            Daily #{dailyNum}
            {!dailyOpen && ' · Done'}
          </span>
        </RingCtaButton>
        {dailyOpen && (
          <p className="text-center text-[10px] text-kb-mute -mt-1">{dailyConstraint.title}</p>
        )}
      </motion.div>

      {dailyPlayed && (
        <KbCard accent="amber" className="mb-5 !p-4">
          <p className="text-kb-gold text-xs font-semibold kb-mono">Played today</p>
          <p className="text-[10px] text-kb-mute mt-1 kb-mono">
            Score {dailyPlayed.score.toFixed(1)}
            {dailyPlayed.percentile != null &&
              ` · Top ${(100 - dailyPlayed.percentile).toFixed(0)}%`}
          </p>
        </KbCard>
      )}

      {dailyPlayed?.percentile != null && (
        <motion.div className="mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
          <DailyLeaderboard percentile={dailyPlayed.percentile} score={dailyPlayed.score} />
        </motion.div>
      )}

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-kb-mute py-2 mb-2 hover:text-kb-soft transition-colors"
      >
        {showMore ? 'Less' : 'How it works & stats'}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <KbCard accent="gold" className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-kb-mute mb-3 text-center">The path</p>
              <GoldenRoadPath variant="full" />
              <p className="text-[10px] text-kb-faint text-center mt-3 leading-relaxed">
                Spring → MSI → Summer → Worlds
              </p>
            </KbCard>

            <KbCard accent="amber" className="mb-4 !p-4">
              <p className="text-[10px] uppercase tracking-widest text-kb-amber/80 mb-1 font-semibold">
                Today&apos;s rule
              </p>
              <p className="text-kb-soft text-xs leading-relaxed">{dailyConstraint.description}</p>
            </KbCard>

            <HowItWorks />

            <StatsGrid stats={stats} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: '1', text: 'Spin a team & year — respin once if you want' },
    { n: '2', text: 'Pick the highest OVR for open roles' },
    { n: '3', text: 'Get your Golden Road result after the fifth pick' },
  ];

  return (
    <div className="mb-4 space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-kb-mute mb-2 text-center">How it works</p>
      {steps.map(({ n, text }) => (
        <div
          key={n}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 kb-glass-panel"
        >
          <span className="w-6 h-6 rounded-lg bg-kb-gold/15 text-kb-gold text-xs font-display flex items-center justify-center shrink-0">
            {n}
          </span>
          <span className="text-xs text-kb-soft leading-relaxed">{text}</span>
        </div>
      ))}
    </div>
  );
}

function StatsGrid({ stats }: { stats: PlayerStats }) {
  const items = [
    { icon: Trophy, label: 'Golden Roads', value: stats.goldenRoads },
    { icon: Flame, label: 'Win Streak', value: stats.winStreak },
    { icon: Target, label: 'Best Score', value: stats.bestRosterScore.toFixed(1) },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 mt-2 mb-4">
      {items.map(({ icon: Icon, label, value }) => (
        <KbCard key={label} className="text-center !p-3">
          <Icon className="w-4 h-4 text-kb-gold/60 mx-auto mb-2" />
          <p className="font-display text-xl text-kb-fg tabular-nums kb-mono !normal-case !tracking-normal">
            {value}
          </p>
          <p className="text-[8px] uppercase tracking-wider text-kb-faint mt-1">{label}</p>
        </KbCard>
      ))}
    </div>
  );
}
