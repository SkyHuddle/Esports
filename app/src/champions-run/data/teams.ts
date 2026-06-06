import type { HistoricalValorantTeam, RosterSlot, TeamTier } from '../core/types';

type RosterInput = Record<RosterSlot, string>;

function R(
  duelist: string,
  initiator: string,
  controller: string,
  sentinel: string,
  flex: string
): Record<RosterSlot, string> {
  return { duelist, initiator, controller, sentinel, flex };
}

function team(
  id: string,
  teamName: string,
  season: number,
  eventContext: string,
  tagline: string,
  region: string,
  roster: RosterInput,
  opts: {
    teamRating: number;
    placement: string;
    championsWins: number;
    mastersWins: number;
    placementTier: string;
    isChampionsWinner: boolean;
    isIconicRoster?: boolean;
    accent: string;
    tier: TeamTier;
    sourceUrl?: string;
  }
): HistoricalValorantTeam {
  return {
    id,
    teamName,
    season,
    eventContext,
    tagline,
    region,
    roster,
    teamRating: opts.teamRating,
    placement: opts.placement,
    championsWins: opts.championsWins,
    mastersWins: opts.mastersWins,
    placementTier: opts.placementTier,
    isChampionsWinner: opts.isChampionsWinner,
    isIconicRoster: opts.isIconicRoster ?? true,
    accent: opts.accent,
    tier: opts.tier,
    sourceUrl: opts.sourceUrl,
  };
}

