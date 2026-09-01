import React, { useState, useEffect } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import { StaffAssignment, AssignmentType } from '../../types';
import {
  GraduationCap,
  Plus,
  BookOpen,
} from 'lucide-react';

export const AssignmentsTab: React.FC = () => {
  const { tenantId, selectedCampusId, staffList, currentUser } = useStaffContext();
  const { notify } = useNotification();

  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Form State
  const [formStaffId, setFormStaffId] = useState<string>(staffList[0]?.id || '');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('TEACHING');
  const [roleTitle, setRoleTitle] = useState<string>('Subject Instructor');
  const [subjectName, setSubjectName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [weeklyPeriods, setWeeklyPeriods] = useState<number>(5);
  const [dutyName, setDutyName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await StaffService.getStaffAssignments(
        tenantId,
        selectedTeacherId !== 'ALL' ? { staffId: selectedTeacherId } : undefined
      );
      setAssignments(data);
    } catch (err: any) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [tenantId, selectedTeacherId]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStaffId) {
      notify('warning', 'Staff Required', 'Please select a faculty member for this assignment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const teacher = staffList.find((s) => s.id === formStaffId);
      await StaffService.createAssignment(
        tenantId,
        {
          tenantId,
          campusId: selectedCampusId || teacher?.campusId || 'main_campus',
          staffId: formStaffId,
          staffName: teacher?.fullName || 'Faculty Member',
          academicYearId: 'ay_2026_27',
          assignmentType,
          roleTitle: roleTitle.trim() || (assignmentType === 'TEACHING' ? 'Subject Instructor' : dutyName),
          department: teacher?.department,
          subjectName: subjectName.trim() || undefined,
          className: className.trim() || undefined,
          weeklyPeriods: Number(weeklyPeriods) || 0,
          status: 'ACTIVE',
          startDate: new Date().toISOString().split('T')[0]
        },
        currentUser
      );

      notify('success', 'Assignment Created', 'Workforce assignment allocated successfully.');

      setShowAddModal(false);
      setSubjectName('');
      setClassName('');
      setDutyName('');
      await loadAssignments();
    } catch (err: any) {
      notify('error', 'Allocation Failed', err.message || 'Could not allocate assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = assignments.filter((a) => {
    if (selectedType !== 'ALL' && a.assignmentType !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Academic & Administrative Duty Allocations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign teaching periods, class mentorships, examination duties, and department responsibilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Duty Allocation
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Faculty Member</label>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="ALL">All Faculty & Staff</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.employeeNumber} - {s.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Assignment Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="ALL">All Assignment Types</option>
            <option value="TEACHING">Teaching / Subject Teacher</option>
            <option value="CLASS_TEACHER">Class Teacher / Homeroom</option>
            <option value="DEPARTMENT_HEAD">Head of Department (HOD)</option>
            <option value="COORDINATOR">Academic Coordinator</option>
            <option value="COMMITTEE_MEMBER">Institutional Committee</option>
            <option value="EXAM_DUTY">Examination Duty</option>
            <option value="ADMINISTRATIVE">Administrative Duty</option>
            <option value="HOSTEL_WARDEN">Hostel Warden</option>
            <option value="TRANSPORT_INCHARGE">Transport Incharge</option>
            <option value="OTHER">Other Assignment</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading allocations...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 mb-1">No Duty Allocations Found</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
            Allocate courses or committee roles to faculty members to track institutional workload.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create First Allocation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Staff Assignee</th>
                  <th className="px-4 py-3.5">Assignment Type & Role</th>
                  <th className="px-4 py-3.5">Subject / Class</th>
                  <th className="px-4 py-3.5">Workload (Periods/Wk)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Effective Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const staff = staffList.find((s) => s.id === item.staffId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-900 block">{staff?.fullName || item.staffName || 'Assigned Staff'}</span>
                        <span className="text-xs text-slate-400">{staff?.department || item.department || 'Department'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800 text-xs block">{item.assignmentType}</span>
                        <span className="text-xs text-slate-500">{item.roleTitle}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700">
                        {item.subjectName ? (
                          <span className="font-semibold block">{item.subjectName}</span>
                        ) : (
                          <span className="font-semibold block">{item.roleTitle || 'Institutional Duty'}</span>
                        )}
                        {item.className && <span className="text-slate-500">Class: {item.className}</span>}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 text-xs">
                        {item.weeklyPeriods ? `${item.weeklyPeriods} hrs/periods` : 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{item.startDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Allocate Staff Assignment
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Faculty / Staff</label>
                <select
                  required
                  value={formStaffId}
                  onChange={(e) => setFormStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="">-- Choose Employee --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.department} - {s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assignment Type</label>
                <select
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="TEACHING">Teaching / Subject Teacher</option>
                  <option value="CLASS_TEACHER">Class Teacher / Homeroom</option>
                  <option value="DEPARTMENT_HEAD">Head of Department (HOD)</option>
                  <option value="COORDINATOR">Academic Coordinator</option>
                  <option value="COMMITTEE_MEMBER">Institutional Committee</option>
                  <option value="EXAM_DUTY">Examination Duty</option>
                  <option value="ADMINISTRATIVE">Administrative Duty</option>
                  <option value="HOSTEL_WARDEN">Hostel Warden</option>
                  <option value="TRANSPORT_INCHARGE">Transport Incharge</option>
                  <option value="OTHER">Other Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role / Designation Title</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="e.g. Lead Instructor / Year 10 Mentor"
                />
              </div>

              {assignmentType === 'TEACHING' || assignmentType === 'CLASS_TEACHER' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Advanced Physics"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Class / Section</label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g. Grade 10-A"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duty / Committee Title</label>
                  <input
                    type="text"
                    value={dutyName}
                    onChange={(e) => setDutyName(e.target.value)}
                    placeholder="e.g. Disciplinary Board Member"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Periods / Load Hours Per Week</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={weeklyPeriods}
                  onChange={(e) => setWeeklyPeriods(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Allocating...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
