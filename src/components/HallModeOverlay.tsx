import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Minimize2,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { KFUPM_SEVEN_HABITS } from '../data/habits';
import { ExamSessionConfig, TimerPhase } from '../types/exam';
import { formatRemainingTime, formatWallClock } from '../utils/time';
import { KfupmTowerMonogram } from './KfupmTowerMonogram';
import { GENUINE_KFUPM_PHOTOS } from './TowerShowcase';

interface HallModeOverlayProps {
  isOpen: boolean;
  isDark: boolean;
  isRunning: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  phase: TimerPhase;
  statusLabel: string;
  session: ExamSessionConfig;
  showHabitsBanner: boolean;
  photoIndex: number;
  now: Date;
  projectedEndTime: Date;
  onSelectPhoto: (index: number) => void;
  onToggleHabitsBanner: () => void;
  onToggleRun: () => void;
  onReset: () => void;
  onAdjustSeconds: (delta: number) => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onExit: () => void;
}

export function HallModeOverlay({
  isOpen,
  isDark,
  isRunning,
  remainingSeconds,
  totalSeconds,
  phase,
  statusLabel,
  session,
  showHabitsBanner,
  photoIndex,
  now,
  projectedEndTime,
  onSelectPhoto,
  onToggleHabitsBanner,
  onToggleRun,
  onReset,
  onAdjustSeconds,
  onToggleTheme,
  onToggleSound,
  onExit,
}: HallModeOverlayProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [habitIdx, setHabitIdx] = useState(0);

  const photo = GENUINE_KFUPM_PHOTOS[photoIndex] ?? GENUINE_KFUPM_PHOTOS[0];

  useEffect(() => {
    setImgFailed(false);
  }, [photo.src]);

  useEffect(() => {
    if (!isOpen || !showHabitsBanner) return;
    const id = window.setInterval(() => {
      setHabitIdx((prev) => (prev + 1) % KFUPM_SEVEN_HABITS.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [isOpen, showHabitsBanner]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      } else if (e.code === 'Space') {
        e.preventDefault();
        onToggleRun();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        onReset();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onExit, onToggleRun, onReset]);

  if (!isOpen) return null;

  const progressRatio =
    totalSeconds > 0
      ? Math.min(1, Math.max(0, (totalSeconds - remainingSeconds) / totalSeconds))
      : 0;

  const digitColorClass =
    phase === 'completed' || phase === 'critical'
      ? 'text-[#B91C1C] dark:text-[#F87171]'
      : phase === 'warning'
        ? 'text-[#9A7400] dark:text-[#DAC961]'
        : 'text-[#0E1E19] dark:text-[#F4F8F7]';

  const progressColorClass =
    phase === 'completed' || phase === 'critical'
      ? 'bg-[#B91C1C] dark:bg-[#EF4444]'
      : phase === 'warning'
        ? 'bg-[#B89014] dark:bg-[#DAC961]'
        : 'bg-[#008540] dark:bg-[#10A859]';

  const currentHabit = KFUPM_SEVEN_HABITS[habitIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F7F8F6] dark:bg-[#061419] text-[#111F1A] dark:text-[#F2F6F5] transition-colors duration-200"
      role="region"
      aria-label="Exam Hall Fullscreen Display"
    >
      {/* Top Exam Hall Header */}
      <header className="flex items-center justify-between gap-6 px-8 py-4 border-b border-[#E1E5E0] dark:border-[#152E37]">
        <div className="flex items-center gap-4 min-w-0">
          <KfupmTowerMonogram className="w-9 h-9 text-[#008540] dark:text-[#10A859] shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
              {[session.courseCode.trim(), session.examTitle.trim()]
                .filter(Boolean)
                .join(' · ') || 'Examination'}
            </h1>
            <p className="text-sm text-[#4D5E58] dark:text-[#9AB3BC] truncate">
              {[session.building.trim(), session.term.trim()]
                .filter(Boolean)
                .join(' · ') || 'King Fahd University of Petroleum & Minerals'}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 shrink-0">
          <div className="text-right">
            <div className="text-xs text-[#596A64] dark:text-[#8CA8B2]">
              {session.clockZone === 'riyadh' ? 'Dhahran Time' : 'Local Time'}
            </div>
            <div className="tabular-clock text-xl font-semibold">
              {formatWallClock(now, session.clockZone, true)}
            </div>
          </div>
          <div className="h-8 w-px bg-[#DCE1DC] dark:bg-[#1A353F]" aria-hidden="true" />
          <div className="text-right">
            <div className="text-xs text-[#596A64] dark:text-[#8CA8B2]">
              {phase === 'completed' ? 'Exam Ended' : 'Scheduled End'}
            </div>
            <div className="tabular-clock text-xl font-semibold text-[#008540] dark:text-[#DAC961]">
              {formatWallClock(projectedEndTime, session.clockZone, false)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Projector Stage */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Dominant Countdown & Large Fullscreen 7 Habits Showcase */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-center px-8 sm:px-14 py-6 overflow-y-auto">
          <div className="flex items-center justify-between text-base sm:text-lg font-medium text-[#4D5E58] dark:text-[#9DB6BF] mb-3">
            <span>{statusLabel}</span>
            <span className="tabular-clock">
              {Math.round(progressRatio * 100)}% Elapsed
            </span>
          </div>

          <div
            className={`tabular-clock font-bold tracking-tight leading-none select-none ${digitColorClass}`}
            style={{ fontSize: 'clamp(4rem, 13.5vw, 11.5rem)' }}
            aria-live="off"
          >
            {formatRemainingTime(remainingSeconds, session.showSeconds)}
          </div>

          {/* Hairline Progress Track */}
          <div className="mt-7 w-full h-2.5 rounded-full bg-[#E3E7E2] dark:bg-[#132B34] overflow-hidden">
            <div
              className={`h-full rounded-full origin-left transition-transform duration-300 ${progressColorClass}`}
              style={{ transform: `scaleX(${progressRatio})` }}
            />
          </div>

          {/* Large, Auditorium-Legible Animated 7 Habits Display */}
          {showHabitsBanner && (
            <div className="mt-9 pt-7 border-t border-[#E1E5E0] dark:border-[#152E37]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHabit.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-5xl"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm sm:text-base font-semibold tracking-wide text-[#008540] dark:text-[#10A859] tabular-clock">
                      KFUPM Habit {currentHabit.number} / 07
                    </span>
                    <span className="text-[#B8C4BF] dark:text-[#284854]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-sm sm:text-base text-[#596A64] dark:text-[#8CA8B2]">
                      {currentHabit.tagline}
                    </span>
                  </div>

                  <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0E201A] dark:text-[#DAC961] leading-tight">
                    {currentHabit.title}
                  </h2>

                  <p className="mt-3 text-xl sm:text-2xl lg:text-3xl font-medium leading-snug text-[#1F2E28] dark:text-[#E5EFF2]">
                    {currentHabit.examReflection}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Optional Compact Proctor Notice */}
          {session.proctorNote.trim() && (
            <p className="mt-6 text-base sm:text-lg text-[#4D5E58] dark:text-[#98B2BB] max-w-4xl leading-relaxed">
              {session.proctorNote}
            </p>
          )}
        </div>

        {/* Right Genuine KFUPM Tower Photograph Column */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 relative border-l border-[#E1E5E0] dark:border-[#152E37] bg-[#07181E] overflow-hidden">
          {!imgFailed ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                initial={{ opacity: 0.25 }}
                animate={{ opacity: 0.94 }}
                exit={{ opacity: 0.25 }}
                transition={{ duration: 0.5 }}
                className={`h-full w-full object-cover ${photo.objectPosition}`}
              />
            </AnimatePresence>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-white/85 bg-gradient-to-b from-[#003E51] to-[#061419]">
              <KfupmTowerMonogram className="w-24 h-24 text-[#DAC961] mb-3" />
              <span className="text-sm font-medium">KFUPM Tower</span>
            </div>
          )}

          {phase === 'completed' && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#DAC961]/45 via-[#008540]/20 to-transparent"
              animate={{ opacity: [0.35, 0.8, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061419]/85 via-transparent to-[#061419]/15"
            aria-hidden="true"
          />

          {/* Photo switcher inside Hall Mode */}
          <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 p-1 rounded-xl bg-[#061419]/60 backdrop-blur-xs border border-white/15">
            {GENUINE_KFUPM_PHOTOS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPhoto(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  idx === photoIndex
                    ? 'bg-white text-[#07161B]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-base font-semibold tracking-tight">{photo.caption}</p>
            <p className="text-xs text-white/75 mt-0.5">
              King Fahd University of Petroleum &amp; Minerals
            </p>
          </div>
        </div>
      </main>

      {/* Quiet Bottom Proctor Control Bar */}
      <footer className="flex flex-wrap items-center justify-between gap-4 px-8 py-4 border-t border-[#E1E5E0] dark:border-[#152E37] bg-white/95 dark:bg-[#091B21]/95">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleRun}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#008540] hover:bg-[#006B33] transition-colors whitespace-nowrap shrink-0"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : remainingSeconds === 0 ? 'Restart' : 'Start'}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-[#D4DBD5] dark:border-[#213F4A] text-[#1D2D27] dark:text-[#DCE7EA] hover:bg-[#F1F4F1] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => onAdjustSeconds(300)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-[#D4DBD5] dark:border-[#213F4A] text-[#1D2D27] dark:text-[#DCE7EA] hover:bg-[#F1F4F1] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />5 min
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHabitsBanner}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-[#D4DBD5] dark:border-[#213F4A] text-[#32443E] dark:text-[#BDD0D6] hover:bg-[#F1F4F1] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
          >
            7 Habits: {showHabitsBanner ? 'Shown' : 'Hidden'}
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={session.soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            className="p-2.5 rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] text-[#32443E] dark:text-[#BDD0D6] hover:bg-[#F1F4F1] dark:hover:bg-[#132C35] transition-colors"
          >
            {session.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2.5 rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] text-[#32443E] dark:text-[#BDD0D6] hover:bg-[#F1F4F1] dark:hover:bg-[#132C35] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#003E51] hover:bg-[#002D3C] text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Minimize2 className="w-4 h-4" />
            Exit Full Screen
          </button>
        </div>
      </footer>
    </div>
  );
}
