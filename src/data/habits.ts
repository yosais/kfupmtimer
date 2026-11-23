export interface KfupmHabit {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  examReflection: string;
  accentHex: string;
}

export const KFUPM_SEVEN_HABITS: KfupmHabit[] = [
  {
    id: 'high-aspirations',
    number: '01',
    title: 'High Aspirations',
    tagline: 'Aim beyond minimum expectations',
    description:
      'KFUPM students think long-term and set ambitious personal benchmarks, focusing on value-added contributions that drive real scientific and societal progress.',
    examReflection: 'Approach every problem as an opportunity to demonstrate mastery.',
    accentHex: '#008540',
  },
  {
    id: 'self-reliance',
    number: '02',
    title: 'Self-Reliance',
    tagline: 'Navigate complexity with ownership',
    description:
      'From leading student-run global conferences to solving rigorous engineering challenges, students take independent ownership of their preparation and outcomes.',
    examReflection: 'Trust your preparation, pace your time calmly, and verify every step.',
    accentHex: '#00573F',
  },
  {
    id: 'international-culture',
    number: '03',
    title: 'International Culture',
    tagline: 'Think globally across perspectives',
    description:
      'Through global delegations, exchange programs, and cross-cultural collaborations, students expand their worldview and benchmark themselves against global excellence.',
    examReflection: 'Hold your work to international standards of clarity and rigor.',
    accentHex: '#003E51',
  },
  {
    id: 'multidisciplinary-thinking',
    number: '04',
    title: 'Multidisciplinary Thinking',
    tagline: 'Connect ideas across disciplines',
    description:
      'Modern challenges rarely sit inside one silo. Students bridge computing, energy, engineering, mathematics, and business to design complete, practical solutions.',
    examReflection: 'Connect foundational principles across concepts when tackling unfamiliar questions.',
    accentHex: '#007367',
  },
  {
    id: 'research',
    number: '05',
    title: 'Research',
    tagline: 'Driven by inquiry and discovery',
    description:
      'Curiosity and evidence-based analysis anchor academic life at KFUPM, empowering undergraduates and graduates alike to contribute to pioneering research.',
    examReflection: 'Read carefully, reason from first principles, and show clear derivations.',
    accentHex: '#008540',
  },
  {
    id: 'entrepreneurship',
    number: '06',
    title: 'Entrepreneurship',
    tagline: 'Turn bold ideas into impact',
    description:
      'Nurtured by KFUPM’s startup and innovation ecosystem, students cultivate initiative, creative problem-solving, and the courage to build real-world ventures.',
    examReflection: 'Stay resourceful — if one approach stalls, pivot constructively to another.',
    accentHex: '#AA8A00',
  },
  {
    id: 'positivity',
    number: '07',
    title: 'Positivity',
    tagline: 'Lead with optimism and purpose',
    description:
      'An optimistic, proactive mindset sustains resilience under pressure and strengthens the collaborative, socially responsible spirit of the Dhahran campus.',
    examReflection: 'Breathe steadily, stay composed, and finish with confidence.',
    accentHex: '#008540',
  },
];
