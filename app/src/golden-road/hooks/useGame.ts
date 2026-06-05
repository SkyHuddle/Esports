import { useCallback, useMemo, useState } from 'react';
import type {
  DraftPick,
  DraftRound,
  DraftSubphase,
  GameMode,
  GamePhase,
  Player,
  Role,
  SimulationResult,
} from '@/golden-road/core/types';
import { ROLE_ORDER } from '@/golden-road/core/constants';
import {
  generateDraftRounds,
  createRunSeed,
  rerollRound,
} from '@/golden-road/engine/draft';
import { simulateGoldenRoad } from '@/golden-road/engine/simulation';
import {
  getDailyConstraint,
  getDateKey,
  estimatePercentile,
  isOnePerOrgDay,
  orgConstraintViolated,
  playerPassesFilter,
} from '@/golden-road/features/daily';
import { recordAttempt, saveDailyResult } from '@/golden-road/features/storage';

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>('home');
  const [mode, setMode] = useState<GameMode>('free');
  const [runSeed, setRunSeed] = useState('');
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [draftRounds, setDraftRounds] = useState<DraftRound[]>([]);
  const [draftSubphase, setDraftSubphase] = useState<DraftSubphase>('spin');
  const [spinGeneration, setSpinGeneration] = useState(0);
  const [respinsLeft, setRespinsLeft] = useState(1);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [dailyPercentile, setDailyPercentile] = useState<number | null>(null);

  const dateKey = getDateKey();
  const dailyConstraint = useMemo(() => getDailyConstraint(), []);

  const currentRound: DraftRound | null = draftRounds[roundIndex] ?? null;

  const filledRoles = useMemo(
    () => new Set(picks.map((p) => p.role)),
    [picks]
  );

  const openRoles = useMemo(
    () => ROLE_ORDER.filter((r) => !filledRoles.has(r)),
    [filledRoles]
  );

  const startGame = useCallback((gameMode: GameMode) => {
    const seed = createRunSeed(gameMode, gameMode === 'daily' ? dateKey : undefined);
    const filter = gameMode === 'daily' ? getDailyConstraint().filter : undefined;
    const rounds = generateDraftRounds(seed, filter);
    setMode(gameMode);
    setRunSeed(seed);
    setDraftRounds(rounds);
    setPicks([]);
    setRoundIndex(0);
    setDraftSubphase('spin');
    setSpinGeneration(0);
    setRespinsLeft(gameMode === 'daily' ? 0 : 1);
    setResult(null);
    setDailyPercentile(null);
    setPhase('draft');
  }, [dateKey]);

  const finishSpin = useCallback(() => {
    setDraftSubphase('pick');
  }, []);

  const respinTeam = useCallback(() => {
    if (mode === 'daily') return;
    if (respinsLeft <= 0 || draftSubphase !== 'pick') return;

    const usedIds = draftRounds
      .filter((_, i) => i !== roundIndex)
      .map((r) => r.team.id);
    const next = rerollRound(runSeed, roundIndex, usedIds);

    setDraftRounds((prev) => {
      const copy = [...prev];
      copy[roundIndex] = next;
      return copy;
    });
    setRespinsLeft((s) => s - 1);
    setSpinGeneration((g) => g + 1);
    setDraftSubphase('spin');
  }, [
    respinsLeft,
    draftSubphase,
    draftRounds,
    roundIndex,
    runSeed,
    mode,
  ]);

  const finalizeRun = useCallback(
    (finalPicks: DraftPick[]) => {
      const simSeed =
        mode === 'daily'
          ? `${dateKey}-${finalPicks.map((p) => p.player.id).sort().join('-')}`
          : undefined;
      const sim = simulateGoldenRoad(finalPicks, { seed: simSeed });
      setResult(sim);
      setPhase('result');

      recordAttempt(sim.goldenRoad, sim.rosterScore, mode === 'daily');

      if (mode === 'daily') {
        const percentile = estimatePercentile(sim.rosterScore, sim.goldenRoad);
        setDailyPercentile(percentile);
        saveDailyResult({
          date: dateKey,
          score: sim.rosterScore,
          goldenRoad: sim.goldenRoad,
          percentile,
        });
      }
    },
    [mode, dateKey]
  );

  const selectPlayer = useCallback(
    (player: Player, naturalRole: Role) => {
      if (!currentRound || !openRoles.includes(naturalRole)) return;

      if (
        mode === 'daily' &&
        isOnePerOrgDay(dailyConstraint.id) &&
        orgConstraintViolated(picks.map((p) => p.player), player)
      ) {
        return;
      }

      if (mode === 'daily' && !playerPassesFilter(player, dailyConstraint)) return;

      const pick: DraftPick = {
        role: naturalRole,
        naturalRole,
        player,
        team: currentRound.team,
        phase: currentRound.phase,
      };

      const nextPicks = [...picks, pick];
      setPicks(nextPicks);

      if (roundIndex >= ROLE_ORDER.length - 1) {
        finalizeRun(nextPicks);
      } else {
        setRoundIndex((i) => i + 1);
        setDraftSubphase('spin');
        setSpinGeneration((g) => g + 1);
      }
    },
    [currentRound, openRoles, mode, dailyConstraint.id, picks, roundIndex, finalizeRun]
  );

  const resetToHome = useCallback(() => {
    setPhase('home');
    setPicks([]);
    setRoundIndex(0);
    setDraftRounds([]);
    setRunSeed('');
    setResult(null);
    setDraftSubphase('spin');
    setSpinGeneration(0);
    setRespinsLeft(1);
  }, []);

  const playAgain = useCallback(() => {
    if (mode === 'daily') return;
    startGame(mode);
  }, [mode, startGame]);

  return {
    phase,
    mode,
    picks,
    roundIndex,
    currentRound,
    draftSubphase,
    spinGeneration,
    openRoles,
    filledRoles,
    respinsLeft,
    result,
    dailyConstraint,
    dailyPercentile,
    dateKey,
    startGame,
    finishSpin,
    respinTeam,
    selectPlayer,
    resetToHome,
    playAgain,
  };
}
