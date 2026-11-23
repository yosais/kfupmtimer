export type PresetCategory = 'Major' | 'Final' | 'Quiz' | 'Lab' | 'Custom';

export interface ExamPreset {
  id: string;
  name: string;
  durationMinutes: number;
  warningMinutes: number;
  finalWarningMinutes: number;
  category: PresetCategory;
  defaultBuilding: string;
  description: string;
  isCustom?: boolean;
}

export type ClockZoneMode = 'riyadh' | 'local';

export interface ExamSessionConfig {
  courseCode: string;
  examTitle: string;
  building: string;
  term: string;
  proctorNote: string;
  soundEnabled: boolean;
  showSeconds: boolean;
  clockZone: ClockZoneMode;
}

export type TimerPhase =
  | 'ready'
  | 'running'
  | 'paused'
  | 'warning'
  | 'critical'
  | 'completed';

export interface DomainSuggestion {
  domain: string;
  category: string;
  rationale: string;
  recommended?: boolean;
}
