import React, { useState, useMemo } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffProfile, StaffStatus, EmploymentCategory, EmploymentType } from '../../types';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Eye,
  Building,
  Briefcase,
  Calendar,
  MoreVertical,
  Users,
  Grid,
  List
} from 'lucide-react';

interface StaffDirectoryTabProps {
  onOpenOnboardModal: () => void;
  onSelectStaff: (staff: StaffProfile) => void;
}

export const StaffDirectoryTab: React.FC<StaffDirectoryTabProps> = ({
  onOpenOnboardModal,
  onSelectStaff
}) => {
  const { staffList, departments, isLoading } = useStaffContext();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = s.fullName.toLowerCase().includes(query);
        const matchesCode = s.employeeNumber.toLowerCase().includes(query);
        const matchesEmail = s.email.toLowerCase().includes(query);
        const matchesDesig = s.designation.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesEmail && !matchesDesig) return false;
      }
      // Department
      if (selectedDept !== 'ALL' && s.department !== selectedDept) {
        return false;
      }
      // Status
      if (selectedStatus !== 'ALL' && s.status !== selectedStatus) {
        return false;
      }
      // Category
      if (selectedCategory !== 'ALL' && s.employmentCategory !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [staffList, searchTerm, selectedDept, selectedStatus, selectedCategory]);

  const handleExportCSV = () => {
    if (filteredStaff.length === 0) return;
    const headers = [
      'Employee Number',
      'Full Name',
      'Email',
      'Phone',
      'Department',
      'Designation',
      'Category',
      'Contract Type',
      'Status',
      'Joining Date'
    ];
    const rows = filteredStaff.map((s) => [
      `"${s.employeeNumber}"`,
      `"${s.fullName}"`,
      `"${s.email}"`,
      `"${s.phone || ''}"`,
      `"${s.department}"`,
      `"${s.designation}"`,
      `"${s.employmentCategory}"`,
      `"${s.employmentType}"`,
      `"${s.status}"`,
      `"${s.joiningDate}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `workforce_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ON_LEAVE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PROBATION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUSPENDED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Search Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, code, email, designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={onOpenOnboardModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Onboard Staff
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Lifecycle Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="PROBATION">PROBATION</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="NOTICE_PERIOD">NOTICE_PERIOD</option>
              <option value="RESIGNED">RESIGNED</option>
              <option value="RETIRED">RETIRED</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Employment Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Categories</option>
              <option value="TEACHING">Teaching / Faculty</option>
              <option value="NON_TEACHING">Non-Teaching</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="MANAGEMENT">Management</option>
              <option value="SUPPORT_STAFF">Support Staff</option>
              <option value="TECHNICAL">Technical / IT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Display */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 mb-1">No Matching Staff Found</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Try adjusting your search criteria or clear active department/status filters.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Staff Member</th>
                  <th className="px-4 py-3.5">Employee ID</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Category & Type</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Joining Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {staff.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{staff.fullName}</span>
                          <span className="text-xs text-slate-500">{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-700 font-semibold">
                      {staff.employeeNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-800 text-xs block">{staff.department}</span>
                      <span className="text-xs text-slate-500">{staff.designation}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <span className="block font-medium">{staff.employmentCategory}</span>
                      <span className="text-slate-400">{staff.employmentType}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(staff.status)}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{staff.joiningDate}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onSelectStaff(staff)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View 360°
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                      {staff.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{staff.fullName}</h4>
                      <span className="text-xs font-mono text-slate-500">{staff.employeeNumber}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(staff.status)}`}>
                    {staff.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.department} ({staff.designation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.employmentCategory} • {staff.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Joined: {staff.joiningDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => onSelectStaff(staff)}
                  className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View 360° Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
