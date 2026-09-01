import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AttendanceService } from '../../services/attendanceService';
import { TenantAttendanceConfig } from '../../types';
import {
  Settings,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Save,
  CheckCircle2,
  Lock,
  Percent,
  Sliders,
  CalendarCheck
} from 'lucide-react';

export const AttendanceSettingsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();
  const { notify } = useNotification();

  const [config, setConfig] = useState<TenantAttendanceConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    async function loadConfig() {
      if (!currentTenant) return;
      setIsLoading(true);
      try {
        const data = await AttendanceService.getTenantConfig(currentTenant.id);
        setConfig(data);
      } catch (err) {
        console.error('Error loading attendance settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, [currentTenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !config) return;

    setIsSaving(true);
    try {
      const updated = await AttendanceService.updateTenantConfig(
        currentTenant.id,
        config,
        {
          id: currentUser?.id || 'usr_admin',
          email: currentUser?.email || 'admin@edutech.io',
          displayName: currentUser?.displayName || currentUser?.email
        }
      );
      setConfig(updated);
      notify('success', 'Policy Config Saved', 'Tenant attendance rules and thresholds updated successfully.');
    } catch (err: any) {
      notify('error', 'Save Failed', err.message || 'Failed to save attendance policy settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !config) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium">Loading institutional attendance policy settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Institutional Attendance Policy Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Define standard school hours, late thresholds, auto-lock policies, and truancy cutoffs
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving Policy...' : 'Save Configuration'}
        </button>
      </div>

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Standard Timings & Tardiness */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>School Timings & Tardiness Rules</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                School Start Time
              </label>
              <input
                type="time"
                value={config.schoolStartTime}
                onChange={e => setConfig({ ...config, schoolStartTime: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                School Dismissal Time
              </label>
              <input
                type="time"
                value={config.schoolEndTime}
                onChange={e => setConfig({ ...config, schoolEndTime: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Late Threshold (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={config.lateThresholdMinutes}
                onChange={e => setConfig({ ...config, lateThresholdMinutes: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Grace Period (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={config.gracePeriodMinutes}
                onChange={e => setConfig({ ...config, gracePeriodMinutes: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Auto-Flag Late Status on Threshold Breach
              </span>
              <input
                type="checkbox"
                checked={config.autoLateOnThreshold}
                onChange={e => setConfig({ ...config, autoLateOnThreshold: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Allow Excused Absence & Medical Leaves
              </span>
              <input
                type="checkbox"
                checked={config.allowExcusedAbsence}
                onChange={e => setConfig({ ...config, allowExcusedAbsence: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Truancy & Risk Cutoffs */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Attendance Risk & Truancy Thresholds</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Warning Threshold Percentage</span>
              <strong className="text-amber-600 font-bold">{config.lowAttendanceWarningThreshold}%</strong>
            </label>
            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={config.lowAttendanceWarningThreshold}
              onChange={e => setConfig({ ...config, lowAttendanceWarningThreshold: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Students falling below this percentage will appear in the warning alert register.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Critical Truancy Threshold Percentage</span>
              <strong className="text-rose-600 font-bold">{config.lowAttendanceCriticalThreshold}%</strong>
            </label>
            <input
              type="range"
              min="40"
              max="80"
              step="1"
              value={config.lowAttendanceCriticalThreshold}
              onChange={e => setConfig({ ...config, lowAttendanceCriticalThreshold: parseInt(e.target.value, 10) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Triggers high-priority alerts for academic coordinator and principal intervention.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Count Late Arrivals As:
            </label>
            <select
              value={config.countLateAs}
              onChange={e => setConfig({ ...config, countLateAs: e.target.value as any })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="present">Full Present (Standard)</option>
              <option value="half_day">Half Day (0.5 Present)</option>
              <option value="absent">Marked as Absent</option>
            </select>
          </div>
        </div>

        {/* Section 3: Lock & Compliance Controls */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Locking & Modification Security</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Automatic Session Lock After (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={config.autoLockAfterHours}
              onChange={e => setConfig({ ...config, autoLockAfterHours: parseInt(e.target.value, 10) || 24 })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <p className="text-[11px] text-slate-500">
              Sessions will be locked against direct modification after this window, requiring auditable corrections.
            </p>
          </div>

          <label className="flex items-center justify-between text-xs cursor-pointer pt-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Require Administrative Sign-off for Retro-Corrections
            </span>
            <input
              type="checkbox"
              checked={config.requireCorrectionApproval}
              onChange={e => setConfig({ ...config, requireCorrectionApproval: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </form>
  );
};
