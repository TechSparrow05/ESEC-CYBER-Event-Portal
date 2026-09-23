import { CollegeEvent } from '../types';

export const DEFAULT_EVENTS: CollegeEvent[] = [
  {
    id: 'evt-tech-01',
    slug: 'code-sprint',
    title: 'Algorithmic Code Sprint',
    category: 'Technical',
    description: 'Intense competitive programming arena testing algorithmic efficiency, data structures, and edge-case solving. Real-time test-case validation with dynamic leaderboard.',
    shortDesc: 'Fast-paced speed coding and problem solving contest.',
    iconName: 'Code',
    fee: 150,
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    scheduleTime: 'Oct 15, 2026 • 10:00 AM',
    venue: 'Lab 3 (Turing Hall)',
    rules: [
      'Individual participation only.',
      'Supported languages: C++, Java, Python, Go.',
      'Total 5 problems, 90 minutes duration.',
      'Plagiarism detection strictly enforced.'
    ]
  },
  {
    id: 'evt-tech-02',
    slug: 'web-dev-hackathon',
    title: 'Full-Stack Web Dev Clash',
    category: 'Technical',
    description: 'Build and deploy a functional web application based on a live mystery prompt within 4 hours. Judged on responsiveness, UI aesthetic, clean code, and API architecture.',
    shortDesc: '4-hour sprint to build next-gen interactive web apps.',
    iconName: 'Layout',
    fee: 300,
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    scheduleTime: 'Oct 15, 2026 • 11:30 AM',
    venue: 'Incubation Center (Silicon Lab)',
    rules: [
      'Teams of 2 to 4 members.',
      'Framework agnostic (React, Next.js, Vue, or Vanilla).',
      'Git repository link must be submitted before deadline.',
      'Deployment on Vercel/Netlify required.'
    ]
  },
  {
    id: 'evt-tech-03',
    slug: 'paper-presentation',
    title: 'National Paper Presentation',
    category: 'Technical',
    description: 'Present innovative research in AI/ML, Quantum Computing, IoT, Cyber Security, or Sustainable Engineering before an eminent panel of IEEE chairpersons.',
    shortDesc: 'Showcase peer-reviewed scientific breakthroughs & research papers.',
    iconName: 'FileText',
    fee: 200,
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 3,
    scheduleTime: 'Oct 15, 2026 • 02:00 PM',
    venue: 'Auditorium Seminar Hall A',
    rules: [
      'Teams of 1 to 3 members.',
      'IEEE format paper (max 6 pages) submission.',
      '8 minutes presentation + 2 minutes Q&A.',
      'Bring 2 printed hard copies.'
    ]
  },
  {
    id: 'evt-tech-04',
    slug: 'circuit-debugging',
    title: 'Circuit Debug & Logic Design',
    category: 'Technical',
    description: 'Diagnose flawed PCB layouts, repair simulated analog and digital circuits, and construct optimal breadboard configurations under strict time constraints.',
    shortDesc: 'Hardware debugging, IC troubleshooting, and digital logic challenge.',
    iconName: 'Cpu',
    fee: 150,
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 2,
    scheduleTime: 'Oct 15, 2026 • 03:30 PM',
    venue: 'VLSI & Embedded Systems Lab',
    rules: [
      'Round 1: Written logic elimination (30 mins).',
      'Round 2: Live hardware debugging.',
      'Multimeters and probes provided on-site.'
    ]
  },
  {
    id: 'evt-nontech-01',
    slug: 'lens-craft-photography',
    title: 'LensCraft Photography',
    category: 'Non-Technical',
    description: 'Capture visual stories across the campus reflecting this year\'s theme: \'Vibrancy & Solitude\'. Digital processing and raw capture evaluation.',
    shortDesc: 'Campus photography contest capturing real emotion and light.',
    iconName: 'Camera',
    fee: 100,
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    scheduleTime: 'Oct 15, 2026 • 10:30 AM',
    venue: 'Open Amphitheatre Campus Grounds',
    rules: [
      'Single participant entry.',
      'DSLR or Smartphone entries categorized separately.',
      'Basic color correction permitted; heavy AI editing disqualified.',
      'Submit raw EXIF data with entries.'
    ]
  },
  {
    id: 'evt-nontech-02',
    slug: 'bgmi-esports-showdown',
    title: 'BGMI Esports Showdown',
    category: 'Non-Technical',
    description: 'Squad tactical battle royale tournament across Erangel and Miramar. Intense lobby matches culminating in an arena-streamed grand finals.',
    shortDesc: 'Mobile esports squad battle for dominance and championship trophy.',
    iconName: 'Gamepad2',
    fee: 400,
    isTeamEvent: true,
    minTeamSize: 4,
    maxTeamSize: 4,
    scheduleTime: 'Oct 15, 2026 • 01:00 PM',
    venue: 'Student Activity Center (SAC 2)',
    rules: [
      'Strictly 4 players per squad (Leader + 3 members).',
      'Mobile devices only (No tablets/emulators).',
      'Point system: Placement + Elimination points.',
      'Screenshots required at match end.'
    ]
  },
  {
    id: 'evt-nontech-03',
    slug: 'mystery-treasure-hunt',
    title: 'The Da Vinci Code Hunt',
    category: 'Non-Technical',
    description: 'Decrypt cryptographic clues, decipher riddles hidden across campus landmarks, and unlock checkpoints to uncover the grand relic before other squads.',
    shortDesc: 'Campus-wide cryptic treasure hunt requiring lateral thinking.',
    iconName: 'Compass',
    fee: 250,
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    scheduleTime: 'Oct 15, 2026 • 02:30 PM',
    venue: 'Main Library Quadrangle',
    rules: [
      'Teams of 2 to 4 members.',
      'Each clue must be validated at marshaled checkpoints.',
      'Time-based penalty for wrong attempts.',
      'Physical navigation only - no outside interference.'
    ]
  },
  {
    id: 'evt-nontech-04',
    slug: 'adzap-marketing-mania',
    title: 'AdZap: Marketing Mania',
    category: 'Non-Technical',
    description: 'Market absurd, humorous, or impossible products on spot with spontaneous skits, jingles, and brand pitches to convince the jury.',
    shortDesc: 'Spontaneous product pitch, theatrical comedy, and creative marketing.',
    iconName: 'Megaphone',
    fee: 200,
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    scheduleTime: 'Oct 15, 2026 • 04:00 PM',
    venue: 'Mini Auditorium',
    rules: [
      'Teams of 2 to 4 members.',
      'Preparation time: 5 minutes after prompt draw.',
      'Stage performance time: 3 to 4 minutes.',
      'Judged on humor, wit, and persuasiveness.'
    ]
  }
];
