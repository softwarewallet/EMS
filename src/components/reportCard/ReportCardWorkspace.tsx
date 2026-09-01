import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Award, 
  Plus, 
  Printer, 
  QrCode, 
  BookOpen 
} from 'lucide-react';
import { ReportCard, AcademicTranscript } from '../../types/reportCard';
import { ReportCardService } from '../../services/reportCardService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const ReportCardWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [transcripts, setTranscripts] = useState<AcademicTranscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reportCards' | 'transcripts'>('reportCards');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const rcs = await ReportCardService.getReportCards(tenantId);
      setReportCards(rcs);
      if (rcs.length > 0) setSelectedReportCard(rcs[0]);
      const trs = await ReportCardService.getTranscripts(tenantId);
      setTranscripts(trs);
    } catch (err) {
      console.error('Error loading report cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      await ReportCardService.generateReportCard(
        tenantId,
        'std_demo_1',
        'Demo Student',
        'enr_demo_1',
        'exam_default',
        user
      );
      setSuccessMessage('Official Report Card generated successfully from authoritative results.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Generation failed');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await ReportCardService.updateStatus(id, tenantId, 'PUBLISHED', user);
      setSuccessMessage('Report Card officially published and locked.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Official Report Cards & Academic Transcripts</h2>
          <p className="text-sm text-slate-500">Phase 7.6A Official Document Projections, Digital Verification, and Academic Transcripts.</p>
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Generate Report Card
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('reportCards')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'reportCards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Report Cards ({reportCards.length})
        </button>
        <button
          onClick={() => setActiveTab('transcripts')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'transcripts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Academic Transcripts ({transcripts.length})
        </button>
      </div>

      {activeTab === 'reportCards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Student Report Cards</h3>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
              {reportCards.map(rc => (
                <div 
                  key={rc.reportCardId}
                  onClick={() => setSelectedReportCard(rc)}
                  className={`p-4 cursor-pointer transition-colors ${selectedReportCard?.reportCardId === rc.reportCardId ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{rc.studentName}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      rc.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Code: {rc.verificationCode}</p>
                  <p className="text-xs text-slate-600 mt-2">Overall: <strong>{rc.overallPercentage}%</strong> ({rc.overallGrade})</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {selectedReportCard ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">OFFICIAL REPORT CARD</h3>
                    <p className="text-xs text-slate-500">Verification ID: <strong className="font-mono text-slate-800">{selectedReportCard.verificationCode}</strong></p>
                  </div>
                  {selectedReportCard.status !== 'PUBLISHED' && (
                    <button
                      onClick={() => handlePublish(selectedReportCard.reportCardId)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-sm"
                    >
                      Publish & Lock
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 text-sm bg-slate-50 px-4 rounded-xl border border-slate-100 my-4">
                  <div>
                    <p className="text-xs text-slate-500">Student Name</p>
                    <p className="font-semibold text-slate-900">{selectedReportCard.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Academic Year</p>
                    <p className="font-semibold text-slate-900">{selectedReportCard.academicYearId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Attendance</p>
                    <p className="font-semibold text-slate-900">{selectedReportCard.attendancePercentage}% ({selectedReportCard.attendanceStatus})</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Overall Result</p>
                    <p className="font-semibold text-indigo-600">{selectedReportCard.overallPercentage}% ({selectedReportCard.overallGrade} - {selectedReportCard.resultStatus})</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Subject Performance</h4>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200">
                        <th className="p-3">Subject</th>
                        <th className="p-3">Max</th>
                        <th className="p-3">Obtained</th>
                        <th className="p-3">%</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReportCard.subjects.map(sub => (
                        <tr key={sub.subjectId}>
                          <td className="p-3 font-medium text-slate-900">{sub.subjectName}</td>
                          <td className="p-3 font-mono text-slate-600">{sub.maximumMarks}</td>
                          <td className="p-3 font-mono text-slate-600">{sub.obtainedMarks}</td>
                          <td className="p-3 font-mono text-slate-600">{sub.percentage}%</td>
                          <td className="p-3 font-bold text-indigo-600">{sub.grade}</td>
                          <td className="p-3">
                            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                              {sub.resultStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">Select a report card to view details.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'transcripts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Academic Transcripts</h3>
            <span className="text-xs text-slate-500 font-medium">{transcripts.length} Transcripts Issued</span>
          </div>
          <div className="divide-y divide-slate-100">
            {transcripts.map(tr => (
              <div key={tr.transcriptId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{tr.studentName}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg">{tr.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-1">Verification Code: {tr.verificationCode}</p>
                </div>
                <div className="text-xs text-slate-600">
                  Issued: {new Date(tr.issuedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
