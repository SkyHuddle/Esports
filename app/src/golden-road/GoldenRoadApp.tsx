import { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useGame } from '@/golden-road/hooks/useGame';

import { HomeScreen } from '@/golden-road/components/HomeScreen';

import { DraftScreen } from '@/golden-road/components/DraftScreen';

import { ResultScreen } from '@/golden-road/components/ResultScreen';

import { HowItWorksModal } from '@/golden-road/components/HowItWorksModal';

import { loadStats, loadDailyResult } from '@/golden-road/features/storage';

import type { DailyRunResult, PlayerStats } from '@/golden-road/core/types';

import { getDateKey } from '@/golden-road/features/daily';

import { hasSeenOnboarding, markOnboardingSeen, recordVisit } from '@/golden-road/features/onboarding';

import { HubBackLink } from '@/components/kb/HubBackLink';



const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];



export function GoldenRoadApp() {

  const game = useGame();

  const [stats, setStats] = useState<PlayerStats>(() => loadStats());

  const [dailyPlayed, setDailyPlayed] = useState<DailyRunResult | null>(() =>

    loadDailyResult(getDateKey())

  );

  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding());



  useEffect(() => {

    recordVisit();

  }, []);



  useEffect(() => {

    if (game.phase === 'home') {

      setStats(loadStats());

      setDailyPlayed(loadDailyResult(getDateKey()));

    }

  }, [game.phase]);



  const dismissOnboarding = () => {

    markOnboardingSeen();

    setShowOnboarding(false);

  };



  const confirmLeaveHub = game.phase === 'draft' && game.picks.length > 0;

  const handleStartFree = useCallback(() => game.startGame('free'), [game]);
  const handleStartDaily = useCallback(() => game.startGame('daily'), [game]);
  const handleBack = useCallback(() => game.resetToHome(), [game]);



  return (

    <div className="kb-root min-h-[100dvh] antialiased relative overflow-x-hidden">

      <div className="fixed inset-0 mesh-bg-lol pointer-events-none z-0" />

      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-50" />



      <div className="fixed top-0 left-0 right-0 z-40 kb-brand-bar">

        <div className="max-w-lg mx-auto px-5 py-2.5">

          <HubBackLink confirmIf={confirmLeaveHub} />

        </div>

      </div>



      <div className="relative z-10 pt-11">

        <AnimatePresence mode="wait">

          {game.phase === 'home' && (

            <motion.div

              key="home"

              initial={{ opacity: 0, y: 12 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0 }}

              transition={{ duration: 0.45, ease: easeOut }}

            >

              <HomeScreen

                stats={stats}

                dailyConstraint={game.dailyConstraint}

                dailyPlayed={dailyPlayed}

                onStartFree={handleStartFree}

                onStartDaily={handleStartDaily}

              />

            </motion.div>

          )}



          {game.phase === 'draft' && game.currentRound && (

            <motion.div

              key={`draft-${game.roundIndex}-${game.draftSubphase}`}

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

            >

              <DraftScreen

                currentRound={game.currentRound}

                draftSubphase={game.draftSubphase}

                picks={game.picks}

                openRoles={game.openRoles}

                spinGeneration={game.spinGeneration}

                respinsLeft={game.respinsLeft}

                dailyConstraint={game.dailyConstraint}

                isDaily={game.mode === 'daily'}

                onSpinComplete={game.finishSpin}

                onRespinTeam={game.respinTeam}

                onSelectPlayer={game.selectPlayer}

                onBack={handleBack}

              />

            </motion.div>

          )}



          {game.phase === 'result' && game.result && (

            <motion.div

              key="result"

              initial={{ opacity: 0, y: 24 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ ease: easeOut }}

            >

              <ResultScreen

                picks={game.picks}

                result={game.result}

                mode={game.mode}

                dailyTitle={game.dailyConstraint.title}

                dailyPercentile={game.dailyPercentile}

                onPlayAgain={game.playAgain}

                onHome={game.resetToHome}

              />

            </motion.div>

          )}

        </AnimatePresence>

      </div>



      <AnimatePresence>

        {showOnboarding && <HowItWorksModal onDismiss={dismissOnboarding} />}

      </AnimatePresence>

    </div>

  );

}


