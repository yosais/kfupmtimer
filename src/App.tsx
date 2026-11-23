import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Maximize2,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DEFAULT_PRESETS, DEFAULT_SESSION_CONFIG } from './data/presets';
import { ExamPreset, ExamSessionConfig, TimerPhase } from './types/exam';
import { playExamChime } from './utils/audio';
import {
  formatDateHeader,
  formatDurationLabel,
  formatRemainingTime,
  formatWallClock,
} from './utils/time';
import { HallModeOverlay } from './components/HallModeOverlay';
import { KfupmTowerMonogram } from './components/KfupmTowerMonogram';
import { PresetModal } from './components/PresetModal';
import { SessionDrawer } from './components/SessionDrawer';
import { SevenHabitsShowcase } from './components/SevenHabitsShowcase';
import { TowerShowcase } from './components/TowerShowcase';

const STORAGE_PRESETS_KEY = 'kfupm_timer_presets_v3';
const STORAGE_SESSION_KEY = 'kfupm_timer_session_v3';
const STORAGE_THEME_KEY = 'kfupm_exam_timer_theme_v1';

function loadStoredPresets(): ExamPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRESETS_KEY);
    if (!raw) return DEFAULT_PRESETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Fallback to defaults
  }
  return DEFAULT_PRESETS;
}

function loadStoredSession(): ExamSessionConfig {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return DEFAULT_SESSION_CONFIG;
    return { ...DEFAULT_SESSION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SESSION_CONFIG;
  }
}

