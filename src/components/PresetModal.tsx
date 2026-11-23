import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ExamPreset } from '../types/exam';
import { formatDurationLabel } from '../utils/time';

interface PresetModalProps {
  isOpen: boolean;
  editingPreset: ExamPreset | null;
  onClose: () => void;
  onSave: (preset: Omit<ExamPreset, 'id'> & { id?: string }) => void;
}

export function PresetModal({
  isOpen,
  editingPreset,
  onClose,
  onSave,
}: PresetModalProps) {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(45);
  const [warningMinutes, setWarningMinutes] = useState(15);
  const [finalWarningMinutes, setFinalWarningMinutes] = useState(5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPreset) {
      setHours(Math.floor(editingPreset.durationMinutes / 60));
      setMinutes(editingPreset.durationMinutes % 60);
      setWarningMinutes(editingPreset.warningMinutes);
      setFinalWarningMinutes(editingPreset.finalWarningMinutes);
    } else {
      setHours(1);
      setMinutes(45);
      setWarningMinutes(15);
      setFinalWarningMinutes(5);
    }
    setError(null);
  }, [isOpen, editingPreset]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const previewTotal =
    Math.max(0, Number(hours) || 0) * 60 + Math.max(0, Number(minutes) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes =
      Math.max(0, Number(hours) || 0) * 60 + Math.max(0, Number(minutes) || 0);

    if (totalMinutes < 1 || totalMinutes > 600) {
      setError('Total duration must be between 1 minute and 10 hours.');
      return;
    }

    const safeWarning = Math.min(Math.max(0, Number(warningMinutes) || 0), totalMinutes - 1);
    const safeFinal = Math.min(
      Math.max(0, Number(finalWarningMinutes) || 0),
      Math.max(0, safeWarning)
    );

    const durationLabel = formatDurationLabel(totalMinutes);

    onSave({
      id: editingPreset?.id,
      name: durationLabel,
      durationMinutes: totalMinutes,
      warningMinutes: safeWarning,
      finalWarningMinutes: safeFinal,
      category: 'Custom',
      defaultBuilding: 'KFUPM Examination Hall',
      description: `${durationLabel} custom duration.`,
      isCustom: true,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07161B]/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-[#DCE1DC] dark:border-[#1E3B46] bg-white dark:bg-[#0C2128] text-[#13201B] dark:text-[#F1F5F4] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E9E5] dark:border-[#1A353F]">
          <div>
            <h2 id="preset-modal-title" className="text-lg font-semibold tracking-tight">
              {editingPreset ? 'Edit Duration Preset' : 'Add Custom Duration'}
            </h2>
            <p className="text-xs text-[#54645E] dark:text-[#96B0B8] mt-0.5">
              {previewTotal > 0
                ? `Preset label: ${formatDurationLabel(previewTotal)}`
                : 'Choose hours and minutes'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close duration editor"
            className="p-2 rounded-lg text-[#54645E] dark:text-[#96B0B8] hover:bg-[#F1F4F1] dark:hover:bg-[#143039] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-200"
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="preset-hours"
                className="block text-sm font-medium text-[#1E2E28] dark:text-[#D9E6E9] mb-1.5"
              >
                Hours
              </label>
              <input
                id="preset-hours"
                type="number"
                min={0}
                max={10}
                value={hours}
                onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                className="w-full tabular-clock rounded-xl border border-[#D4DBD5] dark:border-[#23434F] bg-[#FAFBF9] dark:bg-[#08191F] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>
            <div>
              <label
                htmlFor="preset-minutes"
                className="block text-sm font-medium text-[#1E2E28] dark:text-[#D9E6E9] mb-1.5"
              >
                Minutes
              </label>
              <input
                id="preset-minutes"
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-full tabular-clock rounded-xl border border-[#D4DBD5] dark:border-[#23434F] bg-[#FAFBF9] dark:bg-[#08191F] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="preset-warning"
                className="block text-sm font-medium text-[#1E2E28] dark:text-[#D9E6E9] mb-1.5"
              >
                Advisory Alert (min left)
              </label>
              <input
                id="preset-warning"
                type="number"
                min={0}
                max={120}
                value={warningMinutes}
                onChange={(e) => setWarningMinutes(Math.max(0, Number(e.target.value)))}
                className="w-full tabular-clock rounded-xl border border-[#D4DBD5] dark:border-[#23434F] bg-[#FAFBF9] dark:bg-[#08191F] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>
            <div>
              <label
                htmlFor="preset-critical"
                className="block text-sm font-medium text-[#1E2E28] dark:text-[#D9E6E9] mb-1.5"
              >
                Final Alert (min left)
              </label>
              <input
                id="preset-critical"
                type="number"
                min={0}
                max={60}
                value={finalWarningMinutes}
                onChange={(e) => setFinalWarningMinutes(Math.max(0, Number(e.target.value)))}
                className="w-full tabular-clock rounded-xl border border-[#D4DBD5] dark:border-[#23434F] bg-[#FAFBF9] dark:bg-[#08191F] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E9E5] dark:border-[#1A353F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#475852] dark:text-[#AFC4CB] hover:bg-[#F1F4F1] dark:hover:bg-[#143039] transition-colors whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#008540] hover:bg-[#006B33] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008540]"
            >
              {editingPreset ? 'Save Changes' : 'Add Duration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
