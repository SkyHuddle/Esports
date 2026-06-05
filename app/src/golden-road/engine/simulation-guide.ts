/** Player-facing explanation of Golden Road simulation logic */
export const SIMULATION_GUIDE = {
  headline: 'How OVR & the Golden Road work',
  intro:
    'Each card shows an overall rating (OVR) for that pro on that team and year — built from split stats plus what the team actually achieved that season (Worlds, MSI, etc.).',
  sections: [
    {
      title: 'What OVR means',
      body: 'OVR blends KDA, KP%, damage share, win rate, and games played — then adjusts for team results. World Champions have a rating floor so every starter reflects a title-winning roster.',
    },
    {
      title: 'Exact vs estimated',
      body: 'Most cards use full roster stats. A few show ~ when we only have split-wide data — those ratings are directionally right but less precise.',
    },
    {
      title: 'Respin',
      body: 'After the slot machine lands and you see the five players, you get one respin per game to roll a different team for the current round.',
    },
    {
      title: 'The four checks',
      body: 'Spring → MSI → Summer → Worlds. Each stage has five series (20 total, like Ring Chase). Domestic splits are easiest; MSI is harder; Worlds is the toughest gate.',
    },
    {
      title: 'Your result',
      body: 'After your fifth pick, your run resolves instantly. Series record is W-L across beats played (e.g. 3-1 in Spring). Stages cleared shows how far you got (e.g. 0/4).',
    },
  ],
} as const;
