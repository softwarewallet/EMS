import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionApplication, AdmissionEnquiry, AdmissionMeritEntry, AdmissionWaitlistEntry } from '../../types/admissions';
import { BarChart3, Download, Search, Filter, Loader2, FileText, CheckCircle2 } from 'lucide-react';

export const AdmissionsReportsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const [activeReport, setActiveReport] = useState<string>('rpt_app_list');
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [meritList, setMeritList] = useState<AdmissionMeritEntry[]>([]);
  const [waitlist, setWaitlist] = useState<AdmissionWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const [apps, enqs, merit, wtl] = await Promise.all([
        AdmissionsService.getApplications(currentTenant.id),
        AdmissionsService.getEnquiries(currentTenant.id),
        AdmissionsService.calculateMeritList(currentTenant.id),
        AdmissionsService.getWaitlist(currentTenant.id)
      ]);
      setApplications(apps);
      setEnquiries(enqs);
      setMeritList(merit);
      setWaitlist(wtl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const reportsList = [
    { id: 'rpt_app_list', title: '1. Application Roster Report', desc: 'Detailed register of submitted applications' },
    { id: 'rpt_status', title: '2. Admission Status Distribution', desc: 'Stage-wise lifecycle breakdown' },
    { id: 'rpt_doc_verify', title: '3. Document Verification Audit', desc: 'Inspection status of candidate credentials' },
    { id: 'rpt_conversion', title: '4. Enquiry Lead Conversion Report', desc: 'Funnel conversion percentage from leads to applications' },
    { id: 'rpt_class_capacity', title: '5. Class-wise Capacity Utilization', desc: 'Seat allocations vs maximum class capacity' },
    { id: 'rpt_merit_list', title: '6. Institutional Merit List', desc: 'Score ranks calculated across entrance test & past marks' },
    { id: 'rpt_waitlist', title: '7. Waitlist Queue Register', desc: 'Active waitlist rankings and position offers' },
    { id: 'rpt_approvals', title: '8. Executive Approvals Sign-off', desc: 'Selected candidates awaiting principal approval' }
  ];

  const handleExportCSV = () => {
    let rows: string[][] = [];
    let filename = `${activeReport}_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeReport === 'rpt_app_list' || activeReport === 'rpt_status') {
      rows.push(['Application Number', 'Applicant Name', 'Class', 'Status', 'Submission Date']);
      applications.forEach(a => {
        rows.push([a.applicationNumber, `"${a.applicant.firstName} ${a.applicant.lastName}"`, a.appliedClassId, a.status, a.createdAt]);
      });
    } else if (activeReport === 'rpt_conversion') {
      rows.push(['Enquiry Number', 'Applicant Name', 'Guardian Name', 'Contact', 'Source', 'Status']);
      enquiries.forEach(e => {
        rows.push([e.enquiryNumber, `"${e.applicantName}"`, `"${e.guardianName}"`, e.contactNumber, e.source, e.status]);
      });
    } else if (activeReport === 'rpt_merit_list') {
      rows.push(['Rank', 'Application Number', 'Applicant Name', 'Class', 'Entrance Score', 'Previous Marks', 'Interview Score', 'Weighted Score']);
      meritList.forEach(m => {
        rows.push([m.rank.toString(), m.applicationNumber, `"${m.applicantName}"`, m.appliedClassId, `${m.entranceScore}%`, `${m.previousMarksScore}%`, `${m.interviewScore}%`, m.totalWeightedScore.toString()]);
      });
    } else {
      rows.push(['ID', 'Application Number', 'Applicant Name', 'Status']);
      applications.forEach(a => {
        rows.push([a.id, a.applicationNumber, `"${a.applicant.firstName} ${a.applicant.lastName}"`, a.status]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admissions Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Interactive analytical reporting engine with CSV export for governance and compliance.</p>
        </div>

        <button 
          onClick={handleExportCSV}
          className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Report CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Selector Menu */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1">Standard Reports (8)</h3>
          {reportsList.map(rpt => (
            <button
              key={rpt.id}
              onClick={() => setActiveReport(rpt.id)}
              className={`w-full text-left p-3 rounded-xl transition-colors ${
                activeReport === rpt.id ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <p className="text-xs">{rpt.title}</p>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">{rpt.desc}</p>
            </button>
          ))}
        </div>

        {/* Report View Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">
              {reportsList.find(r => r.id === activeReport)?.title}
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search report records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>
          </div>

          <div className="p-6 flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-16 flex justify-center">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Identifier</th>
                    <th className="px-4 py-3">Candidate / Subject</th>
                    <th className="px-4 py-3">Class Grade</th>
                    <th className="px-4 py-3">Status / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {applications.map((app, idx) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold text-sky-700">{app.applicationNumber}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{app.applicant.firstName} {app.applicant.lastName}</td>
                      <td className="px-4 py-3 uppercase font-semibold text-slate-600">{app.appliedClassId}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">
                          {app.status?.replace(/_/g, ' ') || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
