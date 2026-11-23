import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { KFUPM_SEVEN_HABITS } from '../data/habits';

const CYCLE_DURATION_MS = 6000;

interface HabitArtworkProps {
  habitId: string;
}

/**
 * Bespoke geometric SVG animations honoring each of the 7 Habits of KFUPM Students.
 * Uses compositor-safe transforms, opacity, and SVG pathLength drawing.
 */
function HabitGeometricArtwork({ habitId }: HabitArtworkProps) {
  const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

  switch (habitId) {
    case 'high-aspirations':
      // Ascending geometric trajectory toward an octagonal apex star
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          <motion.polygon
            points="110,18 175,45 202,110 175,175 110,202 45,175 18,110 45,45"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.2"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.8, ease: easeCurve }}
          />
          {[168, 138, 108].map((y, idx) => (
            <motion.line
              key={y}
              x1={60 + idx * 14}
              y1={y}
              x2={160 - idx * 14}
              y2={y}
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.25"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: easeCurve }}
            />
          ))}
          <motion.path
            d="M48 168 Q92 146 110 44"
            stroke="#10A859"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: easeCurve }}
          />
          <motion.path
            d="M172 168 Q128 146 110 44"
            stroke="#DAC961"
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: easeCurve }}
          />
          <motion.polygon
            points="110,30 119,44 110,58 101,44"
            fill="#DAC961"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: easeCurve }}
          />
        </svg>
      );

    case 'self-reliance':
      // Balanced architectural keystone & steady compass needle
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          <motion.circle
            cx="110"
            cy="110"
            r="82"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeDasharray="6 6"
            opacity="0.3"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '110px', originY: '110px' }}
          />
          <motion.path
            d="M72 162 L92 66 H128 L148 162 Z"
            stroke="#10A859"
            strokeWidth="2.4"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: easeCurve }}
          />
          <motion.line
            x1="110"
            y1="44"
            x2="110"
            y2="176"
            stroke="#DAC961"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: easeCurve }}
          />
          <motion.circle
            cx="110"
            cy="110"
            r="14"
            stroke="#DAC961"
            strokeWidth="2.4"
            fill="#07161B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: easeCurve }}
          />
        </svg>
      );

    case 'international-culture':
      // Rotating meridian globe with cross-cultural orbital ring
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          <motion.circle
            cx="110"
            cy="110"
            r="68"
            stroke="#10A859"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: easeCurve }}
          />
          <motion.ellipse
            cx="110"
            cy="110"
            rx="34"
            ry="68"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.55"
            initial={{ scaleX: 0.3, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.55 }}
            transition={{ duration: 0.9, delay: 0.15, ease: easeCurve }}
          />
          <motion.ellipse
            cx="110"
            cy="110"
            rx="68"
            ry="26"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.55"
            initial={{ scaleY: 0.3, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.55 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easeCurve }}
          />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '110px', originY: '110px' }}
          >
            <ellipse
              cx="110"
              cy="110"
              rx="88"
              ry="34"
              transform="rotate(-24 110 110)"
              stroke="#DAC961"
              strokeWidth="1.8"
            />
            <circle cx="190" cy="74" r="5" fill="#DAC961" />
          </motion.g>
        </svg>
      );

    case 'multidisciplinary-thinking':
      // Intersecting geometric disciplines converging in a unified center
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          <motion.circle
            cx="110"
            cy="78"
            r="44"
            stroke="#10A859"
            strokeWidth="2.2"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: easeCurve }}
          />
          <motion.circle
            cx="82"
            cy="128"
            r="44"
            stroke="#DAC961"
            strokeWidth="2.2"
            initial={{ x: -14, y: 12, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeCurve }}
          />
          <motion.circle
            cx="138"
            cy="128"
            r="44"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.7"
            initial={{ x: 14, y: 12, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeCurve }}
          />
          <motion.polygon
            points="110,98 122,118 98,118"
            fill="#DAC961"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={{ duration: 0.6, delay: 0.55, ease: easeCurve }}
          />
        </svg>
      );

    case 'research':
      // Precision atomic / crystallographic discovery lattice
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          {[0, 60, 120].map((angle, idx) => (
            <motion.ellipse
              key={angle}
              cx="110"
              cy="110"
              rx="76"
              ry="28"
              transform={`rotate(${angle} 110 110)`}
              stroke={idx === 0 ? '#10A859' : idx === 1 ? '#DAC961' : 'currentColor'}
              strokeWidth={idx === 2 ? '1.4' : '2'}
              opacity={idx === 2 ? 0.5 : 0.9}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: idx === 2 ? 0.5 : 0.9 }}
              transition={{ duration: 0.9, delay: idx * 0.14, ease: easeCurve }}
            />
          ))}
          <motion.circle
            cx="110"
            cy="110"
            r="11"
            fill="#10A859"
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '110px', originY: '110px' }}
          />
          <motion.circle
            cx="110"
            cy="110"
            r="24"
            stroke="#DAC961"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '110px', originY: '110px' }}
          />
        </svg>
      );

    case 'entrepreneurship':
      // Forward architectural launch prism & momentum vectors
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          <motion.path
            d="M44 166 L104 106 L132 134 L178 58"
            stroke="#10A859"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.95, ease: easeCurve }}
          />
          <motion.path
            d="M150 58 H178 V86"
            stroke="#DAC961"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.65, ease: easeCurve }}
          />
          {[0, 1, 2].map((i) => (
            <motion.rect
              key={i}
              x={54 + i * 38}
              y={144 - i * 18}
              width="20"
              height={32 + i * 18}
              rx="4"
              stroke="currentColor"
              strokeWidth="1.4"
              opacity="0.32"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.32 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: easeCurve }}
              style={{ originY: '176px' }}
            />
          ))}
        </svg>
      );

    default:
      // Positivity: Radiant Arabian horizon sunrise over architectural arches
      return (
        <svg viewBox="0 0 220 220" fill="none" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
          <motion.path
            d="M42 146 H178"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: easeCurve }}
          />
          <motion.path
            d="M62 146 A48 48 0 0 1 158 146"
            stroke="#DAC961"
            strokeWidth="2.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: easeCurve }}
          />
          <motion.path
            d="M84 146 A26 26 0 0 1 136 146"
            stroke="#10A859"
            strokeWidth="2.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.75, delay: 0.2, ease: easeCurve }}
          />
          {[-60, -30, 0, 30, 60].map((deg, idx) => (
            <motion.line
              key={deg}
              x1="110"
              y1="82"
              x2="110"
              y2="54"
              stroke="#DAC961"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${deg} 110 146)`}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.85, scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.35 + idx * 0.08, ease: easeCurve }}
              style={{ originX: '110px', originY: '146px' }}
            />
          ))}
        </svg>
      );
  }
}

interface SevenHabitsShowcaseProps {
  showInHallMode: boolean;
  onToggleShowInHallMode: () => void;
}

export function SevenHabitsShowcase({
  showInHallMode,
  onToggleShowInHallMode,
}: SevenHabitsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % KFUPM_SEVEN_HABITS.length);
    }, CYCLE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [isAutoPlaying]);

  const activeHabit = KFUPM_SEVEN_HABITS[activeIndex];

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + KFUPM_SEVEN_HABITS.length) % KFUPM_SEVEN_HABITS.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % KFUPM_SEVEN_HABITS.length);
  };

  return (
    <section
      id="habits"
      aria-labelledby="seven-habits-heading"
      className="pt-10 border-t border-[#E2E6E1] dark:border-[#18313B]"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#008540] dark:text-[#10A859] mb-1.5">
            The New Spirit of KFUPM
          </p>
          <h2
            id="seven-habits-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#10211B] dark:text-[#F4F8F7]"
            style={{ textWrap: 'balance' }}
          >
            The 7 Habits of KFUPM Students
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#4D5E58] dark:text-[#98B2BB] leading-relaxed">
            Seven defining qualities cultivated across the Dhahran campus — guiding mindset, discipline, and leadership from the exam hall to global impact.
          </p>
        </div>

        {/* Playback & Hall Mode Sync Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleShowInHallMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
              showInHallMode
                ? 'border-[#008540] dark:border-[#10A859] bg-[#F2F8F4] dark:bg-[#0F2C2B] text-[#006B33] dark:text-[#86EFAC]'
                : 'border-[#DCE1DC] dark:border-[#1E3B46] text-[#475852] dark:text-[#9BB4BD] hover:bg-[#EFF3EF] dark:hover:bg-[#132C35]'
            }`}
          >
            Hall Mode Banner: {showInHallMode ? 'On' : 'Off'}
          </button>

          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#DCE1DC] dark:border-[#1E3B46] text-[#1D2D27] dark:text-[#DCE7EA] hover:bg-[#EFF3EF] dark:hover:bg-[#132C35] transition-colors whitespace-nowrap shrink-0"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause Cycle
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Resume Cycle
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Animated 2-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Animated Kinetic Habit Stage (7 cols) */}
        <div className="lg:col-span-7 relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DCE1DC] dark:border-[#1A353F] bg-[#061C24] text-white p-7 sm:p-9 min-h-[380px]">
          {/* Subtle architectural background tone */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#003E51]/65 via-[#061C24] to-[#00573F]/35"
            aria-hidden="true"
          />

          {/* Top Bar inside Stage */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="text-xs font-medium text-white/75 tabular-clock">
              Habit {activeHabit.number} of 07 · KFUPM Framework
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous habit"
                className="p-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next habit"
                className="p-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Animated Centerpiece: Artwork + Habit Typography */}
          <div className="relative z-10 my-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHabit.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center"
              >
                <div className="sm:col-span-5 flex items-center justify-center text-white">
                  <HabitGeometricArtwork habitId={activeHabit.id} />
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-[#DAC961]">
                    {activeHabit.tagline}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {activeHabit.number}. {activeHabit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                    {activeHabit.description}
                  </p>

                  <div className="pt-4 mt-4 border-t border-white/15">
                    <p className="text-xs text-white/60 mb-1">Exam Mindset</p>
                    <p className="text-sm font-medium text-[#A7F3D0] leading-relaxed">
                      {activeHabit.examReflection}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Animated Cycle Progress Bar */}
          <div className="relative z-10 pt-2">
            <div className="grid grid-cols-7 gap-1.5">
              {KFUPM_SEVEN_HABITS.map((habit, idx) => {
                const isCurrent = idx === activeIndex;
                const isPast = idx < activeIndex;
                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Select habit ${habit.number}: ${habit.title}`}
                    className="group py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAC961]"
                  >
                    <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                      {isCurrent && isAutoPlaying ? (
                        <motion.div
                          key={`${habit.id}-progress`}
                          className="h-full bg-[#DAC961] origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: CYCLE_DURATION_MS / 1000,
                            ease: 'linear',
                          }}
                        />
                      ) : (
                        <div
                          className={`h-full transition-colors ${
                            isCurrent
                              ? 'bg-[#DAC961]'
                              : isPast
                                ? 'bg-[#10A859]'
                                : 'bg-transparent group-hover:bg-white/35'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive 7-Habit Editorial Selector List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#DCE1DC] dark:border-[#1A353F] bg-white dark:bg-[#0C2128] p-3 sm:p-4">
          <div className="divide-y divide-[#EEF1ED] dark:divide-[#163039]">
            {KFUPM_SEVEN_HABITS.map((habit, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-current={isSelected ? 'step' : undefined}
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#F1F7F3] dark:bg-[#113131]'
                      : 'hover:bg-[#F7F9F7] dark:hover:bg-[#102931]'
                  }`}
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      className={`tabular-clock text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'text-[#008540] dark:text-[#DAC961]'
                          : 'text-[#73857E] dark:text-[#6F8D97]'
                      }`}
                    >
                      {habit.number}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isSelected
                            ? 'text-[#0E201A] dark:text-white'
                            : 'text-[#2C3E38] dark:text-[#C5D6DC]'
                        }`}
                      >
                        {habit.title}
                      </div>
                      <div className="text-xs text-[#60726B] dark:text-[#86A2AC] truncate">
                        {habit.tagline}
                      </div>
                    </div>
                  </div>

                  <motion.span
                    aria-hidden="true"
                    animate={{ x: isSelected ? 0 : -4, opacity: isSelected ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-semibold text-[#008540] dark:text-[#10A859] shrink-0"
                  >
                    Active
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
