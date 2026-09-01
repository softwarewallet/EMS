import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  FileCheck, 
  Users, 
  Building,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  DollarSign,
  Plus
} from 'lucide-react';
import { StudentExitService } from '../../services/studentExitService';
import { StudentService } from '../../services/studentService';
import { ExitRequest, ClearanceCase, Student, ExitConfiguration, ExitType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNotification } from '../../context/NotificationContext';
import { Student360WorkspaceModal } from '../students/Student360WorkspaceModal';

export const StudentExitsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const { notify } = useNotification();
  
  // Tab control: 'dashboard' | 'clearance' | 'settings'
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'clearance' | 'settings'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [requests, setRequests] = useState<ExitRequest[]>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, Student>>({});
  const [clearanceCases, setClearanceCases] = useState<ClearanceCase[]>([]);
  const [exitConfig, setExitConfig] = useState<ExitConfiguration | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected student for Student 360 Workspace Modal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [is360Open, setIs360Open] = useState(false);

  // Policy configuration edit state
  const [libraryRequired, setLibraryRequired] = useState(true);
  const [financeRequired, setFinanceRequired] = useState(true);
  const [transportRequired, setTransportRequired] = useState(true);
  const [inventoryRequired, setInventoryRequired] = useState(true);
  const [academicsRequired, setAcademicsRequired] = useState(true);
  const [hostelRequired, setHostelRequired] = useState(false);
  const [adminRequired, setAdminRequired] = useState(true);

  const [libraryBlocking, setLibraryBlocking] = useState(true);
  const [financeBlocking, setFinanceBlocking] = useState(true);
  const [transportBlocking, setTransportBlocking] = useState(false);
  const [inventoryBlocking, setInventoryBlocking] = useState(false);
  const [academicsBlocking, setAcademicsBlocking] = useState(true);
  const [hostelBlocking, setHostelBlocking] = useState(false);
  const [adminBlocking, setAdminBlocking] = useState(true);

  // Static structure values needed for 360 Modal
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const loadAllData = async () => {
    if (!currentUser || !currentTenant) return;
    setIsLoading(true);
    try {
      const tenantId = currentTenant.id;
      
      // Load exit requests
      const allReqs = await StudentExitService.getExitRequests(tenantId, currentUser);
      setRequests(allReqs);

      // Load policy configurations
      const config = await StudentExitService.getConfiguration(tenantId);
      setExitConfig(config);
      if (config && config.requiredCategories) {
        const hasCat = (name: string) => config.requiredCategories.some(c => c.category === name);
        const isBlk = (name: string) => config.requiredCategories.find(c => c.category === name)?.blocking || false;

        setAcademicsRequired(hasCat('Academic'));
        setAcademicsBlocking(isBlk('Academic'));

        setFinanceRequired(hasCat('Finance'));
        setFinanceBlocking(isBlk('Finance'));

        setLibraryRequired(hasCat('Library'));
        setLibraryBlocking(isBlk('Library'));

        setTransportRequired(hasCat('Transport'));
        setTransportBlocking(isBlk('Transport'));

        setHostelRequired(hasCat('Hostel'));
        setHostelBlocking(isBlk('Hostel'));

        setInventoryRequired(hasCat('Inventory'));
        setInventoryBlocking(isBlk('Inventory'));

        setAdminRequired(hasCat('Administration'));
        setAdminBlocking(isBlk('Administration'));
      }

      // Load clearance cases
      const cases = await StudentExitService.getAllClearanceCases(tenantId);
      setClearanceCases(cases);

      // Resolve student records for the requests to show names in tables
      const map: Record<string, Student> = {};
      const uniqueStudentIds = Array.from(new Set(allReqs.map(r => r.studentId)));
      for (const sId of uniqueStudentIds) {
        const student = await StudentService.getStudentById(sId as string, currentUser);
        if (student) {
          map[sId as string] = student;
        }
      }
      setStudentsMap(map);

      // Load static data
      if (uniqueStudentIds.length > 0) {
        await StudentService.getStudent360Data(uniqueStudentIds[0] as string, 'ALL', currentUser).catch(() => null);
      }
    } catch (err: any) {
      console.error('Failed to load exits management dashboards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const tenantId = currentUser.tenantId || 'default-tenant';
      const requiredCategories = [];

      if (academicsRequired) {
        requiredCategories.push({ category: 'Academic', moduleId: 'mod_academic', blocking: academicsBlocking, clearingRoles: ['academic_coordinator', 'principal', 'registrar'] });
      }
      if (financeRequired) {
        requiredCategories.push({ category: 'Finance', moduleId: 'fees', blocking: financeBlocking, clearingRoles: ['accountant', 'registrar'] });
      }
      if (libraryRequired) {
        requiredCategories.push({ category: 'Library', moduleId: 'library', blocking: libraryBlocking, clearingRoles: ['librarian', 'registrar'] });
      }
      if (transportRequired) {
        requiredCategories.push({ category: 'Transport', moduleId: 'transport', blocking: transportBlocking, clearingRoles: ['transport_manager', 'registrar'] });
      }
      if (hostelRequired) {
        requiredCategories.push({ category: 'Hostel', moduleId: 'hostel', blocking: hostelBlocking, clearingRoles: ['hostel_warden', 'registrar'] });
      }
      if (inventoryRequired) {
        requiredCategories.push({ category: 'Inventory', moduleId: 'inventory', blocking: inventoryBlocking, clearingRoles: ['inventory_manager', 'registrar'] });
      }
      if (adminRequired) {
        requiredCategories.push({ category: 'Administration', moduleId: 'core', blocking: adminBlocking, clearingRoles: ['registrar', 'tenant_admin'] });
      }

      await StudentExitService.updateConfiguration(tenantId, { requiredCategories }, currentUser);
      notify('success', 'Policy Updated', 'Exit policies and dynamic clearance rules updated successfully.');
      await loadAllData();
    } catch (err: any) {
      notify('error', 'Update Failed', err.message);
    }
  };

  // Metrics calculation
  const totalPending = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const inClearance = requests.filter(r => r.status === 'CLEARANCE_IN_PROGRESS').length;
  const readyForApproval = requests.filter(r => r.status === 'READY_FOR_APPROVAL').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const activeHoldsCount = clearanceCases.filter(c => c.status === 'BLOCKED').length;

  // Filter exits list
  const filteredRequests = requests.filter(req => {
    const student = studentsMap[req.studentId];
    const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
    const studentIdStr = req.studentId.toLowerCase();
    const matchesSearch = studentName.includes(searchQuery.toLowerCase()) || studentIdStr.includes(searchQuery.toLowerCase()) || req.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || req.exitType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div id="student_exits_primary_canvas" className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/10">
              <LogOut className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">Student Exit & Clearance Workspace</h1>
              <p className="text-xs text-slate-500 mt-1">Manage institutional withdrawals, student transfers, clearance blocks, and compliance policies.</p>
            </div>
          </div>
        </div>

        {/* Subtab Buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'dashboard'
                ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Workflow Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('clearance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'clearance'
                ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Clearance Board ({clearanceCases.length})
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'settings'
                ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Policy & Rules
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      {activeSubTab !== 'settings' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submitted & Reviewing</p>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{totalPending}</p>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Clearance</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{inClearance}</p>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Holds / Blocks</p>
            <p className="text-2xl font-bold mt-1 text-rose-600">{activeHoldsCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ready for Sign-off</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{readyForApproval}</p>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 col-span-2 md:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Exits</p>
            <p className="text-2xl font-bold mt-1 text-teal-600">{completedCount}</p>
          </div>
        </div>
      )}

      {/* Primary Subtab Contents */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-4">
          
          {/* Filters controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search exit requests by student name or application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">All Exit Types</option>
                  <option value="WITHDRAWAL">Withdrawals</option>
                  <option value="TRANSFER">Transfers</option>
                  <option value="GRADUATION">Graduations</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="CLEARANCE_IN_PROGRESS">In Clearance</option>
                  <option value="READY_FOR_APPROVAL">Ready for Sign-off</option>
                  <option value="APPROVED">Approved</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading exit applications...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">No matching student exit workflows found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">App ID</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Reason</th>
                      <th className="p-4">Proposed Last Attendance</th>
                      <th className="p-4">Workflow Progress</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {filteredRequests.map(req => {
                      const student = studentsMap[req.studentId];
                      const name = student ? `${student.firstName} ${student.lastName}` : 'Resolving student...';
                      
                      // Progress estimate based on status
                      let progressPct = 10;
                      if (req.status === 'SUBMITTED') progressPct = 30;
                      if (req.status === 'UNDER_REVIEW') progressPct = 40;
                      if (req.status === 'CLEARANCE_IN_PROGRESS') progressPct = 60;
                      if (req.status === 'READY_FOR_APPROVAL') progressPct = 80;
                      if (req.status === 'APPROVED') progressPct = 90;
                      if (req.status === 'COMPLETED') progressPct = 100;
                      if (req.status === 'REJECTED' || req.status === 'CANCELLED') progressPct = 0;

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="p-4 font-bold text-slate-950 dark:text-white">#{req.id}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                              <p className="text-[10px] text-slate-400">ID: {req.studentId}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{req.exitType}</span>
                          </td>
                          <td className="p-4 text-slate-500">{req.reason?.replace(/_/g, ' ') || 'Not Specified'}</td>
                          <td className="p-4 text-slate-600">{new Date(req.proposedLastDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="w-32">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                                <span className="font-bold uppercase text-[9px]">{req.status}</span>
                                <span>{progressPct}%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    req.status === 'REJECTED' ? 'bg-rose-500' :
                                    req.status === 'CANCELLED' ? 'bg-slate-400' :
                                    req.status === 'COMPLETED' ? 'bg-teal-500' : 'bg-indigo-600'
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedStudentId(req.studentId);
                                setIs360Open(true);
                              }}
                              className="px-2.5 py-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-[10px] font-semibold rounded-lg inline-flex items-center gap-1"
                            >
                              Workspace Cockpit
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clearance Board Tab */}
      {activeSubTab === 'clearance' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-400" />
              Department Clearance Dashboard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Below are active clearance cases. Institutional operators can review the holds and manage blocks. Click "Cockpit" to override items.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clearanceCases.length === 0 ? (
              <div className="col-span-2 p-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
                No active clearance boards generated yet.
              </div>
            ) : (
              clearanceCases.map(cCase => {
                const student = studentsMap[cCase.studentId];
                const name = student ? `${student.firstName} ${student.lastName}` : 'Loading...';
                
                return (
                  <div key={cCase.id} className="bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-950 dark:text-white text-xs">{name}</h4>
                        <p className="text-[10px] text-slate-400">Request: #{cCase.exitRequestId}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${
                        cCase.status === 'BLOCKED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        cCase.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {cCase.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-lg flex items-center justify-between text-2xs">
                      <div>
                        <span className="text-slate-400">Overall Clearance Status</span>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">Opened {new Date(cCase.openedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStudentId(cCase.studentId);
                          setIs360Open(true);
                        }}
                        className="px-2 py-1 bg-indigo-600 text-white font-semibold rounded"
                      >
                        Manage Holds
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Policy and settings configuration */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleUpdatePolicy} className="bg-white dark:bg-slate-950 p-6 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400" />
              Dynamic Clearance Departments Policy
            </h3>
            <p className="text-xs text-slate-500 mt-1">Toggle which campus departments must verify clearance logs for student withdrawals, and define if outstanding items block approval.</p>
          </div>

          <div className="space-y-4 max-w-2xl">
            {[
              { id: 'aca', name: 'Academic Registrars Office', desc: 'Submits formal completion credentials, transcripts, and ID return checks.', req: academicsRequired, setReq: setAcademicsRequired, blk: academicsBlocking, setBlk: setAcademicsBlocking },
              { id: 'fin', name: 'Finance / Accounts Department', desc: 'Checks outstanding term tuition fees, uniform charges, and transports.', req: financeRequired, setReq: setFinanceRequired, blk: financeBlocking, setBlk: setFinanceBlocking },
              { id: 'lib', name: 'Library Department', desc: 'Verifies issued library books, catalog fines, and returns.', req: libraryRequired, setReq: setLibraryRequired, blk: libraryBlocking, setBlk: setLibraryBlocking },
              { id: 'tra', name: 'Transport Department', desc: 'Checks transport passes, outstanding vehicle dues, or damage reports.', req: transportRequired, setReq: setTransportRequired, blk: transportBlocking, setBlk: setTransportBlocking },
              { id: 'hos', name: 'Hostel & Mess', desc: 'Locker checks, key hand-ins, messy dues, and room damages.', req: hostelRequired, setReq: setHostelRequired, blk: hostelBlocking, setBlk: setHostelBlocking },
              { id: 'inv', name: 'Inventory & Supplies', desc: 'Verifies uniforms, book store accounts, and hardware asset returns.', req: inventoryRequired, setReq: setInventoryRequired, blk: inventoryBlocking, setBlk: setInventoryBlocking },
              { id: 'adm', name: 'Institutional Administration', desc: 'Validates basic student cards, campus parking passes, and safety tags.', req: adminRequired, setReq: setAdminRequired, blk: adminBlocking, setBlk: setAdminBlocking }
            ].map(dept => (
              <div key={dept.id} className="p-4 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{dept.name}</span>
                  <p className="text-[11px] text-slate-500">{dept.desc}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={dept.req}
                      onChange={(e) => dept.setReq(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    Required
                  </label>

                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      disabled={!dept.req}
                      checked={dept.blk}
                      onChange={(e) => dept.setBlk(e.target.checked)}
                      className="rounded text-indigo-600 disabled:opacity-50"
                    />
                    Blocking hold
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-900">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Save Clearance Policy Settings
            </button>
          </div>
        </form>
      )}

      {/* Embedded Student 360 Workspace Modal for comprehensive overlays */}
      {is360Open && selectedStudentId && (
        <Student360WorkspaceModal
          studentId={selectedStudentId}
          isOpen={is360Open}
          onClose={() => {
            setIs360Open(false);
            loadAllData(); // Reload stats and lists after modal interactions
          }}
          classes={classes}
          sections={sections}
          academicYears={academicYears}
        />
      )}

    </div>
  );
};
