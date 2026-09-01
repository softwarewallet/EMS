import React, { useState } from 'react';
import { StudentAttendanceRecord, AttendanceStatus } from '../../types';
import { AttendanceService } from '../../services/attendanceService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle, Clock, FileText, User, X } from 'lucide-react';

interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StudentAttendanceRecord | null;
  onSuccess: (updatedRecord: StudentAttendanceRecord) => void;
}

const PRESET_REASONS = [
  'Medical certificate provided by guardian',
  'Bus breakdown / transport delay verified',
  'Administrative / Principal approved leave',
  'School sanctioned event / sports competition',
  'Clerical entry error corrected',
  'Late arrival excused with guardian note',
  'Other / Custom justification'
];

export const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  isOpen,
  onClose,
  record,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const { notify } = useNotification();

  const [newStatus, setNewStatus] = useState<AttendanceStatus>(record?.status || 'present');
  const [presetReason, setPresetReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>(record?.arrivalTime || '08:15');
  const [lateMinutes, setLateMinutes] = useState<number>(record?.lateMinutes || 15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if record changes
  React.useEffect(() => {
    if (record) {
      setNewStatus(record.status);
      setArrivalTime(record.arrivalTime || '08:15');
      setLateMinutes(record.lateMinutes || 15);
      setCustomReason('');
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const effectiveReason = presetReason === 'Other / Custom justification'
    ? customReason.trim()
    : `${presetReason}${customReason.trim() ? ` - ${customReason.trim()}` : ''}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveReason) {
      notify('error', 'Reason Required', 'Please provide a justification reason for this correction.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await AttendanceService.correctAttendanceRecord(
        record.id,
        newStatus,
        effectiveReason,
        {
          id: currentUser?.id || 'usr_admin',
          email: currentUser?.email || 'admin@edutech.io',
          displayName: currentUser?.displayName || currentUser?.email || 'Administrator'
        },
        newStatus === 'late' ? arrivalTime : undefined,
        newStatus === 'late' ? Number(lateMinutes) : undefined
      );

      notify('success', 'Attendance Corrected', `Status updated for ${record.studentName} with audit log.`);
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      notify('error', 'Correction Failed', err.message || 'Failed to submit correction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Auditable Attendance Correction
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official correction record will be logged with your signature
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Student Info Card */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Student Profile</span>
              <span>Date: <strong className="text-slate-800 dark:text-slate-200">{record.date}</strong></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {record.studentName}
                </span>
                {record.rollNumber && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Roll #{record.rollNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Current:</span>
                <span className={`capitalize font-semibold ${
                  record.status === 'present' ? 'text-emerald-600 dark:text-emerald-400' :
                  record.status === 'absent' ? 'text-rose-600 dark:text-rose-400' :
                  record.status === 'late' ? 'text-amber-600 dark:text-amber-400' :
                  'text-blue-600 dark:text-blue-400'
                }`}>
                  {record.status}
                </span>
              </div>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Target Correction Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['present', 'absent', 'late', 'excused', 'leave'] as AttendanceStatus[]).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setNewStatus(st)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all capitalize text-center ${
                    newStatus === st
                      ? st === 'present'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : st === 'absent'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : st === 'late'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : st === 'excused'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* If Late: Arrival Time & Late Minutes */}
          {newStatus === 'late' && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Arrival Time
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={e => setArrivalTime(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Late (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={lateMinutes}
                  onChange={e => setLateMinutes(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Preset Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Justification Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={presetReason}
              onChange={e => setPresetReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              {PRESET_REASONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Notes / Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Administrative Remarks & Reference Details
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              placeholder="e.g., Parent submitted Dr. Smith sick leave note #8492"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          {/* Compliance Notice */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>
              This update creates an immutable audit log entry containing your user identity, previous status (<strong>{record.status}</strong>), and new status (<strong>{newStatus}</strong>).
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (presetReason === 'Other / Custom justification' && !customReason.trim())}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Audit...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Apply & Log Correction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
