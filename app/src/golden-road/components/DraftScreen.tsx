import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type {
  DailyConstraint,
  DraftPick,
  DraftRound,
  DraftSubphase,
  DraftTournamentPhase,
  Player,
  Role,
} from '@/golden-road/core/types';
import { DRAFT_PHASE_LABELS, ROLE_LABELS } from '@/golden-road/core/types';
import { DRAFT_PHASE_ORDER } from '@/golden-road/core/types';
import { TeamBanner, TeamRosterCard } from './TeamRosterCard';
import { TeamSlotMachine } from './TeamSlotMachine';
import { isOnePerOrgDay, orgConstraintViolated, playerPassesFilter } from '@/golden-road/features/daily';
import { cardOverall, teamRosterAvgOvr } from '@/golden-road/engine/player-power';
import { ovrAccentColor } from '@/golden-road/engine/ovr-display';
import { hapticTap } from '@/utils/haptics';

interface DraftScreenProps {
  currentRound: DraftRound;
  draftSubphase: DraftSubphase;
  picks: DraftPick[];
  openRoles: Role[];
  spinGeneration: number;
  respinsLeft: number;
  dailyConstraint?: DailyConstraint;
  isDaily: boolean;
  onSpinComplete: () => void;
  onRespinTeam: () => void;
  onSelectPlayer: (player: Player, naturalRole: Role) => void;
  onBack: () => void;
}

