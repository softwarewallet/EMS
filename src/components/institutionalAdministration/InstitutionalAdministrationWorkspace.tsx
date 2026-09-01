import React, { useState } from 'react';
import { 
  Building2, MapPin, Network, GitBranch, Users, ShieldAlert, FileText, 
  Plus, CheckCircle2, AlertTriangle, Layers, Award, RefreshCw, Settings, Search
} from 'lucide-react';
import { InstitutionalAdministrationService } from '../../services/institutionalAdministrationService';
import { 
  Institution, Campus, OrganizationalUnit, OrganizationalPosition, 
  Committee, AdministrativeResponsibility, OrganizationChangeRequest 
} from '../../types/institutionalAdministration';

export const InstitutionalAdministrationWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'command' | 'profile' | 'campuses' | 'directory' | 'hierarchy' | 'schools' | 'departments' | 'positions' | 'committees' | 'responsibilities' | 'changes' | 'diagnostics' | 'audit'
  >('command');
  
  const [tenantId] = useState('tenant_default');
  const [userId] = useState('usr_admin_01');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for forms & dialogs
  const [institutions, setInstitutions] = useState<Institution[]>(() => InstitutionalAdministrationService.getInstitutions(tenantId));
  const [campuses, setCampuses] = useState<Campus[]>(() => InstitutionalAdministrationService.getCampuses(tenantId));
  const [units, setUnits] = useState<OrganizationalUnit[]>(() => InstitutionalAdministrationService.getUnits(tenantId));
  const [positions, setPositions] = useState<OrganizationalPosition[]>(() => InstitutionalAdministrationService.getPositions(tenantId));
  const [committees, setCommittees] = useState<Committee[]>(() => InstitutionalAdministrationService.getCommittees(tenantId));
  const [responsibilities, setResponsibilities] = useState<AdministrativeResponsibility[]>(() => InstitutionalAdministrationService.getResponsibilities(tenantId));
  const [changeRequests, setChangeRequests] = useState<OrganizationChangeRequest[]>(() => InstitutionalAdministrationService.getChangeRequests(tenantId));
  const [auditEvents, setAuditEvents] = useState(() => InstitutionalAdministrationService.getAuditEvents(tenantId));
  const [diagnostics, setDiagnostics] = useState(() => InstitutionalAdministrationService.runDiagnostics(tenantId));

  const [notification, setNotification] = useState<string | null>(null);

  const refreshData = () => {
    setInstitutions(InstitutionalAdministrationService.getInstitutions(tenantId));
    setCampuses(InstitutionalAdministrationService.getCampuses(tenantId));
    setUnits(InstitutionalAdministrationService.getUnits(tenantId));
    setPositions(InstitutionalAdministrationService.getPositions(tenantId));
    setCommittees(InstitutionalAdministrationService.getCommittees(tenantId));
    setResponsibilities(InstitutionalAdministrationService.getResponsibilities(tenantId));
    setChangeRequests(InstitutionalAdministrationService.getChangeRequests(tenantId));
    setAuditEvents(InstitutionalAdministrationService.getAuditEvents(tenantId));
    setDiagnostics(InstitutionalAdministrationService.runDiagnostics(tenantId));
  };

  const handleCreateUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      InstitutionalAdministrationService.createOrganizationUnit({
        tenantId,
        campusId: formData.get('campusId') as string || (campuses[0]?.campusId ?? 'campus_main'),
        parentOrganizationUnitId: formData.get('parentUnitId') as string || undefined,
        unitType: formData.get('unitType') as any || 'DEPARTMENT',
        code: formData.get('code') as string,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: 'ACTIVE',
        effectiveFrom: new Date().toISOString().split('T')[0],
        ownershipType: 'AUTHORITATIVE'
      });
      refreshData();
      setNotification('Organizational unit created successfully.');
      e.currentTarget.reset();
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
  };

  const handleCreateChangeRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      InstitutionalAdministrationService.createOrganizationChangeRequest({
        tenantId,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        changeType: formData.get('changeType') as any || 'UNIT_RESTRUCTURING',
        targetEntityId: formData.get('targetEntityId') as string || 'inst_global',
        payload: { reason: formData.get('reason') as string },
        status: 'DRAFT',
        requestedBy: userId
      });
      refreshData();
      setNotification('Organization change request created as DRAFT.');
      e.currentTarget.reset();
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
  };

  const handleApproveChange = (requestId: string) => {
    try {
      InstitutionalAdministrationService.approveOrganizationChange(requestId, userId);
      refreshData();
      setNotification('Change request approved successfully with Four-Eyes validation.');
    } catch (err: any) {
      setNotification(`Approval failed: ${err.message}`);
    }
  };

  const handleImplementChange = (requestId: string) => {
    try {
      InstitutionalAdministrationService.implementOrganizationChange(requestId, userId);
      refreshData();
      setNotification('Change request implemented successfully.');
    } catch (err: any) {
      setNotification(`Implementation failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Administration &amp; Organization</h1>
                <p className="text-sm text-slate-500">Authoritative Operational Backbone • Phase 10.1 Functional Module</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational Active
            </span>
            <button 
              onClick={refreshData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {notification && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl flex items-center justify-between shadow-sm">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Dismiss</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mt-6 pb-2 border-b border-slate-200">
          {[
            { id: 'command', label: 'Command', icon: Award },
            { id: 'profile', label: 'Profile', icon: Building2 },
            { id: 'campuses', label: 'Campuses', icon: MapPin },
            { id: 'directory', label: 'Directory', icon: Layers },
            { id: 'hierarchy', label: 'Hierarchy', icon: GitBranch },
            { id: 'schools', label: 'Schools', icon: Building2 },
            { id: 'departments', label: 'Departments', icon: Layers },
            { id: 'positions', label: 'Positions', icon: Users },
            { id: 'committees', label: 'Committees', icon: Users },
            { id: 'responsibilities', label: 'Responsibilities', icon: FileText },
            { id: 'changes', label: 'Changes', icon: RefreshCw },
            { id: 'diagnostics', label: 'Diagnostics', icon: ShieldAlert },
            { id: 'audit', label: 'Audit Trail', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. COMMAND */}
        {activeTab === 'command' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Institutions</h3>
              <p className="text-3xl font-extrabold text-indigo-600">{institutions.length}</p>
              <p className="text-xs text-slate-500 mt-1">Authoritative legal entities</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Campuses</h3>
              <p className="text-3xl font-extrabold text-indigo-600">{campuses.length}</p>
              <p className="text-xs text-slate-500 mt-1">Geographic operating nodes</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Organizational Units</h3>
              <p className="text-3xl font-extrabold text-indigo-600">{units.length}</p>
              <p className="text-xs text-slate-500 mt-1">Schools, departments, offices</p>
            </div>

            <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Operational Status &amp; Diagnostics Overview</h3>
              <div className="space-y-3">
                {diagnostics.map((diag: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-slate-900">{diag.title}</p>
                        <p className="text-sm text-slate-600">{diag.description}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {diag.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Institution Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {institutions.map(inst => (
                <div key={inst.institutionId} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900">{inst.legalName}</h3>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-lg">{inst.shortName}</span>
                  </div>
                  <p className="text-sm text-slate-600"><span className="font-medium">Type:</span> {inst.institutionType}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Region/Timezone:</span> {inst.region} / {inst.timezone}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Accreditations:</span> {inst.accreditationReferences.join(', ')}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Status:</span> {inst.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CAMPUSES */}
        {activeTab === 'campuses' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Campus Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campuses.map(campus => (
                <div key={campus.campusId} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-semibold px-2 py-1 bg-slate-200 text-slate-800 rounded">{campus.code}</span>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{campus.status}</span>
                  </div>
                  <h3 className="text-md font-bold text-slate-900">{campus.name}</h3>
                  <p className="text-xs text-slate-600"><span className="font-medium">Type:</span> {campus.campusType}</p>
                  <p className="text-xs text-slate-600"><span className="font-medium">Location:</span> {campus.locationReference}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DIRECTORY & 7. DEPARTMENTS */}
        {(activeTab === 'directory' || activeTab === 'departments' || activeTab === 'schools') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                {activeTab === 'schools' ? 'Schools & Faculties' : activeTab === 'departments' ? 'Departments & Units' : 'Organization Directory'}
              </h2>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search organization units..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Create Unit Form */}
            <form onSubmit={handleCreateUnit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Code</label>
                <input name="code" required placeholder="e.g. CS-DEPT" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Name</label>
                <input name="name" required placeholder="e.g. Computer Science" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Type</label>
                <select name="unitType" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white">
                  <option value="DEPARTMENT">Department</option>
                  <option value="SCHOOL">School</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="COLLEGE">College</option>
                  <option value="OFFICE">Office</option>
                  <option value="CENTER">Center</option>
                </select>
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Unit
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase bg-slate-50">
                    <th className="p-3">Code</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ownership</th>
                    <th className="p-3">Effective From</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {units
                    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(u => (
                      <tr key={u.organizationUnitId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-medium text-indigo-600">{u.code}</td>
                        <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded font-medium">{u.unitType}</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">{u.status}</span></td>
                        <td className="p-3 text-slate-600">{u.ownershipType}</td>
                        <td className="p-3 text-slate-500 text-xs">{u.effectiveFrom}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. HIERARCHY */}
        {activeTab === 'hierarchy' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Organizational Hierarchy Tree</h2>
            <p className="text-sm text-slate-600">Visualizing parent-child structural relationships with cycle detection protection.</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-sm">
              {InstitutionalAdministrationService.getOrganizationTree(tenantId).map((node, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-700">
                    <GitBranch className="w-4 h-4" /> {node.name} ({node.code}) - [{node.unitType}]
                  </div>
                  {node.children && node.children.map((child: any, j: number) => (
                    <div key={j} className="ml-6 pl-4 border-l-2 border-indigo-200 flex items-center gap-2 text-slate-800">
                      <span>├─</span> {child.name} ({child.code}) - [{child.unitType}]
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. POSITIONS */}
        {activeTab === 'positions' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Authoritative Organizational Positions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {positions.map(pos => (
                <div key={pos.positionId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-600">{pos.positionCode}</span>
                  <h3 className="font-bold text-slate-900">{pos.title}</h3>
                  <p className="text-xs text-slate-600">Type: {pos.positionType}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${pos.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {pos.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. COMMITTEES */}
        {activeTab === 'committees' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Institutional Committees</h2>
            <div className="space-y-4">
              {committees.map(com => (
                <div key={com.committeeId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{com.name} ({com.code})</h3>
                    <p className="text-sm text-slate-600">Type: {com.committeeType} • Frequency: {com.meetingFrequency} • Quorum: {com.quorumCount}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">{com.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. RESPONSIBILITIES */}
        {activeTab === 'responsibilities' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Administrative Responsibilities</h2>
            <div className="space-y-3">
              {responsibilities.map(resp => (
                <div key={resp.responsibilityId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900">{resp.responsibilityType}</h3>
                    <p className="text-xs text-slate-600">Unit ID: {resp.organizationUnitId} • Owner Position: {resp.ownerPositionId}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">{resp.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. CHANGES */}
        {activeTab === 'changes' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Organization Change Management &amp; Four-Eyes Approval</h2>
            
            <form onSubmit={handleCreateChangeRequest} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Submit Structural Change Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="title" required placeholder="Change Title" className="p-2 border border-slate-200 rounded-lg text-sm bg-white" />
                <input name="description" required placeholder="Description / Scope" className="p-2 border border-slate-200 rounded-lg text-sm bg-white" />
                <select name="changeType" className="p-2 border border-slate-200 rounded-lg text-sm bg-white">
                  <option value="UNIT_RESTRUCTURING">Unit Restructuring</option>
                  <option value="UNIT_CREATION">Unit Creation</option>
                  <option value="UNIT_CLOSURE">Unit Closure</option>
                </select>
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition">
                Create Change Request (Draft)
              </button>
            </form>

            <div className="space-y-4">
              {changeRequests.map(req => (
                <div key={req.requestId} className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{req.title}</h3>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded">{req.status}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{req.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Requested by: {req.requestedBy}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'DRAFT' && (
                      <button onClick={() => { InstitutionalAdministrationService.submitOrganizationChange(req.requestId, userId); refreshData(); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg">
                        Submit
                      </button>
                    )}
                    {req.status === 'SUBMITTED' && (
                      <button onClick={() => handleApproveChange(req.requestId)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg">
                        Approve (Four-Eyes)
                      </button>
                    )}
                    {req.status === 'APPROVED' && (
                      <button onClick={() => handleImplementChange(req.requestId)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg">
                        Implement
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Institutional Diagnostics &amp; Integrity Scan</h2>
            <div className="space-y-4">
              {diagnostics.map((d: any, i: number) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-slate-900">{d.title}</h3>
                      <p className="text-sm text-slate-600">{d.description}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">{d.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. AUDIT */}
        {activeTab === 'audit' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Cryptographic Append-Only Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase bg-slate-50">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity Type</th>
                    <th className="p-3">Entity ID</th>
                    <th className="p-3 font-mono">SHA-256 Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-mono">
                  {auditEvents.map((ev, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 text-xs text-slate-500">{new Date(ev.timestamp).toLocaleString()}</td>
                      <td className="p-3 font-bold text-indigo-600">{ev.action}</td>
                      <td className="p-3">{ev.entityType}</td>
                      <td className="p-3 text-xs">{ev.entityId}</td>
                      <td className="p-3 text-xs text-slate-400 truncate max-w-xs">{ev.signatureHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
