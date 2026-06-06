import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Lock, ChevronRight } from 'lucide-react';
import type { DailyConstraint, DailyRunResult, PlayerStats } from '@/golden-road/core/types';
import { GoldenRoadPath } from './GoldenRoadPath';
import { DailyLeaderboard } from './DailyLeaderboard';
import { KbCtaButton as GoldenCtaButton } from '@/components/kb/KbCtaButton';
import { getDailyChallengeNumber } from '../features/daily';
import { isReturningPlayer } from '../features/onboarding';

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

  return (
    <div className="min-h-[100dvh] max-w-lg mx-auto flex flex-col">
      {/* Hero */}
      <motion.div
        className="px-5 pt-10 pb-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.32em] font-semibold mb-4"
          style={{ color: 'var(--kb-gold)' }}
        >
          League of Legends
        </p>
        <h1 className="font-display text-[3.75rem] sm:text-[4.25rem] leading-[0.88] text-kb-fg">
          Golden Road
        </h1>
        <p className="text-[13px] text-kb-mute mt-2.5 leading-relaxed max-w-[30ch]">
          Draft five legends from iconic LoL eras. Conquer the Golden Road.
        </p>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="mx-5 mt-5 border-t border-b border-kb-hairline py-3.5 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, ease: easeOut }}
      >
        <StatItem
          label="Roads"
          value={stats.goldenRoads}
          highlight={stats.goldenRoads > 0}
          accentColor="var(--kb-gold)"
        />
        <div className="w-px h-6 bg-kb-hairline" />
        <StatItem
          label="Streak"
          value={stats.winStreak}
          highlight={stats.winStreak > 1}
          accentColor="var(--kb-gold)"
        />
        <div className="w-px h-6 bg-kb-hairline" />
        <StatItem label="Best" value={stats.bestRosterScore.toFixed(1)} />
        <div className="w-px h-6 bg-kb-hairline" />
        <StatItem label="Runs" value={stats.attempts} />
      </motion.div>

      {/* CTAs */}
      <motion.div
        className="px-5 mt-5 space-y-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, ease: easeOut }}
      >
        <GoldenCtaButton onClick={onStartFree} variant="gold" className="h-14">
          Start Golden Road
        </GoldenCtaButton>

        <DailyRow
          dailyNum={dailyNum}
          dailyOpen={dailyOpen}
          dailyPlayed={dailyPlayed}
          constraint={dailyConstraint}
          onStart={onStartDaily}
        />
      </motion.div>

      {/* Today's result (when daily is done) */}
      {dailyPlayed && !dailyOpen && (
        <motion.div
          className="mx-5 mt-4 py-3.5 border-t border-kb-hairline flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <p className="text-xs font-semibold text-kb-gold">
              {dailyPlayed.goldenRoad ? 'Golden Road!' : "Today's run"}
            </p>
            <p className="text-[11px] text-kb-mute mt-0.5">
              Score {dailyPlayed.score.toFixed(1)}
            </p>
          </div>
          <span className="font-display text-2xl text-kb-gold tabular-nums">
            {dailyPlayed.score.toFixed(0)}
          </span>
        </motion.div>
      )}

      {/* Leaderboard */}
      {dailyPlayed?.percentile != null && (
        <motion.div
          className="px-5 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DailyLeaderboard percentile={dailyPlayed.percentile} score={dailyPlayed.score} />
        </motion.div>
      )}

      {/* How to play — new players only */}
      <AnimatePresence>
        {!returning && (
          <motion.div
            className="px-5 mt-8 pb-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: easeOut }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-kb-mute mb-4">How to play</p>
            <div className="space-y-3">
              {[
                { n: '1', text: 'Spin a random LoL team-year from iconic eras' },
                { n: '2', text: 'Pick one player from the roster to fill an open role' },
                { n: '3', text: 'Repeat 5 rounds, clearing Spring, MSI, Summer, and Worlds' },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-3.5">
                  <span
                    className="w-6 h-6 rounded-lg text-[11px] font-display flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(232,184,66,0.12)', color: 'var(--kb-gold)' }}
                  >
                    {n}
                  </span>
                  <p className="text-[13px] text-kb-soft leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-kb-hairline">
              <p className="text-[10px] uppercase tracking-[0.3em] text-kb-mute mb-3">The path</p>
              <GoldenRoadPath variant="full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {returning && <div className="flex-1 pb-8" />}
    </div>
  );
}

function StatItem({
  label,
  value,
  highlight,
  accentColor,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  accentColor?: string;
}) {
  return (
    <div className="flex-1 text-center">
      <p
        className="font-display text-2xl tabular-nums leading-none"
        style={{ color: highlight && accentColor ? accentColor : 'var(--kb-fg)' }}
      >
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-kb-mute mt-1.5">{label}</p>
    </div>
  );
}

function DailyRow({
  dailyNum,
  dailyOpen,
  dailyPlayed,
  constraint,
  onStart,
}: {
  dailyNum: number;
  dailyOpen: boolean;
  dailyPlayed: DailyRunResult | null;
  constraint: DailyConstraint;
  onStart: () => void;
}) {
  const hasConstraint = constraint.id !== 'standard';

  if (!dailyOpen && dailyPlayed) {
    return (
      <div
        className="w-full h-14 flex items-center gap-3 px-5 rounded-2xl border"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
      >
        <Lock className="w-4 h-4 text-kb-mute shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm text-kb-mute font-medium">Daily #{dailyNum}</span>
          <span className="text-[11px] text-kb-faint ml-2">· Done</span>
        </div>
      </div>
    );
  }

  if (!dailyOpen) {
    return (
      <div
        className="w-full h-14 flex items-center gap-3 px-5 rounded-2xl border opacity-40 cursor-not-allowed"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
      >
        <Lock className="w-4 h-4 text-kb-mute shrink-0" />
        <span className="text-sm text-kb-mute font-medium">Daily #{dailyNum}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className="w-full h-auto min-h-[3.5rem] flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-left transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
      style={{
        borderColor: 'rgba(232, 184, 66, 0.35)',
        background: 'rgba(232, 184, 66, 0.07)',
      }}
    >
      <Calendar className="w-4 h-4 shrink-0" style={{ color: 'var(--kb-gold)' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-kb-fg">Daily #{dailyNum}</span>
          {hasConstraint && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                color: 'var(--kb-gold)',
                background: 'rgba(232, 184, 66, 0.12)',
                border: '1px solid rgba(232, 184, 66, 0.25)',
              }}
            >
              {constraint.title}
            </span>
          )}
        </div>
        {hasConstraint && (
          <p className="text-[11px] text-kb-mute mt-0.5 leading-snug truncate">
            {constraint.description}
          </p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--kb-gold)' }} />
    </button>
  );
}