export function DraftScreen({
  currentRound,
  draftSubphase,
  picks,
  openRoles,
  spinGeneration,
  respinsLeft,
  dailyConstraint,
  isDaily,
  onSpinComplete,
  onRespinTeam,
  onSelectPlayer,
  onBack,
}: DraftScreenProps) {
  const orgLock =
    isDaily && dailyConstraint && isOnePerOrgDay(dailyConstraint.id);
  const dailyFilterActive = isDaily && dailyConstraint != null;

  const roleOrder: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];
  const rosterAvg = teamRosterAvgOvr(currentRound.team, currentRound.roster);

  const rosterEntries = useMemo(() => {
    return roleOrder
      .map((teamRole) => {
        const playerId = currentRound.team.roster[teamRole];
        const player = currentRound.roster.find((p) => p.id === playerId);
        if (!player) return null;

        const roleTaken = !openRoles.includes(teamRole);
        const orgBlocked =
          orgLock &&
          orgConstraintViolated(picks.map((p) => p.player), player);
        const dailyBlocked =
          dailyFilterActive && !playerPassesFilter(player, dailyConstraint);
        const blocked = roleTaken || orgBlocked || dailyBlocked;
        const ovr = cardOverall(player, currentRound.team);

        return { player, teamRole, roleTaken, orgBlocked, dailyBlocked, blocked, ovr };
      })
      .filter((e): e is NonNullable<typeof e> => e != null)
      .sort((a, b) => {
        if (a.blocked !== b.blocked) return a.blocked ? 1 : -1;
        return b.ovr - a.ovr;
      });
  }, [currentRound, openRoles, orgLock, dailyFilterActive, dailyConstraint, picks, roleOrder]);

  const pickableCount = rosterEntries.filter((e) => !e.blocked).length;
  const [confirmExit, setConfirmExit] = useState(false);

  const handleExit = () => {
    if (picks.length === 0) {
      onBack();
      return;
    }
    setConfirmExit(true);
  };

  const handleSelect = (player: Player, teamRole: Role) => {
    hapticTap();
    onSelectPlayer(player, teamRole);
  };

  const handleRespin = () => {
    hapticTap();
    onRespinTeam();
  };

  return (
    <div className="flex flex-col min-h-[100dvh] max-w-lg mx-auto">
      <header className="sticky top-11 z-20 px-5 pt-3 pb-3 kb-brand-bar">
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            type="button"
            onClick={handleExit}
            className="text-kb-mute text-sm hover:text-kb-soft transition-colors py-2 shrink-0"
          >
            ← Exit
          </button>
          <span className="text-[10px] uppercase tracking-[0.2em] text-kb-gold/70 font-medium">
            {DRAFT_PHASE_LABELS[currentRound.phase]}
          </span>
          {!isDaily && respinsLeft > 0 && draftSubphase === 'pick' ? (
            <button
              type="button"
              onClick={handleRespin}
              className="shrink-0 text-[10px] uppercase tracking-wider font-semibold px-3 py-2 rounded-full border border-kb-gold/30 bg-kb-gold/10 text-kb-gold hover:bg-kb-gold/15 transition-colors"
            >
              Respin · {respinsLeft}
            </button>
          ) : (
            <span className="w-[72px] shrink-0" aria-hidden />
          )}
        </div>

        <TournamentProgress currentPhase={currentRound.phase} completedCount={picks.length} />
        <RosterSlots picks={picks} openRoles={openRoles} />
      </header>

      <div className="flex-1 overflow-y-auto">
        {draftSubphase === 'spin' && (
          <TeamSlotMachine
            key={spinGeneration}
            phase={currentRound.phase}
            team={currentRound.team}
            spin={currentRound.spin}
            spinKey={spinGeneration}
            onComplete={onSpinComplete}
          />
        )}

        {draftSubphase === 'pick' && (
          <motion.div
            className="px-5 py-4 pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TeamBanner team={currentRound.team} rosterAvgOvr={rosterAvg} />

            <div className="mb-4 rounded-[var(--kb-r-md)] kb-glass-panel px-4 py-3.5 border border-kb-gold/10">
              <p className="text-xs text-kb-soft leading-relaxed">
                {pickableCount === 1 ? (
                  <>
                    Draft your{' '}
                    <span className="text-kb-gold font-medium">
                      {ROLE_LABELS[openRoles[0]!]}
                    </span>
                    . Highest OVR wins.
                  </>
                ) : (
                  <>
                    {pickableCount} slots open — cards sorted by OVR.
                  </>
                )}
              </p>
            </div>

            {isDaily && dailyConstraint && (
              <p className="text-[10px] text-kb-amber/80 mb-4 -mt-2 px-1 font-medium">
                {dailyConstraint.title}
              </p>
            )}

            {isDaily && pickableCount === 0 && (
              <p className="text-sm text-kb-crimson/90 mb-4 rounded-[var(--kb-r-md)] border border-kb-crimson/20 bg-kb-crimson/10 px-4 py-3">
                No eligible players for today&apos;s rule on this team. Exit and try tomorrow&apos;s daily.
              </p>
            )}

            <div className="space-y-3">
              {rosterEntries.map(({ player, teamRole, roleTaken, orgBlocked, dailyBlocked, blocked }, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TeamRosterCard
                    player={player}
                    team={currentRound.team}
                    teamRole={teamRole}
                    onSelect={() => handleSelect(player, teamRole)}
                    disabled={blocked}
                    roleTaken={roleTaken}
                  />
                  {roleTaken && (
                    <p className="text-[10px] text-kb-faint mt-1.5 pl-1">
                      {ROLE_LABELS[teamRole]} slot filled
                    </p>
                  )}
                  {!roleTaken && orgBlocked && (
                    <p className="text-[10px] text-kb-crimson/80 mt-1.5 pl-1">
                      Org already used today
                    </p>
                  )}
                  {!roleTaken && dailyBlocked && (
                    <p className="text-[10px] text-kb-crimson/80 mt-1.5 pl-1">
                      Blocked by today&apos;s rule
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
            {isDaily && (
              <p className="text-center text-[10px] text-kb-faint mt-6">
                Daily mode — one official attempt per day
              </p>
            )}
          </motion.div>
        )}
      </div>

      {confirmExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm">
          <div className="kb-card w-full max-w-xs rounded-[var(--kb-r-lg)] p-5 border border-kb-border">
            <p className="font-display text-lg text-kb-fg mb-2">Leave this run?</p>
            <p className="text-sm text-kb-mute mb-5">Your draft progress won&apos;t be saved.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                className="flex-1 py-3 rounded-full border border-kb-border text-sm text-kb-soft"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmExit(false);
                  onBack();
                }}
                className="flex-1 py-3 rounded-full bg-kb-crimson/20 border border-kb-crimson/30 text-sm text-kb-crimson"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TournamentProgress({
  currentPhase,
  completedCount,
}: {
  currentPhase: DraftTournamentPhase;
  completedCount: number;
}) {
  return (
    <div className="mb-1">
      <div className="flex gap-1">
        {DRAFT_PHASE_ORDER.map((phase, i) => (
          <div key={phase} className="flex-1">
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{
                background:
                  i < completedCount
                    ? 'var(--kb-gold)'
                    : phase === currentPhase
                      ? 'rgba(232, 184, 66, 0.45)'
                      : 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <p
              className="text-[7px] mt-1 text-center truncate transition-colors duration-200"
              style={{
                color:
                  i < completedCount
                    ? 'var(--kb-gold)'
                    : phase === currentPhase
                      ? 'rgba(232, 184, 66, 0.7)'
                      : 'rgba(255,255,255,0.2)',
                fontWeight: phase === currentPhase ? 600 : 400,
              }}
            >
              {phase === 'worlds_groups' ? 'Groups' : phase === 'worlds_playoffs' ? 'Worlds' : DRAFT_PHASE_LABELS[phase].split(' ')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RosterSlots({
  picks,
  openRoles,
}: {
  picks: DraftPick[];
  openRoles: Role[];
}) {
  const slots: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];
  const teamOvr =
    picks.length > 0
      ? Math.round(
          picks.reduce((s, p) => s + cardOverall(p.player, p.team), 0) / picks.length
        )
      : null;

  return (
    <div>
      <div className="flex gap-1.5">
        {slots.map((role) => {
          const pick = picks.find((p) => p.role === role);
          const open = openRoles.includes(role);
          const ovr = pick ? cardOverall(pick.player, pick.team) : null;

          return (
            <div
              key={role}
              className={`flex-1 rounded-xl py-2 px-1 text-center border transition-all ${
                pick
                  ? 'border-kb-gold/25 bg-kb-gold/8'
                  : open
                    ? 'border-kb-gold/15 bg-kb-gold/[0.04] ring-1 ring-kb-gold/10'
                    : 'border-kb-hairline opacity-40'
              }`}
            >
              <p className="text-[7px] uppercase tracking-wider text-kb-mute font-semibold">
                {ROLE_LABELS[role].slice(0, 3)}
              </p>
              <p className="text-[10px] text-kb-fg font-medium mt-0.5 px-0.5">
                {pick ? pick.player.name.split(' ').pop() : open ? '?' : '—'}
              </p>
              {ovr != null && (
                <p
                  className="text-[9px] font-display tabular-nums mt-0.5"
                  style={{ color: ovrAccentColor(ovr) }}
                >
                  {ovr}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {teamOvr != null && (
        <p className="text-[9px] text-center text-kb-mute mt-2 uppercase tracking-wider">
          Draft avg{' '}
          <span className="text-kb-gold/80 font-display tabular-nums">{teamOvr}</span> OVR
        </p>
      )}
    </div>
  );
}
