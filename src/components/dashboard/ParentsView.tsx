import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FamilyService } from '../../services/familyService';
import { StudentService } from '../../services/studentService';
import { AuditService } from '../../services/auditService';
import { FirebaseService } from '../../services/firebaseService';
import { Family, Guardian, StudentGuardianRelationship, Student, RelationshipType, AuditRecord } from '../../types';
import { 
  Users, Phone, Mail, MapPin, Search, Plus, UserCheck, 
  HeartHandshake, Trash2, Edit, ShieldCheck, RefreshCw, 
  Sliders, Eye, PlusCircle, ArrowRight, Lock, AlertCircle,
  Building, Calendar, DollarSign, CheckCircle2, UserPlus,
  ArrowUpDown, AlertTriangle
} from 'lucide-react';

export const ParentsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { currentUser, hasPermission } = useAuth();
  const { notify } = useNotification();

  // Navigation within ParentsView
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'families' | 'guardians'>('dashboard');

  // Core Datasets
  const [families, setFamilies] = useState<Family[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [relationships, setRelationships] = useState<StudentGuardianRelationship[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  
  // Loading & Action states
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Search & Filters
  const [familySearch, setFamilySearch] = useState('');
  const [guardianSearch, setGuardianSearch] = useState('');
  
  // Selected Workspaces / Details
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null);

  // Modals
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isRelEditModalOpen, setIsRelEditModalOpen] = useState(false);
  const [isDuplicateAlertOpen, setIsDuplicateAlertOpen] = useState(false);

  // Forms - Family
  const [familyName, setFamilyName] = useState('');
  const [primaryAddress, setPrimaryAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  // Forms - Guardian
  const [guardianFirstName, setGuardianFirstName] = useState('');
  const [guardianLastName, setGuardianLastName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianAltPhone, setGuardianAltPhone] = useState('');
  const [guardianRelation, setGuardianRelation] = useState<'father' | 'mother' | 'guardian' | 'other'>('father');
  const [guardianGender, setGuardianGender] = useState('male');
  const [guardianDOB, setGuardianDOB] = useState('');
  const [guardianOcc, setGuardianOcc] = useState('');
  const [guardianEmp, setGuardianEmp] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
  
  // Duplicate check warning bucket
  const [duplicateCandidates, setDuplicateCandidates] = useState<Guardian[]>([]);

  // Forms - Link Student ↔ Guardian
  const [linkStudentId, setLinkStudentId] = useState('');
  const [linkGuardianId, setLinkGuardianId] = useState('');
  const [linkRelationType, setLinkRelationType] = useState<RelationshipType>('FATHER');
  const [linkIsPrimary, setLinkIsPrimary] = useState(true);
  const [linkIsEmergency, setLinkIsEmergency] = useState(true);
  const [linkCanComm, setLinkCanComm] = useState(true);
  const [linkCanPortal, setLinkCanPortal] = useState(false);
  const [linkCanAcad, setLinkCanAcad] = useState(true);
  const [linkCanAttend, setLinkCanAttend] = useState(true);
  const [linkCanExams, setLinkCanExams] = useState(true);
  const [linkCanDocs, setLinkCanDocs] = useState(false);
  const [linkCanAuth, setLinkCanAuth] = useState(false);
  const [linkFinancial, setLinkFinancial] = useState<'PRIMARY' | 'SECONDARY' | 'NONE'>('PRIMARY');

  // Forms - Edit existing relationship Attributes
  const [editingRel, setEditingRel] = useState<StudentGuardianRelationship | null>(null);

  const loadData = async () => {
    if (!currentTenant) return;
    setIsLoading(true);
    try {
      const [fList, gList, sList, rList, auditAll] = await Promise.all([
        FamilyService.getFamilies(currentTenant.id),
        FamilyService.getGuardians(currentTenant.id),
        StudentService.getStudents(currentTenant.id),
        // Fetch all student-guardian relationships
        FirebaseService.getTenantCollection<StudentGuardianRelationship>('student_guardian_relationships', currentTenant.id),
        AuditService.getLogs(currentTenant.id)
      ]);

      setFamilies(fList);
      setGuardians(gList);
      setStudents(sList);
      setRelationships(rList);
      
      // Filter audits relevant to family & guardians
      const filteredAudits = auditAll.filter(a => 
        a.resource === 'family' || a.resource === 'guardian' || a.resource === 'relationship'
      );
      setAuditLogs(filteredAudits);

      if (gList.length > 0) setLinkGuardianId(gList[0].id);
      if (sList.length > 0) setLinkStudentId(sList[0].id);
    } catch (err) {
      console.error('Error loading family & guardian data:', err);
      notify('error', 'Failed to retrieve family records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  // Dynamic Trigger to migrate/synchronize database
  const handleMigrateSync = async () => {
    if (!currentTenant) return;
    setIsProcessing(true);
    try {
      const actor = {
        userId: currentUser?.id || 'usr_sys',
        email: currentUser?.email || 'system@ems.edu',
        name: currentUser?.displayName || 'System Sync'
      };
      await FamilyService.runAdHocMigration(currentTenant.id, actor);
      notify('success', 'Database synchronized: Seeded student guardians migrated to authoritative master entities');
      await loadData();
    } catch (e) {
      console.error(e);
      notify('error', 'Synchronization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // ================== FORM HANDLERS ==================

  // Family submission
  const handleFamilySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsProcessing(true);
    try {
      const actor = {
        userId: currentUser?.id || 'sys',
        email: currentUser?.email || '',
        name: currentUser?.displayName || ''
      };

      if (editingFamily) {
        await FamilyService.updateFamily(editingFamily.id, currentTenant.id, {
          familyName,
          primaryAddress,
          city,
          state,
          country,
          postalCode,
          primaryEmail
        }, actor);
        notify('success', 'Family profile updated successfully');
      } else {
        await FamilyService.createFamily({
          tenantId: currentTenant.id,
          familyName,
          primaryAddress,
          city,
          state,
          country,
          postalCode,
          primaryEmail
        }, actor);
        notify('success', 'New family household registered successfully');
      }

      setIsFamilyModalOpen(false);
      setEditingFamily(null);
      await loadData();
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to save family record');
    } finally {
      setIsProcessing(false);
    }
  };

  // Guardian submission with Duplicate Check
  const handleGuardianSubmit = async (e: React.FormEvent, forceBypass = false) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsProcessing(true);
    try {
      const actor = {
        userId: currentUser?.id || 'sys',
        email: currentUser?.email || '',
        name: currentUser?.displayName || ''
      };

      const gData = {
        tenantId: currentTenant.id,
        firstName: guardianFirstName,
        lastName: guardianLastName,
        email: guardianEmail,
        phone: guardianPhone,
        alternatePhone: guardianAltPhone,
        relationship: guardianRelation,
        gender: guardianGender,
        dateOfBirth: guardianDOB,
        occupation: guardianOcc,
        employer: guardianEmp,
        address: guardianAddress,
        isPrimaryContact: false
      };

      if (editingGuardian) {
        await FamilyService.updateGuardian(editingGuardian.id, currentTenant.id, gData, actor);
        notify('success', 'Guardian profile updated successfully');
        setIsGuardianModalOpen(false);
        setEditingGuardian(null);
      } else {
        // Run Duplicate Check if not forced bypass
        if (!forceBypass) {
          const dupes = await FamilyService.detectDuplicateGuardians(currentTenant.id, {
            firstName: guardianFirstName,
            lastName: guardianLastName,
            phone: guardianPhone,
            email: guardianEmail
          });

          if (dupes.length > 0) {
            setDuplicateCandidates(dupes);
            setIsDuplicateAlertOpen(true);
            setIsProcessing(false);
            return; // Halt and show warning
          }
        }

        await FamilyService.createGuardian(gData, actor, forceBypass);
        notify('success', 'New parent/guardian registered successfully');
        setIsGuardianModalOpen(false);
      }

      await loadData();
    } catch (err: any) {
      console.error(err);
      notify('error', 'Failed to save guardian record');
    } finally {
      setIsProcessing(false);
    }
  };

  // Link Student ↔ Guardian submission
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsProcessing(true);
    try {
      const actor = {
        userId: currentUser?.id || 'sys',
        email: currentUser?.email || '',
        name: currentUser?.displayName || ''
      };

      await FamilyService.linkStudentAndGuardian({
        tenantId: currentTenant.id,
        studentId: linkStudentId,
        guardianId: linkGuardianId,
        relationshipType: linkRelationType,
        isPrimary: linkIsPrimary,
        isEmergencyContact: linkIsEmergency,
        canReceiveCommunications: linkCanComm,
        canAccessPortal: linkCanPortal,
        canViewAcademicInformation: linkCanAcad,
        canViewAttendance: linkCanAttend,
        canViewExaminationResults: linkCanExams,
        canViewDocuments: linkCanDocs,
        canAuthorizeActions: linkCanAuth,
        financialResponsibility: linkFinancial
      }, actor);

      notify('success', 'Student and Guardian linked successfully');
      setIsLinkModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to create student linkage');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update existing relationship attributes
  const handleRelUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !editingRel) return;

    setIsProcessing(true);
    try {
      const actor = {
        userId: currentUser?.id || 'sys',
        email: currentUser?.email || '',
        name: currentUser?.displayName || ''
      };

      await FamilyService.updateRelationship(editingRel.id, currentTenant.id, {
        relationshipType: linkRelationType,
        isPrimary: linkIsPrimary,
        isEmergencyContact: linkIsEmergency,
        canReceiveCommunications: linkCanComm,
        canAccessPortal: linkCanPortal,
        canViewAcademicInformation: linkCanAcad,
        canViewAttendance: linkCanAttend,
        canViewExaminationResults: linkCanExams,
        canViewDocuments: linkCanDocs,
        canAuthorizeActions: linkCanAuth,
        financialResponsibility: linkFinancial
      }, actor);

      notify('success', 'Relationship attributes updated');
      setIsRelEditModalOpen(false);
      setEditingRel(null);
      await loadData();
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to update relationship properties');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlink = async (relationshipId: string) => {
    if (!currentTenant) return;
    if (!window.confirm('Are you sure you want to remove this student-guardian relationship?')) return;

    setIsProcessing(true);
    try {
      const actor = {
        userId: currentUser?.id || 'sys',
        email: currentUser?.email || '',
        name: currentUser?.displayName || ''
      };
      await FamilyService.unlinkStudentAndGuardian(relationshipId, currentTenant.id, actor);
      notify('success', 'Relationship successfully unlinked');
      await loadData();
    } catch (err) {
      console.error(err);
      notify('error', 'Unlinking failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Open modals prepared
  const openFamilyCreate = () => {
    setEditingFamily(null);
    setFamilyName('');
    setPrimaryAddress('');
    setCity('');
    setState('');
    setCountry('India');
    setPostalCode('');
    setPrimaryEmail('');
    setIsFamilyModalOpen(true);
  };

  const openFamilyEdit = (fam: Family) => {
    setEditingFamily(fam);
    setFamilyName(fam.familyName);
    setPrimaryAddress(fam.primaryAddress || '');
    setCity(fam.city || '');
    setState(fam.state || '');
    setCountry(fam.country || 'India');
    setPostalCode(fam.postalCode || '');
    setPrimaryEmail(fam.primaryEmail || '');
    setIsFamilyModalOpen(true);
  };

  const openGuardianCreate = () => {
    setEditingGuardian(null);
    setGuardianFirstName('');
    setGuardianLastName('');
    setGuardianEmail('');
    setGuardianPhone('');
    setGuardianAltPhone('');
    setGuardianRelation('father');
    setGuardianGender('male');
    setGuardianDOB('');
    setGuardianOcc('');
    setGuardianEmp('');
    setGuardianAddress('');
    setIsGuardianModalOpen(true);
  };

  const openGuardianEdit = (g: Guardian) => {
    setEditingGuardian(g);
    setGuardianFirstName(g.firstName || '');
    setGuardianLastName(g.lastName || '');
    setGuardianEmail(g.email || '');
    setGuardianPhone(g.phone || '');
    setGuardianAltPhone(g.alternatePhone || '');
    setGuardianRelation(g.relationship || 'father');
    setGuardianGender(g.gender || 'male');
    setGuardianDOB(g.dateOfBirth || '');
    setGuardianOcc(g.occupation || '');
    setGuardianEmp(g.employer || '');
    setGuardianAddress(g.address || '');
    setIsGuardianModalOpen(true);
  };

  const openRelEdit = (rel: StudentGuardianRelationship) => {
    setEditingRel(rel);
    setLinkRelationType(rel.relationshipType);
    setLinkIsPrimary(rel.isPrimary);
    setLinkIsEmergency(rel.isEmergencyContact);
    setLinkCanComm(rel.canReceiveCommunications);
    setLinkCanPortal(rel.canAccessPortal);
    setLinkCanAcad(rel.canViewAcademicInformation);
    setLinkCanAttend(rel.canViewAttendance);
    setLinkCanExams(rel.canViewExaminationResults);
    setLinkCanDocs(rel.canViewDocuments);
    setLinkCanAuth(rel.canAuthorizeActions);
    setLinkFinancial(rel.financialResponsibility);
    setIsRelEditModalOpen(true);
  };

  // ================== SEARCH AND METRICS MATH ==================

  const filteredFamilies = families.filter(f => {
    const term = familySearch.toLowerCase().trim();
    if (!term) return true;
    
    const fNumMatch = f.familyNumber?.toLowerCase().includes(term);
    const fNameMatch = f.familyName?.toLowerCase().includes(term);
    const fMailMatch = f.primaryEmail?.toLowerCase().includes(term);
    
    // Find linked students
    const linkedRels = relationships.filter(r => r.tenantId === f.tenantId);
    const linkedStudentNames = linkedRels
      .map(r => students.find(s => s.id === r.studentId))
      .filter(Boolean)
      .map(s => `${s!.firstName} ${s!.lastName}`.toLowerCase());
      
    const studentMatch = linkedStudentNames.some(name => name.includes(term));

    return fNumMatch || fNameMatch || fMailMatch || studentMatch;
  });

  const filteredGuardians = guardians.filter(g => {
    const term = guardianSearch.toLowerCase().trim();
    if (!term) return true;

    const gNumMatch = g.guardianNumber?.toLowerCase().includes(term);
    const nameMatch = g.name?.toLowerCase().includes(term) || `${g.firstName} ${g.lastName}`.toLowerCase().includes(term);
    const mailMatch = g.email?.toLowerCase().includes(term);
    const phoneMatch = g.phone?.includes(term);

    return gNumMatch || nameMatch || mailMatch || phoneMatch;
  });

  // Calculate high-fidelity dashboard analytics
  const totalFamilies = families.length;
  const totalGuardians = guardians.length;
  
  // Families with multiple children: Group relationships by family
  const familyStudentCounts: Record<string, Set<string>> = {};
  relationships.forEach(rel => {
    const gObj = guardians.find(g => g.id === rel.guardianId);
    if (gObj && gObj.familyId) {
      if (!familyStudentCounts[gObj.familyId]) {
        familyStudentCounts[gObj.familyId] = new Set();
      }
      familyStudentCounts[gObj.familyId].add(rel.studentId);
    }
  });
  const familiesWithMultiStudentsCount = Object.values(familyStudentCounts).filter(set => set.size > 1).length;

  const activePortalAccounts = relationships.filter(r => r.canAccessPortal).length;
  const guardiansNoPortal = guardians.filter(g => {
    const rels = relationships.filter(r => r.guardianId === g.id);
    return rels.length > 0 && !rels.some(r => r.canAccessPortal);
  }).length;

  // Selected details targets
  const targetFamily = selectedFamilyId ? families.find(f => f.id === selectedFamilyId) : null;
  const targetFamilyGuardians = selectedFamilyId ? guardians.filter(g => g.familyId === selectedFamilyId) : [];
  // Find students linked to any guardian in this family
  const targetFamilyStudents = selectedFamilyId 
    ? students.filter(s => {
        const studentRels = relationships.filter(r => r.studentId === s.id);
        return studentRels.some(r => targetFamilyGuardians.some(tg => tg.id === r.guardianId));
      })
    : [];

  const targetGuardian = selectedGuardianId ? guardians.find(g => g.id === selectedGuardianId) : null;
  const targetGuardianRelationships = selectedGuardianId ? relationships.filter(r => r.guardianId === selectedGuardianId) : [];
  const targetGuardianStudents = selectedGuardianId 
    ? targetGuardianRelationships.map(rel => {
        const s = students.find(st => st.id === rel.studentId);
        return s ? { student: s, rel } : null;
      }).filter(Boolean) as { student: Student; rel: StudentGuardianRelationship }[]
    : [];
  const targetGuardianFamily = (targetGuardian && targetGuardian.familyId) ? families.find(f => f.id === targetGuardian.familyId) : null;
  const targetGuardianAudits = selectedGuardianId ? auditLogs.filter(a => a.resourceId === selectedGuardianId) : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0052FF]" />
        <span className="text-xs font-semibold mt-4">Loading Family Master and Guardian Records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Control Contract */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Guardian & Family Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative registry of multi-guardian households, secure relationship linkages, portal access credentials, and communications authorization.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Database Migration Sync Button */}
          <button 
            onClick={handleMigrateSync}
            disabled={isProcessing}
            className="px-3.5 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Imports legacy student guardians to authoritative schemas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} /> Sync DB
          </button>

          <button 
            onClick={openFamilyCreate}
            className="px-3.5 py-2 border border-[#0052FF] bg-white hover:bg-blue-50 text-[#0052FF] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Register Family
          </button>

          <button 
            onClick={openGuardianCreate}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Register Guardian
          </button>

          <button 
            onClick={() => {
              if (guardians.length === 0 || students.length === 0) {
                notify('warning', 'Must have registered Students and Guardians before linking');
                return;
              }
              setLinkStudentId(students[0].id);
              setLinkGuardianId(guardians[0].id);
              setLinkRelationType('FATHER');
              setLinkIsPrimary(true);
              setLinkIsEmergency(true);
              setLinkCanComm(true);
              setLinkCanPortal(false);
              setLinkCanAcad(true);
              setLinkCanAttend(true);
              setLinkCanExams(true);
              setLinkCanDocs(false);
              setLinkCanAuth(false);
              setLinkFinancial('PRIMARY');
              setIsLinkModalOpen(true);
            }}
            className="px-4 py-2 bg-[#0052FF] text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5" /> Link Student-Guardian
          </button>
        </div>
      </div>

      {/* Internal Workspace Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        <button
          onClick={() => { setActiveSubTab('dashboard'); setSelectedFamilyId(null); setSelectedGuardianId(null); }}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'dashboard' 
              ? 'border-[#0052FF] text-[#0052FF]' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Relationship Dashboard
        </button>
        <button
          onClick={() => { setActiveSubTab('families'); setSelectedFamilyId(null); setSelectedGuardianId(null); }}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'families' 
              ? 'border-[#0052FF] text-[#0052FF]' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Families / Households ({families.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('guardians'); setSelectedFamilyId(null); setSelectedGuardianId(null); }}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'guardians' 
              ? 'border-[#0052FF] text-[#0052FF]' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Guardians Directory ({guardians.length})
        </button>
      </div>

      {/* VIEWPORT CANVAS */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Total Families</span>
              <strong className="text-2xl font-bold text-slate-800 mt-2">{totalFamilies}</strong>
              <span className="text-3xs text-slate-400 mt-1">Unique households</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Total Guardians</span>
              <strong className="text-2xl font-bold text-slate-800 mt-2">{totalGuardians}</strong>
              <span className="text-3xs text-slate-400 mt-1">Master identity records</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Multi-Student Families</span>
              <strong className="text-2xl font-bold text-slate-800 mt-2">{familiesWithMultiStudentsCount}</strong>
              <span className="text-3xs text-slate-400 mt-1">Households with 2+ wards</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Portal Active</span>
              <strong className="text-2xl font-bold text-green-600 mt-2">{activePortalAccounts}</strong>
              <span className="text-3xs text-slate-400 mt-1">Eligible portal logins</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Missing Portal Setup</span>
              <strong className="text-2xl font-bold text-amber-600 mt-2">{guardiansNoPortal}</strong>
              <span className="text-3xs text-slate-400 mt-1">Inactive logins</span>
            </div>
          </div>

          {/* Quick Informational / Architectural Card */}
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0052FF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Centralized Identity & Permission Engine</h4>
              <p className="text-xs leading-relaxed text-blue-700">
                EMS utilizes a normalized relationship contract where one <strong>Family</strong> groups multiple <strong>Guardians</strong> and <strong>Students</strong>. 
                Each connection maintains independent, granular access privileges controlling who can access report cards, receive daily attendance notices, approve digital consent forms, or hold financial liability.
              </p>
            </div>
          </div>

          {/* Visual Architecture Chart Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Relational Hierarchy Model</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-6 text-slate-700">
              <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold w-44 shadow-xs">
                <Building className="w-4 h-4 text-slate-400 mb-1" />
                <span>FAMILY GROUPING</span>
                <span className="text-3xs text-slate-400 font-normal mt-0.5">Primary household node</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />
              <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold w-44 shadow-xs">
                <Users className="w-4 h-4 text-indigo-500 mb-1" />
                <span>GUARDIANS</span>
                <span className="text-3xs text-slate-400 font-normal mt-0.5">Authoritative identity</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />
              <div className="flex flex-col items-center bg-[#0052FF] text-white px-4 py-2.5 rounded-lg text-xs font-bold w-44 shadow-xs">
                <HeartHandshake className="w-4 h-4 mb-1" />
                <span>RELATIONSHIP</span>
                <span className="text-3xs text-blue-100 font-normal mt-0.5">Granular access flags</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />
              <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold w-44 shadow-xs">
                <UserCheck className="w-4 h-4 text-emerald-500 mb-1" />
                <span>STUDENTS</span>
                <span className="text-3xs text-slate-400 font-normal mt-0.5">Universal anchor profile</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAMILIES TAB WORKSPACE */}
      {activeSubTab === 'families' && !selectedFamilyId && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search families by ID, name, email or student..."
                value={familySearch}
                onChange={(e) => setFamilySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Family Number</th>
                  <th className="px-6 py-3">Family Name</th>
                  <th className="px-6 py-3">Primary Contact</th>
                  <th className="px-6 py-3">Wards / Students</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {filteredFamilies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                      No family grouping records found matching current query.
                    </td>
                  </tr>
                ) : (
                  filteredFamilies.map(f => {
                    // Find guardians in this family
                    const familyGdns = guardians.filter(g => g.familyId === f.id);
                    const primaryGdn = familyGdns.find(g => g.id === f.primaryContactId) || familyGdns[0];
                    
                    // Find students linked to this family's guardians
                    const familyStudents = students.filter(s => {
                      const studentRels = relationships.filter(r => r.studentId === s.id);
                      return studentRels.some(r => familyGdns.some(tg => tg.id === r.guardianId));
                    });

                    return (
                      <tr key={f.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-semibold text-slate-800">{f.familyNumber}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{f.familyName}</span>
                          {f.city && <span className="block text-3xs text-slate-400">{f.city}, {f.state}</span>}
                        </td>
                        <td className="px-6 py-4">
                          {primaryGdn ? (
                            <div className="space-y-0.5">
                              <span className="font-medium text-slate-700">{primaryGdn.name}</span>
                              <span className="block text-3xs text-slate-400">{primaryGdn.phone}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">None assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {familyStudents.length === 0 ? (
                              <span className="text-slate-400 italic text-2xs">None linked</span>
                            ) : (
                              familyStudents.map(st => (
                                <span key={st.id} className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-blue-50 border border-blue-100 text-blue-700 text-3xs font-semibold">
                                  {st.firstName} {st.lastName}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => setSelectedFamilyId(f.id)}
                              className="p-1 text-slate-400 hover:text-[#0052FF] transition-colors cursor-pointer"
                              title="Family Workspace"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openFamilyEdit(f)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              title="Edit Family"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAMILY DETAILED WORKSPACE VIEW */}
      {activeSubTab === 'families' && selectedFamilyId && targetFamily && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedFamilyId(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              ← Back to Families
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => openFamilyEdit(targetFamily)}
                className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Family Group
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Family Profile Column */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-3xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold uppercase tracking-wider">{targetFamily.familyNumber}</span>
                <h2 className="text-lg font-bold text-slate-800 mt-2">{targetFamily.familyName}</h2>
                <p className="text-2xs text-slate-400">Registered on {new Date(targetFamily.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                {targetFamily.primaryEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{targetFamily.primaryEmail}</span>
                  </div>
                )}
                {targetFamily.primaryAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="block">{targetFamily.primaryAddress}</span>
                      <span className="block text-slate-400">{targetFamily.city}, {targetFamily.state} {targetFamily.postalCode}</span>
                      <span className="block text-slate-400">{targetFamily.country}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Households Members (Guardians and Students) Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Linked Guardians */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" /> Associated Guardians
                </h3>
                {targetFamilyGuardians.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">No guardians currently nested inside this family grouping.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {targetFamilyGuardians.map(g => (
                      <div key={g.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-slate-800 text-sm">{g.name}</span>
                            <span className="text-3xs px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 capitalize">{g.relationship}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-2 space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{g.phone}</span>
                            </div>
                            {g.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{g.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200/50 mt-2 flex justify-end">
                          <button 
                            onClick={() => setSelectedGuardianId(g.id)}
                            className="text-xs font-semibold text-[#0052FF] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Guardian Details →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Students (Wards) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" /> Wards / Students Grouping
                </h3>
                {targetFamilyStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">No students currently linked to this family’s guardians.</p>
                ) : (
                  <div className="space-y-3">
                    {targetFamilyStudents.map(st => {
                      // Find relationship attributes
                      const rels = relationships.filter(r => r.studentId === st.id && targetFamilyGuardians.some(tg => tg.id === r.guardianId));
                      const primaryRel = rels.find(r => r.isPrimary) || rels[0];

                      return (
                        <div key={st.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-3xs text-slate-400 font-bold tracking-wider block uppercase">{st.studentIdNumber}</span>
                            <span className="font-bold text-slate-800">{st.firstName} {st.lastName}</span>
                            <span className="block text-2xs text-slate-500">Class {st.currentClassId} • Section {st.currentSectionId}</span>
                          </div>
                          
                          {primaryRel && (
                            <div className="text-right text-xs space-y-1">
                              <span className="block text-3xs text-slate-400 uppercase tracking-wider font-bold">Guardian Settings</span>
                              <div className="flex flex-wrap items-center justify-end gap-1">
                                {primaryRel.isPrimary && <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-sm text-3xs font-semibold">Primary Contact</span>}
                                {primaryRel.isEmergencyContact && <span className="px-1.5 py-0.5 bg-red-50 border border-red-200 text-red-700 rounded-sm text-3xs font-semibold">Emergency</span>}
                                {primaryRel.canAccessPortal && <span className="px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-sm text-3xs font-semibold">Portal Link</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GUARDIANS TAB DIRECTORY VIEW */}
      {activeSubTab === 'guardians' && !selectedGuardianId && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search guardians by ID, name, email or phone..."
                value={guardianSearch}
                onChange={(e) => setGuardianSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Guardian ID</th>
                  <th className="px-6 py-3">Guardian Name</th>
                  <th className="px-6 py-3">Contact Details</th>
                  <th className="px-6 py-3">Family Group</th>
                  <th className="px-6 py-3">Wards Linked</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {filteredGuardians.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No parent/guardian records found matching current query.
                    </td>
                  </tr>
                ) : (
                  filteredGuardians.map(g => {
                    const fam = families.find(f => f.id === g.familyId);
                    const linkedRels = relationships.filter(r => r.guardianId === g.id);
                    const linkedSts = linkedRels
                      .map(r => students.find(s => s.id === r.studentId))
                      .filter(Boolean) as Student[];

                    return (
                      <tr key={g.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-semibold text-slate-800">{g.guardianNumber || 'GDN-UNKNOWN'}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{g.name}</span>
                          {g.occupation && <span className="block text-3xs text-slate-400">{g.occupation}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <span className="block font-medium text-slate-700">{g.phone}</span>
                            {g.email && <span className="block text-3xs text-slate-400 truncate max-w-[150px]">{g.email}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {fam ? (
                            <button 
                              onClick={() => { setSelectedFamilyId(fam.id); setActiveSubTab('families'); }}
                              className="hover:text-[#0052FF] hover:underline cursor-pointer"
                            >
                              {fam.familyName}
                            </button>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {linkedSts.length === 0 ? (
                              <span className="text-slate-400 italic text-3xs">None</span>
                            ) : (
                              linkedSts.map(st => (
                                <span key={st.id} className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-indigo-50 border border-indigo-100 text-indigo-700 text-3xs font-semibold">
                                  {st.firstName} {st.lastName}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => setSelectedGuardianId(g.id)}
                              className="p-1 text-slate-400 hover:text-[#0052FF] transition-colors cursor-pointer"
                              title="Guardian Profile & Relational Workspace"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openGuardianEdit(g)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              title="Edit Profile"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GUARDIAN MASTER DETAIL & WORKSPACE */}
      {activeSubTab === 'guardians' && selectedGuardianId && targetGuardian && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedGuardianId(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              ← Back to Guardians Directory
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => openGuardianEdit(targetGuardian)}
                className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Master Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guardian Demographics Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 h-fit">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                  {targetGuardian.firstName ? targetGuardian.firstName.charAt(0) : targetGuardian.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 leading-tight">{targetGuardian.name}</h2>
                  <span className="text-3xs text-slate-400 block tracking-wider uppercase font-semibold mt-0.5">{targetGuardian.guardianNumber || 'GDN-UNKNOWN'}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Relationship (Preferred)</span>
                  <span className="capitalize font-semibold text-slate-700">{targetGuardian.relationship || 'other'}</span>
                </div>
                {targetGuardian.occupation && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Occupation</span>
                    <span className="font-semibold text-slate-700 text-right truncate max-w-[150px]" title={targetGuardian.occupation}>{targetGuardian.occupation}</span>
                  </div>
                )}
                {targetGuardian.employer && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Employer</span>
                    <span className="font-semibold text-slate-700 text-right truncate max-w-[150px]" title={targetGuardian.employer}>{targetGuardian.employer}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <span className="block font-bold text-slate-400 text-2xs uppercase tracking-wider">Contact Details</span>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{targetGuardian.phone}</span>
                  </div>
                  {targetGuardian.alternatePhone && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{targetGuardian.alternatePhone} (Alt)</span>
                    </div>
                  )}
                  {targetGuardian.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{targetGuardian.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <span className="block font-bold text-slate-400 text-2xs uppercase tracking-wider">Family Group</span>
                  {targetGuardianFamily ? (
                    <button 
                      onClick={() => { setSelectedFamilyId(targetGuardianFamily.id); setActiveSubTab('families'); }}
                      className="px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between w-full text-left transition-colors cursor-pointer"
                    >
                      <div className="truncate">
                        <span className="block font-bold">{targetGuardianFamily.familyName}</span>
                        <span className="block text-3xs text-slate-400">{targetGuardianFamily.familyNumber}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ) : (
                    <span className="text-slate-400 italic block">No family group assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Linkage & Permissions Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Linked Children Wards with detailed permission flags */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#0052FF]" /> Linked Wards / Students
                </h3>
                {targetGuardianStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">No student records are currently linked to this guardian identity.</p>
                ) : (
                  <div className="space-y-4">
                    {targetGuardianStudents.map(({ student, rel }) => (
                      <div key={student.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-3xs text-indigo-600 font-bold uppercase tracking-wider">Student Profile Link</span>
                            <h4 className="font-bold text-slate-800 text-sm">{student.firstName} {student.lastName} ({student.studentIdNumber})</h4>
                            <span className="block text-2xs text-slate-500">Class {student.currentClassId} • Section {student.currentSectionId}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => openRelEdit(rel)}
                              className="px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-3xs font-bold text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3 h-3" /> Adjust Access Flags
                            </button>
                            <button 
                              onClick={() => handleUnlink(rel.id)}
                              className="p-1.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove Linkage"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Attribute Matrix Indicators */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-200/50">
                          <div className={`p-2 rounded-lg border text-2xs ${rel.isPrimary ? 'bg-blue-50/50 border-blue-200 text-blue-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                            <span className="block font-semibold">Primary Contact</span>
                            <span className="text-3xs text-slate-400 block mt-0.5">{rel.isPrimary ? 'Primary commun.' : 'No'}</span>
                          </div>
                          <div className={`p-2 rounded-lg border text-2xs ${rel.isEmergencyContact ? 'bg-red-50/50 border-red-200 text-red-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                            <span className="block font-semibold">Emergency Pickup</span>
                            <span className="text-3xs text-slate-400 block mt-0.5">{rel.isEmergencyContact ? 'Authorized' : 'No'}</span>
                          </div>
                          <div className={`p-2 rounded-lg border text-2xs ${rel.canAccessPortal ? 'bg-green-50/50 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                            <span className="block font-semibold">Portal Setup</span>
                            <span className="text-3xs text-slate-400 block mt-0.5">{rel.canAccessPortal ? 'Access enabled' : 'No access'}</span>
                          </div>
                          <div className={`p-2 rounded-lg border text-2xs ${rel.financialResponsibility !== 'NONE' ? 'bg-amber-50/50 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                            <span className="block font-semibold">Fees Obligation</span>
                            <span className="text-3xs text-slate-400 block mt-0.5">{rel.financialResponsibility}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="block text-3xs text-slate-400 uppercase tracking-wider font-bold mb-1.5">Granular Informational Access</span>
                          <div className="flex flex-wrap gap-2 text-2xs">
                            <span className={`px-2 py-0.5 rounded-full border ${rel.canViewAcademicInformation ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-300 border-slate-100 line-through'}`}>Academic info</span>
                            <span className={`px-2 py-0.5 rounded-full border ${rel.canViewAttendance ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-300 border-slate-100 line-through'}`}>Attendance tracker</span>
                            <span className={`px-2 py-0.5 rounded-full border ${rel.canViewExaminationResults ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-300 border-slate-100 line-through'}`}>Exam results</span>
                            <span className={`px-2 py-0.5 rounded-full border ${rel.canViewDocuments ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-300 border-slate-100 line-through'}`}>Student files</span>
                            <span className={`px-2 py-0.5 rounded-full border ${rel.canAuthorizeActions ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-300 border-slate-100 line-through'}`}>Consent authorize</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Local Guardian Log Audit Timeline */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-slate-500" /> Activity Trail
                </h3>
                {targetGuardianAudits.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No auditable actions found for this parent record.</p>
                ) : (
                  <div className="space-y-4 text-xs">
                    {targetGuardianAudits.slice(0, 5).map(log => (
                      <div key={log.id} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                        <div>
                          <strong className="text-slate-800 font-bold block">{log.action?.replace(/_/g, ' ') || 'Unknown Action'}</strong>
                          <span className="block text-slate-500 text-3xs mt-0.5">Executed by {log.userDisplayName} • {new Date(log.timestamp).toLocaleString()}</span>
                          {log.notes && <span className="block text-slate-400 text-3xs mt-0.5">{log.notes}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================== MODALS ================== */}

      {/* Register / Edit Family Modal */}
      {isFamilyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">{editingFamily ? 'Edit Family Profile' : 'Register Family Household'}</h3>
              <button onClick={() => setIsFamilyModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleFamilySubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Family / Household Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sharma Family" 
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Primary Household Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. sharma.household@email.com" 
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Household Address</label>
                <textarea 
                  placeholder="Street and house details" 
                  value={primaryAddress}
                  onChange={(e) => setPrimaryAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">City</label>
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">State</label>
                  <input 
                    type="text" 
                    placeholder="State" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Country</label>
                  <input 
                    type="text" 
                    placeholder="India" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Postal Code / PIN</label>
                  <input 
                    type="text" 
                    placeholder="PIN Code" 
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsFamilyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : editingFamily ? 'Save Changes' : 'Register Family'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register / Edit Guardian Modal */}
      {isGuardianModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">{editingGuardian ? 'Edit Guardian Profile' : 'Register Parent/Guardian'}</h3>
              <button onClick={() => setIsGuardianModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => handleGuardianSubmit(e, false)} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">First Name</label>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={guardianFirstName}
                    onChange={(e) => setGuardianFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={guardianLastName}
                    onChange={(e) => setGuardianLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. parent@email.com" 
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Preferred Relationship</label>
                  <select 
                    value={guardianRelation}
                    onChange={(e: any) => setGuardianRelation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Legal Guardian</option>
                    <option value="other">Other Authorized Contact</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Contact Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 98110 22100" 
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Alternate Contact Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Alternate number" 
                    value={guardianAltPhone}
                    onChange={(e) => setGuardianAltPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Gender</label>
                  <select 
                    value={guardianGender}
                    onChange={(e) => setGuardianGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Date of Birth (Optional)</label>
                  <input 
                    type="date" 
                    value={guardianDOB}
                    onChange={(e) => setGuardianDOB(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Occupation</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Architect, Software Engineer" 
                    value={guardianOcc}
                    onChange={(e) => setGuardianOcc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Employer Name</label>
                  <input 
                    type="text" 
                    placeholder="Employer name" 
                    value={guardianEmp}
                    onChange={(e) => setGuardianEmp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Family / Household Association</label>
                <select 
                  value={editingGuardian?.familyId || ''}
                  onChange={(e) => {
                    const famId = e.target.value;
                    if (editingGuardian) {
                      editingGuardian.familyId = famId || undefined;
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                >
                  <option value="">-- No Family Group Assigned --</option>
                  {families.map(f => (
                    <option key={f.id} value={f.id}>{f.familyName} ({f.familyNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Residential Address</label>
                <textarea 
                  placeholder="Guardian living address" 
                  value={guardianAddress}
                  onChange={(e) => setGuardianAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsGuardianModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : editingGuardian ? 'Save Changes' : 'Register Guardian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Guardian Warning Alert */}
      {isDuplicateAlertOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-800 text-sm">Possible Existing Guardian Found</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              The system has identified registered guardians matching this name, phone, or email within this school tenant. Please verify to avoid duplicates:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {duplicateCandidates.map(dc => (
                <div key={dc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-2xs space-y-1 text-slate-700">
                  <strong className="block font-bold text-slate-800">{dc.name} ({dc.guardianNumber || 'GDN'})</strong>
                  <span className="block">Phone: {dc.phone}</span>
                  {dc.email && <span className="block">Email: {dc.email}</span>}
                  {dc.occupation && <span className="block text-slate-400">Occupation: {dc.occupation}</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => setIsDuplicateAlertOpen(false)}
                className="w-full px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
              >
                No, Go Back and Correct Fields
              </button>
              <button 
                onClick={(e) => {
                  setIsDuplicateAlertOpen(false);
                  handleGuardianSubmit(e as any, true); // force bypass duplicate check
                }}
                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Yes, This is a Different Person, Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Student ↔ Guardian & Manage Link Modal */}
      {(isLinkModalOpen || isRelEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">
                {isRelEditModalOpen ? 'Configure Relationship Attributes' : 'Create Student ↔ Guardian Relationship'}
              </h3>
              <button 
                onClick={() => { setIsLinkModalOpen(false); setIsRelEditModalOpen(false); setEditingRel(null); }} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={isRelEditModalOpen ? handleRelUpdate : handleLinkSubmit} className="p-6 space-y-4 text-xs">
              
              {!isRelEditModalOpen && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-600 font-semibold">Select Student</label>
                    <select
                      value={linkStudentId}
                      onChange={(e) => setLinkStudentId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                      required
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentIdNumber})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-600 font-semibold">Select Guardian</label>
                    <select
                      value={linkGuardianId}
                      onChange={(e) => setLinkGuardianId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                      required
                    >
                      {guardians.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.guardianNumber})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Relationship Terminology</label>
                  <select 
                    value={linkRelationType}
                    onChange={(e: any) => setLinkRelationType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                  >
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="LEGAL_GUARDIAN">Legal Guardian</option>
                    <option value="STEP_PARENT">Step Parent</option>
                    <option value="GRANDPARENT">Grandparent</option>
                    <option value="SIBLING_GUARDIAN">Sibling Guardian</option>
                    <option value="FOSTER_GUARDIAN">Foster Guardian</option>
                    <option value="OTHER">Other Authorized Term</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Fee / Financial Obligation</label>
                  <select 
                    value={linkFinancial}
                    onChange={(e: any) => setLinkFinancial(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                  >
                    <option value="PRIMARY">Primary Financial Responsibility</option>
                    <option value="SECONDARY">Secondary Obligation</option>
                    <option value="NONE">None</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <strong className="block text-slate-700 font-bold">Relational Authorization Matrix</strong>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input 
                      type="checkbox" 
                      checked={linkIsPrimary} 
                      onChange={(e) => setLinkIsPrimary(e.target.checked)} 
                      className="w-4 h-4 rounded-sm text-[#0052FF]" 
                    />
                    <div>
                      <span className="block font-semibold text-slate-700">Designated Primary Contact</span>
                      <span className="block text-3xs text-slate-400">Ordinary communication target</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input 
                      type="checkbox" 
                      checked={linkIsEmergency} 
                      onChange={(e) => setLinkIsEmergency(e.target.checked)} 
                      className="w-4 h-4 rounded-sm text-[#0052FF]" 
                    />
                    <div>
                      <span className="block font-semibold text-slate-700">Authorized Emergency Pickup</span>
                      <span className="block text-3xs text-slate-400">Consent for crisis pickup</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input 
                      type="checkbox" 
                      checked={linkCanComm} 
                      onChange={(e) => setLinkCanComm(e.target.checked)} 
                      className="w-4 h-4 rounded-sm text-[#0052FF]" 
                    />
                    <div>
                      <span className="block font-semibold text-slate-700">Receive Notices & Alerts</span>
                      <span className="block text-3xs text-slate-400">SMS, Emails, and general bulletins</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input 
                      type="checkbox" 
                      checked={linkCanPortal} 
                      onChange={(e) => setLinkCanPortal(e.target.checked)} 
                      className="w-4 h-4 rounded-sm text-[#0052FF]" 
                    />
                    <div>
                      <span className="block font-semibold text-slate-700">Enable Parent Portal Access</span>
                      <span className="block text-3xs text-slate-400">Eligible for login account credentials</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <strong className="block text-slate-700 font-bold">Information Categories Visibility (Parent Portal)</strong>
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={linkCanAcad} onChange={(e) => setLinkCanAcad(e.target.checked)} className="rounded-sm" />
                    <span>View Academic Grades & Reports</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={linkCanAttend} onChange={(e) => setLinkCanAttend(e.target.checked)} className="rounded-sm" />
                    <span>View Calendar & Attendance Tracker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={linkCanExams} onChange={(e) => setLinkCanExams(e.target.checked)} className="rounded-sm" />
                    <span>View Datesheets & Exam Marks</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={linkCanDocs} onChange={(e) => setLinkCanDocs(e.target.checked)} className="rounded-sm" />
                    <span>View Shared Student Documents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={linkCanAuth} onChange={(e) => setLinkCanAuth(e.target.checked)} className="rounded-sm" />
                    <span>Authorize Institutional Approvals</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setIsLinkModalOpen(false); setIsRelEditModalOpen(false); setEditingRel(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : isRelEditModalOpen ? 'Update Relationship' : 'Link Student-Guardian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
