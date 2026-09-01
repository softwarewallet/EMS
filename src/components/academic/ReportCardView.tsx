import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Search, 
  Filter, 
  FileText, 
  GraduationCap, 
  Layers, 
  Download,
  Building2,
  Calendar,
  User,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReportCardService, GradingService, ExaminationService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { StudentService } from '../../services/studentService';
import { 
  ReportCard, 
  GradingScheme, 
  Examination, 
  ClassGrade, 
  Section, 
  Student 
} from '../../types';

export const ReportCardView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const tenantId = currentTenant?.id || '';

  const [activeTab, setActiveTab] = useState<'reports' | 'grading_scale'>('reports');
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [gradingScheme, setGradingScheme] = useState<GradingScheme | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Selected
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Status messages
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canGenerate = userPermissions.includes('platform.admin') || userPermissions.includes('report_card.generate');
  const canPublish = userPermissions.includes('platform.admin') || userPermissions.includes('report_card.publish');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [rList, gScheme, eList, cList, secList, stuList] = await Promise.all([
        ReportCardService.getReportCards(tenantId),
        GradingService.getGradingScheme(tenantId),
        ExaminationService.getExaminations(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        StudentService.getStudents(tenantId)
      ]);

      setReportCards(rList);
      setGradingScheme(gScheme);
      setExaminations(eList);
      setClasses(cList);
      setSections(secList);
      setStudents(stuList);

      if (eList.length > 0) setSelectedExamId(eList[0].id);
      if (cList.length > 0) {
        setSelectedClassId(cList[0].id);
        const validSecs = secList.filter(s => s.classId === cList[0].id);
        if (validSecs.length > 0) setSelectedSectionId(validSecs[0].id);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load report cards dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerate = async () => {
    if (!selectedExamId || !selectedClassId) {
      setErrorMsg('Please select target Examination and Class');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const generated = await ReportCardService.generateBatchReportCards(
        tenantId,
        selectedExamId,
        selectedClassId,
        selectedSectionId || undefined,
        currentUser?.email || 'admin',
        currentUser?.displayName || 'Academic Coordinator'
      );

      setSuccessMsg(`Successfully generated ${generated.length} official report cards!`);
      const updated = await ReportCardService.getReportCards(tenantId, selectedExamId, selectedClassId);
      setReportCards(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Batch generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishAll = async () => {
    if (!window.confirm('Are you sure you want to publish all generated report cards to students and parents?')) return;
    try {
      const currentList = reportCards.filter(r => (!selectedExamId || r.examId === selectedExamId) && (!selectedClassId || r.classId === selectedClassId));
      for (const card of currentList) {
        await ReportCardService.updateStatus(tenantId, card.id, 'PUBLISHED', currentUser?.email || 'admin', currentUser?.displayName || 'Principal');
      }
      setSuccessMsg('All report cards published to student portals');
      const updated = await ReportCardService.getReportCards(tenantId, selectedExamId, selectedClassId);
      setReportCards(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish report cards');
    }
  };

  const filteredCards = reportCards.filter(r => {
    const matchesExam = !selectedExamId || r.examId === selectedExamId;
    const matchesClass = !selectedClassId || r.classId === selectedClassId;
    const matchesSec = !selectedSectionId || r.sectionId === selectedSectionId;
    return matchesExam && matchesClass && matchesSec;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Academic Transcripts & CBSE 9-Point Scale
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Report Cards & Grading Transcripts</h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate standardized scholastic grade sheets, aggregate GPA, and official printable institutional transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canGenerate && (
            <button
              onClick={handleBatchGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Computing...' : 'Generate Batch Cards'}</span>
            </button>
          )}
          {canPublish && (
            <button
              onClick={handlePublishAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish All</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3 print:hidden">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-start gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMsg}</div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'reports'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Student Transcripts ({filteredCards.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('grading_scale')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'grading_scale'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>CBSE 9-Point Grading Scheme</span>
        </button>
      </div>

      {activeTab === 'reports' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Examination:</label>
              <select
                value={selectedExamId}
                onChange={e => setSelectedExamId(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold"
              >
                {examinations.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Class:</label>
              <select
                value={selectedClassId}
                onChange={e => {
                  const cid = e.target.value;
                  setSelectedClassId(cid);
                  const validSecs = sections.filter(s => s.classId === cid);
                  setSelectedSectionId(validSecs[0]?.id || '');
                }}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Section:</label>
              <select
                value={selectedSectionId}
                onChange={e => setSelectedSectionId(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold"
              >
                {sections
                  .filter(s => !selectedClassId || s.classId === selectedClassId)
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="font-medium">Loading report cards...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No report cards generated yet</h3>
              <p className="text-sm text-slate-500 mt-1">Click "Generate Batch Cards" above to automatically compile scholastic marks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map(card => {
                return (
                  <div key={card.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-xs text-slate-400 font-medium">Roll No: {card.studentRollNo}</div>
                          <h3 className="font-bold text-slate-900 text-lg">{card.studentName}</h3>
                          <div className="text-xs text-sky-700 font-medium">{card.className} — {card.sectionName}</div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          card.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {card.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50 rounded-xl text-center">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Marks</div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">{card.totalMarksObtained} / {card.totalMaxMarks}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Percentage</div>
                          <div className="font-bold text-sky-700 text-sm mt-0.5">{card.percentage.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall Grade</div>
                          <div className="font-bold text-emerald-700 text-sm mt-0.5">{card.overallGrade}</div>
                        </div>
                      </div>

                      {/* Subject breakdown preview */}
                      <div className="space-y-1 text-xs">
                        {card.subjectMarks.slice(0, 3).map((sub, i) => (
                          <div key={i} className="flex items-center justify-between text-slate-600">
                            <span>{sub.subjectName}</span>
                            <span className="font-semibold text-slate-800">{sub.marksObtained}/{sub.maxMarks} ({sub.grade})</span>
                          </div>
                        ))}
                        {card.subjectMarks.length > 3 && (
                          <div className="text-[11px] text-slate-400 text-center italic">
                            + {card.subjectMarks.length - 3} more subjects
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Attendance: <strong className="text-slate-800">{card.attendancePercentage}%</strong>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedReportCard(card);
                          setShowPrintModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Official Card</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: CBSE 9-Point Grading Scheme */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">CBSE Standard 9-Point Grading Scale (Scholastic)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Statutory national evaluation matrix mapped with grade points, score percentage thresholds, and qualitative performance descriptors.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Marks Range (%)</th>
                  <th className="py-3 px-4 text-center">Grade Point</th>
                  <th className="py-3 px-4">Performance Descriptor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gradingScheme?.rules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 font-bold text-xs">
                        {rule.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 text-xs">
                      {rule.minPercentage}% – {rule.maxPercentage}%
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 text-xs">
                      {rule.gradePoint}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {rule.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Printable Report Card Modal */}
      {showPrintModal && selectedReportCard && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
            {/* Modal Controls Top Bar (Hidden in Print) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-sm">Official Academic Performance Transcript Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Card Printable Document */}
            <div className="p-8 print:p-6 space-y-6 text-slate-900 bg-white">
              {/* Institution Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-xl font-black uppercase tracking-wider text-slate-900">
                  {currentTenant?.name || 'Delhi Public School (DPS) R.K. Puram'}
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1">
                  Affiliated to Central Board of Secondary Education (CBSE), New Delhi • Reg. No: CBSE-DEL-1972-0042
                </div>
                <div className="text-xs text-slate-500">
                  Sector XII, R.K. Puram, New Delhi – 110022 | Phone: +91 11 2617 7371
                </div>
                <div className="mt-3 inline-block px-4 py-1 bg-slate-100 border border-slate-300 rounded-full font-bold text-xs uppercase tracking-widest text-slate-800">
                  Academic Performance Statement (Session 2025–2026)
                </div>
              </div>

              {/* Student Particulars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name:</span>
                  <strong className="text-slate-900 text-sm">{selectedReportCard.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Roll Number:</span>
                  <strong className="text-slate-900 text-sm">{selectedReportCard.studentRollNo}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class & Section:</span>
                  <strong className="text-slate-900 text-sm">{selectedReportCard.className} — {selectedReportCard.sectionName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Attendance:</span>
                  <strong className="text-slate-900 text-sm">{selectedReportCard.attendancePercentage}% Recorded</strong>
                </div>
              </div>

              {/* Scholastic Subject Table */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">Part 1: Scholastic Performance</h4>
                <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="py-2 px-3 border-r border-slate-300">Subject Name</th>
                      <th className="py-2 px-3 border-r border-slate-300 text-center">Max Marks</th>
                      <th className="py-2 px-3 border-r border-slate-300 text-center">Marks Obtained</th>
                      <th className="py-2 px-3 border-r border-slate-300 text-center">CBSE Grade</th>
                      <th className="py-2 px-3 text-center">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {selectedReportCard.subjectMarks.map((sub, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-semibold border-r border-slate-300">{sub.subjectName}</td>
                        <td className="py-2 px-3 text-center border-r border-slate-300">{sub.maxMarks}</td>
                        <td className="py-2 px-3 text-center font-bold border-r border-slate-300">{sub.marksObtained}</td>
                        <td className="py-2 px-3 text-center font-bold text-sky-800 border-r border-slate-300">{sub.grade}</td>
                        <td className="py-2 px-3 text-center font-bold">{sub.gradePoint}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-900">
                      <td className="py-2 px-3 border-r border-slate-300">GRAND TOTAL & AGGREGATE</td>
                      <td className="py-2 px-3 text-center border-r border-slate-300">{selectedReportCard.totalMaxMarks}</td>
                      <td className="py-2 px-3 text-center border-r border-slate-300">{selectedReportCard.totalMarksObtained}</td>
                      <td className="py-2 px-3 text-center text-emerald-800 border-r border-slate-300">{selectedReportCard.overallGrade}</td>
                      <td className="py-2 px-3 text-center">GPA: {(selectedReportCard.percentage / 9.5).toFixed(1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Qualitative Remarks */}
              <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-slate-800">Class Teacher Remarks:</span>
                  <p className="text-slate-600 mt-0.5 italic">"{selectedReportCard.teacherRemarks}"</p>
                </div>
                {selectedReportCard.principalRemarks && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Principal Remarks:</span>
                    <p className="text-slate-600 mt-0.5 italic">"{selectedReportCard.principalRemarks}"</p>
                  </div>
                )}
              </div>

              {/* Grading Legend Key */}
              <div className="text-[10px] text-slate-500 border border-slate-200 p-2.5 rounded-lg">
                <span className="font-bold text-slate-700">CBSE Grading Legend:</span> A1 (91–100), A2 (81–90), B1 (71–80), B2 (61–70), C1 (51–60), C2 (41–50), D (33–40), E (Needs Improvement).
              </div>

              {/* Official Signatures */}
              <div className="grid grid-cols-3 gap-8 pt-10 text-center text-xs">
                <div className="border-t border-slate-400 pt-2 font-medium">
                  Class Teacher Signature
                </div>
                <div className="border-t border-slate-400 pt-2 font-medium">
                  Academic Coordinator
                </div>
                <div className="border-t border-slate-400 pt-2 font-bold text-slate-900">
                  Principal & School Seal
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
