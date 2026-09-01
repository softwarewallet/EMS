import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  FileText, 
  AlertTriangle, 
  Check, 
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { AttendancePolicy, BoardType } from '../../types';
import { AttendancePolicyService } from '../../services/attendancePolicyService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const AttendancePolicyWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [policies, setPolicies] = useState<AttendancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<AttendancePolicy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<AttendancePolicy>>({
    name: '',
    description: '',
    boardType: 'Custom',
    minimumAttendancePercentage: 75,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    version: '1.0',
    latePolicy: {
      schoolStartTime: '08:00',
      gracePeriodMinutes: 10,
      lateThresholdMinutes: 11,
      maxLateCountBeforeWarning: 3,
      maxLateCountBeforeEscalation: 5,
      countLateAs: 'present'
    },
    shortagePolicy: {
      warningThreshold: 80,
      shortageThreshold: 75,
      criticalThreshold: 60,
      autoNotifyParent: true,
      autoNotifyCoordinator: true
    }
  });

  useEffect(() => {
    loadPolicies();
  }, [tenantId]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const list = await AttendancePolicyService.getPolicies(tenantId);
      setPolicies(list);
      if (list.length > 0 && !selectedPolicy) {
        setSelectedPolicy(list[0]);
      }
    } catch (err) {
      console.error('Error loading policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (policyId: string) => {
    try {
      await AttendancePolicyService.activatePolicy(policyId, tenantId, user);
      setSuccessMessage('Policy activated successfully as the authoritative active standard.');
      loadPolicies();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to activate policy');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AttendancePolicyService.savePolicy({
        ...formData,
        tenantId,
        status: formData.status || 'DRAFT'
      } as AttendancePolicy, user);
      setSuccessMessage('Attendance policy saved successfully.');
      setIsEditing(false);
      loadPolicies();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save policy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Attendance Policy Engine</h2>
          <p className="text-sm text-slate-500">Configure board-agnostic attendance standards, shortage thresholds, and calculation rules.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: 'New Attendance Policy',
              description: '',
              boardType: 'Custom',
              minimumAttendancePercentage: 75,
              effectiveFrom: new Date().toISOString().split('T')[0],
              effectiveTo: '2027-03-31',
              version: '1.0',
              latePolicy: { schoolStartTime: '08:00', gracePeriodMinutes: 10, lateThresholdMinutes: 11, maxLateCountBeforeWarning: 3, maxLateCountBeforeEscalation: 5, countLateAs: 'present' },
              shortagePolicy: { warningThreshold: 80, shortageThreshold: 75, criticalThreshold: 60, autoNotifyParent: true, autoNotifyCoordinator: true }
            });
            setSelectedPolicy(null);
            setIsEditing(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Policy
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-medium text-slate-900">Configure Attendance Policy</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Policy Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. CBSE Senior Secondary Attendance Standard"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Board / Framework Type</label>
                <select
                  value={formData.boardType || 'Custom'}
                  onChange={e => setFormData({ ...formData, boardType: e.target.value as BoardType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE Board</option>
                  <option value="IB">IB (International Baccalaureate)</option>
                  <option value="Cambridge">Cambridge Assessment</option>
                  <option value="State Board">State Board</option>
                  <option value="Custom">Custom Institution</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe institutional applicability and governing rules..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Attendance Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formData.minimumAttendancePercentage ?? 75}
                  onChange={e => setFormData({ ...formData, minimumAttendancePercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Policy Version</label>
                <input
                  type="text"
                  required
                  value={formData.version || '1.0'}
                  onChange={e => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Effective From</label>
                <input
                  type="date"
                  required
                  value={formData.effectiveFrom || ''}
                  onChange={e => setFormData({ ...formData, effectiveFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Effective To</label>
                <input
                  type="date"
                  required
                  value={formData.effectiveTo || ''}
                  onChange={e => setFormData({ ...formData, effectiveTo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
              >
                Save Policy Draft
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Policy List Sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h3 className="text-sm font-medium text-slate-900 px-2 uppercase tracking-wider">Policies Registry</h3>
            <div className="space-y-2">
              {policies.map(p => {
                const isSelected = selectedPolicy?.policyId === p.policyId;
                return (
                  <div
                    key={p.policyId}
                    onClick={() => setSelectedPolicy(p)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-300 shadow-sm'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                        {p.boardType}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'SUPERSEDED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Min Attendance: <span className="font-semibold text-indigo-600">{p.minimumAttendancePercentage}%</span> (v{p.version})</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Policy Detail View */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            {selectedPolicy ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">{selectedPolicy.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                        v{selectedPolicy.version}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{selectedPolicy.description || 'No description provided.'}</p>
                  </div>
                  {selectedPolicy.status !== 'ACTIVE' && (
                    <button
                      onClick={() => handleActivate(selectedPolicy.policyId)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Activate Policy
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Min Threshold</span>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedPolicy.minimumAttendancePercentage}%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Board Framework</span>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{selectedPolicy.boardType}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Effective From</span>
                    <p className="text-sm font-semibold text-slate-900 mt-2">{selectedPolicy.effectiveFrom}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Effective To</span>
                    <p className="text-sm font-semibold text-slate-900 mt-2">{selectedPolicy.effectiveTo}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    Governing Rule Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <span className="font-semibold text-slate-800 block">Late Arrival Policy</span>
                      <p className="text-slate-600 text-xs">School Start Time: <span className="font-medium">{selectedPolicy.latePolicy?.schoolStartTime}</span></p>
                      <p className="text-slate-600 text-xs">Grace Period: <span className="font-medium">{selectedPolicy.latePolicy?.gracePeriodMinutes} mins</span></p>
                      <p className="text-slate-600 text-xs">Late Threshold: <span className="font-medium">{selectedPolicy.latePolicy?.lateThresholdMinutes}+ mins</span></p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <span className="font-semibold text-slate-800 block">Attendance Shortage Thresholds</span>
                      <p className="text-slate-600 text-xs">Warning: <span className="font-medium">{selectedPolicy.shortagePolicy?.warningThreshold}%</span></p>
                      <p className="text-slate-600 text-xs">Shortage: <span className="font-medium">{selectedPolicy.shortagePolicy?.shortageThreshold}%</span></p>
                      <p className="text-slate-600 text-xs">Critical: <span className="font-medium">{selectedPolicy.shortagePolicy?.criticalThreshold}%</span></p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a policy to inspect rule specifications.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
