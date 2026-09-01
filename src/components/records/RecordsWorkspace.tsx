import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileLock2, 
  Trash2, 
  Scale, 
  History, 
  Plus, 
  Search, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Package,
  Calendar,
  Eye,
  Filter,
  FileText,
  Clock,
  MoreVertical,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { RecordsService } from '../../services/recordsService';
import { 
  InstitutionalRecord, 
  RetentionSchedule, 
  LegalHold, 
  EvidencePackage, 
  DispositionBatch,
  RecordStatus,
  RecordClassification
} from '../../types/records';
import { format } from 'date-fns';

const RecordsWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'records' | 'schedules' | 'holds' | 'disposition' | 'evidence'>('records');
  const [records, setRecords] = useState<InstitutionalRecord[]>([]);
  const [schedules, setSchedules] = useState<RetentionSchedule[]>([]);
  const [holds, setHolds] = useState<LegalHold[]>([]);
  const [packages, setPackages] = useState<EvidencePackage[]>([]);
  const [batches, setBatches] = useState<DispositionBatch[]>([]);
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
        case 'records':
          const recs = await RecordsService.listRecords(user.tenantId);
          setRecords(recs);
          break;
        case 'schedules':
          const schs = await RecordsService.getRetentionSchedules(user.tenantId);
          setSchedules(schs);
          break;
        case 'holds':
          // Need to implement listLegalHolds in service
          // For now using records list for demo purposes (wait, NO MOCK DATA)
          // I will add listLegalHolds to service
          break;
        case 'disposition':
          // Need to implement listDispositionBatches in service
          break;
        case 'evidence':
          // Need to implement listEvidencePackages in service
          break;
      }
    } catch (error) {
      console.error('Failed to load records data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: RecordStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ARCHIVED': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'LEGAL_HOLD': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PENDING_DISPOSITION': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DISPOSED': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'PERMANENT': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getClassificationColor = (classification: RecordClassification) => {
    switch (classification) {
      case 'UNCLASSIFIED': return 'text-slate-500';
      case 'INTERNAL': return 'text-sky-600';
      case 'CONFIDENTIAL': return 'text-amber-600 font-medium';
      case 'HIGHLY_CONFIDENTIAL': return 'text-orange-600 font-bold';
      case 'RESTRICTED': return 'text-rose-600 font-black';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              Institutional Records Management & Governance Engine
            </h1>
            <p className="text-slate-500 mt-1">
              Phase 7.49 — Records lifecycle, retention, and legal hold governance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <History className="w-4 h-4" />
              Audit Log
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              <Plus className="w-4 h-4" />
              Register Record
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 mt-8">
          {[
            { id: 'records', label: 'Record Registry', icon: FileText },
            { id: 'schedules', label: 'Retention Schedules', icon: Clock },
            { id: 'holds', label: 'Legal Holds', icon: Scale },
            { id: 'disposition', label: 'Disposition', icon: Trash2 },
            { id: 'evidence', label: 'Evidence Packages', icon: Package },
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
          {/* Filters & Search */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Records View */}
          {activeTab === 'records' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                    <th className="px-6 py-4">Record Details</th>
                    <th className="px-6 py-4">Classification</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Disposition Due</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-12 h-12 text-slate-200" />
                          <p className="text-slate-500 font-medium">No records registered in governance</p>
                          <p className="text-slate-400 text-sm">Register documents from registry to govern their lifecycle</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{record.title}</p>
                              <p className="text-xs text-slate-500 uppercase tracking-wider">{record.recordNumber} • {record.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs uppercase tracking-wider ${getClassificationColor(record.classification)}`}>
                            {record.classification.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(record.status)}`}>
                            {record.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {format(new Date(record.dispositionDueDate), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Download Reference">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Retention Schedules View */}
          {activeTab === 'schedules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.length === 0 ? (
                <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                   <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                   <h3 className="text-slate-900 font-semibold">No retention schedules defined</h3>
                   <p className="text-slate-500 text-sm mt-1">Define institutional policies for record keeping</p>
                   <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                     Create Schedule
                   </button>
                </div>
              ) : (
                schedules.map((schedule) => (
                  <div key={schedule.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Clock className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                        {schedule.recordSeriesCode}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-slate-900">{schedule.categoryName}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {schedule.retentionPeriodYears} Years Retention
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <Trash2 className="w-4 h-4" />
                        {schedule.dispositionAction.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Trigger: {schedule.trigger.replace('_', ' ')}</span>
                      <button className="text-indigo-600 text-xs font-semibold hover:underline">Edit Policy</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Legal Holds View (Simplified) */}
          {activeTab === 'holds' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
              <Scale className="w-16 h-16 text-amber-100 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900">Legal Holds & Mandates</h2>
              <p className="text-slate-500 max-w-lg mx-auto mt-2">
                Manage legal preservation orders. Records under hold are strictly protected from disposition 
                until the mandate is formally released.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                 <button className="px-6 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 shadow-sm shadow-amber-200">
                   Institute New Hold
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordsWorkspace;
