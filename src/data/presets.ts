import { DomainSuggestion, ExamPreset, ExamSessionConfig } from '../types/exam';

export const DEFAULT_PRESETS: ExamPreset[] = [
  {
    id: 'dur-10',
    name: '10 min',
    durationMinutes: 10,
    warningMinutes: 3,
    finalWarningMinutes: 1,
    category: 'Quiz',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '10-minute exam duration.',
  },
  {
    id: 'dur-15',
    name: '15 min',
    durationMinutes: 15,
    warningMinutes: 5,
    finalWarningMinutes: 1,
    category: 'Quiz',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '15-minute exam duration.',
  },
  {
    id: 'dur-30',
    name: '30 min',
    durationMinutes: 30,
    warningMinutes: 5,
    finalWarningMinutes: 2,
    category: 'Quiz',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '30-minute exam duration.',
  },
  {
    id: 'dur-45',
    name: '45 min',
    durationMinutes: 45,
    warningMinutes: 10,
    finalWarningMinutes: 5,
    category: 'Lab',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '45-minute exam duration.',
  },
  {
    id: 'dur-60',
    name: '1 hr',
    durationMinutes: 60,
    warningMinutes: 10,
    finalWarningMinutes: 5,
    category: 'Lab',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '60-minute exam duration.',
  },
  {
    id: 'dur-75',
    name: '1 hr 15 min',
    durationMinutes: 75,
    warningMinutes: 15,
    finalWarningMinutes: 5,
    category: 'Major',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '75-minute exam duration.',
  },
  {
    id: 'dur-90',
    name: '1 hr 30 min',
    durationMinutes: 90,
    warningMinutes: 15,
    finalWarningMinutes: 5,
    category: 'Major',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '90-minute exam duration.',
  },
  {
    id: 'dur-120',
    name: '2 hr',
    durationMinutes: 120,
    warningMinutes: 20,
    finalWarningMinutes: 5,
    category: 'Final',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '120-minute exam duration.',
  },
  {
    id: 'dur-150',
    name: '2 hr 30 min',
    durationMinutes: 150,
    warningMinutes: 25,
    finalWarningMinutes: 10,
    category: 'Final',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '150-minute exam duration.',
  },
  {
    id: 'dur-180',
    name: '3 hr',
    durationMinutes: 180,
    warningMinutes: 30,
    finalWarningMinutes: 10,
    category: 'Final',
    defaultBuilding: 'KFUPM Examination Hall',
    description: '180-minute exam duration.',
  },
];

export const DEFAULT_SESSION_CONFIG: ExamSessionConfig = {
  courseCode: '',
  examTitle: 'Examination',
  building: 'KFUPM Examination Hall',
  term: '',
  proctorNote:
    'Place your KFUPM ID card visibly on the desk. Electronic devices and smartwatches must remain switched off inside your bag.',
  soundEnabled: true,
  showSeconds: true,
  clockZone: 'riyadh',
};

export const DOMAIN_SUGGESTIONS: DomainSuggestion[] = [
  {
    domain: 'kfupmtimer.com',
    category: 'Direct & Memorable',
    rationale:
      'Immediately recognizable to every student and proctor, effortless to type on exam hall podium computers.',
    recommended: true,
  },
  {
    domain: 'towertime.sa',
    category: 'Symbolic & Saudi Native',
    rationale:
      'Honors the iconic KFUPM Water Tower while pairing with the national .sa domain for Vision 2030 identity.',
  },
  {
    domain: 'kfupmexam.com',
    category: 'Academic Focus',
    rationale:
      'Explicitly conveys its exam-hall role for common exams in Building 54 and departmental lecture rooms.',
  },
  {
    domain: 'jabalclock.com',
    category: 'Campus Heritage',
    rationale:
      'Celebrates Jabal Dhahran, the rocky hill at the heart of the campus community and student identity.',
  },
  {
    domain: 'b54timer.com',
    category: 'Hall Specific',
    rationale:
      'A crisp insider nod to Building 54, where thousands of KFUPM students sit their Major and Final exams.',
  },
  {
    domain: 'timer.kfupm.edu.sa',
    category: 'Official Institutional Subdomain',
    rationale:
      'Zero domain cost if adopted by KFUPM IT (ITC) via a simple CNAME record pointing to your free Vercel or Netlify deployment.',
  },
];
