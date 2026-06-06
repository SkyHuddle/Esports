import type { PlayerRatings, RoleConfidence, RosterSlot, ValorantPlayer, ValorantRole } from '../core/types';

type RatingInput = Partial<PlayerRatings> & { overall: number };

function r(input: RatingInput): PlayerRatings {
  const o = input.overall;
  return {
    overall: o,
    firepower: input.firepower ?? o,
    utility: input.utility ?? o - 2,
    clutch: input.clutch ?? o - 1,
    lan: input.lan ?? o,
    playoffs: input.playoffs ?? o,
    international: input.international ?? o - 1,
    consistency: input.consistency ?? o - 2,
    communication: input.communication ?? o - 3,
    leadership: input.leadership ?? o - 4,
    firstKillPressure: input.firstKillPressure ?? o - 2,
    roleFlexibility: input.roleFlexibility ?? o - 3,
    championshipFactor: input.championshipFactor ?? Math.min(99, o + 3),
  };
}

function rc(
  duelist: number,
  initiator: number,
  controller: number,
  sentinel: number,
  flex: number
): RoleConfidence {
  return { duelist, initiator, controller, sentinel, flex };
}

function p(
  id: string,
  gamertag: string,
  primaryRole: ValorantRole,
  secondaryRole: ValorantRole,
  organization: string,
  region: string,
  championsWins: number,
  mastersWins: number,
  achievement: string,
  ratings: RatingInput,
  roleConfidence: RoleConfidence,
  extras?: Partial<
    Pick<
      ValorantPlayer,
      'badge' | 'realName' | 'country' | 'accent' | 'sourceUrl' | 'internationalTitles'
    >
  >
): ValorantPlayer {
  return {
    id,
    gamertag,
    realName: extras?.realName,
    primaryRole,
    secondaryRole,
    roleConfidence,
    country: extras?.country ?? 'USA',
    region,
    organization,
    championsWins,
    mastersWins,
    internationalTitles: extras?.internationalTitles ?? championsWins + mastersWins,
    notableAchievement: achievement,
    badge: extras?.badge,
    ratings: r(ratings),
    accent: extras?.accent ?? '#c45c5c',
    sourceUrl: extras?.sourceUrl,
  };
}

