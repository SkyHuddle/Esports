import type { HistoricalCsTeam, RosterSlot, TeamTier } from '../core/types';

type RosterInput = Record<RosterSlot, string>;

/** Explicit igl → awper → entry → lurker → support mapping */
function R(
  igl: string,
  awper: string,
  entry: string,
  lurker: string,
  support: string
): Record<RosterSlot, string> {
  return { igl, awper, entry, lurker, support };
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
    majorWins: number;
    majorPlacement: string;
    isMajorWinner: boolean;
    isIconicRoster?: boolean;
    accent: string;
    tier: TeamTier;
  }
): HistoricalCsTeam {
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
    majorWins: opts.majorWins,
    majorPlacement: opts.majorPlacement,
    isMajorWinner: opts.isMajorWinner,
    isIconicRoster: opts.isIconicRoster ?? true,
    accent: opts.accent,
    tier: opts.tier,
  };
}

export const CS_TEAMS: HistoricalCsTeam[] = [
  team('astralis-2018', 'Astralis', 2018, 'FACEIT London Major', 'First Astralis major · Device peak', 'EU', R('gla1ve', 'device', 'magisk', 'dupreeh', 'xyp9x'), {
    teamRating: 95, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#E63946', tier: 'legendary',
  }),
  team('astralis-2019', 'Astralis', 2019, 'IEM Katowice Major', 'Back-to-back majors · Dynasty', 'EU', R('gla1ve', 'device', 'magisk', 'dupreeh', 'xyp9x'), {
    teamRating: 96, placement: 'Major Champion', majorWins: 2, majorPlacement: 'Champion', isMajorWinner: true, accent: '#E63946', tier: 'legendary',
  }),
  team('navi-2021', 'NAVI', 2021, 'PGL Stockholm Major', 'Perfect major run · s1mple MVP', 'EU', R('boombl4', 's1mple', 'b1t', 'electronic', 'perfecto'), {
    teamRating: 94, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FFD700', tier: 'legendary',
  }),
  team('faze-2022', 'FaZe Clan', 2022, 'PGL Antwerp Major', 'Karrigan redemption arc', 'EU', R('karrigan', 'broky', 'rain', 'ropz', 'twistzz'), {
    teamRating: 93, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FF0000', tier: 'legendary',
  }),
  team('vitality-2023', 'Team Vitality', 2023, 'BLAST Paris Major', 'Home crowd major · ZywOo crowning', 'EU', R('apex', 'zywoo', 'spinx', 'flamez', 'mezii'), {
    teamRating: 92, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#1B4D3E', tier: 'legendary',
  }),
  team('spirit-2024', 'Team Spirit', 2024, 'PGL Copenhagen Major', 'donk phenomenon · Young champions', 'EU', R('chopper', 'sh1ro', 'donk', 'zont1x', 'magixx'), {
    teamRating: 91, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#7B2D8E', tier: 'legendary',
  }),
  team('fnatic-2015', 'Fnatic', 2015, 'ESL One Cologne', 'Back-to-back Cologne · JW era', 'EU', R('pronax', 'jw', 'olofmeister', 'flusha', 'krimz'), {
    teamRating: 93, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FF6600', tier: 'legendary',
  }),
  team('sk-2017', 'SK Gaming', 2017, 'PGL Kraków Major', 'Second major · Brazilian core', 'SA', R('fallen', 'coldzera', 'fer', 'fnx', 'taco'), {
    teamRating: 92, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#006400', tier: 'legendary',
  }),
  team('luminosity-2016', 'Luminosity', 2016, 'MLG Columbus Major', 'First Brazilian major', 'SA', R('fallen', 'coldzera', 'fer', 'fnx', 'taco'), {
    teamRating: 91, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FFD700', tier: 'legendary',
  }),
  team('cloud9-2018', 'Cloud9', 2018, 'ELEAGUE Boston Major', 'First NA major · Underdog run', 'NA', R('stewie2k', 'skadoodle', 'tarik', 'autimatic', 'rush'), {
    teamRating: 88, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#00AEEF', tier: 'elite',
  }),
  team('nip-2014', 'NiP', 2014, 'ESL One Cologne', 'f0rest era · Swedish legends', 'EU', R('xizt', 'fiff', 'f0rest', 'get_right', 'friberg'), {
    teamRating: 89, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FFD700', tier: 'elite',
  }),
  team('envy-2015', 'Team EnVyUs', 2015, 'DreamHack Cluj-Napoca', 'kennyS MVP major', 'EU', R('happy', 'kennyS', 'apex', 'nbk', 'kio'), {
    teamRating: 90, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#003366', tier: 'elite',
  }),
  team('gambit-2017', 'Gambit Esports', 2017, 'PGL Kraków Major', 'Zeus redemption · Underdogs', 'EU', R('zeus', 'adren', 'hobbit', 'mou', 'dosia'), {
    teamRating: 86, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#8B0000', tier: 'strong',
  }),
  team('vp-2014', 'Virtus.pro', 2014, 'ESL Katowice Major', 'Virtus plow · Polish power', 'EU', R('neo', 'pasha', 'byali', 'taz', 'snax'), {
    teamRating: 90, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FF6600', tier: 'elite',
  }),
  team('liquid-2019', 'Team Liquid', 2019, 'IEM Katowice Major', 'Grand final heartbreak vs Astralis', 'NA', R('nitr0', 'stewie2k', 'elige', 'naf', 'twistzz'), {
    teamRating: 91, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#0066CC', tier: 'elite',
  }),
  team('g2-2023', 'G2 Esports', 2023, 'BLAST Paris Major', 'NiKo major heartbreak · Semifinal', 'EU', R('hooxi', 'm0nesy', 'niko', 'hunter', 'jks'), {
    teamRating: 90, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#000000', tier: 'elite',
  }),
  team('faze-2017', 'FaZe Clan', 2017, 'ECS Season 3 Finals', 'Superteam before the major win', 'EU', R('karrigan', 'allu', 'rain', 'niko', 'kioshima'), {
    teamRating: 87, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#FF0000', tier: 'strong',
  }),
  team('mouz-2018', 'MOUZ', 2018, 'WESG World Finals', 'Breakthrough international run', 'EU', R('cadian', 'smooya', 'frozen', 'blamef', 'sjuush'), {
    teamRating: 84, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#FF0000', tier: 'solid',
  }),
  team('big-2017', 'BIG', 2017, 'PGL Kraków Major', 'Home crowd run · gob b IGL', 'EU', R('gob-b', 'smooya', 'tabsen', 'nex', 'tizian'), {
    teamRating: 83, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#FFD700', tier: 'solid',
  }),
  team('heroic-2022', 'Heroic', 2022, 'PGL Antwerp Major', 'cadiaN leadership · Deep run', 'EU', R('cadian', 'stavn', 'jabbi', 'blamef', 'sjuush'), {
    teamRating: 86, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#E63946', tier: 'strong',
  }),
  team('outsiders-2022', 'Outsiders', 2022, 'IEM Rio Major', 'Jame system · Rio champions', 'EU', R('jame', 'npl', 'fame', 'qikert', 'ferro'), {
    teamRating: 87, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#4169E1', tier: 'strong',
  }),
  team('imperial-2022', 'Imperial Esports', 2022, 'PGL Antwerp Major', 'Legends return · FER & FalleN', 'SA', R('fallen-imp', 'vini', 'fer-imp', 'boltz', 'chelo'), {
    teamRating: 80, placement: 'Legends Stage', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#006400', tier: 'underdog',
  }),
  team('c9-2024', 'Cloud9', 2024, 'PGL Copenhagen Major', 'sh1ro-led international roster', 'NA', R('hobbit-c9', 'sh1ro-c9', 'ax1le', 'b1t-c9', 'interz-c9'), {
    teamRating: 86, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#00AEEF', tier: 'strong',
  }),
  team('mongolz-2024', 'The MongolZ', 2024, 'PGL Copenhagen Major', 'Historic APAC breakthrough', 'APAC', R('breeze', '910', 'senzu', 'techno', 'mzinho'), {
    teamRating: 84, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#0066CC', tier: 'strong',
  }),
  team('navi-2010', 'NAVI', 2010, 'ESWC Grand Final', 'markeloff era · Early legends', 'EU', R('ceh9', 'markeloff', 'edward', 'starix', 'guardian'), {
    teamRating: 88, placement: 'Major Champion', majorWins: 1, majorPlacement: 'Champion', isMajorWinner: true, accent: '#FFD700', tier: 'elite',
  }),
  team('ence-2019', 'ENCE', 2019, 'IEM Katowice Major', 'Aleksib IGL · Berlin run', 'EU', R('aleksib', 'sergej', 'sunny', 'xseven', 'aerial'), {
    teamRating: 85, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#003366', tier: 'strong',
  }),
  team('vp-2015', 'Virtus.pro', 2015, 'ESL One Cologne', 'Second major final · VP plow', 'EU', R('neo-vp15', 'pasha-vp15', 'byali-vp15', 'taz-vp15', 'snax-vp15'), {
    teamRating: 89, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#FF6600', tier: 'elite',
  }),
  team('liquid-2016', 'Team Liquid', 2016, 'MLG Columbus Major', 's1mple flash · NA hope', 'NA', R('hiko-16', 's1mple-16', 'hsg', 'naf-16', 'jdm64'), {
    teamRating: 84, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#0066CC', tier: 'solid',
  }),
  team('renegades-2018', 'Renegades', 2018, 'IEM Boston Qualifier', 'jks breakout · APAC pioneers', 'APAC', R('dexter', 'azk', 'jks-reneg', 'liazz', 'ustilo'), {
    teamRating: 78, placement: 'Challengers Stage', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#FFD700', tier: 'underdog',
  }),
  team('complexity-2024', 'Complexity Gaming', 2024, 'PGL Copenhagen Major', 'blameF-led NA contender', 'NA', R('jt', 'hallzerk', 'blamef-col', 'floppy', 'grim'), {
    teamRating: 83, placement: 'Legends Stage', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#000000', tier: 'solid',
  }),
  team('fnatic-2018', 'Fnatic', 2018, 'IEM Katowice Major', 'Post-olof roster · Swedish core', 'EU', R('xizt', 'draken', 'jw', 'flusha', 'krimz'), {
    teamRating: 86, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#FF6600', tier: 'strong',
  }),
  team('nip-2013', 'NiP', 2013, 'DreamHack Winter', '87-0 streak roster', 'EU', R('xizt', 'fiff', 'f0rest', 'get_right', 'friberg'), {
    teamRating: 90, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#FFD700', tier: 'elite',
  }),
  team('liquid-2018', 'Team Liquid', 2018, 'FACEIT London Major', 'NA grand final heartbreak', 'NA', R('nitr0', 'twistzz', 'elige', 'naf', 'tacolilla'), {
    teamRating: 88, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#0066CC', tier: 'elite',
  }),
  team('g2-2016', 'G2 Esports', 2016, 'ESL Pro League S3 Finals', 'French superteam pre-major win', 'EU', R('ex6tenz', 'smithzz', 'shox', 'scream', 'bodyy'), {
    teamRating: 85, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#000000', tier: 'strong',
  }),
  team('mibr-2019', 'MIBR', 2019, 'Berlin Major', 'Brazilian dynasty in free fall', 'SA', R('fallen-mibr', 'lucas1-mibr', 'fer-mibr', 'kng-mibr', 'taco-mibr'), {
    teamRating: 76, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#FFD700', tier: 'underdog',
  }),
  team('100t-2021', '100 Thieves', 2021, 'PGL Stockholm Major', 'CS project shut down', 'NA', R('stan-100t', 'ptr-100t', 'autimatic-100t', 'jks-100t', 'grimet-100t'), {
    teamRating: 75, placement: 'Challengers Stage', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#E31837', tier: 'underdog',
  }),
  team('nrg-2019', 'NRG Esports', 2019, 'Berlin Major', 'NA groups disappointment', 'NA', R('daps-nrg', 'cerq-nrg', 'ethan-nrg', 'nafta-nrg', 'brehze-nrg'), {
    teamRating: 77, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#FF6600', tier: 'underdog',
  }),
  team('tyloo-2019', 'TYLOO', 2019, 'Berlin Major', 'Historic CN major debut', 'APAC', R('tyloo-attacker', 'bntet-tyloo', 'summer-tyloo', 'ae-tyloo', 'freeman-tyloo'), {
    teamRating: 72, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#CC0000', tier: 'underdog',
  }),
  team('clg-2016', 'CLG', 2016, 'MLG Columbus Major', 'NA runs out early', 'NA', R('pita-clg', 'jdm-clg', 'fug-clg', 'reltu-clg', 'cutler-clg'), {
    teamRating: 74, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#000000', tier: 'underdog',
  }),
  team('vp-2018', 'Virtus.pro', 2018, 'FACEIT London Major', 'Plow era ends quietly', 'EU', R('neo', 'pasha', 'byali', 'taz', 'snax'), {
    teamRating: 79, placement: 'Legends Stage Exit', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#FF6600', tier: 'underdog',
  }),
  team('navi-2018', 'NAVI', 2018, 'FACEIT London Major', 's1mple peak · Zeus IGL', 'EU', R('zeus', 's1mple', 'electronic', 'flamie', 'edward'), {
    teamRating: 92, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#FFD700', tier: 'elite',
  }),
  team('ldlc-2014', 'Team LDLC', 2014, 'DreamHack Winter', 'French upset · Happy core', 'EU', R('happy', 'kennyS', 'shox', 'nbk', 'kio'), {
    teamRating: 88, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#003399', tier: 'elite',
  }),
  team('eg-2019', 'Evil Geniuses', 2019, 'Berlin Major', 'NA superteam peak', 'NA', R('stan-eg', 'cerq-eg', 'ethan-eg', 'brehze-eg', 'tarik-eg'), {
    teamRating: 89, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#0066CC', tier: 'strong',
  }),
  team('mouz-2024', 'MOUZ', 2024, 'PGL Copenhagen Major', 'siuhy era · Young stars', 'EU', R('siuhy', 'torzsi', 'frozen', 'jimpphat', 'brollan'), {
    teamRating: 90, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#FF0000', tier: 'elite',
  }),
  team('g2-2024', 'G2 Esports', 2024, 'PGL Copenhagen Major', 'NiKo heartbreak · Snax IGL', 'EU', R('snax-g2', 'm0nesy', 'niko', 'hunter', 'malbsmd'), {
    teamRating: 91, placement: 'Major Finalist', majorWins: 0, majorPlacement: 'Runner-Up', isMajorWinner: false, accent: '#000000', tier: 'elite',
  }),
  team('furia-2024', 'FURIA', 2024, 'PGL Copenhagen Major', 'FalleN return · BR hope', 'SA', R('fallen-furia', 'yuurih', 'kscerato', 'chelo-furia', 'skullz'), {
    teamRating: 86, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#000000', tier: 'strong',
  }),
  team('spacesoldiers-2018', 'Space Soldiers', 2018, 'ELEAGUE Boston Major', 'XANTARES aim · Turkish run', 'EU', R('maj3r', 'xantares', 'paz', 'ngin', 'dimke'), {
    teamRating: 78, placement: 'Legends Stage', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#E30A17', tier: 'underdog',
  }),
  team('north-2018', 'North', 2018, 'FACEIT London Major', 'MSL IGL · valde AWP', 'EU', R('msl', 'valde', 'aizy', 'k0nfig', 'niko-north'), {
    teamRating: 85, placement: 'Major Quarterfinalist', majorWins: 0, majorPlacement: 'Top 8', isMajorWinner: false, accent: '#0099CC', tier: 'solid',
  }),
  team('grayhound-2019', 'Grayhound', 2019, 'Berlin Major', 'APAC underdog · Quick exit', 'APAC', R('dexter-gh', 'aliStair-gh', 'malta-gh', 'dickw-gh', 'kaide-gh'), {
    teamRating: 71, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#FFD700', tier: 'underdog',
  }),
  team('avangar-2018', 'AVANGAR', 2018, 'ELEAGUE Boston Major', 'Jame system before Rio', 'EU', R('jame-av', 'fitch-av', 'dimasick-av', 'qikert-av', 'krizzen-av'), {
    teamRating: 73, placement: 'Legends Stage Exit', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#FFD700', tier: 'underdog',
  }),
  team('sprout-2017', 'Sprout', 2017, 'PGL Kraków Major', 'German upset one-hit wonder', 'EU', R('dav1g-spr', 'syrsoN-spr', 'denis-spr', 'innocent-spr', 'spiidi-spr'), {
    teamRating: 72, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#00A651', tier: 'underdog',
  }),
  team('optic-2019', 'OpTic', 2019, 'Berlin Major', 'NA superteam bust', 'NA', R('stan-optic', 'cerq-optic', 'ethan-optic', 'brehze-optic', 'nahte-optic'), {
    teamRating: 74, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#9ACD32', tier: 'underdog',
  }),
  team('pain-2022', 'paiN Gaming', 2022, 'PGL Antwerp Major', 'Brazilian underdog run', 'SA', R('biguzera', 'saffee', 'hardzao', 'nyezin', 'zevy'), {
    teamRating: 76, placement: 'Legends Stage', majorWins: 0, majorPlacement: 'Top 16', isMajorWinner: false, accent: '#006400', tier: 'underdog',
  }),
  team('gamerlegion-2023', 'GamerLegion', 2023, 'BLAST Paris Major', 'siuhy before MOUZ · Deep run', 'EU', R('siuhy-gl', 'acor-gl', 'im-gl', 'isak-gl', 'keoz-gl'), {
    teamRating: 77, placement: 'Major Semifinalist', majorWins: 0, majorPlacement: 'Top 4', isMajorWinner: false, accent: '#FF6600', tier: 'underdog',
  }),
  team('forze-2019', 'forZe', 2019, 'Berlin Major', 'CIS qualifier · Out in groups', 'EU', R('almazer-forze', 'jerry-forze', 'facecrack-forze', 'krizzen-forze', 'worldwide-forze'), {
    teamRating: 70, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#003366', tier: 'underdog',
  }),
  team('echofox-2018', 'Echo Fox', 2018, 'ELEAGUE Boston Major', 'NA experiment · No payoff', 'NA', R('stan-efx', 'cajunb-efx', 'tarik-efx', 'autimatic-efx', 'friberg-efx'), {
    teamRating: 73, placement: 'Opening Stage Exit', majorWins: 0, majorPlacement: 'Top 24', isMajorWinner: false, accent: '#FF6600', tier: 'underdog',
  }),
];

export function getAllTeams(): HistoricalCsTeam[] {
  return CS_TEAMS;
}

export function getTeamById(id: string): HistoricalCsTeam | undefined {
  return CS_TEAMS.find((t) => t.id === id);
}

export function getValidTeams(filter?: (t: HistoricalCsTeam) => boolean): HistoricalCsTeam[] {
  const teams = CS_TEAMS.filter((t) => Object.keys(t.roster).length >= 5);
  return filter ? teams.filter(filter) : teams;
}

export function getTeamPool(filter?: (team: HistoricalCsTeam) => boolean): HistoricalCsTeam[] {
  return getValidTeams(filter);
}
