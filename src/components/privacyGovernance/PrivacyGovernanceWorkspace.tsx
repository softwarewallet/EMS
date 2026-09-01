import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  FileLock, 
  EyeOff, 
  History, 
  Plus, 
  Search, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Globe,
  Database,
  UserX,
  FileText,
  Activity,
  Shield,
  Key,
  Briefcase,
  Share2,
  Trash2,
  Download,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { PrivacyGovernanceService } from '../../services/privacyGovernanceService';
import { 
  ProcessingPurpose, 
  PrivacySubjectRequest, 
  PrivacyIncident,
  ProcessingPurposeStatus,
  SubjectRequestStatus
} from '../../types/privacyGovernance';
import { format } from 'date-fns';

const PrivacyGovernanceWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'command' | 'purposes' | 'requests' | 'incidents' | 'controls'>('command');
  const [purposes, setPurposes] = useState<ProcessingPurpose[]>([]);
  const [requests, setRequests] = useState<PrivacySubjectRequest[]>([]);
  const [incidents, setIncidents] = useState<PrivacyIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.tenantId) {
      loadData();
    }
  }, [user?.tenantId, activeTab]);

  const loadData = async () => {
    if (!user?.tenantId) return;
    setLoading(true);
    try {
      switch (activeTab) {
        case 'purposes':
          const purps = await PrivacyGovernanceService.listPurposes(user.tenantId);
          setPurposes(purps);
          break;
        case 'requests':
          const reqs = await PrivacyGovernanceService.listRequests(user.tenantId);
          setRequests(reqs);
          break;
        case 'incidents':
          const incs = await PrivacyGovernanceService.listIncidents(user.tenantId);
          setIncidents(incs);
          break;
      }
    } catch (error) {
      console.error('Failed to load privacy governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'ACTIVE':
      case 'VERIFIED':
      case 'FULFILLED':
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UNDER_REVIEW':
      case 'IN_PROGRESS':
      case 'TRIAGED':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'HIGH_RISK':
      case 'REPORTED':
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'DRAFT':
      case 'SUBMITTED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              Privacy & Data Protection Governance
            </h1>
            <p className="text-slate-500 mt-1">
              Phase 7.28 — Consent management, subject rights, and information security
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <History className="w-4 h-4" />
              Privacy Audit Log
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              <Plus className="w-4 h-4" />
              New Privacy Action
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 mt-8">
          {[
            { id: 'command', label: 'Command Center', icon: Activity },
            { id: 'purposes', label: 'Processing Purposes', icon: Database },
            { id: 'requests', label: 'Subject Requests', icon: UserCheck },
            { id: 'incidents', label: 'Privacy Incidents', icon: ShieldAlert },
            { id: 'controls', label: 'Security Controls', icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Command Center View */}
          {activeTab === 'command' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Purposes', value: purposes.filter(p => p.status === 'ACTIVE').length, icon: Globe, color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Pending Requests', value: requests.filter(r => r.status !== 'CLOSED').length, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Open Incidents', value: incidents.filter(i => i.status !== 'CLOSED').length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Security Score', value: '88%', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}

              <div className="col-span-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                 <Shield className="w-16 h-16 text-indigo-100 mx-auto mb-4" />
                 <h2 className="text-xl font-bold text-slate-900">Privacy Governance Dashboard</h2>
                 <p className="text-slate-500 max-w-2xl mx-auto mt-2">
                   This command center provides a unified view of the institution's privacy posture, 
                   from lawful processing purposes to individual data subject rights fulfillment.
                 </p>
              </div>
            </div>
          )}

          {/* Processing Purposes View */}
          {activeTab === 'purposes' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search purposes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  Define Purpose
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                    <th className="px-6 py-4">Purpose Detail</th>
                    <th className="px-6 py-4">Data Categories</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Review</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purposes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                         No processing purposes defined yet.
                      </td>
                    </tr>
                  ) : (
                    purposes.map((purpose) => (
                      <tr key={purpose.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-sky-500" />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{purpose.name}</p>
                              <p className="text-xs text-slate-500 uppercase">Version {purpose.version} • {purpose.processingBasis}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-wrap gap-1">
                             {purpose.dataCategories.slice(0, 2).map((cat, i) => (
                               <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">{cat}</span>
                             ))}
                             {purpose.dataCategories.length > 2 && <span className="text-[10px] text-slate-400">+{purpose.dataCategories.length - 2} more</span>}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(purpose.status)}`}>
                            {purpose.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {format(new Date(purpose.updatedAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg">
                             <CheckCircle className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Placeholder for other views */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <UserCheck className="w-16 h-16 text-indigo-100 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Data Subject Rights Management</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-2">
                Process and track individual requests for data access, rectification, deletion, and portability.
              </p>
              <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Log New Request
              </button>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <ShieldAlert className="w-16 h-16 text-rose-100 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Privacy & Security Incident Log</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-2">
                Reporting and triage of suspected data breaches or security policy violations.
              </p>
              <button className="mt-6 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                Report Incident
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyGovernanceWorkspace;
