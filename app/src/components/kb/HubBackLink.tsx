import { useState } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';

interface HubBackLinkProps {
  className?: string;
  /** Show leave confirmation before navigating to the game picker */
  confirmIf?: boolean;
}

export function HubBackLink({ className, confirmIf = false }: HubBackLinkProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const goToHub = () => {
    setShowConfirm(false);
    navigate('/');
  };

  const handleClick = () => {
    if (confirmIf) {
      setShowConfirm(true);
      return;
    }
    goToHub();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'text-kb-mute text-sm hover:text-kb-soft transition-colors py-1 shrink-0',
          className
        )}
      >
        ← Games
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm">
          <div className="kb-card w-full max-w-xs rounded-[var(--kb-r-lg)] p-5 border border-kb-border">
            <p className="font-display text-lg text-kb-fg mb-2">Leave this run?</p>
            <p className="text-sm text-kb-mute mb-5">Your progress won&apos;t be saved.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-full border border-kb-border text-sm text-kb-soft"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={goToHub}
                className="flex-1 py-3 rounded-full bg-kb-crimson/20 border border-kb-crimson/30 text-sm text-kb-crimson"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
