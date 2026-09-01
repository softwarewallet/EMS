import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { Clock, Plus, CheckCircle2, UserCheck, AlertCircle, Calendar } from 'lucide-react';

interface SubstitutionRecord {
  id: string;
  absentTeacherName: string;
  substituteTeacherName: string;
  date: string;
  periodNumber: number;
  className: string;
  subjectName: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
}

export const SubstitutionsTab: React.FC = () => {
  const { staffList } = useStaffContext();

  const [substitutions, setSubstitutions] = useState<SubstitutionRecord[]>([
    {
      id: 'sub_1',
      absentTeacherName: 'Dr. Arthur Pendelton',
      substituteTeacherName: 'Ms. Clara Oswald',
      date: new Date().toISOString().split('T')[0],
      periodNumber: 2,
      className: 'Grade 10-A',
      subjectName: 'Physics (Mechanics)',
      status: 'CONFIRMED'
    },
    {
      id: 'sub_2',
      absentTeacherName: 'Mr. David Tennant',
      substituteTeacherName: 'Prof. Alistair Finch',
      date: new Date().toISOString().split('T')[0],
      periodNumber: 4,
      className: 'Grade 11-B',
      subjectName: 'Organic Chemistry',
      status: 'PENDING'
    }
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [absentTeacher, setAbsentTeacher] = useState<string>(staffList[0]?.fullName || '');
  const [subTeacher, setSubTeacher] = useState<string>(staffList[1]?.fullName || '');
  const [periodNum, setPeriodNum] = useState<number>(1);
  const [className, setClassName] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');

  const handleAddSubstitution = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SubstitutionRecord = {
      id: `sub_${Date.now()}`,
      absentTeacherName: absentTeacher,
      substituteTeacherName: subTeacher,
      date: new Date().toISOString().split('T')[0],
      periodNumber: Number(periodNum),
      className: className.trim() || 'Grade 10',
      subjectName: subjectName.trim() || 'General Studies',
      status: 'CONFIRMED'
    };
    setSubstitutions([newRecord, ...substitutions]);
    setShowModal(false);
    setClassName('');
    setSubjectName('');
  };

  const handleConfirm = (id: string) => {
    setSubstitutions(
      substitutions.map((s) => (s.id === id ? { ...s, status: 'CONFIRMED' } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Class Coverage & Daily Faculty Substitutions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate emergency period covers and proxy teacher assignments for faculty on approved leave.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Assign Period Cover
        </button>
      </div>

      {/* Roster */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Today&apos;s Coverage Register</h4>
          <span className="text-xs text-slate-500 font-medium">{substitutions.length} Covers Scheduled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Absent Faculty</th>
                <th className="px-4 py-3.5">Assigned Substitute</th>
                <th className="px-4 py-3.5">Period & Time</th>
                <th className="px-4 py-3.5">Class & Subject</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {substitutions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{sub.absentTeacherName}</td>
                  <td className="px-4 py-3.5 font-semibold text-blue-700">{sub.substituteTeacherName}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">Period {sub.periodNumber} ({sub.date})</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">
                    <span className="font-semibold block">{sub.className}</span>
                    <span className="text-slate-500">{sub.subjectName}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        sub.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {sub.status === 'PENDING' && (
                      <button
                        onClick={() => handleConfirm(sub.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Confirm Cover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Schedule Substitution
            </h3>
            <form onSubmit={handleAddSubstitution} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Absent Teacher</label>
                <select
                  value={absentTeacher}
                  onChange={(e) => setAbsentTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.fullName}>
                      {s.fullName} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assigned Cover / Substitute</label>
                <select
                  value={subTeacher}
                  onChange={(e) => setSubTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.fullName}>
                      {s.fullName} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Period Number</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={periodNum}
                    onChange={(e) => setPeriodNum(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Class / Room</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 10-A"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics - Quadratic Equations"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs"
                >
                  Save Substitution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