export const VALORANT_TEAMS: HistoricalValorantTeam[] = [
  team('sentinels-2021', 'Sentinels', 2021, 'VCT Champions 2021', 'First NA Champions · TenZ era', 'Americas', R('tenz', 'shahzam', 'zombs', 'dapr', 'sick'), {
    teamRating: 94, placement: 'Champions Winner', championsWins: 1, mastersWins: 0, placementTier: 'Champion', isChampionsWinner: true, accent: '#c8102e', tier: 'legendary',
    sourceUrl: 'https://www.vlr.gg/team/2',
  }),
  team('loud-2022', 'LOUD', 2022, 'VCT Champions 2022', 'Brazilian dynasty · aspas MVP', 'Americas', R('aspas', 'sacy', 'pancada', 'less', 'saadhak'), {
    teamRating: 95, placement: 'Champions Winner', championsWins: 1, mastersWins: 0, placementTier: 'Champion', isChampionsWinner: true, accent: '#00ff66', tier: 'legendary',
    sourceUrl: 'https://www.vlr.gg/team/738',
  }),
  team('fnatic-2023', 'Fnatic', 2023, 'VCT Masters Tokyo', 'Masters Tokyo · LOCK//IN', 'EMEA', R('derke', 'leo', 'chronicle-fn', 'alfajer', 'boaster'), {
    teamRating: 93, placement: 'Masters Winner', championsWins: 0, mastersWins: 2, placementTier: 'Masters', isChampionsWinner: false, accent: '#ff5900', tier: 'legendary',
  }),
  team('paper-rex-2023', 'Paper Rex', 2023, 'VCT Pacific 2023', 'Wrecking ball meta · PRX', 'Pacific', R('something', 'f0rsaken', 'mindfreak', 'd4v41', 'jinggg'), {
    teamRating: 91, placement: 'Masters Finalist', championsWins: 0, mastersWins: 0, placementTier: 'Top 4', isChampionsWinner: false, accent: '#ff3366', tier: 'elite',
  }),
  team('eg-2023', 'Evil Geniuses', 2023, 'VCT Champions 2023', 'NA redemption · yay returns', 'Americas', R('yay', 'com', 'ethan', 'jawgemo', 'boostio'), {
    teamRating: 92, placement: 'Champions Winner', championsWins: 1, mastersWins: 0, placementTier: 'Champion', isChampionsWinner: true, accent: '#0d9b4d', tier: 'legendary',
  }),
  team('optic-2022', 'OpTic Gaming', 2022, 'VCT Masters Reykjavík', 'yay chamber meta · Masters', 'Americas', R('yay-optic', 'crashies', 'marved', 'victor', 'fns'), {
    teamRating: 93, placement: 'Masters Winner', championsWins: 0, mastersWins: 1, placementTier: 'Masters', isChampionsWinner: false, accent: '#9ddc00', tier: 'legendary',
  }),
  team('drx-2022', 'DRX', 2022, 'VCT Champions 2022', 'Korean superteam · Finals', 'Pacific', R('buzz', 'rb', 'mako', 'zest', 'stax'), {
    teamRating: 91, placement: 'Champions Finalist', championsWins: 0, mastersWins: 0, placementTier: 'Runner-Up', isChampionsWinner: false, accent: '#0046ff', tier: 'elite',
  }),
  team('acend-2021', 'Acend', 2021, 'VCT Champions 2021', 'EMEA upset · cNed clutch', 'EMEA', R('cned', 'starxo', 'kryptix', 'bonecrusher', 'zeek'), {
    teamRating: 90, placement: 'Champions Winner', championsWins: 1, mastersWins: 0, placementTier: 'Champion', isChampionsWinner: true, accent: '#6b2d8e', tier: 'legendary',
  }),
  team('gambit-2021', 'Gambit Esports', 2021, 'VCT Masters Reykjavík', 'nAts sentinel meta · Masters', 'EMEA', R('nats', 'sheydos', 'd3ffo', 'chronicle-gmb', 'redgar'), {
    teamRating: 91, placement: 'Masters Winner', championsWins: 0, mastersWins: 1, placementTier: 'Masters', isChampionsWinner: false, accent: '#00a651', tier: 'elite',
  }),
  team('geng-2024', 'Gen.G', 2024, 'VCT Masters Shanghai', 'Korean Masters run', 'Pacific', R('meteor', 'munchkin', 'kar-on', 'tex', 't3xture'), {
    teamRating: 92, placement: 'Masters Winner', championsWins: 0, mastersWins: 1, placementTier: 'Masters', isChampionsWinner: false, accent: '#aa8c2c', tier: 'elite',
  }),
  team('heretics-2024', 'Team Heretics', 2024, 'VCT Masters Madrid', 'wo0t breakout · Madrid', 'EMEA', R('miniboo', 'riens', 'benjyfishy', 'boo', 'wo0t'), {
    teamRating: 90, placement: 'Masters Winner', championsWins: 0, mastersWins: 1, placementTier: 'Masters', isChampionsWinner: false, accent: '#f5c518', tier: 'strong',
  }),
  team('edg-2024', 'EDward Gaming', 2024, 'VCT Champions 2024', 'China Champions · zmjjKK', 'China', R('zmjjkk', 'chichoo', 'smoggy', 'wang', 'nobody'), {
    teamRating: 93, placement: 'Champions Winner', championsWins: 1, mastersWins: 0, placementTier: 'Champion', isChampionsWinner: true, accent: '#000000', tier: 'legendary',
  }),
  team('nrg-2023', 'NRG', 2023, 'VCT Americas 2023', 'Demon1 breakout season', 'Americas', R('demon1', 'ethos', 'sge', 'fiesta', 's0m'), {
    teamRating: 88, placement: 'Champions Playoffs', championsWins: 0, mastersWins: 0, placementTier: 'Top 8', isChampionsWinner: false, accent: '#c8102e', tier: 'strong',
  }),
  team('liquid-2023', 'Team Liquid', 2023, 'VCT EMEA 2023', 'nAts reunion · EMEA', 'EMEA', R('jamppi', 'enzo', 'keiko', 'nats-tl', 'redgar-tl'), {
    teamRating: 87, placement: 'Champions Playoffs', championsWins: 0, mastersWins: 0, placementTier: 'Top 8', isChampionsWinner: false, accent: '#0a1e5c', tier: 'solid',
  }),
  team('kc-2024', 'Karmine Corp', 2024, 'VCT EMEA 2024', 'French superteam rise', 'EMEA', R('sh1n', 'marteen', 'tomaszy', 'ayame', 'n4rrate'), {
    teamRating: 86, placement: 'Champions Groups', championsWins: 0, mastersWins: 0, placementTier: 'Top 16', isChampionsWinner: false, accent: '#3d5afe', tier: 'solid',
  }),
  team('leviatan-2023', 'Leviatán', 2023, 'VCT Americas 2023', 'LATAM power · kiNgg', 'Americas', R('kiNgg', 'c0m-lev', 'mazino', 'tacolilla', 'tex-lev'), {
    teamRating: 87, placement: 'Champions Playoffs', championsWins: 0, mastersWins: 0, placementTier: 'Top 8', isChampionsWinner: false, accent: '#00b4d8', tier: 'strong',
  }),
  team('fut-2024', 'FUT Esports', 2024, 'VCT EMEA 2024', 'Turkish contenders', 'EMEA', R('mrfoli', 'qutionerx', 'yetujey', 'cNed-fut', 'atakap'), {
    teamRating: 85, placement: 'Champions Groups', championsWins: 0, mastersWins: 0, placementTier: 'Top 16', isChampionsWinner: false, accent: '#00a651', tier: 'solid',
  }),
  team('navi-2023', 'NAVI', 2023, 'VCT EMEA 2023', 'CIS superteam experiment', 'EMEA', R('shao', 'zyppan', 'sociabl', 'suygetsu', 'ange1'), {
    teamRating: 86, placement: 'Champions Groups', championsWins: 0, mastersWins: 0, placementTier: 'Top 16', isChampionsWinner: false, accent: '#ffcc00', tier: 'solid',
  }),
];

const TEAM_MAP = new Map(VALORANT_TEAMS.map((t) => [t.id, t]));

export function getTeamById(id: string): HistoricalValorantTeam | undefined {
  return TEAM_MAP.get(id);
}

export function getAllTeams(): HistoricalValorantTeam[] {
  return VALORANT_TEAMS;
}

export function getValidTeams(): HistoricalValorantTeam[] {
  return VALORANT_TEAMS.filter((t) => {
    const slots = Object.values(t.roster);
    return slots.every((pid) => pid.length > 0);
  });
}

export function getTeamPool(filter?: (team: HistoricalValorantTeam) => boolean): HistoricalValorantTeam[] {
  const pool = getValidTeams();
  return filter ? pool.filter(filter) : pool;
}