export default function App() {
  const [presets, setPresets] = useState<ExamPreset[]>(loadStoredPresets);
  const [activePresetId, setActivePresetId] = useState<string>(() => {
    const list = loadStoredPresets();
    return list.find((p) => p.durationMinutes === 75)?.id ?? list[0]?.id ?? DEFAULT_PRESETS[0].id;
  });
  const [session, setSession] = useState<ExamSessionConfig>(loadStoredSession);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  const activePreset = useMemo(
    () => presets.find((p) => p.id === activePresetId) ?? presets[0] ?? DEFAULT_PRESETS[0],
    [presets, activePresetId]
  );

  // Drift-free timer state anchored to wall-clock target timestamp
  const [totalSeconds, setTotalSeconds] = useState<number>(() => {
    const list = loadStoredPresets();
    const initial = list.find((p) => p.durationMinutes === 75) ?? list[0];
    return (initial?.durationMinutes ?? 75) * 60;
  });
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    const list = loadStoredPresets();
    const initial = list.find((p) => p.durationMinutes === 75) ?? list[0];
    return (initial?.durationMinutes ?? 75) * 60;
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const endTimestampRef = useRef<number | null>(null);

  const firedMilestonesRef = useRef<{
    warning: boolean;
    critical: boolean;
    complete: boolean;
  }>({ warning: false, critical: false, complete: false });

  const [now, setNow] = useState<Date>(() => new Date());

  // Overlays & modals
  const [isHallMode, setIsHallMode] = useState<boolean>(false);
  const [showHabitsInHall, setShowHabitsInHall] = useState<boolean>(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [editingPreset, setEditingPreset] = useState<ExamPreset | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(presets));
    } catch {
      // Ignore storage errors
    }
  }, [presets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage errors
    }
  }, [session]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (endTimestampRef.current === null) return;
      const diffSec = Math.max(0, (endTimestampRef.current - Date.now()) / 1000);
      setRemainingSeconds(diffSec);

      const warningSec = activePreset.warningMinutes * 60;
      const criticalSec = activePreset.finalWarningMinutes * 60;

      if (
        warningSec > 0 &&
        diffSec <= warningSec &&
        diffSec > criticalSec &&
        !firedMilestonesRef.current.warning
      ) {
        firedMilestonesRef.current.warning = true;
        if (session.soundEnabled) playExamChime('warning');
      }

      if (
        criticalSec > 0 &&
        diffSec <= criticalSec &&
        diffSec > 0 &&
        !firedMilestonesRef.current.critical
      ) {
        firedMilestonesRef.current.critical = true;
        if (session.soundEnabled) playExamChime('critical');
      }

      if (diffSec <= 0) {
        endTimestampRef.current = null;
        setIsRunning(false);
        setRemainingSeconds(0);
        if (!firedMilestonesRef.current.complete) {
          firedMilestonesRef.current.complete = true;
          if (session.soundEnabled) playExamChime('complete');
        }
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 200);
    return () => window.clearInterval(intervalId);
  }, [
    isRunning,
    activePreset.warningMinutes,
    activePreset.finalWarningMinutes,
    session.soundEnabled,
  ]);

  useEffect(() => {
    const labelParts = [session.courseCode.trim(), session.examTitle.trim()].filter(Boolean);
    const label = labelParts.join(' · ');
    if (isRunning) {
      document.title = `${formatRemainingTime(remainingSeconds, session.showSeconds)}${label ? ` · ${label}` : ''} · KFUPM Timer`;
    } else if (remainingSeconds === 0) {
      document.title = `Time Complete · KFUPM Timer`;
    } else {
      document.title = 'KFUPM Timer';
    }
  }, [isRunning, remainingSeconds, session.courseCode, session.examTitle, session.showSeconds]);

  const phase: TimerPhase = useMemo(() => {
    if (remainingSeconds <= 0) return 'completed';
    if (!isRunning) {
      return Math.abs(remainingSeconds - totalSeconds) < 0.5 ? 'ready' : 'paused';
    }
    if (
      activePreset.finalWarningMinutes > 0 &&
      remainingSeconds <= activePreset.finalWarningMinutes * 60
    ) {
      return 'critical';
    }
    if (
      activePreset.warningMinutes > 0 &&
      remainingSeconds <= activePreset.warningMinutes * 60
    ) {
      return 'warning';
    }
    return 'running';
  }, [
    remainingSeconds,
    totalSeconds,
    isRunning,
    activePreset.warningMinutes,
    activePreset.finalWarningMinutes,
  ]);

  const statusLabel = useMemo(() => {
    switch (phase) {
      case 'ready':
        return 'Ready to Begin';
      case 'running':
        return 'Examination in Progress';
      case 'paused':
        return 'Timer Paused';
      case 'warning':
        return `Final ${activePreset.warningMinutes} Minutes Advisory`;
      case 'critical':
        return `Final ${activePreset.finalWarningMinutes} Minutes Remaining`;
      case 'completed':
        return 'Time Complete — Pens Down';
    }
  }, [phase, activePreset.warningMinutes, activePreset.finalWarningMinutes]);

  const projectedEndTime = useMemo(() => {
    if (isRunning && endTimestampRef.current) {
      return new Date(endTimestampRef.current);
    }
    return new Date(now.getTime() + remainingSeconds * 1000);
  }, [isRunning, now, remainingSeconds]);

  const progressPercent =
    totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  const handleSelectPreset = useCallback((preset: ExamPreset) => {
    setActivePresetId(preset.id);
    const secs = preset.durationMinutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
    endTimestampRef.current = null;
    firedMilestonesRef.current = {
      warning: false,
      critical: false,
      complete: false,
    };
  }, []);

  const handleToggleRun = useCallback(() => {
    if (isRunning) {
      if (endTimestampRef.current !== null) {
        setRemainingSeconds(Math.max(0, (endTimestampRef.current - Date.now()) / 1000));
      }
      endTimestampRef.current = null;
      setIsRunning(false);
      return;
    }

    let startFrom = remainingSeconds;
    if (startFrom <= 0) {
      startFrom = totalSeconds;
      setRemainingSeconds(totalSeconds);
      firedMilestonesRef.current = {
        warning: false,
        critical: false,
        complete: false,
      };
    }

    if (session.soundEnabled && Math.abs(startFrom - totalSeconds) < 1) {
      playExamChime('start');
    }

    endTimestampRef.current = Date.now() + startFrom * 1000;
    setIsRunning(true);
  }, [isRunning, remainingSeconds, totalSeconds, session.soundEnabled]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    endTimestampRef.current = null;
    const secs = activePreset.durationMinutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    firedMilestonesRef.current = {
      warning: false,
      critical: false,
      complete: false,
    };
  }, [activePreset.durationMinutes]);

  const handleAdjustSeconds = useCallback(
    (deltaSeconds: number) => {
      const nextRemaining = Math.max(0, remainingSeconds + deltaSeconds);
      const nextTotal = Math.max(totalSeconds, nextRemaining);
      setTotalSeconds(nextTotal);
      setRemainingSeconds(nextRemaining);

      if (isRunning) {
        endTimestampRef.current = Date.now() + nextRemaining * 1000;
      }

      if (nextRemaining > activePreset.warningMinutes * 60) {
        firedMilestonesRef.current.warning = false;
      }
      if (nextRemaining > activePreset.finalWarningMinutes * 60) {
        firedMilestonesRef.current.critical = false;
      }
      if (nextRemaining > 0) {
        firedMilestonesRef.current.complete = false;
      }
    },
    [
      remainingSeconds,
      totalSeconds,
      isRunning,
      activePreset.warningMinutes,
      activePreset.finalWarningMinutes,
    ]
  );

  const handleSavePreset = (payload: Omit<ExamPreset, 'id'> & { id?: string }) => {
    if (payload.id) {
      const updated = presets.map((p) =>
        p.id === payload.id ? { ...p, ...payload, id: payload.id } : p
      );
      setPresets(updated);
      if (payload.id === activePresetId) {
        const secs = payload.durationMinutes * 60;
        setTotalSeconds(secs);
        setRemainingSeconds(secs);
        setIsRunning(false);
        endTimestampRef.current = null;
      }
      return;
    }

    const created: ExamPreset = {
      ...payload,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    setPresets((prev) => [created, ...prev]);
    handleSelectPreset(created);
  };

  const handleDeletePreset = (id: string) => {
    if (presets.length <= 1) return;
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    if (id === activePresetId && next[0]) {
      handleSelectPreset(next[0]);
    }
  };

  const handleRestoreDefaults = () => {
    setPresets(DEFAULT_PRESETS);
    handleSelectPreset(DEFAULT_PRESETS[0]);
  };

  const enterHallMode = () => {
    setIsHallMode(true);
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Fallback gracefully when fullscreen is restricted
    }
  };

  const exitHallMode = () => {
    setIsHallMode(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Ignore
    }
  };

  const digitColorClass =
    phase === 'completed' || phase === 'critical'
      ? 'text-[#B91C1C] dark:text-[#F87171]'
      : phase === 'warning'
        ? 'text-[#9A7400] dark:text-[#DAC961]'
        : 'text-[#0E1E19] dark:text-[#F4F8F7]';

  const phaseTextClass =
    phase === 'completed' || phase === 'critical'
      ? 'text-[#B91C1C] dark:text-[#F87171]'
      : phase === 'warning'
        ? 'text-[#9A7400] dark:text-[#DAC961]'
        : phase === 'running'
          ? 'text-[#008540] dark:text-[#10A859]'
          : 'text-[#4D5E58] dark:text-[#98B2BB]';

  const progressFillClass =
    phase === 'completed' || phase === 'critical'
      ? 'bg-[#B91C1C] dark:bg-[#EF4444]'
      : phase === 'warning'
        ? 'bg-[#B89014] dark:bg-[#DAC961]'
        : 'bg-[#008540] dark:bg-[#10A859]';

  return (
    <div className="min-h-screen bg-[#F7F8F6] dark:bg-[#07161B] text-[#13201B] dark:text-[#F1F5F4] transition-colors duration-200">
      {/* Clean 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E2E6E1] dark:border-[#163039] bg-[#F7F8F6]/95 dark:bg-[#07161B]/95 backdrop-blur-sm">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          <a
            href="#countdown"
            className="font-display text-lg font-bold tracking-tight text-[#0F241D] dark:text-[#F4F8F7] whitespace-nowrap shrink-0"
          >
            KFUPM Timer
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden sm:flex items-center gap-7 text-sm font-medium text-[#475852] dark:text-[#9BB4BD]"
          >
            <a
              href="#countdown"
              className="hover:text-[#008540] dark:hover:text-[#F1F5F4] transition-colors whitespace-nowrap shrink-0"
            >
              Timer
            </a>
            <a
              href="#habits"
              className="hover:text-[#008540] dark:hover:text-[#F1F5F4] transition-colors whitespace-nowrap shrink-0"
            >
              7 Habits
            </a>
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="hover:text-[#008540] dark:hover:text-[#F1F5F4] transition-colors whitespace-nowrap shrink-0"
            >
              Exam Details
            </button>
          </nav>

          <button
            type="button"
            onClick={enterHallMode}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#008540] hover:bg-[#006B33] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008540]"
          >
            <Maximize2 className="w-4 h-4" />
            Full Screen
          </button>
        </div>
      </header>

      <main className="max-w-[1240px] mx-auto px-6 py-8 space-y-12">
        {/* Focused 2-Column Exam Countdown + Genuine KFUPM Tower Stage */}
        <section
          id="countdown"
          aria-label="Exam Countdown Stage"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Left: Clean Countdown Card + Inline Presets */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-[#DCE1DC] dark:border-[#1A353F] bg-white dark:bg-[#0C2128] p-6 sm:p-8">
            {/* Exam Header & Quiet Controls */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#EAEEE9] dark:border-[#163039]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#52635D] dark:text-[#91ACB6]">
                  {[session.term.trim(), session.building.trim(), formatDateHeader(now, session.clockZone)]
                    .filter(Boolean)
                    .map((item, idx) => (
                      <span key={`${item}-${idx}`} className="inline-flex items-center gap-2">
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        <span>{item}</span>
                      </span>
                    ))}
                </div>
                <h1
                  className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#10211B] dark:text-[#F4F8F7]"
                  style={{ textWrap: 'balance' }}
                >
                  {[session.courseCode.trim(), session.examTitle.trim()]
                    .filter(Boolean)
                    .join(' · ') || 'Examination'}
                </h1>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(true)}
                  aria-label="Open exam details and preset settings"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DCE1DC] dark:border-[#1E3B46] text-xs font-medium text-[#354741] dark:text-[#BFD2D8] hover:bg-[#F3F6F3] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Details
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSession((prev) => ({
                      ...prev,
                      soundEnabled: !prev.soundEnabled,
                    }))
                  }
                  aria-label={session.soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                  className="p-2 rounded-xl border border-[#DCE1DC] dark:border-[#1E3B46] text-[#354741] dark:text-[#BFD2D8] hover:bg-[#F3F6F3] dark:hover:bg-[#132C35] transition-colors"
                >
                  {session.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#008540] dark:text-[#10A859]" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  className="p-2 rounded-xl border border-[#DCE1DC] dark:border-[#1E3B46] text-[#354741] dark:text-[#BFD2D8] hover:bg-[#F3F6F3] dark:hover:bg-[#132C35] transition-colors"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-[#DAC961]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#003E51]" />
                  )}
                </button>
              </div>
            </div>

            {/* Central Zero-Jitter Countdown */}
            <div className="py-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`text-sm font-semibold ${phaseTextClass}`}>
                  {statusLabel}
                </span>
                <span className="text-xs text-[#596A64] dark:text-[#8CA8B2] tabular-clock">
                  {formatDurationLabel(activePreset.durationMinutes)}
                </span>
              </div>

              <div
                className={`tabular-clock font-bold tracking-tight leading-none select-none ${digitColorClass}`}
                style={{ fontSize: 'clamp(3.5rem, 9vw, 6.75rem)' }}
                aria-live="off"
              >
                {formatRemainingTime(remainingSeconds, session.showSeconds)}
              </div>

              {/* Progress Track & Live Clock */}
              <div className="mt-7">
                <div className="h-2 w-full rounded-full bg-[#E8ECE7] dark:bg-[#132C35] overflow-hidden">
                  <div
                    className={`h-full rounded-full origin-left transition-transform duration-300 ${progressFillClass}`}
                    style={{
                      transform: `scaleX(${Math.min(1, Math.max(0, progressPercent / 100))})`,
                    }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-[#4D5E58] dark:text-[#98B2BB]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#008540] dark:text-[#10A859] shrink-0" />
                    <span>
                      {session.clockZone === 'riyadh' ? 'Dhahran' : 'Local'}:{' '}
                      <strong className="tabular-clock font-semibold text-[#13201B] dark:text-[#F1F5F4]">
                        {formatWallClock(now, session.clockZone, true)}
                      </strong>
                    </span>
                  </div>

                  <span>
                    Ends:{' '}
                    <strong className="tabular-clock font-semibold text-[#003E51] dark:text-[#DAC961]">
                      {formatWallClock(projectedEndTime, session.clockZone, false)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Controls + One-Click Presets */}
            <div className="pt-6 border-t border-[#EAEEE9] dark:border-[#163039] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleToggleRun}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#008540] hover:bg-[#006B33] transition-colors whitespace-nowrap shrink-0"
                  >
                    {isRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isRunning
                      ? 'Pause'
                      : remainingSeconds === 0
                        ? 'Restart'
                        : remainingSeconds < totalSeconds
                          ? 'Resume'
                          : 'Start Exam'}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-[#D4DBD5] dark:border-[#213F4A] text-[#1D2D27] dark:text-[#DCE7EA] hover:bg-[#F3F6F3] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAdjustSeconds(-60)}
                    aria-label="Subtract 1 minute"
                    className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold tabular-clock border border-[#DCE1DC] dark:border-[#1E3B46] text-[#354741] dark:text-[#BFD2D8] hover:bg-[#F3F6F3] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Minus className="w-3.5 h-3.5" />1m
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustSeconds(300)}
                    aria-label="Add 5 minutes"
                    className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold tabular-clock border border-[#DCE1DC] dark:border-[#1E3B46] text-[#354741] dark:text-[#BFD2D8] hover:bg-[#F3F6F3] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />5m
                  </button>
                </div>
              </div>

              {/* Compact 1-Click Duration Presets Row */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-medium text-[#596A64] dark:text-[#8CA8B2]">
                    Durations
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPreset(null);
                      setIsPresetModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#008540] dark:text-[#10A859] hover:underline whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Custom Duration
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => {
                    const selected = preset.id === activePreset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold tabular-clock transition-colors whitespace-nowrap shrink-0 border ${
                          selected
                            ? 'bg-[#008540] border-[#008540] text-white'
                            : 'bg-[#F6F8F6] dark:bg-[#091A20] border-[#DCE1DC] dark:border-[#1E3B46] text-[#1D2D27] dark:text-[#DCE7EA] hover:border-[#008540]'
                        }`}
                      >
                        {formatDurationLabel(preset.durationMinutes)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Genuine KFUPM Tower & Campus Showcase */}
          <div className="lg:col-span-4">
            <TowerShowcase
              photoIndex={photoIndex}
              onSelectPhoto={setPhotoIndex}
              isRunning={isRunning}
              phase={phase}
              progressPercent={progressPercent}
              statusLabel={statusLabel}
            />
          </div>
        </section>

        {/* Animated 7 Habits of KFUPM Students */}
        <SevenHabitsShowcase
          showInHallMode={showHabitsInHall}
          onToggleShowInHallMode={() => setShowHabitsInHall((prev) => !prev)}
        />
      </main>

      {/* Quiet Minimal Footer */}
      <footer className="mt-14 border-t border-[#E2E6E1] dark:border-[#163039]">
        <div className="max-w-[1240px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#596A64] dark:text-[#8CA8B2]">
          <div className="flex items-center gap-2.5">
            <KfupmTowerMonogram className="w-5 h-5 text-[#008540] dark:text-[#10A859] shrink-0" />
            <span>
              KFUPM Timer · King Fahd University of Petroleum &amp; Minerals, Dhahran
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="hover:text-[#008540] dark:hover:text-[#F1F5F4] transition-colors whitespace-nowrap"
          >
            Manage Presets &amp; Exam Details
          </button>
        </div>
      </footer>

      {/* Exam Details & Presets Drawer */}
      <SessionDrawer
        isOpen={isDetailsOpen}
        session={session}
        presets={presets}
        activePresetId={activePreset.id}
        onClose={() => setIsDetailsOpen(false)}
        onChangeSession={setSession}
        onSelectPreset={handleSelectPreset}
        onAddPreset={() => {
          setEditingPreset(null);
          setIsPresetModalOpen(true);
        }}
        onEditPreset={(preset) => {
          setEditingPreset(preset);
          setIsPresetModalOpen(true);
        }}
        onDeletePreset={handleDeletePreset}
        onRestoreDefaults={handleRestoreDefaults}
      />

      {/* Custom Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        editingPreset={editingPreset}
        onClose={() => {
          setIsPresetModalOpen(false);
          setEditingPreset(null);
        }}
        onSave={handleSavePreset}
      />

      {/* Full-Screen Hall Mode with Enlarged 7 Habits Display */}
      <HallModeOverlay
        isOpen={isHallMode}
        isDark={isDark}
        isRunning={isRunning}
        remainingSeconds={remainingSeconds}
        totalSeconds={totalSeconds}
        phase={phase}
        statusLabel={statusLabel}
        session={session}
        showHabitsBanner={showHabitsInHall}
        photoIndex={photoIndex}
        now={now}
        projectedEndTime={projectedEndTime}
        onSelectPhoto={setPhotoIndex}
        onToggleHabitsBanner={() => setShowHabitsInHall((prev) => !prev)}
        onToggleRun={handleToggleRun}
        onReset={handleReset}
        onAdjustSeconds={handleAdjustSeconds}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onToggleSound={() =>
          setSession((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onExit={exitHallMode}
      />
    </div>
  );
}