export const VALORANT_PLAYERS: ValorantPlayer[] = [
  // Sentinels 2021
  p('tenz', 'TenZ', 'duelist', 'flex', 'Sentinels', 'Americas', 1, 0, 'Champions 2021 · Icon', { overall: 96, firepower: 97, firstKillPressure: 96, clutch: 94, lan: 93, championshipFactor: 96 }, rc(98, 40, 30, 35, 55), { badge: 'Champions', country: 'CA', sourceUrl: 'https://www.vlr.gg/player/9' }),
  p('shahzam', 'ShahZaM', 'flex', 'initiator', 'Sentinels', 'Americas', 1, 0, 'Champions IGL', { overall: 88, leadership: 92, communication: 91, utility: 87, international: 90 }, rc(45, 85, 60, 50, 90), { country: 'USA' }),
  p('sick', 'SicK', 'flex', 'controller', 'Sentinels', 'Americas', 1, 0, 'Champions flex', { overall: 89, utility: 90, roleFlexibility: 94, consistency: 88 }, rc(70, 75, 80, 55, 88), { country: 'USA' }),
  p('zombs', 'zombs', 'controller', 'sentinel', 'Sentinels', 'Americas', 1, 0, 'Champions controller', { overall: 87, utility: 91, consistency: 88 }, rc(30, 50, 92, 60, 55), { country: 'USA' }),
  p('dapr', 'dapr', 'sentinel', 'initiator', 'Sentinels', 'Americas', 1, 0, 'Champions sentinel', { overall: 86, utility: 88, clutch: 87, consistency: 88 }, rc(35, 70, 55, 95, 50), { country: 'USA' }),

  // LOUD 2022
  p('aspas', 'aspas', 'duelist', 'flex', 'LOUD', 'Americas', 1, 0, 'Champions 2022 MVP', { overall: 97, firepower: 98, firstKillPressure: 97, clutch: 95, lan: 94, championshipFactor: 97 }, rc(98, 45, 35, 40, 60), { badge: 'MVP', country: 'BR', sourceUrl: 'https://www.vlr.gg/player/858' }),
  p('less', 'Less', 'sentinel', 'controller', 'LOUD', 'Americas', 1, 0, 'Champions sentinel', { overall: 90, utility: 91, clutch: 89, consistency: 90 }, rc(30, 55, 70, 95, 45), { country: 'BR' }),
  p('sacy', 'Sacy', 'initiator', 'flex', 'LOUD', 'Americas', 1, 1, 'Champions · Masters', { overall: 89, utility: 92, communication: 90, international: 91 }, rc(50, 92, 65, 55, 80), { country: 'BR' }),
  p('pancada', 'pANcada', 'controller', 'sentinel', 'LOUD', 'Americas', 1, 0, 'Champions controller', { overall: 88, utility: 93, consistency: 89 }, rc(25, 50, 95, 70, 40), { country: 'BR' }),
  p('saadhak', 'saadhak', 'flex', 'controller', 'LOUD', 'Americas', 1, 0, 'Champions IGL', { overall: 90, leadership: 94, communication: 93, utility: 88, international: 92 }, rc(40, 75, 85, 50, 92), { badge: 'IGL', country: 'BR' }),

  // Fnatic 2023
  p('derke', 'Derke', 'duelist', 'flex', 'Fnatic', 'EMEA', 0, 2, 'Masters Tokyo · LOCK//IN', { overall: 94, firepower: 95, firstKillPressure: 94, clutch: 91 }, rc(96, 45, 35, 40, 55), { country: 'FI' }),
  p('leo', 'Leo', 'initiator', 'flex', 'Fnatic', 'EMEA', 0, 2, 'Masters initiator', { overall: 93, utility: 94, communication: 91, international: 92 }, rc(50, 95, 60, 55, 75), { country: 'GB' }),
  p('boaster', 'Boaster', 'flex', 'initiator', 'Fnatic', 'EMEA', 0, 2, 'Fnatic IGL', { overall: 88, leadership: 93, communication: 92, utility: 86 }, rc(40, 80, 55, 45, 92), { badge: 'IGL', country: 'GB' }),
  p('alfajer', 'Alfajer', 'sentinel', 'duelist', 'Fnatic', 'EMEA', 0, 2, 'Masters sentinel', { overall: 91, utility: 90, clutch: 90, consistency: 91 }, rc(65, 55, 50, 94, 50), { country: 'TR' }),
  p('chronicle-fn', 'Chronicle', 'flex', 'initiator', 'Fnatic', 'EMEA', 0, 2, 'Masters flex', { overall: 92, utility: 91, roleFlexibility: 95, international: 91 }, rc(70, 85, 75, 60, 88), { country: 'RU' }),

  // Paper Rex 2023
  p('something', 'something', 'duelist', 'flex', 'Paper Rex', 'Pacific', 0, 0, 'Pacific superstar', { overall: 95, firepower: 96, firstKillPressure: 95, clutch: 93 }, rc(97, 50, 35, 40, 55), { country: 'ID' }),
  p('jinggg', 'Jinggg', 'duelist', 'flex', 'Paper Rex', 'Pacific', 0, 0, 'PRX duelist', { overall: 92, firepower: 93, firstKillPressure: 92 }, rc(94, 45, 30, 35, 50), { country: 'SG' }),
  p('f0rsaken', 'f0rsakeN', 'flex', 'initiator', 'Paper Rex', 'Pacific', 0, 0, 'PRX IGL', { overall: 90, leadership: 91, utility: 89, communication: 90 }, rc(55, 88, 60, 50, 90), { country: 'ID' }),
  p('mindfreak', 'mindfreak', 'controller', 'sentinel', 'Paper Rex', 'Pacific', 0, 0, 'PRX controller', { overall: 88, utility: 92, consistency: 88 }, rc(25, 45, 94, 65, 40), { country: 'AU' }),
  p('d4v41', 'd4v41', 'sentinel', 'initiator', 'Paper Rex', 'Pacific', 0, 0, 'PRX sentinel', { overall: 87, utility: 88, clutch: 86 }, rc(35, 70, 55, 93, 45), { country: 'MY' }),

  // Evil Geniuses 2023
  p('yay', 'yay', 'duelist', 'flex', 'Evil Geniuses', 'Americas', 1, 1, 'Champions 2023', { overall: 95, firepower: 96, firstKillPressure: 95, clutch: 93, lan: 92 }, rc(96, 45, 35, 40, 60), { badge: 'Champions', country: 'USA' }),
  p('boostio', 'Boostio', 'flex', 'initiator', 'Evil Geniuses', 'Americas', 1, 0, 'Champions IGL', { overall: 89, leadership: 92, communication: 91, utility: 87 }, rc(50, 82, 55, 45, 90), { country: 'USA' }),
  p('com', 'C0M', 'initiator', 'flex', 'Evil Geniuses', 'Americas', 1, 0, 'Champions initiator', { overall: 88, utility: 90, communication: 88 }, rc(45, 92, 60, 50, 70), { country: 'USA' }),
  p('jawgemo', 'jawgemo', 'duelist', 'flex', 'Evil Geniuses', 'Americas', 1, 0, 'Champions duelist', { overall: 90, firepower: 91, firstKillPressure: 90 }, rc(93, 45, 30, 35, 55), { country: 'USA' }),
  p('ethan', 'Ethan', 'flex', 'initiator', 'Evil Geniuses', 'Americas', 1, 0, 'Champions flex', { overall: 89, utility: 90, roleFlexibility: 92, international: 90 }, rc(70, 80, 65, 55, 85), { country: 'USA' }),

  // OpTic 2022
  p('yay-optic', 'yay', 'duelist', 'flex', 'OpTic Gaming', 'Americas', 0, 1, 'Masters Reykjavík', { overall: 94, firepower: 95, firstKillPressure: 94, clutch: 92 }, rc(96, 45, 35, 40, 55), { country: 'USA' }),
  p('fns', 'FNS', 'flex', 'initiator', 'OpTic Gaming', 'Americas', 0, 1, 'Masters IGL', { overall: 87, leadership: 91, communication: 90, utility: 86 }, rc(40, 78, 55, 45, 90), { country: 'CA' }),
  p('crashies', 'crashies', 'initiator', 'flex', 'OpTic Gaming', 'Americas', 0, 1, 'Masters initiator', { overall: 89, utility: 91, communication: 88 }, rc(45, 93, 60, 50, 72), { country: 'USA' }),
  p('victor', 'Victor', 'duelist', 'flex', 'OpTic Gaming', 'Americas', 0, 1, 'Masters duelist', { overall: 90, firepower: 91, firstKillPressure: 90 }, rc(92, 45, 30, 35, 50), { country: 'USA' }),
  p('marved', 'Marved', 'controller', 'sentinel', 'OpTic Gaming', 'Americas', 0, 1, 'Masters controller', { overall: 88, utility: 92, consistency: 88 }, rc(25, 50, 94, 65, 40), { country: 'CA' }),

  // DRX 2022
  p('stax', 'stax', 'flex', 'initiator', 'DRX', 'Pacific', 0, 0, 'DRX IGL · Finals', { overall: 90, leadership: 92, communication: 91, utility: 88, international: 91 }, rc(45, 85, 60, 50, 92), { country: 'KR' }),
  p('mako', 'MaKo', 'controller', 'sentinel', 'DRX', 'Pacific', 0, 0, 'DRX controller', { overall: 91, utility: 94, consistency: 90, international: 90 }, rc(30, 55, 96, 70, 45), { country: 'KR' }),
  p('buzz', 'Buzz', 'duelist', 'flex', 'DRX', 'Pacific', 0, 0, 'DRX duelist', { overall: 91, firepower: 92, firstKillPressure: 91 }, rc(93, 45, 35, 40, 55), { country: 'KR' }),
  p('rb', 'Rb', 'initiator', 'flex', 'DRX', 'Pacific', 0, 0, 'DRX initiator', { overall: 88, utility: 90, communication: 87 }, rc(50, 90, 55, 50, 70), { country: 'KR' }),
  p('zest', 'Zest', 'sentinel', 'duelist', 'DRX', 'Pacific', 0, 0, 'DRX sentinel', { overall: 87, utility: 86, clutch: 86 }, rc(60, 50, 45, 92, 45), { country: 'KR' }),

  // Acend 2021
  p('cned', 'cNed', 'duelist', 'flex', 'Acend', 'EMEA', 1, 0, 'Champions 2021', { overall: 93, firepower: 94, firstKillPressure: 93, clutch: 91, championshipFactor: 94 }, rc(95, 45, 35, 40, 55), { badge: 'Champions', country: 'TR' }),
  p('zeek', 'zeek', 'flex', 'initiator', 'Acend', 'EMEA', 1, 0, 'Champions IGL', { overall: 87, leadership: 90, communication: 89, utility: 86 }, rc(45, 80, 55, 45, 88), { country: 'GB' }),
  p('starxo', 'starxo', 'initiator', 'flex', 'Acend', 'EMEA', 1, 0, 'Champions initiator', { overall: 86, utility: 88, communication: 87 }, rc(45, 90, 55, 50, 65), { country: 'BG' }),
  p('kryptix', 'KRYPTIX', 'controller', 'sentinel', 'Acend', 'EMEA', 1, 0, 'Champions controller', { overall: 85, utility: 89, consistency: 86 }, rc(25, 45, 92, 65, 40), { country: 'GB' }),
  p('bonecrusher', 'BONECRUSHER', 'sentinel', 'initiator', 'Acend', 'EMEA', 1, 0, 'Champions sentinel', { overall: 84, utility: 86, clutch: 85 }, rc(35, 65, 50, 93, 45), { country: 'RU' }),

  // Gambit 2021
  p('nats', 'nAts', 'sentinel', 'controller', 'Gambit Esports', 'EMEA', 0, 1, 'Masters Reykjavík', { overall: 92, utility: 93, clutch: 90, consistency: 91, international: 91 }, rc(40, 55, 75, 96, 50), { badge: 'Masters', country: 'RU' }),
  p('chronicle-gmb', 'Chronicle', 'flex', 'initiator', 'Gambit Esports', 'EMEA', 0, 1, 'Masters flex', { overall: 91, utility: 90, roleFlexibility: 94 }, rc(70, 85, 70, 60, 88), { country: 'RU' }),
  p('d3ffo', 'd3ffo', 'controller', 'sentinel', 'Gambit Esports', 'EMEA', 0, 1, 'Masters controller', { overall: 88, utility: 92, consistency: 88 }, rc(25, 50, 94, 70, 40), { country: 'RU' }),
  p('redgar', 'Redgar', 'flex', 'initiator', 'Gambit Esports', 'EMEA', 0, 1, 'Masters IGL', { overall: 87, leadership: 90, communication: 89, utility: 86 }, rc(45, 82, 60, 50, 88), { country: 'RU' }),
  p('sheydos', 'sheydos', 'initiator', 'flex', 'Gambit Esports', 'EMEA', 0, 1, 'Masters initiator', { overall: 86, utility: 88, communication: 86 }, rc(45, 90, 55, 50, 65), { country: 'RU' }),

  // Gen.G 2024
  p('meteor', 'Meteor', 'duelist', 'flex', 'Gen.G', 'Pacific', 0, 1, 'Masters Shanghai', { overall: 93, firepower: 94, firstKillPressure: 93 }, rc(95, 45, 35, 40, 55), { country: 'KR' }),
  p('t3xture', 't3xture', 'flex', 'duelist', 'Gen.G', 'Pacific', 0, 1, 'Masters flex', { overall: 91, firepower: 92, roleFlexibility: 90 }, rc(85, 55, 50, 45, 80), { country: 'KR' }),
  p('munchkin', 'Munchkin', 'initiator', 'flex', 'Gen.G', 'Pacific', 0, 1, 'Masters initiator', { overall: 89, utility: 91, communication: 88 }, rc(50, 92, 60, 55, 70), { country: 'KR' }),
  p('kar-on', 'Karon', 'controller', 'sentinel', 'Gen.G', 'Pacific', 0, 1, 'Masters controller', { overall: 88, utility: 92, consistency: 88 }, rc(25, 50, 94, 65, 40), { country: 'KR' }),
  p('tex', 'tex', 'duelist', 'flex', 'Gen.G', 'Pacific', 0, 1, 'Masters duelist', { overall: 90, firepower: 91, firstKillPressure: 90 }, rc(92, 45, 30, 35, 50), { country: 'KR' }),

  // Team Heretics 2024
  p('miniboo', 'MiniBoo', 'duelist', 'flex', 'Team Heretics', 'EMEA', 0, 1, 'Masters Madrid', { overall: 92, firepower: 93, firstKillPressure: 92 }, rc(94, 45, 30, 35, 50), { country: 'ES' }),
  p('wo0t', 'wo0t', 'flex', 'duelist', 'Team Heretics', 'EMEA', 0, 1, 'Masters flex', { overall: 91, firepower: 92, roleFlexibility: 88 }, rc(88, 55, 50, 45, 75), { country: 'RU' }),
  p('riens', 'RieNs', 'initiator', 'flex', 'Team Heretics', 'EMEA', 0, 1, 'Masters initiator', { overall: 88, utility: 90, communication: 87 }, rc(45, 91, 55, 50, 68), { country: 'TR' }),
  p('benjyfishy', 'Benjyfishy', 'controller', 'sentinel', 'Team Heretics', 'EMEA', 0, 1, 'Masters controller', { overall: 87, utility: 91, consistency: 87 }, rc(25, 45, 93, 65, 40), { country: 'GB' }),
  p('boo', 'boo', 'flex', 'initiator', 'Team Heretics', 'EMEA', 0, 1, 'Masters IGL', { overall: 86, leadership: 89, communication: 88, utility: 85 }, rc(40, 78, 55, 45, 88), { country: 'FI' }),

  // EDward Gaming 2024
  p('zmjjkk', 'zmjjKK', 'duelist', 'flex', 'EDward Gaming', 'China', 1, 0, 'Champions 2024', { overall: 95, firepower: 96, firstKillPressure: 95, clutch: 93, championshipFactor: 95 }, rc(96, 45, 35, 40, 55), { badge: 'Champions', country: 'CN' }),
  p('chichoo', 'CHICHOO', 'duelist', 'flex', 'EDward Gaming', 'China', 1, 0, 'Champions duelist', { overall: 92, firepower: 93, firstKillPressure: 92 }, rc(93, 45, 30, 35, 50), { country: 'CN' }),
  p('smoggy', 'Smoggy', 'controller', 'sentinel', 'EDward Gaming', 'China', 1, 0, 'Champions controller', { overall: 90, utility: 93, consistency: 89 }, rc(30, 55, 95, 70, 45), { country: 'CN' }),
  p('nobody', 'nobody', 'flex', 'initiator', 'EDward Gaming', 'China', 1, 0, 'Champions IGL', { overall: 89, leadership: 91, communication: 90, utility: 87 }, rc(45, 82, 60, 50, 90), { country: 'CN' }),
  p('wang', 'Wang', 'sentinel', 'initiator', 'EDward Gaming', 'China', 1, 0, 'Champions sentinel', { overall: 88, utility: 88, clutch: 87 }, rc(35, 70, 55, 93, 45), { country: 'CN' }),

  // NRG 2023
  p('demon1', 'Demon1', 'duelist', 'flex', 'NRG', 'Americas', 0, 0, 'Americas superstar', { overall: 94, firepower: 95, firstKillPressure: 94, clutch: 91 }, rc(96, 45, 35, 40, 55), { country: 'USA' }),
  p('s0m', 's0m', 'flex', 'initiator', 'NRG', 'Americas', 0, 0, 'NRG flex', { overall: 88, utility: 89, roleFlexibility: 90 }, rc(70, 80, 60, 55, 82), { country: 'USA' }),
  p('ethos', 'Ethos', 'initiator', 'flex', 'NRG', 'Americas', 0, 0, 'NRG initiator', { overall: 86, utility: 88, communication: 86 }, rc(45, 88, 55, 50, 65), { country: 'USA' }),
  p('sge', 'sge', 'controller', 'sentinel', 'NRG', 'Americas', 0, 0, 'NRG controller', { overall: 85, utility: 89, consistency: 85 }, rc(25, 45, 91, 65, 40), { country: 'USA' }),
  p('fiesta', 'fiesta', 'sentinel', 'initiator', 'NRG', 'Americas', 0, 0, 'NRG sentinel', { overall: 84, utility: 85, clutch: 84 }, rc(35, 65, 50, 90, 45), { country: 'USA' }),

  // Team Liquid 2023
  p('nats-tl', 'nAts', 'sentinel', 'controller', 'Team Liquid', 'EMEA', 0, 0, 'Liquid sentinel', { overall: 90, utility: 91, clutch: 88, consistency: 89 }, rc(40, 55, 70, 94, 50), { country: 'RU' }),
  p('jamppi', 'Jamppi', 'duelist', 'flex', 'Team Liquid', 'EMEA', 0, 0, 'Liquid duelist', { overall: 89, firepower: 90, firstKillPressure: 89 }, rc(92, 45, 30, 35, 50), { country: 'FI' }),
  p('redgar-tl', 'Redgar', 'flex', 'initiator', 'Team Liquid', 'EMEA', 0, 0, 'Liquid IGL', { overall: 86, leadership: 89, communication: 88, utility: 85 }, rc(45, 80, 55, 45, 88), { country: 'RU' }),
  p('enzo', 'Enzo', 'initiator', 'flex', 'Team Liquid', 'EMEA', 0, 0, 'Liquid initiator', { overall: 87, utility: 89, communication: 86 }, rc(45, 90, 55, 50, 68), { country: 'FR' }),
  p('keiko', 'Keiko', 'controller', 'sentinel', 'Team Liquid', 'EMEA', 0, 0, 'Liquid controller', { overall: 85, utility: 89, consistency: 85 }, rc(25, 45, 91, 65, 40), { country: 'GB' }),

  // Karmine Corp 2024
  p('sh1n', 'sh1n', 'duelist', 'flex', 'Karmine Corp', 'EMEA', 0, 0, 'KC duelist', { overall: 89, firepower: 90, firstKillPressure: 89 }, rc(91, 45, 30, 35, 50), { country: 'FR' }),
  p('marteen', 'marteen', 'initiator', 'flex', 'Karmine Corp', 'EMEA', 0, 0, 'KC initiator', { overall: 87, utility: 89, communication: 86 }, rc(45, 88, 55, 50, 65), { country: 'FR' }),
  p('n4rrate', 'N4RRATE', 'flex', 'initiator', 'Karmine Corp', 'EMEA', 0, 0, 'KC IGL', { overall: 86, leadership: 88, communication: 87, utility: 85 }, rc(45, 78, 55, 45, 86), { country: 'FR' }),
  p('tomaszy', 'tomaszy', 'controller', 'sentinel', 'Karmine Corp', 'EMEA', 0, 0, 'KC controller', { overall: 85, utility: 89, consistency: 85 }, rc(25, 45, 91, 65, 40), { country: 'PL' }),
  p('ayame', 'Ayame', 'sentinel', 'initiator', 'Karmine Corp', 'EMEA', 0, 0, 'KC sentinel', { overall: 84, utility: 85, clutch: 84 }, rc(35, 65, 50, 90, 45), { country: 'FR' }),

  // Leviatán 2023
  p('kiNgg', 'kiNgg', 'duelist', 'flex', 'Leviatán', 'Americas', 0, 0, 'LATAM duelist', { overall: 91, firepower: 92, firstKillPressure: 91 }, rc(93, 45, 30, 35, 50), { country: 'AR' }),
  p('tacolilla', 'tacolilla', 'duelist', 'flex', 'Leviatán', 'Americas', 0, 0, 'LATAM star', { overall: 90, firepower: 91, firstKillPressure: 90 }, rc(92, 45, 30, 35, 50), { country: 'CL' }),
  p('c0m-lev', 'C0M', 'initiator', 'flex', 'Leviatán', 'Americas', 0, 0, 'LATAM initiator', { overall: 87, utility: 89, communication: 86 }, rc(45, 88, 55, 50, 65), { country: 'AR' }),
  p('mazino', 'Mazino', 'controller', 'sentinel', 'Leviatán', 'Americas', 0, 0, 'LATAM controller', { overall: 86, utility: 90, consistency: 86 }, rc(25, 45, 92, 65, 40), { country: 'MX' }),
  p('tex-lev', 'tex', 'flex', 'initiator', 'Leviatán', 'Americas', 0, 0, 'LATAM IGL', { overall: 85, leadership: 87, communication: 86, utility: 84 }, rc(45, 78, 55, 45, 85), { country: 'MX' }),

  // FUT Esports 2024
  p('atakap', 'AtaKaptan', 'flex', 'initiator', 'FUT Esports', 'EMEA', 0, 0, 'FUT IGL', { overall: 87, leadership: 89, communication: 88, utility: 86 }, rc(45, 80, 55, 45, 88), { country: 'TR' }),
  p('mrfoli', 'MrFalinho', 'duelist', 'flex', 'FUT Esports', 'EMEA', 0, 0, 'FUT duelist', { overall: 89, firepower: 90, firstKillPressure: 89 }, rc(91, 45, 30, 35, 50), { country: 'TR' }),
  p('qutionerx', 'qRaxs', 'initiator', 'flex', 'FUT Esports', 'EMEA', 0, 0, 'FUT initiator', { overall: 86, utility: 88, communication: 85 }, rc(45, 88, 55, 50, 65), { country: 'TR' }),
  p('yetujey', 'yetujey', 'controller', 'sentinel', 'FUT Esports', 'EMEA', 0, 0, 'FUT controller', { overall: 85, utility: 89, consistency: 85 }, rc(25, 45, 91, 65, 40), { country: 'TR' }),
  p('cNed-fut', 'cNed', 'duelist', 'flex', 'FUT Esports', 'EMEA', 0, 0, 'FUT duelist', { overall: 90, firepower: 91, firstKillPressure: 90 }, rc(92, 45, 30, 35, 50), { country: 'TR' }),

  // NAVI 2023
  p('suygetsu', 'SUYGETSU', 'flex', 'initiator', 'NAVI', 'EMEA', 0, 0, 'NAVI flex', { overall: 89, utility: 90, roleFlexibility: 91 }, rc(65, 82, 70, 55, 85), { country: 'RU' }),
  p('ange1', 'ANGE1', 'flex', 'initiator', 'NAVI', 'EMEA', 0, 0, 'NAVI IGL', { overall: 86, leadership: 89, communication: 88, utility: 85 }, rc(45, 78, 55, 45, 88), { country: 'UA' }),
  p('shao', 'Shao', 'duelist', 'flex', 'NAVI', 'EMEA', 0, 0, 'NAVI duelist', { overall: 90, firepower: 91, firstKillPressure: 90 }, rc(92, 45, 30, 35, 50), { country: 'DK' }),
  p('zyppan', 'ZywOo-zyppan', 'initiator', 'flex', 'NAVI', 'EMEA', 0, 0, 'NAVI initiator', { overall: 87, utility: 89, communication: 86 }, rc(45, 88, 55, 50, 65), { country: 'SE' }),
  p('sociabl', 'sociablEE', 'controller', 'sentinel', 'NAVI', 'EMEA', 0, 0, 'NAVI controller', { overall: 85, utility: 89, consistency: 85 }, rc(25, 45, 91, 65, 40), { country: 'UA' }),
];

const PLAYER_MAP = new Map(VALORANT_PLAYERS.map((pl) => [pl.id, pl]));

export function getPlayerById(id: string): ValorantPlayer | undefined {
  return PLAYER_MAP.get(id);
}

export function getAllPlayers(): ValorantPlayer[] {
  return VALORANT_PLAYERS;
}

export function resolveRoster(ids: string[]): ValorantPlayer[] {
  return ids.map((id) => PLAYER_MAP.get(id)).filter((pl): pl is ValorantPlayer => pl != null);
}

export function roleFitScore(player: ValorantPlayer, slot: RosterSlot): number {
  return player.roleConfidence[slot];
}
