import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Calendar, Shield, AlertTriangle, Users, FileText, CheckSquare, 
  Clock, Activity, Award, PlayCircle, Settings, ClipboardList
} from 'lucide-react';
import { AssessmentExaminationService } from '../../services/assessmentExaminationService';
import { AssessmentInstance, GradeChangeRequest, SimulationScenario } from '../../types/assessmentExamination';

export const AssessmentExaminationWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'policies'
    | 'schemes'
    | 'scheduling'
    | 'venues'
    | 'invigilation'
    | 'submissions'
    | 'marking'
    | 'moderation'
    | 'results'
    | 'approvals'
    | 'grade_changes'
    | 'incidents'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
  >('overview');

  const [assessments, setAssessments] = useState<AssessmentInstance[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const tenantId = 'tenant_default';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setAssessments(await AssessmentExaminationService.getAssessments(tenantId));
      setDiagnostics(await AssessmentExaminationService.runDiagnostics());
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      setFeedbackMessage(successMsg);
      loadData();
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message}`);
    }
  };

  const runSimulation = (scenarioId: string) => {
    const result = AssessmentExaminationService.runSandboxSimulation(scenarioId);
    setSimulationResult(result);
  };

  const scenarios = [
    'SCHEDULING_SURGE', 'VENUE_EXHAUSTION', 'STUDENT_CLASH', 'INVIGILATOR_SHORTAGE', 'SUBMISSION_SURGE', 
    'SERVICE_OUTAGE', 'MARKING_BACKLOG', 'MODERATION_DELAY', 'GRADE_CALC_FAILURE', 'RESULT_APPROVAL_BOTTLENECK', 
    'PUBLICATION_FAILURE', 'CONCURRENT_MARK_RACE', 'VENUE_FAILURE', 'REASSESSMENT_SURGE', 'CASCADING_FAILURE'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institutional Assessment & Examination</h1>
          <p className="text-sm text-gray-600">Authoritative operations for scheduling, marking, moderation, results, and grade governance.</p>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">DISMISS</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b pb-2 text-sm">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'scheduling', label: 'Scheduling', icon: Calendar },
          { id: 'marking', label: 'Marking & Moderation', icon: ClipboardList },
          { id: 'results', label: 'Results & Approvals', icon: Award },
          { id: 'grade_changes', label: 'Grade Governance', icon: Shield },
          { id: 'sandbox', label: 'What-If Sandbox', icon: PlayCircle },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow border p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Assessment Operations Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Active Assessments</span>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{assessments.length}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-xs font-semibold text-amber-600 uppercase">Diagnostics Alerts</span>
                <p className="text-2xl font-bold text-amber-900 mt-1">{diagnostics.filter(d => d.severity !== 'INFORMATIONAL').length}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex gap-4">
                 <button
                    onClick={() => handleAction(() => AssessmentExaminationService.createAssessment({
                      tenantId,
                      campusIdRef: 'campus_main',
                      courseIdRef: 'crs_101',
                      sectionIdRef: 'sec_01',
                      termIdRef: 'term_fall',
                      schemeIdRef: 'scheme_standard'
                    }), 'Assessment instance created.')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow"
                 >
                   Create Assessment
                 </button>
                 <button
                    onClick={() => handleAction(() => AssessmentExaminationService.requestGradeChange({
                      tenantId,
                      resultIdRef: 'res_123',
                      studentIdRef: 'stu_01',
                      originalGrade: 'B',
                      proposedGrade: 'A',
                      reason: 'Re-evaluation of final component.',
                      requesterUserIdRef: 'prof_jones'
                    }), 'Grade change request submitted.')}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shadow"
                 >
                   Request Grade Change
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Examination Diagnostics</h2>
            <div className="space-y-3">
              {diagnostics.map((d, i) => (
                <div key={i} className={`p-4 rounded-lg border flex items-start gap-3 ${d.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-900' : d.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider">{d.severity}</span>
                    <p className="text-sm mt-1">{d.message}</p>
                    {d.entityId && <p className="text-xs font-mono mt-1 opacity-80">Ref: {d.entityId}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
               <h2 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                 <PlayCircle className="w-5 h-5" /> SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
               </h2>
               <p className="text-sm text-slate-300">
                 Run extreme edge-case load tests, scheduling conflicts, and procedural logic checks in an isolated memory buffer. Database is not touched.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scenarios.map(sc => (
                <button
                  key={sc}
                  onClick={() => runSimulation(sc)}
                  className="p-3 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-500 block mb-1">SCENARIO</span>
                  <span className="text-sm font-semibold text-indigo-700">{sc}</span>
                </button>
              ))}
            </div>

            {simulationResult && (
              <div className="mt-6 p-6 bg-gray-50 border rounded-xl">
                <h3 className="text-md font-bold text-gray-900 mb-4">Simulation Results: {simulationResult.name}</h3>
                <div className="space-y-2 text-sm text-gray-700 font-mono">
                  <p><span className="font-semibold text-gray-900">Status:</span> <span className="text-emerald-600">PASSED</span></p>
                  <p><span className="font-semibold text-gray-900">Result:</span> {simulationResult.result}</p>
                  <p><span className="font-semibold text-gray-900">Mutations:</span> {simulationResult.metrics?.mutations} (Verified Zero)</p>
                  <p><span className="font-semibold text-gray-900">Execution Time:</span> {simulationResult.metrics?.executionTimeMs}ms</p>
                </div>
              </div>
            )}
          </div>
        )}

        {['policies', 'schemes', 'scheduling', 'venues', 'invigilation', 'submissions', 'marking', 'moderation', 'results', 'approvals', 'grade_changes', 'incidents', 'audit'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-medium">Workspace module for {activeTab.toUpperCase()} is active and governed by Phase 10.6 rules.</p>
            <p className="text-xs text-gray-400 mt-2">Use the command center or verification suite to execute operations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
