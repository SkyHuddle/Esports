import { cn } from '@/lib/utils';
import type { StageId } from '@/golden-road/core/types';
import { STAGES, STAGE_LABELS } from '@/golden-road/core/types';
import { Check } from 'lucide-react';

interface GoldenRoadPathProps {
  completedCount?: number;
  activeIndex?: number;
  variant?: 'compact' | 'full';
  className?: string;
}

const STAGE_SHORT: Record<StageId, string> = {
  spring: 'Spring',
  msi: 'MSI',
  summer: 'Summer',
  worlds: 'Worlds',
};

export function GoldenRoadPath({
  completedCount = 0,
  activeIndex,
  variant = 'compact',
  className,
}: GoldenRoadPathProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {STAGES.map((stage, i) => {
        const done = i < completedCount;
        const active = activeIndex === i;
        const future = i > (activeIndex ?? completedCount);

        return (
          <div key={stage} className="flex items-center flex-1 min-w-0">
            <div
              className={cn(
                'flex-1 flex flex-col items-center gap-1 min-w-0',
                variant === 'full' && 'py-1'
              )}
            >
              <div
                className={cn(
                  'w-full max-w-[52px] h-1.5 rounded-full transition-all duration-300',
                  done && 'bg-kb-gold shadow-sm shadow-kb-gold/30',
                  active && !done && 'bg-kb-gold/50 ring-1 ring-kb-gold/20',
                  future && 'bg-kb-hairline',
                  !done && !active && !future && 'bg-kb-glass-strong'
                )}
              />
              {variant === 'full' && (
                <span
                  className={cn(
                    'text-[8px] uppercase tracking-wider font-medium truncate w-full text-center',
                    done && 'text-kb-gold',
                    active && !done && 'text-kb-gold/80',
                    !done && !active && 'text-kb-faint'
                  )}
                >
                  {done ? <Check className="w-3 h-3 mx-auto text-kb-gold" /> : STAGE_SHORT[stage]}
                </span>
              )}
            </div>
            {i < STAGES.length - 1 && (
              <div className={cn('w-1 h-px shrink-0 mx-0.5', done ? 'bg-kb-gold/40' : 'bg-kb-hairline')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function GoldenRoadPathLabels({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-between text-[9px] text-kb-faint uppercase tracking-wider', className)}>
      {STAGES.map((s) => (
        <span key={s} className="flex-1 text-center">
          {STAGE_LABELS[s].split(' ')[0]}
        </span>
      ))}
    </div>
  );
}
