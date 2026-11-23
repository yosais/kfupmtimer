import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TimerPhase } from '../types/exam';
import { KfupmTowerMonogram } from './KfupmTowerMonogram';

export interface GenuineTowerPhoto {
  id: string;
  label: string;
  src: string;
  alt: string;
  caption: string;
  objectPosition: string;
}

export const GENUINE_KFUPM_PHOTOS: GenuineTowerPhoto[] = [
  {
    id: 'clock-tower',
    label: 'Clock Tower',
    src: '/assets/aistudio/images1_905e136f.jpg',
    alt: 'The iconic concrete KFUPM Clock Tower rising against blue skies in Dhahran',
    caption: 'The KFUPM Tower · Dhahran',
    objectPosition: 'object-center',
  },
  {
    id: 'campus-view',
    label: 'Campus',
    src: '/assets/aistudio/images_46814545.jpg',
    alt: 'The KFUPM Tower seen across campus gardens and flowering trees under blue skies',
    caption: 'KFUPM Campus Gardens · Dhahran',
    objectPosition: 'object-center',
  },
  {
    id: 'jabal-sign',
    label: 'KFUPM Sign',
    src: '/assets/aistudio/5555_copy.max-1900x1900_febf2108.jpg',
    alt: 'The iconic KFUPM sign on Jabal Dhahran with the KFUPM Tower rising beside campus buildings',
    caption: 'Jabal Dhahran · KFUPM Landmark',
    objectPosition: 'object-[22%_center]',
  },
];

interface TowerShowcaseProps {
  photoIndex: number;
  onSelectPhoto: (index: number) => void;
  isRunning: boolean;
  phase: TimerPhase;
  progressPercent: number;
  statusLabel: string;
}

export function TowerShowcase({
  photoIndex,
  onSelectPhoto,
  isRunning,
  phase,
  progressPercent,
  statusLabel,
}: TowerShowcaseProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const photo = GENUINE_KFUPM_PHOTOS[photoIndex] ?? GENUINE_KFUPM_PHOTOS[0];
  const showFallback = failedSrc === photo.src;
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progressPercent)));
  const isCompleted = phase === 'completed';

  const progressBarColor =
    phase === 'completed' || phase === 'critical'
      ? 'bg-[#EF4444]'
      : phase === 'warning'
        ? 'bg-[#DAC961]'
        : 'bg-[#10A859]';

  return (
    <aside
      aria-label="Genuine KFUPM Tower photograph"
      className="relative flex flex-col justify-end overflow-hidden rounded-2xl border border-[#DCE1DC] dark:border-[#1A353F] bg-[#0B2229] min-h-[380px] lg:h-full"
    >
      {!showFallback ? (
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            referrerPolicy="no-referrer"
            onError={() => setFailedSrc(photo.src)}
            initial={{ opacity: 0.25, scale: 1.03 }}
            animate={
              isCompleted
                ? { opacity: 1, scale: 1.035 }
                : isRunning
                  ? { opacity: 1, scale: 1.02 }
                  : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0.25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 h-full w-full object-cover ${photo.objectPosition} will-change-transform`}
          />
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#003E51] via-[#00573F] to-[#07161B] text-white/90 p-8 text-center">
          <KfupmTowerMonogram className="w-24 h-24 text-[#DAC961] mb-4" />
          <p className="text-base font-semibold tracking-tight">KFUPM Tower</p>
          <p className="text-xs text-white/70 mt-1">Dhahran Campus</p>
        </div>
      )}

      {/* Subtle architectural ambience while timer is active */}
      {isRunning && !isCompleted && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#008540]/20 via-transparent to-transparent"
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Warm golden-emerald glow upon exam completion */}
      {isCompleted && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#DAC961]/45 via-[#008540]/20 to-transparent"
          animate={{ opacity: [0.35, 0.8, 0.45] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Measured contrast scrim for legibility */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061419]/90 via-[#061419]/25 to-[#061419]/10"
        aria-hidden="true"
      />

      {/* Top photo view switcher for the 3 genuine images */}
      <div className="relative z-10 flex items-center justify-end p-4 mb-auto">
        <div
          role="tablist"
          aria-label="Choose KFUPM campus photograph"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#061419]/60 backdrop-blur-xs border border-white/15"
        >
          {GENUINE_KFUPM_PHOTOS.map((item, idx) => {
            const active = idx === photoIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectPhoto(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#07161B]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom caption & progress bar */}
      <div className="relative z-10 p-6 text-white">
        <p className="text-xs text-white/80">{photo.caption}</p>
        <div className="mt-3 pt-3 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-white/90 mb-2">
            <span>{statusLabel}</span>
            <span className="tabular-clock font-medium">{clampedProgress}% elapsed</span>
          </div>
          <div
            className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden"
            role="progressbar"
            aria-valuenow={clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Exam elapsed progress"
          >
            <div
              className={`h-full rounded-full transition-transform duration-300 origin-left ${progressBarColor}`}
              style={{ transform: `scaleX(${clampedProgress / 100})` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
