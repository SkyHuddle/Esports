import { motion } from 'framer-motion';
import { KbCtaButton } from '@/components/kb/KbCtaButton';

interface HowItWorksModalProps {
  onDismiss: () => void;
}

const STEPS = [
  { n: '1', text: 'Spin five iconic VCT team-year rosters' },
  { n: '2', text: 'Draft one player per round into role slots' },
  { n: '3', text: 'Your Champions run resolves instantly. Share the result' },
];

export function HowItWorksModal({ onDismiss }: HowItWorksModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="kb-card w-full max-w-sm rounded-[var(--kb-r-xl)] p-6 border border-kb-coral/20"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-kb-coral/80 mb-2">How it works</p>
        <h2 className="font-display text-2xl text-kb-fg mb-4">Five picks, one Champions run</h2>
        <ol className="space-y-3 mb-6">
          {STEPS.map(({ n, text }) => (
            <li key={n} className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-full text-sm font-display flex items-center justify-center shrink-0"
                style={{ background: 'rgba(196,92,92,0.15)', color: 'var(--kb-coral)' }}
              >
                {n}
              </span>
              <p className="text-sm text-kb-soft pt-1 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
        <KbCtaButton onClick={onDismiss} variant="gold" className="h-12">
          Got it
        </KbCtaButton>
      </motion.div>
    </motion.div>
  );
}
