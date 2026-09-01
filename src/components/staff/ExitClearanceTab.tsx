import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffExitCase, StaffClearanceItem, ClearanceStatus } from '../../types';
import { LogOut, CheckCircle2 } from 'lucide-react';

export const ExitClearanceTab: React.FC = () => {
  const { staffList } = useStaffContext();

  const [exitCases] = useState<StaffExitCase[]>([
    {
      id: 'exit_1',
      tenantId: 'tenant_default',
      campusId: 'campus_main',
      staffId: staffList[staffList.length - 1]?.id || 'staff_exit',
      staffName: staffList[staffList.length - 1]?.fullName || 'Departing Faculty Member',
      employeeNumber: staffList[staffList.length - 1]?.employeeNumber || 'EMP-2026-0099',
      designation: staffList[staffList.length - 1]?.designation || 'Senior Faculty',
      department: staffList[staffList.length - 1]?.department || 'Academics',
      exitType: 'RESIGNATION',
      noticeDate: '2026-08-01',
      lastWorkingDate: '2026-08-31',
      reason: 'Relocating to another academic institution.',
      status: 'CLEARANCE_IN_PROGRESS',
      overallClearanceStatus: 'PENDING',
      handoverCompleted: false,
      version: 1,
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-08-01T08:00:00Z'
    }
  ]);

  const [clearances, setClearances] = useState<StaffClearanceItem[]>([
    {
      id: 'clr_1',
      tenantId: 'tenant_default',
      exitCaseId: 'exit_1',
      staffId: 'staff_exit',
      departmentKey: 'IT_EQUIPMENT',
      departmentName: 'IT & Digital Assets',
      status: 'CLEARED',
      remarks: 'Workstation Laptop, Email Archive, Smart Board RFID Keycard returned',
      clearedByName: 'System Administrator',
      clearedAt: '2026-08-15T10:00:00Z',
      updatedAt: '2026-08-15T10:00:00Z'
    },
    {
      id: 'clr_2',
      tenantId: 'tenant_default',
      exitCaseId: 'exit_1',
      staffId: 'staff_exit',
      departmentKey: 'LIBRARY',
      departmentName: 'Library & Resource Center',
      status: 'CLEARED',
      remarks: 'Reference Textbooks and Journal Borrows cleared',
      clearedByName: 'Head Librarian',
      clearedAt: '2026-08-16T11:00:00Z',
      updatedAt: '2026-08-16T11:00:00Z'
    },
    {
      id: 'clr_3',
      tenantId: 'tenant_default',
      exitCaseId: 'exit_1',
      staffId: 'staff_exit',
      departmentKey: 'ACADEMIC_RESOURCES',
      departmentName: 'Academic Department',
      status: 'PENDING',
      remarks: 'Gradebook Finalization, Subject Curriculum Handoff pending',
      updatedAt: '2026-08-01T08:00:00Z'
    },
    {
      id: 'clr_4',
      tenantId: 'tenant_default',
      exitCaseId: 'exit_1',
      staffId: 'staff_exit',
      departmentKey: 'FINANCE',
      departmentName: 'Finance & Payroll',
      status: 'PENDING',
      remarks: 'Final Settlement, Gratuity & Tax Clearance pending',
      updatedAt: '2026-08-01T08:00:00Z'
    }
  ]);

  const handleClearDepartment = (clrId: string) => {
    setClearances(
      clearances.map((c) =>
        c.id === clrId
          ? {
              ...c,
              status: 'CLEARED',
              clearedByName: 'Authorized Admin',
              clearedAt: new Date().toISOString()
            }
          : c
      )
    );
  };

  const getStatusBadge = (status: ClearanceStatus) => {
    switch (status) {
      case 'CLEARED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'HOLD':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'WAIVED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-blue-600" />
            Staff Offboarding & Departmental Asset Clearance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate multi-department sign-offs for IT hardware, library books, academic handover, and payroll settlements.
          </p>
        </div>
      </div>

      {/* Active Exits */}
      <div className="space-y-4">
        {exitCases.map((ec) => {
          const staff = staffList.find((s) => s.id === ec.staffId);
          const clearedCount = clearances.filter((c) => c.status === 'CLEARED').length;
          const totalCheckpoints = clearances.length;

          return (
            <div key={ec.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-slate-900">{staff?.fullName || ec.staffName}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {ec.exitType} ({ec.status})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {staff?.department || ec.department} • Notice Date: {ec.noticeDate} • Last Day: {ec.lastWorkingDate}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Clearance Progress</span>
                  <span className="text-lg font-bold text-slate-800">
                    {clearedCount} / {totalCheckpoints} Departments
                  </span>
                </div>
              </div>

              {/* Department Checkpoints Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clearances.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                        {c.departmentName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500 block">Clearance Items:</span>
                      <p className="text-xs text-slate-600">{c.remarks}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      {c.clearedByName ? (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared by {c.clearedByName}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClearDepartment(c.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Sign-Off Clearance
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
