import { TimerPhase } from '../types/exam';
import { formatRemainingTime } from '../utils/time';

interface ExamProgressBarProps {
  totalSeconds: number;
  remainingSeconds: number;
  warningMinutes: number;
  finalWarningMinutes: number;
  phase: TimerPhase;
  showSeconds: boolean;
  size?: 'default' | 'hall';
}

export function ExamProgressBar({
  totalSeconds,
  remainingSeconds,
  warningMinutes,
  finalWarningMinutes,
  phase,
  showSeconds,
  size = 'default',
}: ExamProgressBarProps) {
  const safeTotal = Math.max(1, totalSeconds);
  const elapsedSeconds = Math.max(0, Math.min(safeTotal, safeTotal - remainingSeconds));
  const elapsedRatio = Math.min(1, Math.max(0, elapsedSeconds / safeTotal));
  const elapsedPct = Math.round(elapsedRatio * 100);
  const remainingPct = Math.max(0, 100 - elapsedPct);

  const warningStartPct =
    warningMinutes > 0 && warningMinutes * 60 < safeTotal
      ? Math.max(0, Math.min(100, ((safeTotal - warningMinutes * 60) / safeTotal) * 100))
      : null;

  const criticalStartPct =
    finalWarningMinutes > 0 && finalWarningMinutes * 60 < safeTotal
      ? Math.max(
          0,
          Math.min(100, ((safeTotal - finalWarningMinutes * 60) / safeTotal) * 100)
        )
      : null;

  const fillColorClass =
    phase === 'completed' || phase === 'critical'
      ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] dark:from-[#EF4444] dark:to-[#DC2626]'
      : phase === 'warning'
        ? 'bg-gradient-to-r from-[#C89D16] to-[#A67D08] dark:from-[#E5D36A] dark:to-[#C8B243]'
        : 'bg-gradient-to-r from-[#00994B] to-[#007438] dark:from-[#12B761] dark:to-[#008540]';

  const percentAccentClass =
    phase === 'completed' || phase === 'critical'
      ? 'text-[#B91C1C] dark:text-[#F87171]'
      : phase === 'warning'
        ? 'text-[#9A7400] dark:text-[#DAC961]'
        : 'text-[#007438] dark:text-[#34D399]';

  const isHall = size === 'hall';

  return (
    <div className="w-full">
      {/* Top Quantitative Header */}
      <div
        className={`flex flex-wrap items-baseline justify-between gap-2 mb-2.5 ${
          isHall ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
        }`}
      >
        <div className="flex items-baseline gap-2 text-[#475852] dark:text-[#9AB3BC]">
          <span className="font-medium">Elapsed</span>
          <span className="tabular-clock font-semibold text-[#13201B] dark:text-[#F1F5F4]">
            {formatRemainingTime(elapsedSeconds, showSeconds)}
          </span>
          <span aria-hidden="true" className="text-[#B8C4BF] dark:text-[#2A4C58]">
            ·
          </span>
          <span className={`tabular-clock font-bold ${percentAccentClass}`}>
            {elapsedPct}%
          </span>
        </div>

        <div className="tabular-clock font-semibold text-[#13201B] dark:text-[#F1F5F4]">
          {remainingPct}%{' '}
          <span className="font-normal text-[#596A64] dark:text-[#8CA8B2]">
            remaining
          </span>
        </div>
      </div>

      {/* Prominent High-Contrast Progress Track */}
      <div
        role="progressbar"
        aria-valuenow={elapsedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Exam time elapsed progress"
        className={`relative w-full overflow-hidden rounded-xl border border-[#CBD4CC] dark:border-[#1E3F4B] bg-[#E8EDE8] dark:bg-[#0F2630] shadow-inner ${
          isHall ? 'h-8 sm:h-9' : 'h-5 sm:h-6'
        }`}
      >
        {/* Subtle advisory alert tail zone */}
        {warningStartPct !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 right-0 bg-[#DAC961]/22 dark:bg-[#DAC961]/15"
            style={{ left: `${warningStartPct}%` }}
          />
        )}

        {/* Subtle final alert tail zone */}
        {criticalStartPct !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 right-0 bg-[#EF4444]/18 dark:bg-[#EF4444]/20"
            style={{ left: `${criticalStartPct}%` }}
          />
        )}

        {/* Quarter guide ticks (25%, 50%, 75%) */}
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 bottom-0 z-10 w-px ${
              pct === 50
                ? 'bg-[#13201B]/20 dark:bg-white/25'
                : 'bg-[#13201B]/10 dark:bg-white/12'
            }`}
            style={{ left: `${pct}%` }}
          />
        ))}

        {/* Filled Progress Bar */}
        <div
          className={`relative h-full origin-left transition-transform duration-300 ease-out ${fillColorClass}`}
          style={{ transform: `scaleX(${elapsedRatio})` }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 bg-white/15"
          />
        </div>

        {/* Crisp Leading-Edge Position Cursor (visible while progressing) */}
        {elapsedRatio > 0.005 && elapsedRatio < 0.995 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 z-20 w-1 -ml-0.5 bg-white dark:bg-[#F8FAFC] shadow-[0_0_8px_rgba(0,0,0,0.35)]"
            style={{ left: `${elapsedRatio * 100}%` }}
          />
        )}

        {/* Advisory threshold marker tick */}
        {warningStartPct !== null && warningStartPct > 6 && warningStartPct < 96 && (
          <div
            aria-hidden="true"
            title={`Advisory alert at ${warningMinutes} min remaining`}
            className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-[#A67D08] dark:bg-[#DAC961]"
            style={{ left: `${warningStartPct}%` }}
          />
        )}
      </div>

      {/* Bottom Scale Reference Labels */}
      <div
        className={`mt-2 flex items-center justify-between text-[#596A64] dark:text-[#8CA8B2] tabular-clock ${
          isHall ? 'text-sm' : 'text-xs'
        }`}
      >
        <span>Start</span>
        <div className="flex items-center gap-3">
          <span>50% Halfway</span>
          {warningStartPct !== null && (
            <>
              <span aria-hidden="true" className="text-[#C2CCC6] dark:text-[#23434F]">
                ·
              </span>
              <span className="text-[#8E6B00] dark:text-[#DAC961] font-medium">
                {warningMinutes}m alert
              </span>
            </>
          )}
        </div>
        <span>End</span>
      </div>
    </div>
  );
}
