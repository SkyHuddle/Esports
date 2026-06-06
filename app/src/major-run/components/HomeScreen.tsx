import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, Lock } from 'lucide-react';
import type { DailyConstraint, DailyRunResult, PlayerStats } from '../core/types';
import { MajorPath } from './MajorPath';
import { DailyLeaderboard } from './DailyLeaderboard';
import { KbCtaButton } from '@/components/kb/KbCtaButton';
import { canStartDailyToday, getDailyTeamLabels, loadDailyBoard } from '../features/daily-board';
import { getDateKey, getDailyChallengeNumber } from '../features/daily';
import { isReturningPlayer } from '../features/onboarding';

interface HomeScreenProps {
  stats: PlayerStats;
  dailyConstraint: DailyConstraint;
  dailyPlayed: DailyRunResult | null;
  onStartFree: () => void;
  onStartDaily: () => void;
}

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HomeScreen({
  stats,
  dailyConstraint,
  dailyPlayed,
  onStartFree,
  onStartDaily,
}: HomeScreenProps) {
  const dateKey = getDateKey();
  const dailyNum = getDailyChallengeNumber();
  const dailyOpen = canStartDailyToday(dailyPlayed);
  const dailyTeams = getDailyTeamLabels(dateKey);
  const board = loadDailyBoard(dateKey);
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
          style={{ color: 'var(--kb-steel)' }}
        >
          Counter-Strike 2
        </p>
        <h1 className="font-display text-[3.75rem] sm:text-[4.25rem] leading-[0.88] text-kb-fg">
          Major Run
        </h1>
        <p className="text-[13px] text-kb-mute mt-2.5 leading-relaxed max-w-[30ch]">
          Draft five CS legends. Survive the Major bracket.
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
          label="Majors"
          value={stats.majorsWon}
          highlight={stats.majorsWon > 0}
          accentColor="var(--kb-gold)"
        />
        <div className="w-px h-6 bg-kb-hairline" />
        <StatItem
          label="Streak"
          value={stats.winStreak}
          highlight={stats.winStreak > 1}
          accentColor="var(--kb-steel)"
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
        <KbCtaButton onClick={onStartFree} variant="gold" className="h-14">
          Start Major Run
        </KbCtaButton>

        <DailyRow
          dailyNum={dailyNum}
          dailyOpen={dailyOpen}
          dailyPlayed={dailyPlayed}
          constraint={dailyConstraint}
          onStart={onStartDaily}
        />
      </motion.div>

      {/* Daily constraint teams */}
      {dailyOpen && dailyConstraint.id !== 'standard' && dailyTeams.length > 0 && (
        <div className="px-5 mt-2 flex flex-wrap gap-1.5">
          {dailyTeams.slice(0, 6).map((label) => (
            <span
              key={label}
              className="text-[9px] px-2 py-0.5 rounded-full border border-kb-border text-kb-faint kb-mono"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Today's result */}
      {dailyPlayed && !dailyOpen && (
        <motion.div
          className="mx-5 mt-4 py-3.5 border-t border-kb-hairline flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <p className="text-xs font-semibold text-kb-gold">
              {dailyPlayed.headline ?? "Today's run"}
            </p>
            <p className="text-[11px] text-kb-mute mt-0.5">
              {dailyPlayed.record} · Score {dailyPlayed.score.toFixed(1)}
            </p>
          </div>
          <span className="font-display text-2xl text-kb-gold tabular-nums">
            {dailyPlayed.score.toFixed(0)}
          </span>
        </motion.div>
      )}

      {/* Leaderboard */}
      {board.length > 0 && (
        <motion.div
          className="px-5 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DailyLeaderboard board={board} yourEntryId={dailyPlayed ? `you-${dateKey}` : undefined} />
        </motion.div>
      )}

      {/* How to play */}
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
                { n: '1', text: 'Spin a historical CS2/CSGO Major team roster' },
                { n: '2', text: 'Pick one player from the team to fill an open slot' },
                { n: '3', text: 'Repeat 5 rounds, then run the Major bracket' },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-3.5">
                  <span
                    className="w-6 h-6 rounded-lg text-[11px] font-display flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(139,167,199,0.12)', color: 'var(--kb-steel)' }}
                  >
                    {n}
                  </span>
                  <p className="text-[13px] text-kb-soft leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-kb-hairline">
              <p className="text-[10px] uppercase tracking-[0.3em] text-kb-mute mb-3">The bracket</p>
              <MajorPath variant="full" />
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
        borderColor: 'rgba(255, 106, 31, 0.35)',
        background: 'rgba(255, 106, 31, 0.07)',
      }}
    >
      <Calendar className="w-4 h-4 shrink-0" style={{ color: 'var(--kb-amber)' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-kb-fg">Daily #{dailyNum}</span>
          {hasConstraint && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                color: 'var(--kb-amber)',
                background: 'rgba(255, 106, 31, 0.12)',
                border: '1px solid rgba(255, 106, 31, 0.25)',
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
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--kb-amber)' }} />
    </button>
  );
}
