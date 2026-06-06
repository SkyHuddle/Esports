import type { DraftPick, HistoricalComparison, RunSummary } from '../core/types';

function formatTeamFact(pick: DraftPick): HistoricalComparison['facts'][number] {
  const { team, player } = pick;
  return {
    teamLabel: `${team.teamName} ${team.season}`,
    playerTag: player.gamertag,
    placement: team.placement,
    champions: team.championsWins,
    titleLine: team.placementTier,
    wonThatYear: team.isChampionsWinner,
  };
}

function anchorPick(picks: DraftPick[]): DraftPick {
  const winners = picks.filter((p) => p.team.isChampionsWinner);
  if (winners.length > 0) {
    return winners.sort((a, b) => b.team.teamRating - a.team.teamRating)[0]!;
  }
  return [...picks].sort((a, b) => b.team.teamRating - a.team.teamRating)[0]!;
}

function teamHistoricalLine(pick: DraftPick): string {
  const { team } = pick;
  if (team.isChampionsWinner) {
    return `${team.placement} — Champions winner`;
  }
  if (team.mastersWins > 0) {
    return `${team.placement}`;
  }
  return `${team.placement}`;
}

export function buildHistoricalComparison(
  picks: DraftPick[],
  summary: RunSummary
): HistoricalComparison {
  const facts = picks.map(formatTeamFact);
  const anchor = anchorPick(picks);
  const anchorHist = teamHistoricalLine(anchor);

  let anchorLine: string;
  let contrastLine: string;

  const flawless = summary.tagline.includes('Flawless');
  const championsWon = summary.tagline.includes('Champions');

  if (flawless) {
    anchorLine = `Perfect run. ${anchor.team.teamName} ${anchor.team.season} actually went ${anchorHist}.`;
    contrastLine = 'You ran the table — that is the ceiling.';
  } else if (championsWon) {
    anchorLine = `Champions secured. ${anchor.team.teamName} ${anchor.team.season} went ${anchorHist}.`;
    contrastLine = anchor.team.isChampionsWinner
      ? 'You matched a real Champions-winning roster ceiling.'
      : `You went further than ${anchor.team.teamName} ${anchor.team.season} did that year.`;
  } else if (summary.stagesCleared >= 3) {
    anchorLine = `Deep run — ${summary.record}. ${anchor.team.teamName} ${anchor.team.season}: ${anchorHist}.`;
    contrastLine = anchor.team.isChampionsWinner
      ? 'They lifted Champions. You fell short.'
      : 'Your path stacks up to that card ceiling.';
  } else {
    anchorLine = `Tough run. ${anchor.team.teamName} ${anchor.team.season} still went ${anchorHist}.`;
    contrastLine = 'The cards you drafted have more hardware than this run.';
  }

  return {
    yourHeadline: summary.headline,
    facts,
    anchorLine,
    contrastLine,
  };
}
