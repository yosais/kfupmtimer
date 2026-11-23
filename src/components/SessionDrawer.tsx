import { useEffect } from 'react';
import { Bell, Pencil, Plus, Trash2, X } from 'lucide-react';
import { ExamPreset, ExamSessionConfig } from '../types/exam';
import { playExamChime } from '../utils/audio';
import { formatDurationLabel } from '../utils/time';

interface SessionDrawerProps {
  isOpen: boolean;
  session: ExamSessionConfig;
  presets: ExamPreset[];
  activePresetId: string;
  onClose: () => void;
  onChangeSession: (updater: (prev: ExamSessionConfig) => ExamSessionConfig) => void;
  onSelectPreset: (preset: ExamPreset) => void;
  onAddPreset: () => void;
  onEditPreset: (preset: ExamPreset) => void;
  onDeletePreset: (id: string) => void;
  onRestoreDefaults: () => void;
}

export function SessionDrawer({
  isOpen,
  session,
  presets,
  activePresetId,
  onClose,
  onChangeSession,
  onSelectPreset,
  onAddPreset,
  onEditPreset,
  onDeletePreset,
  onRestoreDefaults,
}: SessionDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-[#07161B]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-[#0B1E25] text-[#13201B] dark:text-[#F1F5F4] border-l border-[#DCE1DC] dark:border-[#1A353F] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E9E5] dark:border-[#163039]">
          <h2 id="session-drawer-title" className="text-lg font-semibold tracking-tight">
            Exam Details &amp; Presets
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close exam details"
            className="p-2 rounded-lg text-[#54645E] dark:text-[#96B0B8] hover:bg-[#F1F4F1] dark:hover:bg-[#143039] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Exam Session Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wide text-[#008540] dark:text-[#10A859]">
              Exam Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="drawer-course"
                  className="block text-xs font-medium text-[#475852] dark:text-[#9AB3BC] mb-1"
                >
                  Course Code (Optional)
                </label>
                <input
                  id="drawer-course"
                  type="text"
                  placeholder="Optional"
                  value={session.courseCode}
                  onChange={(e) =>
                    onChangeSession((prev) => ({ ...prev, courseCode: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] bg-[#FAFBF9] dark:bg-[#07161B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
                />
              </div>
              <div>
                <label
                  htmlFor="drawer-term"
                  className="block text-xs font-medium text-[#475852] dark:text-[#9AB3BC] mb-1"
                >
                  Term (Optional)
                </label>
                <input
                  id="drawer-term"
                  type="text"
                  placeholder="Optional"
                  value={session.term}
                  onChange={(e) =>
                    onChangeSession((prev) => ({ ...prev, term: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] bg-[#FAFBF9] dark:bg-[#07161B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="drawer-title"
                className="block text-xs font-medium text-[#475852] dark:text-[#9AB3BC] mb-1"
              >
                Exam Title
              </label>
              <input
                id="drawer-title"
                type="text"
                value={session.examTitle}
                onChange={(e) =>
                  onChangeSession((prev) => ({ ...prev, examTitle: e.target.value }))
                }
                className="w-full rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] bg-[#FAFBF9] dark:bg-[#07161B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>

            <div>
              <label
                htmlFor="drawer-building"
                className="block text-xs font-medium text-[#475852] dark:text-[#9AB3BC] mb-1"
              >
                Building &amp; Hall
              </label>
              <input
                id="drawer-building"
                type="text"
                value={session.building}
                onChange={(e) =>
                  onChangeSession((prev) => ({ ...prev, building: e.target.value }))
                }
                className="w-full rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] bg-[#FAFBF9] dark:bg-[#07161B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>

            <div>
              <label
                htmlFor="drawer-notice"
                className="block text-xs font-medium text-[#475852] dark:text-[#9AB3BC] mb-1"
              >
                Proctor Notice
              </label>
              <textarea
                id="drawer-notice"
                rows={2}
                value={session.proctorNote}
                onChange={(e) =>
                  onChangeSession((prev) => ({ ...prev, proctorNote: e.target.value }))
                }
                className="w-full rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] bg-[#FAFBF9] dark:bg-[#07161B] px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#008540]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  onChangeSession((prev) => ({
                    ...prev,
                    clockZone: prev.clockZone === 'riyadh' ? 'local' : 'riyadh',
                  }))
                }
                className="px-3 py-2 rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] text-xs font-medium hover:border-[#008540] transition-colors whitespace-nowrap"
              >
                Clock: {session.clockZone === 'riyadh' ? 'Dhahran (AST)' : 'Local'}
              </button>
              <button
                type="button"
                onClick={() =>
                  onChangeSession((prev) => ({
                    ...prev,
                    showSeconds: !prev.showSeconds,
                  }))
                }
                className="px-3 py-2 rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] text-xs font-medium hover:border-[#008540] transition-colors whitespace-nowrap"
              >
                Seconds: {session.showSeconds ? 'Shown' : 'Hidden'}
              </button>
              <button
                type="button"
                onClick={() => playExamChime('warning')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D4DBD5] dark:border-[#213F4A] text-xs font-medium hover:border-[#008540] transition-colors whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5 text-[#008540] dark:text-[#10A859]" />
                Test Chime
              </button>
            </div>
          </div>

          {/* Manage Saved Presets */}
          <div className="pt-6 border-t border-[#E5E9E5] dark:border-[#163039] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold tracking-wide text-[#008540] dark:text-[#10A859]">
                Saved Presets
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRestoreDefaults}
                  className="text-xs text-[#596A64] dark:text-[#8CA8B2] hover:text-[#13201B] dark:hover:text-white transition-colors"
                >
                  Restore
                </button>
                <button
                  type="button"
                  onClick={onAddPreset}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#008540] hover:bg-[#006B33] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Preset
                </button>
              </div>
            </div>

            <div className="divide-y divide-[#EDF0EC] dark:divide-[#163039] border border-[#E2E6E1] dark:border-[#1A353F] rounded-xl overflow-hidden">
              {presets.map((preset) => {
                const selected = preset.id === activePresetId;
                return (
                  <div
                    key={preset.id}
                    className={`flex items-center justify-between gap-3 px-3.5 py-3 ${
                      selected
                        ? 'bg-[#F1F7F3] dark:bg-[#102E2C]'
                        : 'bg-white dark:bg-[#0C2128]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPreset(preset)}
                      className="text-left min-w-0 flex-1"
                    >
                      <div className="text-sm font-semibold tabular-clock text-[#13201B] dark:text-[#F1F5F4] truncate">
                        {formatDurationLabel(preset.durationMinutes)}
                      </div>
                      <div className="text-xs text-[#596A64] dark:text-[#8CA8B2] tabular-clock">
                        Alerts: {preset.warningMinutes} min / {preset.finalWarningMinutes} min
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditPreset(preset)}
                        aria-label={`Edit ${preset.name}`}
                        className="p-1.5 rounded-lg text-[#596A64] dark:text-[#8CA8B2] hover:bg-[#E7ECE7] dark:hover:bg-[#163641] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {presets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeletePreset(preset.id)}
                          aria-label={`Delete ${preset.name}`}
                          className="p-1.5 rounded-lg text-[#596A64] dark:text-[#8CA8B2] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
