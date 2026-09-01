import React, { useState, useEffect } from 'react';
import { 
  ArrowRightCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Users, 
  GraduationCap, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  History,
  Check,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  Settings,
  UserX,
  UserCheck,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PromotionService, ReportCardService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { StudentService } from '../../services/studentService';
import { 
  PromotionBatch, 
  PromotionDecision, 
  AcademicYear, 
  ClassGrade, 
  Section, 
  Student, 
  ReportCard,
  StudentEnrollment,
  PromotionPolicy
} from '../../types';

export const StudentPromotionView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const { notify } = useNotification();
  const tenantId = currentTenant?.id || '';

  const [activeTab, setActiveTab] = useState<'wizard' | 'allocation' | 'rollover' | 'history'>('wizard');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [pastBatches, setPastBatches] = useState<PromotionBatch[]>([]);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePolicy, setActivePolicy] = useState<PromotionPolicy | null>(null);
  const [isPolicySaving, setIsPolicySaving] = useState(false);

  // Policy Form State
  const [policyBoard, setPolicyBoard] = useState('CBSE');
  const [policyName, setPolicyName] = useState('CBSE Standard Promotion Criteria');
  const [policyVersion, setPolicyVersion] = useState('1.0.0');
  const [minAcademic, setMinAcademic] = useState(33);
  const [minAttendance, setMinAttendance] = useState(75);
  const [failedThreshold, setFailedThreshold] = useState(2);
  const [teacherRecRequired, setTeacherRecRequired] = useState(false);
  const [principalApprovalRequired, setPrincipalApprovalRequired] = useState(true);
  const [examRequired, setExamRequired] = useState(true);
  const [autoPromotion, setAutoPromotion] = useState(true);
  const [retentionRulesRemarks, setRetentionRulesRemarks] = useState('');

  // Sync policy form state when activePolicy is loaded
  useEffect(() => {
    if (activePolicy) {
      setPolicyBoard(activePolicy.boardName);
      setPolicyName(activePolicy.name);
      setPolicyVersion(activePolicy.version);
      setMinAcademic(activePolicy.minAcademicPercentage);
      setMinAttendance(activePolicy.minAttendancePercentage);
      setFailedThreshold(activePolicy.failedSubjectThreshold);
      setTeacherRecRequired(activePolicy.teacherRecommendationRequired);
      setPrincipalApprovalRequired(activePolicy.principalApprovalRequired);
      setExamRequired(activePolicy.examRequirementEnabled);
      setAutoPromotion(activePolicy.automaticPromotionEnabled);
      setRetentionRulesRemarks(activePolicy.retentionRulesRemarks || '');
    }
  }, [activePolicy]);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePolicy || !tenantId) return;
    setIsPolicySaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const updated: PromotionPolicy = {
        ...activePolicy,
        boardName: policyBoard,
        name: policyName,
        version: policyVersion,
        minAcademicPercentage: Number(minAcademic),
        minAttendancePercentage: Number(minAttendance),
        failedSubjectThreshold: Number(failedThreshold),
        teacherRecommendationRequired: teacherRecRequired,
        principalApprovalRequired: principalApprovalRequired,
        examRequirementEnabled: examRequired,
        automaticPromotionEnabled: autoPromotion,
        retentionRulesRemarks: retentionRulesRemarks,
        updatedAt: new Date().toISOString()
      };
      await PromotionService.savePromotionPolicy(
        tenantId,
        updated,
        currentUser?.email || 'admin@ems.internal',
        currentUser?.displayName || 'Academic Coordinator'
      );
      setActivePolicy(updated);
      notify('success', 'Policy Configured', `Promotion settings updated successfully for board ${policyBoard}`);
      setSuccessMsg(`Promotion policy updated to version ${policyVersion}.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update promotion policy configuration.');
    } finally {
      setIsPolicySaving(false);
    }
  };

  // Filters & State for Wizards
  const [fromAcademicYearId, setFromAcademicYearId] = useState('ay_current');
  const [toAcademicYearId, setToAcademicYearId] = useState('');
  const [fromClassId, setFromClassId] = useState('');
  const [toClassId, setToClassId] = useState('');
  const [defaultToSectionId, setDefaultToSectionId] = useState('');

  // Decisions Map: studentId -> decision details
  const [decisions, setDecisions] = useState<Record<string, {
    decision: PromotionDecision;
    toClassId: string;
    toSectionId: string;
    remarks: string;
  }>>({});

  // Section Allocation Workspace State
  const [allocationClassId, setAllocationClassId] = useState('');
  const [allocationSectionId, setAllocationSectionId] = useState('');
  const [allocationSearch, setAllocationSearch] = useState('');
  const [selectedStudentForReassign, setSelectedStudentForReassign] = useState<Student | null>(null);
  const [reassignTargetSectionId, setReassignTargetSectionId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [reassignOverrideCapacity, setReassignOverrideCapacity] = useState(false);
  const [sectionLiveCounts, setSectionLiveCounts] = useState<Record<string, number>>({});

  // Rollover pre-checks
  const [closureChecks, setClosureChecks] = useState<any>(null);
  const [openingChecks, setOpeningChecks] = useState<any>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canPromote = userPermissions.includes('platform.admin') || userPermissions.includes('promotion.process') || userPermissions.includes('promotion.approve');
  const canReassign = userPermissions.includes('platform.admin') || userPermissions.includes('enrollment.assign') || userPermissions.includes('enrollment.reassign');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [ayList, cList, secList, stuList, rList, bList, eList, policy] = await Promise.all([
        AcademicService.getAcademicYears(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        StudentService.getStudents(tenantId),
        ReportCardService.getReportCards(tenantId),
        PromotionService.getPromotionBatches(tenantId),
        // Fetch all enrollments for counting/timeline
        StudentService.getStudentEnrollments('ALL', tenantId),
        PromotionService.getPromotionPolicy(tenantId)
      ]);

      setAcademicYears(ayList);
      setClasses(cList);
      setSections(secList);
      setStudents(stuList);
      setReportCards(rList);
      setPastBatches(bList);
      setEnrollments(eList);
      setActivePolicy(policy);

      // Set initial state defaults
      const currentAYObj = ayList.find(ay => ay.isCurrent) || ayList[0];
      if (currentAYObj) {
        setFromAcademicYearId(currentAYObj.id);
        const nextAY = ayList.find(ay => ay.id !== currentAYObj.id && new Date(ay.startDate) > new Date(currentAYObj.startDate));
        if (nextAY) setToAcademicYearId(nextAY.id);
        else setToAcademicYearId(currentAYObj.id);
      }

      if (cList.length > 0) {
        setFromClassId(cList[0].id);
        setAllocationClassId(cList[0].id);
        const nextClass = cList[1] || cList[0];
        setToClassId(nextClass.id);
        const nextSecs = secList.filter(s => s.classId === nextClass.id);
        if (nextSecs.length > 0) {
          setDefaultToSectionId(nextSecs[0].id);
        }
      }

      if (secList.length > 0) {
        setAllocationSectionId(secList[0].id);
      }

      // Pre-calculate live section enrollment counts for the current year
      const activeAY = currentAYObj?.id || 'ay_current';
      const liveCounts: Record<string, number> = {};
      secList.forEach(sec => {
        liveCounts[sec.id] = eList.filter(e => e.sectionId === sec.id && e.academicYearId === activeAY && e.status === 'ACTIVE').length;
      });
      setSectionLiveCounts(liveCounts);

      // Trigger pre-checks
      const closure = await PromotionService.closeAcademicYearCheck(tenantId, currentAYObj?.id || 'ay_current');
      setClosureChecks(closure);
      const opening = await PromotionService.openAcademicYearCheck(tenantId, currentAYObj?.id || 'ay_current');
      setOpeningChecks(opening);

    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load advanced progression workspace');
    } finally {
      setLoading(false);
    }
  };

  // Re-calculate dynamic counts when from class, target class, or section mapping updates
  useEffect(() => {
    if (!fromClassId) return;
    
    // Filter out withdrawn, transferred, and graduated students from active promotion processing eligibility
    const activeStudents = students.filter(s => 
      s.currentClassId === fromClassId && 
      s.status !== 'WITHDRAWN' && 
      s.status !== 'TRANSFERRED' && 
      s.status !== 'GRADUATED' && 
      s.status !== 'ALUMNI'
    );

    const minScore = activePolicy ? activePolicy.minAcademicPercentage : 33;
    const policyName = activePolicy ? `${activePolicy.boardName} Policy (v${activePolicy.version})` : 'CBSE Policy (Default)';

    const newDecisions: Record<string, { decision: PromotionDecision; toClassId: string; toSectionId: string; remarks: string }> = {};

    activeStudents.forEach(stu => {
      // Fetch latest scholastic report card
      const studentReport = reportCards.find(r => r.studentId === stu.id);
      const isPass = studentReport ? studentReport.percentage >= minScore : true;

      // Uniqueness pre-check: Is student already active in target session?
      const isAlreadyInTarget = enrollments.some(e => e.studentId === stu.id && e.academicYearId === toAcademicYearId);

      newDecisions[stu.id] = {
        decision: isAlreadyInTarget ? 'PROMOTED' : (isPass ? 'PROMOTED' : 'RETAINED'),
        toClassId: isAlreadyInTarget ? (stu.currentClassId) : (isPass ? toClassId : fromClassId),
        toSectionId: defaultToSectionId || stu.currentSectionId,
        remarks: isAlreadyInTarget 
          ? 'Already registered in target session' 
          : (isPass 
              ? `Meets ${policyName} threshold (${minScore}%)` 
              : `Below ${policyName} threshold (${minScore}%)`)
      };
    });

    setDecisions(newDecisions);
  }, [fromClassId, toClassId, defaultToSectionId, toAcademicYearId, students, reportCards, enrollments, activePolicy]);

  // Bulk execution handler with comprehensive validation and capacity audit trail
  const handleExecutePromotion = async () => {
    const fromClass = classes.find(c => c.id === fromClassId);
    const toClass = classes.find(c => c.id === toClassId);
    if (!fromClass) {
      setErrorMsg('Please select a source class');
      return;
    }

    const eligibleStudents = students.filter(s => 
      s.currentClassId === fromClassId && 
      s.status !== 'WITHDRAWN' && 
      s.status !== 'TRANSFERRED' && 
      s.status !== 'GRADUATED' && 
      s.status !== 'ALUMNI'
    );

    if (eligibleStudents.length === 0) {
      setErrorMsg('No eligible students found in the selected standard to promote.');
      return;
    }

    // Capacity Pre-flight Checks
    const sectionRosterNeeds: Record<string, number> = {};
    eligibleStudents.forEach(stu => {
      const dec = decisions[stu.id];
      if (dec && dec.decision === 'PROMOTED') {
        sectionRosterNeeds[dec.toSectionId] = (sectionRosterNeeds[dec.toSectionId] || 0) + 1;
      }
    });

    const capacityErrors: string[] = [];
    Object.keys(sectionRosterNeeds).forEach(secId => {
      const targetSec = sections.find(s => s.id === secId);
      if (targetSec) {
        const currentCount = sectionLiveCounts[secId] || 0;
        const requested = sectionRosterNeeds[secId];
        if (currentCount + requested > targetSec.maxCapacity) {
          capacityErrors.push(`Section "${targetSec.name}" capacity exceeded. Space remaining: ${targetSec.maxCapacity - currentCount}, Roster requested: ${requested}.`);
        }
      }
    });

    if (capacityErrors.length > 0) {
      const confirmOverride = window.confirm(
        `Pre-flight capacity warnings detected:\n\n${capacityErrors.join('\n')}\n\nDo you want to proceed with administrative capacity override? Every overflow will be logged to security audit.`
      );
      if (!confirmOverride) return;
    } else {
      const confirmed = window.confirm(
        `Execute batch progression and academic year rollover for ${eligibleStudents.length} students?\n\nThis will archive existing session records and activate target placements.`
      );
      if (!confirmed) return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const promotionRecords = eligibleStudents.map(stu => {
      const dec = decisions[stu.id] || {
        decision: 'PROMOTED',
        toClassId: toClassId,
        toSectionId: defaultToSectionId,
        remarks: 'Meets academic requirements'
      };

      const targetClassObj = classes.find(c => c.id === dec.toClassId);
      const targetSecObj = sections.find(s => s.id === dec.toSectionId);

      const stuName = `${stu.firstName} ${stu.lastName}`.trim();

      return {
        studentId: stu.id,
        studentName: stuName,
        studentRollNo: stu.rollNumber || '',
        fromClassId: stu.currentClassId,
        fromClassName: fromClass.name,
        fromSectionId: stu.currentSectionId,
        fromSectionName: sections.find(s => s.id === stu.currentSectionId)?.name || 'Section',
        toClassId: dec.toClassId,
        toClassName: targetClassObj?.name || fromClass.name,
        toSectionId: dec.toSectionId,
        toSectionName: targetSecObj?.name || 'Section',
        decision: dec.decision,
        remarks: dec.remarks
      };
    });

    try {
      await PromotionService.executePromotionBatch(
        tenantId,
        {
          fromAcademicYearId,
          toAcademicYearId,
          fromClassId,
          fromClassName: fromClass.name,
          toClassId: toClass?.id || fromClassId,
          toClassName: toClass?.name || fromClass.name,
          records: promotionRecords
        },
        currentUser?.email || 'admin@ems.internal',
        currentUser?.displayName || 'Academic Coordinator'
      );

      notify('success', 'Roster Rollover Complete', `${eligibleStudents.length} students migrated safely into session.`);
      setSuccessMsg(`Roster rollover processing has finished successfully. New active placements generated.`);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Roster progression process failed during transaction safety validation.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Section Reassignment trigger
  const handleReassignSection = async () => {
    if (!selectedStudentForReassign || !reassignTargetSectionId) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const targetSec = sections.find(s => s.id === reassignTargetSectionId);
    const targetSecName = targetSec?.name || 'Section';

    try {
      await PromotionService.reassignSection(
        tenantId,
        selectedStudentForReassign.id,
        fromAcademicYearId,
        reassignTargetSectionId,
        targetSecName,
        currentUser?.email || 'admin@ems.internal',
        currentUser?.displayName || 'Academic Coordinator',
        reassignReason || 'Standard academic roster adjustment',
        reassignOverrideCapacity
      );

      notify('success', 'Roster Adjusted', `Student reassigned to section ${targetSecName}`);
      setSelectedStudentForReassign(null);
      setReassignReason('');
      setReassignOverrideCapacity(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Section reassignment rejected due to capacity policies.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Student list filtered for roster workspace
  const rosterStudents = students.filter(s => {
    const matchesClass = s.currentClassId === allocationClassId;
    const matchesSection = !allocationSectionId || s.currentSectionId === allocationSectionId;
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(allocationSearch.toLowerCase()) || (s.studentIdNumber || '').toLowerCase().includes(allocationSearch.toLowerCase());
    return matchesClass && matchesSection && s.status === 'ACTIVE';
  });

  // Calculate Metrics for Progression Dashboard
  const activeCount = students.filter(s => s.status === 'ACTIVE').length;
  const withdrawnCount = students.filter(s => s.status === 'WITHDRAWN').length;
  const transferredCount = students.filter(s => s.status === 'TRANSFERRED').length;
  const graduatedCount = students.filter(s => s.status === 'GRADUATED' || s.status === 'ALUMNI').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Control Contract */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
              Core Roster & Promotion Engine
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Academic Progression & Rollover Terminal</h1>
          <p className="text-slate-400 text-xs mt-1">
            Secure multi-tenant workspace to perform annual student promotions, allocate classroom sections, and archive historical transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'wizard' && canPromote && (
            <button
              onClick={handleExecutePromotion}
              disabled={isProcessing || students.filter(s => s.currentClassId === fromClassId && s.status === 'ACTIVE').length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              <ArrowRightCircle className="w-4 h-4" />
              <span>{isProcessing ? 'Rolling Over...' : 'Process Batch Progression'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Counter Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Active Enrollment</span>
          <span className="text-lg font-bold text-slate-900 block mt-1">{activeCount} Students</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Graduated / Alumni</span>
          <span className="text-lg font-bold text-indigo-700 block mt-1">{graduatedCount} Scholars</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Withdrawn / TC</span>
          <span className="text-lg font-bold text-rose-600 block mt-1">{withdrawnCount} Records</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Transferred</span>
          <span className="text-lg font-bold text-amber-600 block mt-1">{transferredCount} Students</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 col-span-2 md:col-span-1">
          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Registered Sessions</span>
          <span className="text-lg font-bold text-emerald-600 block mt-1">{academicYears.length} Terms</span>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-semibold">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-semibold">{successMsg}</div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynamic Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'wizard', label: 'Cohort Progression Wizard', icon: RotateCcw },
          { id: 'allocation', label: 'Roster & Section Allocation', icon: Users },
          { id: 'rollover', label: 'Academic Rollover Foundation', icon: Settings },
          { id: 'history', label: `Immutable Logs (${pastBatches.length})`, icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cohort Bulk Progression Wizard */}
      {activeTab === 'wizard' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</span>
              <span>Configure Academic Placement Mappings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {/* Source configuration */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Source Session & Class (From):</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Year</label>
                    <select
                      value={fromAcademicYearId}
                      onChange={e => setFromAcademicYearId(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      {academicYears.map(ay => (
                        <option key={ay.id} value={ay.id}>{ay.name} {ay.isCurrent ? '(Current)' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grade Level</label>
                    <select
                      value={fromClassId}
                      onChange={e => setFromClassId(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Target configuration */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Target Session & Class (To):</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Academic Year</label>
                    <select
                      value={toAcademicYearId}
                      onChange={e => setToAcademicYearId(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      {academicYears.map(ay => (
                        <option key={ay.id} value={ay.id}>{ay.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Class</label>
                    <select
                      value={toClassId}
                      onChange={e => {
                        const cid = e.target.value;
                        setToClassId(cid);
                        const nextSecs = sections.filter(s => s.classId === cid);
                        if (nextSecs.length > 0) setDefaultToSectionId(nextSecs[0].id);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Ledger Decisions Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Student progression decisions ({students.filter(s => s.currentClassId === fromClassId && s.status === 'ACTIVE').length} Active Students)</span>
                </h3>
                <p className="text-xs text-slate-500">Formulate and review individual progression vectors prior to rollover.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const copy = { ...decisions };
                    students.filter(s => s.currentClassId === fromClassId && s.status === 'ACTIVE').forEach(stu => {
                      copy[stu.id] = {
                        decision: 'PROMOTED',
                        toClassId,
                        toSectionId: defaultToSectionId || stu.currentSectionId,
                        remarks: 'Promoted'
                      };
                    });
                    setDecisions(copy);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition"
                >
                  Mark All Promoted
                </button>
              </div>
            </div>

            {students.filter(s => s.currentClassId === fromClassId && s.status === 'ACTIVE').length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No active students enrolled in this source class.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">ID Number</th>
                      <th className="py-3 px-4 text-center">Score Card Status</th>
                      <th className="py-3 px-4">Decision</th>
                      <th className="py-3 px-4">Target Class & Section</th>
                      <th className="py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.filter(s => s.currentClassId === fromClassId && s.status === 'ACTIVE').map(stu => {
                      const dec = decisions[stu.id] || {
                        decision: 'PROMOTED',
                        toClassId,
                        toSectionId: defaultToSectionId,
                        remarks: 'Promoted'
                      };
                      const studentReport = reportCards.find(r => r.studentId === stu.id);
                      const isAlreadyEnrolled = enrollments.some(e => e.studentId === stu.id && e.academicYearId === toAcademicYearId);

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900">{stu.firstName} {stu.lastName}</p>
                            <span className="text-[10px] text-slate-400">Current Sec: {sections.find(s => s.id === stu.currentSectionId)?.name || 'N/A'}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-600">
                            {stu.studentIdNumber}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isAlreadyEnrolled ? (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase">
                                Registered in target
                              </span>
                            ) : studentReport ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                CBSE Exam Mark: {studentReport.percentage.toFixed(1)}% ({studentReport.overallGrade})
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">No Marksheet</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={dec.decision}
                              onChange={e => {
                                const newDec = e.target.value as PromotionDecision;
                                setDecisions({
                                  ...decisions,
                                  [stu.id]: {
                                    ...dec,
                                    decision: newDec,
                                    toClassId: newDec === 'PROMOTED' || newDec === 'CONDITIONAL' ? toClassId : fromClassId
                                  }
                                });
                              }}
                              className={`text-xs font-semibold rounded px-2.5 py-1 border focus:ring-1 focus:ring-indigo-500 bg-white ${
                                dec.decision === 'PROMOTED'
                                  ? 'border-emerald-200 text-emerald-800'
                                  : dec.decision === 'RETAINED'
                                  ? 'border-rose-200 text-rose-800'
                                  : dec.decision === 'CONDITIONAL'
                                  ? 'border-amber-200 text-amber-800'
                                  : 'border-slate-200 text-slate-800'
                              }`}
                            >
                              <option value="PROMOTED">Promoted (Pass)</option>
                              <option value="RETAINED">Retained / Repeat</option>
                              <option value="CONDITIONAL">Conditional Promotion</option>
                              <option value="GRADUATED">Graduated / Issue TC</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {dec.decision !== 'GRADUATED' ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-slate-700">
                                  {dec.decision === 'PROMOTED' || dec.decision === 'CONDITIONAL' 
                                    ? (classes.find(c => c.id === toClassId)?.name || 'Next Class')
                                    : (classes.find(c => c.id === fromClassId)?.name || 'Retained')
                                  }
                                </span>
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                <select
                                  value={dec.toSectionId}
                                  onChange={e => {
                                    setDecisions({
                                      ...decisions,
                                      [stu.id]: { ...dec, toSectionId: e.target.value }
                                    });
                                  }}
                                  className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white font-medium"
                                >
                                  {sections.filter(s => s.classId === (dec.decision === 'PROMOTED' || dec.decision === 'CONDITIONAL' ? toClassId : fromClassId)).map(sec => (
                                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No Target Class (Graduated)</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={dec.remarks}
                              onChange={e => {
                                setDecisions({
                                  ...decisions,
                                  [stu.id]: { ...dec, remarks: e.target.value }
                                });
                              }}
                              placeholder="Remarks"
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500"
                            />
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

      {/* Tab 2: Roster & Section Allocation Workspace */}
      {activeTab === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Capacity panel */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Roster Filter Controls</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Class</label>
                  <select
                    value={allocationClassId}
                    onChange={e => setAllocationClassId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:ring-1 focus:ring-indigo-500"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Classroom Section</label>
                  <select
                    value={allocationSectionId}
                    onChange={e => setAllocationSectionId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- All Sections --</option>
                    {sections.filter(s => s.classId === allocationClassId).map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Students</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={allocationSearch}
                      onChange={e => setAllocationSearch(e.target.value)}
                      placeholder="Name or Admission ID..."
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Section Capacities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Section Capacity Audits</span>
              </h3>
              <p className="text-[10px] text-slate-500 leading-normal">
                Real-time active student counts calculated continuously across standard classrooms for safety verification.
              </p>

              <div className="space-y-3">
                {sections.filter(s => s.classId === allocationClassId).map(sec => {
                  const count = sectionLiveCounts[sec.id] || 0;
                  const pct = Math.min((count / sec.maxCapacity) * 100, 100);
                  const isFull = count >= sec.maxCapacity;

                  return (
                    <div key={sec.id} className="text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-2xs">
                        <span className="font-semibold text-slate-700">{sec.name}</span>
                        <span className={`font-bold ${isFull ? 'text-rose-600' : 'text-slate-500'}`}>
                          {count} / {sec.maxCapacity} Seats ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isFull ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {sections.filter(s => s.classId === allocationClassId).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No sections configured under this standard.</p>
                )}
              </div>
            </div>
          </div>

          {/* Active Class Roster */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Class Roster</h3>
                  <p className="text-2xs text-slate-500">List of students actively placed in selected class standard.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {rosterStudents.length} Students Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Admission Number</th>
                      <th className="py-3 px-4">Roster Section</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rosterStudents.map(stu => (
                      <tr key={stu.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{stu.firstName} {stu.lastName}</p>
                          <p className="text-[10px] text-slate-500">{stu.email || 'No Email'}</p>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-600">
                          {stu.studentIdNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-[10px]">
                            {sections.find(s => s.id === stu.currentSectionId)?.name || 'Unassigned'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {canReassign && (
                            <button
                              onClick={() => {
                                setSelectedStudentForReassign(stu);
                                setReassignTargetSectionId(stu.currentSectionId);
                                setReassignOverrideCapacity(false);
                              }}
                              className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-indigo-600 font-bold rounded-lg text-3xs transition"
                            >
                              Reassign Section
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {rosterStudents.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                          No active students found matching filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal: Section Reassignment Slider */}
          {selectedStudentForReassign && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Adjust Roster Allocation</h3>
                    <p className="text-2xs text-slate-500">Reassign {selectedStudentForReassign.firstName} {selectedStudentForReassign.lastName} to standard section.</p>
                  </div>
                  <button onClick={() => setSelectedStudentForReassign(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Section</label>
                    <select
                      value={reassignTargetSectionId}
                      onChange={e => setReassignTargetSectionId(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-white font-medium focus:ring-1 focus:ring-indigo-500"
                    >
                      {sections.filter(s => s.classId === selectedStudentForReassign.currentClassId).map(sec => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Authorization Reason</label>
                    <textarea
                      value={reassignReason}
                      onChange={e => setReassignReason(e.target.value)}
                      rows={2}
                      placeholder="Reason for mid-term reassignment..."
                      className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Capacity warnings & override indicator */}
                  {(() => {
                    const sec = sections.find(s => s.id === reassignTargetSectionId);
                    if (!sec) return null;
                    const count = sectionLiveCounts[reassignTargetSectionId] || 0;
                    const isFull = count >= sec.maxCapacity;

                    return (
                      <div className={`p-3 rounded-xl border flex gap-2 ${isFull ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        {isFull ? <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" /> : <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />}
                        <div className="space-y-1">
                          <p className="font-bold text-[11px]">
                            {isFull ? 'Capacity Conflict Warning' : 'Capacity Check Safe'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Section maximum capacity: {sec.maxCapacity}. Live current headcount: {count}.
                          </p>
                          {isFull && (
                            <label className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-rose-950 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={reassignOverrideCapacity}
                                onChange={e => setReassignOverrideCapacity(e.target.checked)}
                                className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                              />
                              <span>Authorize capacity limit override</span>
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="pt-2 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForReassign(null)}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReassignSection}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50"
                    >
                      {isProcessing ? 'Saving...' : 'Authorize Allocation'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Academic Year Rollover Foundation */}
      {activeTab === 'rollover' && (
        <div className="space-y-6">
          {/* Active Promotion Policy & Criteria Configuration */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Tenant Promotion Policy Configuration</h3>
                  <p className="text-2xs text-slate-500">Define localized scholastic and attendance benchmarks. Overrides CBSE core fallback.</p>
                </div>
              </div>
              {activePolicy && (
                <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-full shrink-0 whitespace-nowrap">
                  Active Board: {activePolicy.boardName} (v{activePolicy.version})
                </span>
              )}
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Board Configuration */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b pb-1">Academic Board Affiliation</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Education Board Type</label>
                    <select
                      value={policyBoard}
                      onChange={e => setPolicyBoard(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-white font-semibold focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                      <option value="ICSE">ICSE (Indian Certificate of Secondary Education)</option>
                      <option value="IB">IB (International Baccalaureate)</option>
                      <option value="Cambridge">Cambridge Assessment International</option>
                      <option value="State Board">State Secondary Board</option>
                      <option value="Custom">Custom Institutional Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Policy Profile Name</label>
                    <input
                      type="text"
                      value={policyName}
                      onChange={e => setPolicyName(e.target.value)}
                      required
                      placeholder="e.g. standard CBSE primary promotion rules"
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Policy Version Tag</label>
                    <input
                      type="text"
                      value={policyVersion}
                      onChange={e => setPolicyVersion(e.target.value)}
                      required
                      placeholder="e.g. 1.2.0"
                      className="w-full border border-slate-200 rounded-lg p-2 font-mono focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Scholastic & Attendance Benchmarks */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b pb-1">Benchmark Metrics</h4>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Minimum Academic Grade Score (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={minAcademic}
                        onChange={e => setMinAcademic(Number(e.target.value))}
                        required
                        className="w-full border border-slate-200 rounded-lg p-2 pr-8 focus:ring-1 focus:ring-indigo-500 font-semibold"
                      />
                      <span className="absolute right-3 top-2.5 font-bold text-slate-400">%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Students below this report card percentage are recommended for retention.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Minimum Attendance Benchmark (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={minAttendance}
                        onChange={e => setMinAttendance(Number(e.target.value))}
                        required
                        className="w-full border border-slate-200 rounded-lg p-2 pr-8 focus:ring-1 focus:ring-indigo-500 font-semibold"
                      />
                      <span className="absolute right-3 top-2.5 font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Failed Subjects Threshold</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={failedThreshold}
                      onChange={e => setFailedThreshold(Number(e.target.value))}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Maximum allowed failed subjects before automatic retention is triggered.</p>
                  </div>
                </div>

                {/* Statutory Checklists */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b pb-1">Statutory Approvals & Automation</h4>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teacherRecRequired}
                        onChange={e => setTeacherRecRequired(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-slate-800">Teacher Review Required</span>
                        <p className="text-[10px] text-slate-500 leading-normal">Requires review comments from the Class Teacher before promotion.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={principalApprovalRequired}
                        onChange={e => setPrincipalApprovalRequired(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-slate-800">Principal Sign-off Required</span>
                        <p className="text-[10px] text-slate-500 leading-normal">Promotions cannot be finalized without final executive authorization.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={examRequired}
                        onChange={e => setExamRequired(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-slate-800">Verify Examinations Completion</span>
                        <p className="text-[10px] text-slate-500 leading-normal">Checks that term end-semester cards exist before calculation.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoPromotion}
                        onChange={e => setAutoPromotion(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-slate-800">Allow Automatic Evaluation</span>
                        <p className="text-[10px] text-slate-500 leading-normal">Permits EMS auto-progression batch tool to compute default actions.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Retention Rules Remarks Area */}
              <div className="pt-4 border-t">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Official Retention Rules & Statutory Guidelines Remarks</label>
                <textarea
                  value={retentionRulesRemarks}
                  onChange={e => setRetentionRulesRemarks(e.target.value)}
                  rows={2}
                  placeholder="Official institutional remarks printed on transcripts..."
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 gap-4">
                <p className="text-[10px] text-slate-500 max-w-xl">
                  Tenant changes are immediately isolated. All automatic cohort evaluations and single-student workflows instantly reference these configured values.
                </p>
                <button
                  type="submit"
                  disabled={isPolicySaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 shrink-0 whitespace-nowrap text-xs"
                >
                  {isPolicySaving ? 'Updating policy...' : 'Save Promotion Policy'}
                </button>
              </div>
            </form>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> System Readiness Checklist Audits
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year-End Closure Readiness */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <UserX className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Year-End Closure Readiness</h3>
                    <p className="text-2xs text-slate-500">Pre-flight check to isolate unresolved items in the active session.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {closureChecks?.checks.map((c: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex gap-2.5 items-start text-xs">
                      {c.status === 'PASSED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800">{c.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{c.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-950 text-2xs space-y-1">
                  <span className="font-bold block">Year-End Closure Conditions:</span>
                  <p className="text-slate-600 leading-normal">
                    All class progression decisions should ideally be finalized. Unprocessed student profiles will remain locked in the historic session to maintain roster consistency.
                  </p>
                </div>
              </div>

              {/* New Academic Year Opening Checklist */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <UserCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Target Session Setup Checklist</h3>
                    <p className="text-2xs text-slate-500">Structural integrity assessments of the target academic year before activations.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {openingChecks?.checks.map((c: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex gap-2.5 items-start text-xs">
                      {c.status === 'PASSED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800">{c.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{c.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-amber-950 text-2xs space-y-1">
                  <span className="font-bold block">Academic Structure Prerequisite:</span>
                  <p className="text-slate-600 leading-normal">
                    Ensure that target grade levels, maximum capacities, and sections are mapped. Rosters cannot be loaded into empty structures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Immutable Promotion Logs & Audit Timeline */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Immutable Promotion batches</h3>
            <p className="text-2xs text-slate-500">Immutable secure transaction timeline of historical session progressions.</p>
          </div>

          {pastBatches.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs italic border-b border-slate-200">
              No historical session roll-overs registered in tenant databases yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 text-xs">
              {pastBatches.map(batch => (
                <div key={batch.id} className="p-5 hover:bg-slate-50 transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {batch.status}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        Class {batch.fromClassName} → Class {batch.toClassName}
                      </h4>
                      <p className="text-2xs text-slate-500">
                        Executed by {batch.executedBy} on {new Date(batch.executedAt || '').toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right text-2xs space-y-0.5">
                      <div className="font-bold text-slate-900">{batch.totalStudents} Scholars Rolled Over</div>
                      <div className="text-emerald-700 font-semibold">{batch.promotedCount} Promoted • {batch.retainedCount} Retained</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
