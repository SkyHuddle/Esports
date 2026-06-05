import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { KbCard } from '@/components/kb/KbCard';

interface DailyLeaderboardProps {
  percentile: number;
  score: number;
}

export function DailyLeaderboard({ percentile, score }: DailyLeaderboardProps) {
  const topPercent = Math.max(1, Math.round(100 - percentile));
  const tier =
    topPercent <= 1 ? 'Top 1%' : topPercent <= 5 ? 'Top 5%' : topPercent <= 10 ? 'Top 10%' : 'Global';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <KbCard accent="amber">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-kb-amber" />
          <span className="text-[10px] uppercase tracking-widest text-kb-amber/90 font-semibold">
            Daily rank
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-3xl text-kb-gold tabular-nums">{tier}</p>
            <p className="text-kb-mute text-xs mt-1">vs today&apos;s global attempts</p>
          </div>
          <div className="text-right">
            <p className="text-kb-mute text-[10px] uppercase">Your score</p>
            <p className="font-display text-2xl text-kb-fg tabular-nums kb-mono">{score.toFixed(1)}</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-kb-glass-strong overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-kb-gold/80"
            initial={{ width: 0 }}
            animate={{ width: `${percentile}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </KbCard>
    </motion.div>
  );
}
