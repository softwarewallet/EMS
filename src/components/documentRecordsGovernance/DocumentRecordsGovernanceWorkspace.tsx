import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Search,
  Plus,
  ArrowRight,
  GitBranch,
  Archive,
  RefreshCw,
  Zap,
  UserCheck,
  FileCheck,
  Activity,
  History,
  Scale,
  MessageSquare,
  Network
} from 'lucide-react';
import { DocumentRecordsGovernanceService } from '../../services/documentRecordsGovernanceService';
import {
  EnterpriseDocumentGovDoc,
  EnterpriseDocumentVersion,
  EnterpriseRecordGovRecord,
  EnterpriseCorrespondenceGovRecord,
  EnterpriseApprovalPackageGovPkg,
  EnterpriseLegalHoldGovHold,
  EnterpriseDocumentRelationship,
  EnterpriseDocumentDiagnostic,
  EnterpriseDocumentSimulation,
  EnterpriseDocumentAuditLog
} from '../../types/documentRecordsGovernance';

export const DocumentRecordsGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [filterQuery, setFilterQuery] = useState('');

  // Mock State for UI
  const [mockDocs, setMockDocs] = useState<EnterpriseDocumentGovDoc[]>([
    {
      id: 'doc-101',
      tenantId: 'tenant-main',
      campusId: 'campus-alpha',
      documentNumber: 'EDG-2026-001',
      title: 'Institutional Academic Governance Framework',
      description: 'Master policy document governing curriculum and degree authorization.',
      documentType: 'INSTITUTIONAL_POLICY',
      status: 'PUBLISHED',
      classification: 'CONFIDENTIAL',
      businessCriticality: 'CRITICAL',
      sourceModuleIdRef: 'mod_academic',
      sourceRecordIdRef: 'academic-pol-88',
      ownerUserIdRef: 'user-provost-1',
      stewardUserIdRef: 'user-steward-2',
      activeVersionNumber: 2,
      legalHoldActive: false,
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'doc-102',
      tenantId: 'tenant-main',
      campusId: 'campus-alpha',
      documentNumber: 'EDG-2026-002',
      title: 'Enterprise Cyber Resilience Strategy 2026-2030',
      description: 'Security blueprint and disaster recovery protocol standard.',
      documentType: 'SECURITY_BLUEPRINT',
      status: 'APPROVAL_PENDING',
      classification: 'HIGHLY_RESTRICTED',
      businessCriticality: 'CRITICAL',
      sourceModuleIdRef: 'mod_cybersecurity',
      sourceRecordIdRef: 'sec-strat-901',
      ownerUserIdRef: 'user-ciso-1',
      stewardUserIdRef: 'user-steward-3',
      activeVersionNumber: 1,
      legalHoldActive: true,
      createdAt: '2026-02-10T09:30:00Z',
      updatedAt: '2026-02-28T14:20:00Z'
    }
  ]);

  const [mockVersions] = useState<EnterpriseDocumentVersion[]>([
    {
      id: 'ver-1',
      tenantId: 'tenant-main',
      documentIdRef: 'doc-101',
      versionNumber: 1,
      sourceReferenceUrl: 'https://dms.internal.edu/v1/EDG-2026-001-v1',
      contentHash: 'sha256-a1b2c3d4e5f6',
      changeSummary: 'Initial draft of Academic Governance Policy',
      createdByUserIdRef: 'user-author-1',
      isApprovedVersion: true,
      verificationStatus: 'VERIFIED',
      createdAt: '2026-01-15T08:00:00Z'
    },
    {
      id: 'ver-2',
      tenantId: 'tenant-main',
      documentIdRef: 'doc-101',
      versionNumber: 2,
      sourceReferenceUrl: 'https://dms.internal.edu/v2/EDG-2026-001-v2',
      contentHash: 'sha256-f6e5d4c3b2a1',
      changeSummary: 'Updated Section 4 with credit hour standards',
      createdByUserIdRef: 'user-provost-1',
      isApprovedVersion: true,
      verificationStatus: 'VERIFIED',
      createdAt: '2026-03-01T10:00:00Z'
    }
  ]);

  const [mockRecords] = useState<EnterpriseRecordGovRecord[]>([
    {
      id: 'rec-1',
      tenantId: 'tenant-main',
      campusId: 'campus-alpha',
      recordNumber: 'REC-2026-8801',
      title: 'FY2025 Financial Audit Ledger',
      recordCategory: 'FINANCIAL_AUDIT',
      status: 'ACTIVE',
      sourceSystem: 'FINANCE_ERP_V4',
      sourceRecordIdRef: 'erp-ledger-2025',
      ownerUserIdRef: 'user-cfo-1',
      stewardUserIdRef: 'user-finance-steward',
      retentionCategory: 'RETENTION_FINANCIAL_7YR',
      retentionStartDate: '2025-12-31T23:59:59Z',
      disposalEligibilityDate: '2032-12-31T23:59:59Z',
      legalHoldActive: false,
      preservationStatus: 'NORMAL',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ]);

  const [mockCorrespondence] = useState<EnterpriseCorrespondenceGovRecord[]>([
    {
      id: 'corr-1',
      tenantId: 'tenant-main',
      campusId: 'campus-alpha',
      correspondenceNumber: 'CORR-2026-901',
      type: 'REGULATORY',
      status: 'UNDER_REVIEW',
      subject: 'Ministry Accreditation Compliance Notice',
      classification: 'RESTRICTED',
      priority: 'URGENT',
      senderReference: 'Ministry of Higher Education',
      recipientReference: 'Office of the University President',
      responseRequired: true,
      responseDueDate: '2026-09-15T17:00:00Z',
      createdAt: '2026-08-20T11:00:00Z',
      updatedAt: '2026-08-25T09:00:00Z'
    }
  ]);

  const [mockPackages] = useState<EnterpriseApprovalPackageGovPkg[]>([
    {
      id: 'pkg-1',
      tenantId: 'tenant-main',
      campusId: 'campus-alpha',
      packageNumber: 'APK-2026-044',
      title: 'Q3 Cyber Resilience Approval Package',
      purpose: 'Executive signoff for institution-wide security architecture shift',
      classification: 'HIGHLY_RESTRICTED',
      status: 'APPROVAL_PENDING',
      ownerUserIdRef: 'user-ciso-1',
      requesterUserIdRef: 'user-ciso-1',
      targetApprovalLevel: 'LEVEL_4',
      requiredApprovalCount: 2,
      referencedDocumentIds: ['doc-102'],
      decisionDeadline: '2026-09-05T23:59:59Z',
      auditHash: 'hash-apk-044-prod',
      createdAt: '2026-08-28T10:00:00Z',
      updatedAt: '2026-08-28T10:00:00Z'
    }
  ]);

  const [mockHolds] = useState<EnterpriseLegalHoldGovHold[]>([
    {
      id: 'hold-1',
      tenantId: 'tenant-main',
      holdNumber: 'LGH-2026-009',
      title: 'Vendor Contract Dispute Preservation Order',
      matterName: 'Litigation Matter #4401',
      reason: 'Mandatory litigation freeze on all procurement correspondence',
      status: 'ACTIVE',
      authorizedByUserIdRef: 'user-general-counsel',
      effectiveDate: '2026-02-01T00:00:00Z',
      targetDocumentIdRefs: ['doc-102'],
      targetRecordIdRefs: [],
      auditHash: 'hash-lgh-009',
      createdAt: '2026-02-01T00:00:00Z'
    }
  ]);

  const [mockRelationships] = useState<EnterpriseDocumentRelationship[]>([
    {
      id: 'rel-1',
      tenantId: 'tenant-main',
      sourceDocumentIdRef: 'doc-101',
      targetDocumentIdRef: 'doc-102',
      relationshipType: 'SUPPORTS',
      createdAt: '2026-02-15T00:00:00Z'
    }
  ]);

  const [diagnostics, setDiagnostics] = useState<EnterpriseDocumentDiagnostic[]>([]);
  const [simulationScenario, setSimulationScenario] = useState<EnterpriseDocumentSimulation['scenario']>('APPROVAL_BACKLOG_SURGE');
  const [simulationResult, setSimulationResult] = useState<EnterpriseDocumentSimulation | null>(null);

  const runDiagnosticsCheck = () => {
    const diags = DocumentRecordsGovernanceService.runDiagnostics(
      mockDocs,
      mockPackages,
      mockHolds,
      mockRelationships
    );
    setDiagnostics(diags);
  };

  const handleRunSimulation = () => {
    const res = DocumentRecordsGovernanceService.runSimulation(simulationScenario, mockPackages);
    setSimulationResult(res);
  };

  const handleNewDocument = () => {
    const res = DocumentRecordsGovernanceService.registerDocument(
      'tenant-main',
      'campus-alpha',
      `EDG-2026-0${mockDocs.length + 1}`,
      'New Governed Standard Operating Procedure',
      'Standardized workflow for emergency campus operations.',
      'SOP',
      'CONFIDENTIAL',
      'user-dir-1',
      'user-steward-1',
      'mod_operational',
      'rec-sop-99'
    );
    if (res.success && res.document) {
      setMockDocs([...mockDocs, res.document]);
    }
  };

  return (
    <div id="document-records-governance-workspace" className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Enterprise Document, Records & Approval Control Plane
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            EMS Phase 8.3 — Reference-Only Document Governance, Approval Packages, Correspondence & Legal Holds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-run-diagnostics-header"
            onClick={runDiagnosticsCheck}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            Run Diagnostics
          </button>
          <button
            id="btn-register-document"
            onClick={handleNewDocument}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow transition"
          >
            <Plus className="w-4 h-4" />
            Register Document
          </button>
        </div>
      </div>

      {/* METRIC RIBBON */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Registered Docs</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{mockDocs.length}</div>
          <div className="text-xs text-indigo-400 mt-1">100% Governed</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Approval Packages</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{mockPackages.length}</div>
          <div className="text-xs text-emerald-400 mt-1">Four-Eyes Enforced</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Legal Holds</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{mockHolds.filter(h => h.status === 'ACTIVE').length}</div>
          <div className="text-xs text-amber-400 mt-1">Litigation Freeze</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Correspondence</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{mockCorrespondence.length}</div>
          <div className="text-xs text-cyan-400 mt-1">SLA Tracked</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Active Versions</span>
            <GitBranch className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{mockVersions.length}</div>
          <div className="text-xs text-purple-400 mt-1">Immutable Hashes</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Diagnostics</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{diagnostics.length}</div>
          <div className="text-xs text-rose-400 mt-1">Issue Alerts</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 overflow-x-auto space-x-2 scrollbar-none pb-1">
        {[
          { id: 'executive', label: '1. Executive Command', icon: Zap },
          { id: 'registry', label: '2. Document Registry', icon: FileText },
          { id: 'versions', label: '3. Version Governance', icon: GitBranch },
          { id: 'records', label: '4. Records Governance', icon: Archive },
          { id: 'correspondence', label: '5. Correspondence', icon: MessageSquare },
          { id: 'approval_packages', label: '6. Approval Packages', icon: FileCheck },
          { id: 'approval_matrix', label: '7. Approval Matrix', icon: UserCheck },
          { id: 'reviews', label: '8. Document Reviews', icon: CheckCircle2 },
          { id: 'issues', label: '9. Issues & Actions', icon: AlertTriangle },
          { id: 'retention_holds', label: '10. Retention & Legal Holds', icon: Lock },
          { id: 'provenance', label: '11. Evidence & Provenance', icon: Shield },
          { id: 'relationships', label: '12. Relationships', icon: Network },
          { id: 'analytics', label: '13. Analytics', icon: Activity },
          { id: 'sandbox', label: '14. What-If Sandbox', icon: RefreshCw },
          { id: 'diagnostics', label: '15. Diagnostics', icon: AlertTriangle },
          { id: 'audit', label: '16. Audit Trail', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 bg-slate-800 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENTS */}
      <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-6 min-h-[420px]">
        {/* TAB 1: EXECUTIVE COMMAND */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Executive Document & Records Command Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-slate-200 text-sm mb-3">Governance Control Principles</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Reference-only metadata pointers — source content remains in authoritative DMS/ERP/SIS.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Four-Eyes Segregation of Duties (SoD) enforced on all package approvals.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Immutable document versions with SHA-256 evidence integrity hashing.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Active legal holds freeze record disposition and retirement transitions.
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-slate-200 text-sm mb-3">Pending Executive Approval Packages</h3>
                {mockPackages.map(pkg => (
                  <div key={pkg.id} className="p-3 bg-slate-800 rounded border border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{pkg.packageNumber} — {pkg.title}</span>
                      <span className="text-amber-400">{pkg.targetApprovalLevel}</span>
                    </div>
                    <p className="text-slate-400">{pkg.purpose}</p>
                    <div className="text-slate-400 text-[11px] pt-1 flex justify-between">
                      <span>Requester: {pkg.requesterUserIdRef}</span>
                      <span>Deadline: {pkg.decisionDeadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENT REGISTRY */}
        {activeTab === 'registry' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Governed Document Registry</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter documents..."
                  value={filterQuery}
                  onChange={e => setFilterQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Doc Number</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Active Version</th>
                    <th className="p-3">Legal Hold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockDocs
                    .filter(d => d.title.toLowerCase().includes(filterQuery.toLowerCase()) || d.documentNumber.toLowerCase().includes(filterQuery.toLowerCase()))
                    .map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-800/60">
                        <td className="p-3 font-mono text-indigo-400 font-semibold">{doc.documentNumber}</td>
                        <td className="p-3 font-medium text-white">{doc.title}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]">
                            {doc.classification}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            doc.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            doc.status === 'APPROVAL_PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3">{doc.ownerUserIdRef}</td>
                        <td className="p-3 font-mono text-purple-400 font-bold">v{doc.activeVersionNumber}</td>
                        <td className="p-3">
                          {doc.legalHoldActive ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> ACTIVE
                            </span>
                          ) : (
                            <span className="text-slate-400">NONE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VERSION GOVERNANCE */}
        {activeTab === 'versions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-400" />
              Immutable Document Versions
            </h2>
            <div className="space-y-3">
              {mockVersions.map(ver => (
                <div key={ver.id} className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-purple-400 font-bold text-sm">Version {ver.versionNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                      {ver.verificationStatus}
                    </span>
                  </div>
                  <p className="text-slate-300">{ver.changeSummary}</p>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                    <span>Created By: {ver.createdByUserIdRef}</span>
                    <span className="font-mono">Hash: {ver.contentHash}</span>
                    <span>Date: {ver.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RECORDS GOVERNANCE */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Archive className="w-5 h-5 text-amber-400" />
              Institutional Records Control
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Record Number</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Source System</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Retention Category</th>
                    <th className="p-3">Disposal Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-800/60">
                      <td className="p-3 font-mono text-amber-400 font-bold">{rec.recordNumber}</td>
                      <td className="p-3 font-medium text-white">{rec.title}</td>
                      <td className="p-3 text-slate-400 font-mono">{rec.sourceSystem}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{rec.retentionCategory}</td>
                      <td className="p-3 font-mono text-slate-400">{rec.disposalEligibilityDate.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CORRESPONDENCE */}
        {activeTab === 'correspondence' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Governed Institutional Correspondence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCorrespondence.map(corr => (
                <div key={corr.id} className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-cyan-400 font-bold">{corr.correspondenceNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                      {corr.priority}
                    </span>
                  </div>
                  <div className="font-bold text-white">{corr.subject}</div>
                  <div className="text-slate-300 flex justify-between">
                    <span>From: {corr.senderReference}</span>
                    <span>To: {corr.recipientReference}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-800 flex justify-between">
                    <span>Response Due: {corr.responseDueDate}</span>
                    <span className="text-cyan-400 font-semibold">{corr.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: APPROVAL PACKAGES */}
        {activeTab === 'approval_packages' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              Governed Approval Packages
            </h2>
            {mockPackages.map(pkg => (
              <div key={pkg.id} className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-emerald-400 font-bold text-sm">{pkg.packageNumber} — {pkg.title}</span>
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                    {pkg.status}
                  </span>
                </div>
                <p className="text-slate-300">{pkg.purpose}</p>
                <div className="flex gap-4 text-slate-400 text-[11px]">
                  <span>Target Level: <strong className="text-white">{pkg.targetApprovalLevel}</strong></span>
                  <span>Required Approvals: <strong className="text-white">{pkg.requiredApprovalCount}</strong></span>
                  <span>Requester: <strong className="text-white">{pkg.requesterUserIdRef}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: APPROVAL MATRIX */}
        {activeTab === 'approval_matrix' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Institutional Approval Matrix & SoD Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg space-y-2">
                <div className="font-bold text-indigo-400">LEVEL_1 / LEVEL_2</div>
                <div className="text-slate-300 font-semibold">Operational & Management</div>
                <p className="text-slate-400 text-[11px]">Requires single independent management approval. Author !== Approver.</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg space-y-2">
                <div className="font-bold text-amber-400">LEVEL_3 / LEVEL_4</div>
                <div className="text-slate-300 font-semibold">Executive & Governance</div>
                <p className="text-slate-400 text-[11px]">Requires two independent executive approvals. Four-Eyes validation enforced.</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg space-y-2">
                <div className="font-bold text-rose-400">LEVEL_5</div>
                <div className="text-slate-300 font-semibold">Board / Authorized Authority</div>
                <p className="text-slate-400 text-[11px]">Requires formal board resolution reference and legal counsel signoff.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Document Review Engine
            </h2>
            <p className="text-slate-400 text-xs">Structured peer and compliance document review records.</p>
            <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs text-slate-400 text-center">
              All active reviews currently up to date. No pending reviewer bottlenecks.
            </div>
          </div>
        )}

        {/* TAB 9: ISSUES & ACTIONS */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Document Issues & Action Register
            </h2>
            <p className="text-slate-400 text-xs">Governed document findings linked to Phase 8.2 Action Items.</p>
            <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs text-slate-400 text-center">
              No open document issues or evidence gaps detected.
            </div>
          </div>
        )}

        {/* TAB 10: RETENTION & LEGAL HOLDS */}
        {activeTab === 'retention_holds' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              Retention Policies & Active Legal Holds
            </h2>
            {mockHolds.map(hold => (
              <div key={hold.id} className="p-4 bg-slate-900/60 border border-amber-800/80 rounded-lg text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-amber-400 font-bold">{hold.holdNumber} — {hold.title}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700 font-bold">
                    {hold.status}
                  </span>
                </div>
                <p className="text-slate-300">{hold.reason}</p>
                <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                  <span>Matter: {hold.matterName}</span>
                  <span>Authorized By: {hold.authorizedByUserIdRef}</span>
                  <span>Effective: {hold.effectiveDate.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 11: EVIDENCE & PROVENANCE */}
        {activeTab === 'provenance' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              Document Evidence & SHA-256 Provenance
            </h2>
            <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-2 font-mono text-slate-300">
              <div>EDG-2026-001-v2 Content Hash: sha256-f6e5d4c3b2a1 [VERIFIED]</div>
              <div>EDG-2026-002-v1 Content Hash: sha256-a1b2c3d4e5f6 [VERIFIED]</div>
            </div>
          </div>
        )}

        {/* TAB 12: RELATIONSHIPS */}
        {activeTab === 'relationships' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              Document Relationship Bounded Graph
            </h2>
            {mockRelationships.map(rel => (
              <div key={rel.id} className="p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-xs flex justify-between items-center">
                <span className="font-mono text-indigo-400">{rel.sourceDocumentIdRef}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold text-[11px]">
                  {rel.relationshipType}
                </span>
                <span className="font-mono text-indigo-400">{rel.targetDocumentIdRef}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 13: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Executive Governance Metrics & Cycle Times
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                <div className="text-slate-400">Avg Review Time</div>
                <div className="text-xl font-bold text-white mt-1">1.8 Days</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                <div className="text-slate-400">Avg Approval Time</div>
                <div className="text-xl font-bold text-white mt-1">2.4 Days</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                <div className="text-slate-400">Overdue Approvals</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">0</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                <div className="text-slate-400">Retention Reviews</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">1 Pending</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: WHAT-IF SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400" />
                What-If Document Governance Simulation Sandbox
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded border border-amber-800">
                SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Select Simulation Scenario</label>
                <select
                  id="select-simulation-scenario"
                  value={simulationScenario}
                  onChange={e => setSimulationScenario(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="APPROVAL_BACKLOG_SURGE">APPROVAL_BACKLOG_SURGE</option>
                  <option value="EXECUTIVE_REVIEW_SURGE">EXECUTIVE_REVIEW_SURGE</option>
                  <option value="REGULATORY_DOCUMENT_SURGE">REGULATORY_DOCUMENT_SURGE</option>
                  <option value="CORRESPONDENCE_VOLUME_SURGE">CORRESPONDENCE_VOLUME_SURGE</option>
                  <option value="CRITICAL_DOCUMENT_LOSS">CRITICAL_DOCUMENT_LOSS</option>
                  <option value="LEGAL_HOLD_SURGE">LEGAL_HOLD_SURGE</option>
                  <option value="RETENTION_REVIEW_BACKLOG">RETENTION_REVIEW_BACKLOG</option>
                  <option value="MASS_APPROVAL_EVENT">MASS_APPROVAL_EVENT</option>
                </select>
                <button
                  id="btn-run-simulation"
                  onClick={handleRunSimulation}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Execute In-Memory Simulation
                </button>
              </div>

              <div className="md:col-span-2 bg-slate-900/80 p-4 rounded-lg border border-slate-700 space-y-3">
                <div className="text-xs font-bold text-slate-200">Simulation Output Results</div>
                {simulationResult ? (
                  <div className="space-y-2 text-xs">
                    <div className="text-indigo-400 font-mono">Scenario: {simulationResult.scenario}</div>
                    <div className="text-slate-300">Simulated Package Load: {simulationResult.simulatedPackageCount} packages</div>
                    <div className="text-amber-400 font-bold">Predicted Overdue Approvals: {simulationResult.predictedOverdueApprovals}</div>
                    <div className="text-rose-400">Bottlenecks: {simulationResult.capacityBottlenecks.join(', ')}</div>
                    <ul className="list-disc pl-4 text-slate-300 space-y-1 pt-2">
                      {simulationResult.impactSummary.map((sum, i) => (
                        <li key={i}>{sum}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">Click 'Execute In-Memory Simulation' to model governance impact.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 15: DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Document Governance Diagnostics
              </h2>
              <button
                id="btn-run-diagnostics-tab"
                onClick={runDiagnosticsCheck}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold"
              >
                Run Diagnostics Engine
              </button>
            </div>

            {diagnostics.length === 0 ? (
              <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Zero diagnostic findings. All document structures, version hashes, and approval paths comply with governance rules.
              </div>
            ) : (
              <div className="space-y-2">
                {diagnostics.map(diag => (
                  <div key={diag.id} className="p-3 bg-slate-900/80 border border-rose-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-rose-400">
                      <span>[{diag.issueType}] {diag.severity}</span>
                      <span className="text-slate-400 font-mono">{diag.entityIdRef}</span>
                    </div>
                    <p className="text-slate-200">{diag.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 16: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Immutable Append-Only Audit Trail
            </h2>
            <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-2 font-mono text-slate-300">
              <div>[2026-08-30T10:50:00Z] REGISTER_DOCUMENT doc-101 (Actor: user-provost-1) [Hash: hash-803-a4f91]</div>
              <div>[2026-08-30T10:51:22Z] SUBMIT_APPROVAL_PACKAGE pkg-1 (Actor: user-ciso-1) [Hash: hash-803-b9002]</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
