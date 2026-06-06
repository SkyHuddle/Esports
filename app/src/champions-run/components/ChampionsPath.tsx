import { STAGES, STAGE_LABELS } from '../core/types';

export function ChampionsPath({ variant = 'compact' }: { variant?: 'compact' | 'full' }) {
  return (
    <div className={`flex items-center ${variant === 'full' ? 'justify-between gap-0.5' : 'gap-1.5'}`}>
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div
              className={`rounded-full border flex items-center justify-center shrink-0 ${
                variant === 'full' ? 'w-7 h-7 text-[8px]' : 'w-5 h-5 text-[7px]'
              } border-ring-gold/30 bg-ring-gold/10 text-ring-gold/80 font-display`}
            >
              {i + 1}
            </div>
            <span
              className={`mt-1 text-center truncate w-full leading-tight ${
                variant === 'full' ? 'text-[8px]' : 'text-[7px]'
              } uppercase tracking-wider text-white/35`}
            >
              {STAGE_LABELS[stage].split(' ')[0]}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div className="h-px flex-1 bg-gradient-to-r from-ring-gold/25 to-transparent mx-0.5 mb-3" />
          )}
        </div>
      ))}
    </div>
  );
}
