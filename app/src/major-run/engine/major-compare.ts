import type { DraftPick, HistoricalComparison, MajorSummary } from '../core/types';

function formatTeamFact(pick: DraftPick): HistoricalComparison['facts'][number] {
  const { team, player } = pick;
  return {
    teamLabel: `${team.teamName} ${team.season}`,
    playerTag: player.gamertag,
    placement: team.placement,
    majors: team.majorWins,
    majorLine: team.majorPlacement,
    wonThatYear: team.isMajorWinner,
  };
}

function anchorPick(picks: DraftPick[]): DraftPick {
  const winners = picks.filter((p) => p.team.isMajorWinner);
  if (winners.length > 0) {
    return winners.sort((a, b) => b.team.teamRating - a.team.teamRating)[0]!;
  }
  return [...picks].sort((a, b) => b.team.teamRating - a.team.teamRating)[0]!;
}

function teamHistoricalLine(pick: DraftPick): string {
  const { team } = pick;
  if (team.isMajorWinner) {
    return `${team.placement} — Major winner`;
  }
  if (team.majorWins > 0) {
    return `${team.placement}, ${team.majorPlacement}`;
  }
  return `${team.placement}`;
}

export function buildHistoricalComparison(
  picks: DraftPick[],
  summary: MajorSummary
): HistoricalComparison {
  const facts = picks.map(formatTeamFact);
  const anchor = anchorPick(picks);
  const anchorHist = teamHistoricalLine(anchor);

  let anchorLine: string;
  let contrastLine: string;

  const flawless = summary.tagline.includes('Flawless');
  const majorWon = summary.tagline.includes('Champion');

  if (flawless) {
    anchorLine = `Flawless run. ${anchor.team.teamName} ${anchor.team.season} actually went ${anchorHist}.`;
    contrastLine = 'You ran the table — that\'s the ceiling.';
  } else if (majorWon) {
    anchorLine = `Major secured. ${anchor.team.teamName} ${anchor.team.season} went ${anchorHist}.`;
    contrastLine = anchor.team.isMajorWinner
      ? 'You matched a real major-winning roster\'s ceiling.'
      : `You went further than ${anchor.team.teamName} ${anchor.team.season} did that year.`;
  } else if (summary.stagesCleared >= 3) {
    anchorLine = `Deep run — ${summary.record}. ${anchor.team.teamName} ${anchor.team.season}: ${anchorHist}.`;
    contrastLine = anchor.team.isMajorWinner
      ? 'They lifted the trophy. You fell short.'
      : 'Your path stacks up to that card\'s ceiling.';
  } else {
    anchorLine = `Tough major. ${anchor.team.teamName} ${anchor.team.season} still went ${anchorHist}.`;
    contrastLine = 'The cards you drafted have more hardware than this run.';
  }

  return {
    yourHeadline: summary.headline,
    facts,
    anchorLine,
    contrastLine,
  };
}
