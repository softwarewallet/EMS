import React, { useState } from 'react';
import { NavigationService } from './services/navigationService';
import { NotificationProvider } from './context/NotificationContext';
import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { StakeholderGovernanceWorkspace } from './components/stakeholderGovernance/StakeholderGovernanceWorkspace';
import { DataGovernanceWorkspace } from './components/dataGovernance/DataGovernanceWorkspace';
import { RouteGuard } from './components/common/RouteGuard';
import { ClassDetailsView } from './components/dashboard/ClassDetailsView';
import { DashboardRouter } from './components/dashboard/DashboardRouter';
import { ClassRoutineView } from './components/dashboard/ClassRoutineView';
import { ManageFeesView } from './components/dashboard/ManageFeesView';
import { AccountingView } from './components/dashboard/AccountingView';
import { LibraryView } from './components/dashboard/LibraryView';
import { TransportView } from './components/dashboard/TransportView';
import { NoticeboardView } from './components/dashboard/NoticeboardView';
import { InboxView } from './components/dashboard/InboxView';
import { ParentsView } from './components/dashboard/ParentsView';
import { ReportsView } from './components/dashboard/ReportsView';
import { RegistrationView } from './components/dashboard/RegistrationView';
import { ExamsView } from './components/dashboard/ExamsView';
import { StudentDirectoryView } from './components/students/StudentDirectoryView';
import { AcademicStructureView } from './components/academic/AcademicStructureView';
import { AttendanceTrackerView } from './components/attendance/AttendanceTrackerView';
import { TenantManagement } from './components/tenants/TenantManagement';
import { UserManagementView } from './components/users/UserManagementView';
import { RolePermissionView } from './components/users/RolePermissionView';
import { AuditLogView } from './components/audit/AuditLogView';
import { TenantSettingsView } from './components/settings/TenantSettingsView';
import { ModuleRegistryView } from './components/modules/ModuleRegistryView';
import { SecurityVerificationView } from './components/testing/SecurityVerificationView';

// Phase 3 Academic Management Views
import { TeacherManagementView } from './components/academic/TeacherManagementView';
import { TimetableWorkspace } from './components/timetable/TimetableWorkspace';
import { LessonPlanningView } from './components/academic/LessonPlanningView';
import { AssignmentManagementView } from './components/academic/AssignmentManagementView';
import { AssessmentManagementView } from './components/academic/AssessmentManagementView';
import { ExaminationManagementView } from './components/academic/ExaminationManagementView';
import { ReportCardView } from './components/academic/ReportCardView';
import { StudentPromotionView } from './components/academic/StudentPromotionView';

// Phase 4 Navigation Engine View
import { NavigationEngineView } from './components/navigation/NavigationEngineView';
import { AdmissionsDashboard } from './components/admissions/AdmissionsDashboard';
import { AdmissionsEnquiriesView } from './components/admissions/AdmissionsEnquiriesView';
import { AdmissionsApplicationsView } from './components/admissions/AdmissionsApplicationsView';
import { AdmissionsVerificationView } from './components/admissions/AdmissionsVerificationView';
import { AdmissionsTestsInterviewsView } from './components/admissions/AdmissionsTestsInterviewsView';
import { AdmissionsSelectionMeritView } from './components/admissions/AdmissionsSelectionMeritView';
import { AdmissionsApprovalsView } from './components/admissions/AdmissionsApprovalsView';
import { AdmissionsReportsView } from './components/admissions/AdmissionsReportsView';
import { AdmissionsSettingsView } from './components/admissions/AdmissionsSettingsView';
import { StudentExitsView } from './components/exits/StudentExitsView';
import { CertificateManagementView } from './components/certificates/CertificateManagementView';
import { PublicCertificateVerificationView } from './components/certificates/PublicCertificateVerificationView';
import { FinanceWorkspace } from './components/finance/FinanceWorkspace';
import { TransportWorkspace } from './components/transport/TransportWorkspace';
import { HostelWorkspace } from './components/hostel/HostelWorkspace';
import { StudentSupportWorkspace } from './components/studentSupport/StudentSupportWorkspace';
import { CommunicationWorkspace } from './components/communication/CommunicationWorkspace';
import { LibraryWorkspace } from './components/library/LibraryWorkspace';
import { ExaminationOpsWorkspace } from './components/examinationOps/ExaminationOpsWorkspace';
import { StaffHRWorkspace } from './components/staff/StaffHRWorkspace';
import { ProcurementWorkspace } from './components/procurement/ProcurementWorkspace';
import { InventoryWorkspace } from './components/inventory/InventoryWorkspace';
import { AssetManagementWorkspace } from './components/asset/AssetManagementWorkspace';
import { AlumniPlacementWorkspace } from './components/alumniPlacement/AlumniPlacementWorkspace';
import { LearningWorkspace } from './components/learning/LearningWorkspace';
import { ResearchWorkspace } from './components/research/ResearchWorkspace';
import { GovernanceWorkspace } from './components/governance/GovernanceWorkspace';
import { AccessGovernanceWorkspace } from './components/accessGovernance/AccessGovernanceWorkspace';
import RecordsWorkspace from './components/records/RecordsWorkspace';
import PrivacyGovernanceWorkspace from './components/privacyGovernance/PrivacyGovernanceWorkspace';
import { InstitutionalPerformanceWorkspace } from './components/institutionalPerformance/InstitutionalPerformanceWorkspace';
import { InstitutionalCommunicationWorkspace } from './components/institutionalCommunication/InstitutionalCommunicationWorkspace';
import { InstitutionalRiskWorkspace } from './components/institutionalRisk/InstitutionalRiskWorkspace';
import { SchedulingWorkspace } from './components/scheduling/SchedulingWorkspace';
import { StudentSuccessWorkspace } from './components/studentSuccess/StudentSuccessWorkspace';
import { QualityExecutionWorkspace } from './components/qualityExecution/QualityExecutionWorkspace';
import { AccreditationReviewWorkspace } from './components/accreditationReview/AccreditationReviewWorkspace';
import { InstitutionalAnalyticsWorkspace } from './components/institutionalAnalytics/InstitutionalAnalyticsWorkspace';
import { WorkflowGovernanceWorkspace } from './components/workflowGovernance/WorkflowGovernanceWorkspace';
import { KnowledgeGovernanceWorkspace } from './components/knowledgeGovernance/KnowledgeGovernanceWorkspace';
import { IntegrationGovernanceWorkspace } from './components/integrationGovernance/IntegrationGovernanceWorkspace';
import { AutomationGovernanceWorkspace } from './components/automationGovernance/AutomationGovernanceWorkspace';
import { ResourcePlanningWorkspace } from './components/resourcePlanning/ResourcePlanningWorkspace';
import { EnterprisePortfolioWorkspace } from './components/enterprisePortfolio/EnterprisePortfolioWorkspace';
import { EnterpriseArchitectureWorkspace } from './components/enterpriseArchitecture/EnterpriseArchitectureWorkspace';
import { ITServiceManagementWorkspace } from './components/itServiceManagement/ITServiceManagementWorkspace';
import { CybersecurityWorkspace } from './components/cybersecurity/CybersecurityWorkspace';
import { AIGovernanceWorkspace } from './components/aiGovernance/AIGovernanceWorkspace';
import { CrisisResilienceWorkspace } from './components/crisisResilience/CrisisResilienceWorkspace';
import { ComplianceAssuranceWorkspace } from './components/complianceAssurance/ComplianceAssuranceWorkspace';
import { InstitutionalGovernanceWorkspace } from './components/institutionalGovernance/InstitutionalGovernanceWorkspace';
import { InstitutionalPerformanceAssuranceWorkspace } from './components/institutionalPerformanceAssurance/InstitutionalPerformanceAssuranceWorkspace';
import { ResearchInnovationGovernanceWorkspace } from './components/researchInnovationGovernance/ResearchInnovationGovernanceWorkspace';
import { HumanCapitalGovernanceWorkspace } from './components/humanCapitalGovernance/HumanCapitalGovernanceWorkspace';
import { FinancialGovernanceWorkspace } from './components/financialGovernance/FinancialGovernanceWorkspace';
import { ProcurementGovernanceWorkspace } from './components/procurementGovernance/ProcurementGovernanceWorkspace';
import { ContractGovernanceWorkspace } from './components/contractGovernance/ContractGovernanceWorkspace';
import { AssetFacilitiesGovernanceWorkspace } from './components/assetFacilitiesGovernance/AssetFacilitiesGovernanceWorkspace';
import { SafetyEhsGovernanceWorkspace } from './components/safetyEhsGovernance/SafetyEhsGovernanceWorkspace';
import { QualityAssuranceGovernanceWorkspace } from './components/qualityAssuranceGovernance/QualityAssuranceGovernanceWorkspace';
import { StudentSuccessGovernanceWorkspace } from './components/studentSuccessGovernance/StudentSuccessGovernanceWorkspace';
import { CommunityEngagementGovernanceWorkspace } from './components/communityEngagementGovernance/CommunityEngagementGovernanceWorkspace';
import { InternationalizationGovernanceWorkspace } from './components/internationalizationGovernance/InternationalizationGovernanceWorkspace';
import { InternationalizationGlobalMobilityWorkspace } from './components/internationalizationGlobalMobility/InternationalizationGlobalMobilityWorkspace';
import { InstitutionalAdvancementDevelopmentWorkspace } from './components/institutionalAdvancementDevelopment/InstitutionalAdvancementDevelopmentWorkspace';
import { InstitutionalLegalComplianceRiskGovernanceWorkspace } from './components/institutionalLegalComplianceRiskGovernance/InstitutionalLegalComplianceRiskGovernanceWorkspace';
import { InstitutionalStrategyPlanningPerformanceWorkspace } from './components/institutionalStrategyPlanningPerformance/InstitutionalStrategyPlanningPerformanceWorkspace';
import { InstitutionalDigitalTransformationTechnologyOperationsWorkspace } from './components/institutionalDigitalTransformationTechnologyOperations/InstitutionalDigitalTransformationTechnologyOperationsWorkspace';
import { InstitutionalDataGovernanceRecordsPrivacyDigitalTrustWorkspace } from './components/institutionalDataGovernanceRecordsPrivacyDigitalTrust/InstitutionalDataGovernanceRecordsPrivacyDigitalTrustWorkspace';
import { InstitutionalITServiceManagementWorkspace } from './components/institutionalITServiceManagement/InstitutionalITServiceManagementWorkspace';
import { InstitutionalCybersecurityIdentitySecurityOperationsWorkspace } from './components/institutionalCybersecurityIdentitySecurityOperations/InstitutionalCybersecurityIdentitySecurityOperationsWorkspace';
import { DigitalTechnologyGovernanceWorkspace } from './components/digitalTechnologyGovernance/DigitalTechnologyGovernanceWorkspace';
import { CyberSecurityPrivacyGovernanceWorkspace } from './components/cyberSecurityPrivacyGovernance/CyberSecurityPrivacyGovernanceWorkspace';
import { BusinessContinuityResilienceGovernanceWorkspace } from './components/businessContinuityResilienceGovernance/BusinessContinuityResilienceGovernanceWorkspace';
import { EnterpriseRiskGovernanceWorkspace } from './components/enterpriseRiskGovernance/EnterpriseRiskGovernanceWorkspace';
import { AuditAssuranceGovernanceWorkspace } from './components/auditAssuranceGovernance/AuditAssuranceGovernanceWorkspace';
import { EnterpriseWorkflowOrchestrationWorkspace } from './components/enterpriseWorkflowOrchestration/EnterpriseWorkflowOrchestrationWorkspace';
import { EnterpriseCaseGovernanceWorkspace } from './components/enterpriseCaseGovernance/EnterpriseCaseGovernanceWorkspace';
import { DocumentRecordsGovernanceWorkspace } from './components/documentRecordsGovernance/DocumentRecordsGovernanceWorkspace';
import { EnterpriseCommunicationGovernanceWorkspace } from './components/enterpriseCommunicationGovernance/EnterpriseCommunicationGovernanceWorkspace';
import { EnterpriseDataIntegrationGovernanceWorkspace } from './components/enterpriseDataIntegrationGovernance/EnterpriseDataIntegrationGovernanceWorkspace';
import { EnterpriseEventAutomationGovernanceWorkspace } from './components/enterpriseEventAutomationGovernance/EnterpriseEventAutomationGovernanceWorkspace';
import { EnterpriseIntegrationGovernanceWorkspace } from './components/enterpriseIntegrationGovernance/EnterpriseIntegrationGovernanceWorkspace';
import { InstitutionalPerformanceGovernanceWorkspace } from './components/institutionalPerformanceGovernance/InstitutionalPerformanceGovernanceWorkspace';
import { InstitutionalAnalyticsGovernanceWorkspace } from './components/institutionalAnalyticsGovernance/InstitutionalAnalyticsGovernanceWorkspace';
import { InstitutionalDecisionGovernanceView } from './modules/decisionIntelligenceGovernance/views/InstitutionalDecisionGovernanceView';
import { PlanningBudgetResourceGovernanceWorkspace } from './components/planningBudgetResourceGovernance/PlanningBudgetResourceGovernanceWorkspace';
import { ProcessExcellenceGovernanceWorkspace } from './components/processExcellenceGovernance/ProcessExcellenceGovernanceWorkspace';
import { EMSCoreReadinessWorkspace } from './components/emsCoreReadiness/EMSCoreReadinessWorkspace';
import { InstitutionalAdministrationWorkspace } from './components/institutionalAdministration/InstitutionalAdministrationWorkspace';
import { AcademicManagementWorkspace } from './components/academicManagement/AcademicManagementWorkspace';
import { AdmissionsEnrollmentWorkspace } from './components/admissionsEnrollment/AdmissionsEnrollmentWorkspace';
import { StudentLifecycleWorkspace } from './components/studentLifecycle/StudentLifecycleWorkspace';
import { StudentAcademicOperationsWorkspace } from './components/studentAcademicOperations/StudentAcademicOperationsWorkspace';
import { AssessmentExaminationWorkspace } from './components/assessmentExamination/AssessmentExaminationWorkspace';
import { ResultsTranscriptCertificationWorkspace } from './components/resultsTranscriptCertification/ResultsTranscriptCertificationWorkspace';
import { GraduationDegreeAlumniCredentialWorkspace } from './components/graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialWorkspace';
import { InstitutionalLifecycleIntegrationWorkspace } from './components/institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationWorkspace';
import { HumanResourcesWorkforceWorkspace } from './components/humanResourcesWorkforce/HumanResourcesWorkforceWorkspace';
import { InstitutionalFinanceOperationsWorkspace } from './components/institutionalFinanceOperations/InstitutionalFinanceOperationsWorkspace';
import { InstitutionalProcurementOperationsWorkspace } from './components/institutionalProcurementOperations/InstitutionalProcurementOperationsWorkspace';
import { AssetsInventoryFacilitiesWorkspace } from './components/assetsInventoryFacilities/AssetsInventoryFacilitiesWorkspace';
import { FacilitiesSpaceSafetyOperationsWorkspace } from './components/facilitiesSpaceSafetyOperations/FacilitiesSpaceSafetyOperationsWorkspace';
import { TransportFleetMobilityWorkspace } from './components/transportFleetMobility/TransportFleetMobilityWorkspace';
import { InventoryAssetsStoresMaterialsWorkspace } from './components/inventoryAssetsStoresMaterials/InventoryAssetsStoresMaterialsWorkspace';
import { LibraryLearningResourcesWorkspace } from './components/libraryLearningResources/LibraryLearningResourcesWorkspace';
import { ResearchGrantsProjectsInnovationWorkspace } from './components/researchGrantsProjectsInnovation/ResearchGrantsProjectsInnovationWorkspace';
import { LibraryKnowledgeInformationServicesWorkspace } from './components/libraryKnowledgeInformationServices/LibraryKnowledgeInformationServicesWorkspace';
import { InstitutionalCommunicationsWorkspace } from './components/institutionalCommunications/InstitutionalCommunicationsWorkspace';
import { InstitutionalSecuritySafetyContinuityWorkspace } from './components/institutionalSecuritySafetyContinuity/InstitutionalSecuritySafetyContinuityWorkspace';
import { StudentServicesSupportWorkspace } from './components/studentServicesSupport/StudentServicesSupportWorkspace';
import DataIntelligenceTrustGovernanceWorkspace from './components/dataIntelligenceTrustGovernance/DataIntelligenceTrustGovernanceWorkspace';
import KnowledgeIntelligenceGovernanceWorkspace from './components/knowledgeIntelligenceGovernance/KnowledgeIntelligenceGovernanceWorkspace';
import './modules';

import { Loader2 } from 'lucide-react';

import { BookLoader } from './components/common/BookLoader';

function AppContent() {
  const { activeTab, setActiveTab } = useNavigation();
  const { currentTenant, isLoadingTenants } = useTenant();
  const { currentUser, isLoadingAuth, activeRoleAssignment } = useAuth();

  const activeRoute = NavigationService.getRouteForTab(activeTab);

  if (isLoadingTenants || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#1E2235] flex flex-col items-center justify-center text-slate-300">
        <BookLoader />
        <h2 className="text-xl font-bold text-white tracking-tight mt-4">EMS Platform</h2>
        <p className="text-sm text-slate-400 mt-2 text-center max-w-xs">
          Preparing educational workspace environment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Bar Header */}
      <Header />

      {/* Main Container: Dynamic Sidebar + Dynamic Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Multi-Level Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Dynamic View Canvas with Route Guard Enforcement */}
        <main className="flex-1 overflow-y-auto px-[10px] pt-0 pb-0 w-full max-w-[1600px] mx-auto">
          <RouteGuard tab={activeTab}>
            {(activeRoute === 'class' || activeTab === 'class') && <ClassDetailsView onNavigate={(t) => setActiveTab(t as ActiveTab)} />}
            {(activeRoute === 'my_school' || activeTab === 'my_school') && <DashboardRouter onNavigate={(t) => setActiveTab(t as ActiveTab)} />}
            {(activeRoute === 'national_dashboard' || activeTab === 'national_dashboard') && <DashboardRouter onNavigate={(t) => setActiveTab(t as ActiveTab)} />}
            {(activeRoute === 'platform_dashboard' || activeTab === 'platform_dashboard') && <DashboardRouter onNavigate={(t) => setActiveTab(t as ActiveTab)} />}
            {(activeRoute === 'students' || activeTab === 'students') && <StudentDirectoryView />}
            
            {/* Phase 3 Academic Management Modules */}
            {(activeRoute === 'teachers' || activeTab === 'teachers') && <TeacherManagementView />}
            {(activeRoute === 'timetable' || activeTab === 'timetable') && <TimetableWorkspace tenantId={currentTenant?.id || ''} user={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}
            {(activeRoute === 'lesson_planning' || activeTab === 'lesson_planning') && <LessonPlanningView />}
            {(activeRoute === 'assignments' || activeTab === 'assignments') && <AssignmentManagementView />}
            {(activeRoute === 'assessments' || activeTab === 'assessments') && <AssessmentManagementView />}
            {(activeRoute === 'examinations' || activeTab === 'examinations') && <ExaminationManagementView />}
            {(activeRoute === 'report_cards' || activeTab === 'report_cards') && <ReportCardView />}
            {(activeRoute === 'promotions' || activeTab === 'promotions') && <StudentPromotionView />}
            {(activeRoute === 'attendance' || activeTab === 'attendance' || activeRoute === 'attendance_dashboard' || activeTab === 'attendance_dashboard') && <AttendanceTrackerView initialTab="dashboard" />}
            {(activeRoute === 'daily_attendance' || activeTab === 'daily_attendance' || activeRoute === 'roll_call' || activeTab === 'roll_call') && <AttendanceTrackerView initialTab="rollcall" />}
            {(activeRoute === 'attendance_history' || activeTab === 'attendance_history' || activeRoute === 'attendance_register' || activeTab === 'attendance_register') && <AttendanceTrackerView initialTab="history" />}
            {(activeRoute === 'attendance_missing' || activeTab === 'attendance_missing' || activeRoute === 'missing_attendance' || activeTab === 'missing_attendance') && <AttendanceTrackerView initialTab="missing" />}
            {(activeRoute === 'attendance_reports' || activeTab === 'attendance_reports') && <AttendanceTrackerView initialTab="reports" />}
            {(activeRoute === 'attendance_settings' || activeTab === 'attendance_settings') && <AttendanceTrackerView initialTab="settings" />}
            {(activeRoute === 'parents' || activeTab === 'parents') && <ParentsView />}
            {(activeRoute === 'routine' || activeTab === 'routine') && <ClassRoutineView />}
            
            {/* Extended modules */}
            {(activeRoute === 'manage_fees' || activeTab === 'manage_fees') && <ManageFeesView />}
            {(activeRoute === 'accounting' || activeTab === 'accounting') && <AccountingView />}
            {(activeRoute === 'library' || activeTab === 'library') && <LibraryView />}
            {(activeRoute === 'transport' || activeTab === 'transport') && <TransportView />}
            {(activeRoute === 'noticeboard' || activeTab === 'noticeboard') && <NoticeboardView />}
            {(activeRoute === 'inbox' || activeTab === 'inbox') && <InboxView />}
            {(activeRoute === 'reports' || activeTab === 'reports') && <ReportsView />}
            {(activeRoute === 'registration' || activeTab === 'registration') && <RegistrationView />}
            {(activeRoute === 'exams' || activeTab === 'exams') && <ExamsView />}
            
            {/* Admin & Security Views */}
            {(activeRoute === 'tenants' || activeTab === 'tenants') && <TenantManagement />}
            {(activeRoute === 'users' || activeTab === 'users') && <UserManagementView />}
            {(activeRoute === 'roles' || activeTab === 'roles') && <RolePermissionView />}
            {(activeRoute === 'academic' || activeTab === 'academic') && <AcademicStructureView />}
            {(activeRoute === 'audit' || activeTab === 'audit') && <AuditLogView />}
            {(activeRoute === 'security_tests' || activeTab === 'security_tests') && <SecurityVerificationView />}
            {(activeRoute === 'settings' || activeTab === 'settings') && <TenantSettingsView />}
            {(activeRoute === 'modules' || activeTab === 'modules') && <ModuleRegistryView />}

            {/* Phase 4 Navigation Engine View */}
            {(activeRoute === 'nav_engine' || activeTab === 'nav_engine') && <NavigationEngineView />}
            {/* Phase 5 Admissions & Enrollment Views */}
            {(activeRoute === 'admissions_dashboard' || activeTab === 'admissions_dashboard' || activeRoute === 'admissions' || activeTab === 'admissions') && <AdmissionsDashboard />}
            {(activeRoute === 'admissions_enquiries' || activeTab === 'admissions_enquiries') && <AdmissionsEnquiriesView />}
            {(activeRoute === 'admissions_applications' || activeTab === 'admissions_applications') && <AdmissionsApplicationsView />}
            {(activeRoute === 'admissions_verification' || activeTab === 'admissions_verification') && <AdmissionsVerificationView />}
            {(activeRoute === 'admissions_tests' || activeTab === 'admissions_tests' || activeRoute === 'admissions_interviews' || activeTab === 'admissions_interviews') && <AdmissionsTestsInterviewsView />}
            {(activeRoute === 'admissions_selection' || activeTab === 'admissions_selection') && <AdmissionsSelectionMeritView />}
            {(activeRoute === 'admissions_approvals' || activeTab === 'admissions_approvals') && <AdmissionsApprovalsView />}
            {(activeRoute === 'admissions_reports' || activeTab === 'admissions_reports') && <AdmissionsReportsView />}
            {(activeRoute === 'admissions_settings' || activeTab === 'admissions_settings') && <AdmissionsSettingsView />}

            {/* Phase 6.4A Student Exit & Clearance Views */}
            {(activeRoute === 'student_exits' || activeTab === 'student_exits' || activeRoute === 'exit_requests' || activeTab === 'exit_requests' || activeRoute === 'exit_clearance' || activeTab === 'exit_clearance' || activeRoute === 'exit_settings' || activeTab === 'exit_settings' || activeRoute === 'exit_workspace' || activeTab === 'exit_workspace' || activeRoute === 'exit_dashboard' || activeTab === 'exit_dashboard') && <StudentExitsView />}

            {/* Phase 6.4B Certificate Generation & Issuance Views */}
            {(activeRoute === 'certificates' || activeTab === 'certificates' || activeRoute === 'certificate_registry' || activeTab === 'certificate_registry' || activeRoute === 'nav_certificate_registry' || activeTab === 'nav_certificate_registry') && (
              <CertificateManagementView tenantId={currentTenant?.id || 'tenant_main'} currentUser={currentUser} />
            )}
            {(activeRoute === 'certificate_verification' || activeTab === 'certificate_verification' || activeRoute === 'nav_certificate_verification' || activeTab === 'nav_certificate_verification') && (
              <PublicCertificateVerificationView />
            )}
            
            {/* Phase 7.10 Finance & Billing Views */}
            {(activeRoute === 'finance_workspace' || activeTab === 'finance_workspace') && <FinanceWorkspace tenantId={currentTenant?.id || ''} user={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}
            
            {/* Phase 7.11 Transport & Fleet Views */}
            {(activeRoute === 'transport_workspace' || activeTab === 'transport_workspace') && <TransportWorkspace tenantId={currentTenant?.id || ''} user={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}
            
            {/* Phase 7.12A Hostel Views */}
            {(activeRoute === 'hostel_workspace' || activeTab === 'hostel_workspace') && <HostelWorkspace tenantId={currentTenant?.id || ''} user={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}

            {/* Phase 7.13 Health & Student Support Views */}
            {(activeRoute === 'student_support_workspace' || activeTab === 'student_support_workspace') && <StudentSupportWorkspace tenantId={currentTenant?.id || ''} user={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}

            {/* Phase 7.14 Communications & Notifications Views */}
            {(activeRoute === 'communication_workspace' || activeTab === 'communication_workspace') && <CommunicationWorkspace currentTenantId={currentTenant?.id || ''} currentUser={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}

            {/* Phase 7.15A Library Workspace */}
            {(activeRoute === 'library_workspace' || activeTab === 'library_workspace') && <LibraryWorkspace currentTenantId={currentTenant?.id || ''} currentUser={{ id: currentUser?.uid || '', email: currentUser?.email || '', displayName: currentUser?.displayName || '', role: activeRoleAssignment?.roleCode }} />}

            {/* Phase 7.16 Examination Operations Workspace */}
            {(activeRoute === 'examination_ops' || activeTab === 'examination_ops') && (
              <ExaminationOpsWorkspace
                currentTenantId={currentTenant?.id || ''}
                currentUser={{
                  id: currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  role: activeRoleAssignment?.roleCode
                }}
              />
            )}

            {/* Phase 7.17 Staff, HR & Workforce Management Workspace */}
            {(activeRoute === 'staff' || activeTab === 'staff' || activeRoute === 'staff_workspace' || activeTab === 'staff_workspace' || activeRoute === 'staff_directory' || activeTab === 'staff_directory' || activeRoute === 'staff_leave' || activeTab === 'staff_leave' || activeRoute === 'staff_appraisal' || activeTab === 'staff_appraisal' || activeRoute === 'hr_cases' || activeTab === 'hr_cases' || activeRoute === 'staff_exit' || activeTab === 'staff_exit') && (
              <StaffHRWorkspace
                tenantId={currentTenant?.id || 'tenant_main'}
                currentUser={{
                  id: currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  role: activeRoleAssignment?.roleCode
                }}
              />
            )}

            {/* Phase 7.18 Procurement, Vendor & Purchase Management Workspace */}
            {(activeRoute === 'procurement_workspace' || activeTab === 'procurement_workspace' || activeRoute === 'procurement' || activeTab === 'procurement') && (
              <ProcurementWorkspace
                tenantId={currentTenant?.id || 'tenant_main'}
                currentUser={{
                  id: currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  role: activeRoleAssignment?.roleCode
                }}
              />
            )}

            {/* Phase 7.19 Asset & Inventory Management Workspace */}
            {(activeRoute === 'inventory_workspace' || activeTab === 'inventory_workspace' || activeRoute === 'inventory' || activeTab === 'inventory') && (
              <InventoryWorkspace />
            )}

            {/* Phase 7.21 Alumni, Career Services & Placement Management Workspace */}
            {(activeRoute === 'alumni_placement' || activeTab === 'alumni_placement' || activeRoute === 'nav_imo_alumni' || activeTab === 'nav_imo_alumni' || activeRoute === 'alumni' || activeTab === 'alumni') && (
              <AlumniPlacementWorkspace
                tenantId={currentTenant?.id || ''}
                currentUser={{
                  id: currentUser?.id || currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  roles: activeRoleAssignment ? [activeRoleAssignment.roleCode] : []
                }}
              />
            )}

            {/* Phase 7.22 Learning Management, Digital Classroom & Teaching Delivery Governance Workspace */}
            {(activeRoute === 'learning_workspace' || activeTab === 'learning_workspace' || activeRoute === 'nav_learning_workspace' || activeTab === 'nav_learning_workspace' || activeRoute === 'learning' || activeTab === 'learning') && (
              <LearningWorkspace
                tenantId={currentTenant?.id || ''}
                currentUser={{
                  id: currentUser?.id || currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  roles: activeRoleAssignment ? [activeRoleAssignment.roleCode] : []
                }}
              />
            )}

            {/* Phase 7.23 Research, Innovation, Institutional Projects & Knowledge Assets Workspace */}
            {(activeRoute === 'research_workspace' || activeTab === 'research_workspace' || activeRoute === 'nav_research_workspace' || activeTab === 'nav_research_workspace' || activeRoute === 'research' || activeTab === 'research') && (
              <ResearchWorkspace
                tenantId={currentTenant?.id || ''}
                currentUser={{
                  id: currentUser?.id || currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  roles: activeRoleAssignment ? [activeRoleAssignment.roleCode] : []
                }}
              />
            )}

            {/* Phase 7.24 Governance, Compliance, Accreditation & Institutional Quality Workspace */}
            {(activeRoute === 'governance_workspace' || activeTab === 'governance_workspace' || activeRoute === 'nav_governance_workspace' || activeTab === 'nav_governance_workspace' || activeRoute === 'governance' || activeTab === 'governance') && (
              <GovernanceWorkspace
                tenantId={currentTenant?.id || ''}
                currentUser={{
                  id: currentUser?.id || currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  roles: activeRoleAssignment ? [activeRoleAssignment.roleCode] : []
                }}
              />
            )}

            {/* Phase 7.25 Access Governance & Platform Administration Workspace */}
            {(activeRoute === 'access_governance' || activeTab === 'access_governance' || activeRoute === 'access_governance_workspace' || activeTab === 'access_governance_workspace') && (
              <AccessGovernanceWorkspace />
            )}

            {/* Phase 7.27 Institutional Document, Records & Retention Governance Workspace */}
            {(activeRoute === 'records_governance' || activeTab === 'records_governance') && (
              <RecordsWorkspace />
            )}

            {/* Phase 7.28 Privacy & Information Security Governance Workspace */}
            {(activeRoute === 'privacy_governance' || activeTab === 'privacy_governance') && (
              <PrivacyGovernanceWorkspace />
            )}

            {/* Phase 7.29 Institutional Planning, Strategy, KPI & Performance Management */}
            {(activeRoute === 'institutional_performance' || activeTab === 'institutional_performance' || activeRoute === 'nav_institutional_performance' || activeTab === 'nav_institutional_performance' || activeRoute === 'performance_strategy' || activeTab === 'performance_strategy') && (
              <InstitutionalPerformanceWorkspace />
            )}

            {/* Phase 7.30 Institutional Communication, Engagement & Stakeholder Relations Governance */}
            {(activeRoute === 'institutional_communication' || activeTab === 'institutional_communication' || activeRoute === 'nav_institutional_communication' || activeTab === 'nav_institutional_communication' || activeRoute === 'communication_governance' || activeTab === 'communication_governance' || activeRoute === 'nav_imo_announcements' || activeTab === 'nav_imo_announcements' || activeRoute === 'nav_imo_circulars' || activeTab === 'nav_imo_circulars') && (
              <InstitutionalCommunicationWorkspace
                tenantId={currentTenant?.id || ''}
                currentUser={{
                  id: currentUser?.id || currentUser?.uid || '',
                  email: currentUser?.email || '',
                  displayName: currentUser?.displayName || '',
                  roles: activeRoleAssignment ? [activeRoleAssignment.roleCode] : []
                }}
              />
            )}

            {/* Phase 7.31 Institutional Enterprise Risk Management, Campus Incident Command & Business Continuity */}
            {(activeRoute === 'institutional_risk' || activeTab === 'institutional_risk' || activeRoute === 'nav_institutional_risk' || activeTab === 'nav_institutional_risk' || activeRoute === 'risk_governance' || activeTab === 'risk_governance' || activeRoute === 'incident_command' || activeTab === 'incident_command') && (
              <InstitutionalRiskWorkspace />
            )}

            {/* Phase 7.32 Institutional Scheduling, Timetable & Resource Booking Workspace */}
            {(activeRoute === 'scheduling' || activeTab === 'scheduling' || activeRoute === 'scheduling_workspace' || activeTab === 'scheduling_workspace' || activeRoute === 'nav_scheduling' || activeTab === 'nav_scheduling') && (
              <SchedulingWorkspace
                tenantId={currentTenant?.id || 'tenant_main'}
                campusId="MAIN_CAMPUS"
                userRole={activeRoleAssignment?.roleCode || 'SUPER_ADMIN'}
                userId={currentUser?.uid || 'usr_admin'}
                userName={currentUser?.displayName || 'Platform Administrator'}
              />
            )}

            {/* Phase 7.33 Institutional Student Success, Early Warning & Academic Progression Workspace */}
            {(activeRoute === 'student_success' || activeTab === 'student_success' || activeRoute === 'student_success_workspace' || activeTab === 'student_success_workspace' || activeRoute === 'nav_student_success' || activeTab === 'nav_student_success') && (
              <StudentSuccessWorkspace />
            )}

            {/* Phase 7.34 Institutional Assessment, Accreditation Evidence & Quality Execution Workspace */}
            {(activeRoute === 'quality_execution' || activeTab === 'quality_execution' || activeRoute === 'quality_execution_workspace' || activeTab === 'quality_execution_workspace' || activeRoute === 'nav_quality_execution' || activeTab === 'nav_quality_execution') && (
              <QualityExecutionWorkspace />
            )}

            {/* Phase 7.35 Institutional Accreditation, Regulatory Submission & External Review Workspace */}
            {(activeRoute === 'accreditation_review' || activeTab === 'accreditation_review' || activeRoute === 'accreditation_review_workspace' || activeTab === 'accreditation_review_workspace' || activeRoute === 'nav_accreditation_review' || activeTab === 'nav_accreditation_review') && (
              <AccreditationReviewWorkspace />
            )}

            {/* Phase 7.36 Institutional Data, Analytics, Business Intelligence & Decision Intelligence Workspace */}
            {(activeRoute === 'institutional_analytics' || activeTab === 'institutional_analytics' || activeRoute === 'institutional_analytics_workspace' || activeTab === 'institutional_analytics_workspace' || activeRoute === 'nav_institutional_analytics' || activeTab === 'nav_institutional_analytics') && (
              <InstitutionalAnalyticsWorkspace />
            )}

            {/* Phase 7.37 Institutional Workflow, Case Management, Task Orchestration & Enterprise Process Governance Engine Workspace */}
            {(activeRoute === 'workflow_governance' || activeTab === 'workflow_governance' || activeRoute === 'workflow_governance_workspace' || activeTab === 'workflow_governance_workspace' || activeRoute === 'nav_workflow_governance' || activeTab === 'nav_workflow_governance') && (
              <WorkflowGovernanceWorkspace />
            )}

            {/* Phase 7.38 Institutional Knowledge, Enterprise Search, Policy Intelligence & Governed Information Discovery Engine Workspace */}
            {(activeRoute === 'knowledge_governance' || activeTab === 'knowledge_governance' || activeRoute === 'knowledge_governance_workspace' || activeTab === 'knowledge_governance_workspace' || activeRoute === 'nav_knowledge_governance' || activeTab === 'nav_knowledge_governance') && (
              <KnowledgeGovernanceWorkspace />
            )}

            {(activeRoute === 'integration_governance' || activeTab === 'integration_governance' || activeRoute === 'integration_governance_workspace' || activeTab === 'integration_governance_workspace' || activeRoute === 'nav_integration_governance' || activeTab === 'nav_integration_governance') && (
              <IntegrationGovernanceWorkspace />
            )}

            {(activeRoute === 'automation_governance' || activeTab === 'automation_governance' || activeRoute === 'automation_governance_workspace' || activeTab === 'automation_governance_workspace' || activeRoute === 'nav_automation_governance' || activeTab === 'nav_automation_governance') && (
              <AutomationGovernanceWorkspace />
            )}

            {(activeRoute === 'resource_planning' || activeTab === 'resource_planning' || activeRoute === 'resource_planning_workspace' || activeTab === 'resource_planning_workspace' || activeRoute === 'nav_resource_planning' || activeTab === 'nav_resource_planning') && (
              <ResourcePlanningWorkspace />
            )}

            {(activeRoute === 'enterprise_portfolio_workspace' || activeTab === 'enterprise_portfolio_workspace' || activeRoute === 'nav_enterprise_portfolio' || activeTab === 'nav_enterprise_portfolio') && (
              <EnterprisePortfolioWorkspace />
            )}

            {(activeRoute === 'enterprise_architecture_workspace' || activeTab === 'enterprise_architecture_workspace' || activeRoute === 'nav_enterprise_architecture' || activeTab === 'nav_enterprise_architecture') && (
              <EnterpriseArchitectureWorkspace />
            )}

            {(activeRoute === 'it_service_management_workspace' || activeTab === 'it_service_management_workspace' || activeRoute === 'nav_it_service_management' || activeTab === 'nav_it_service_management') && (
              <ITServiceManagementWorkspace />
            )}

            {(activeRoute === 'cybersecurity_operations_workspace' || activeTab === 'cybersecurity_operations_workspace' || activeRoute === 'nav_cybersecurity_operations' || activeTab === 'nav_cybersecurity_operations') && (
              <CybersecurityWorkspace />
            )}

            {(activeRoute === 'ai_governance_workspace' || activeTab === 'ai_governance_workspace' || activeRoute === 'nav_ai_governance' || activeTab === 'nav_ai_governance') && (
              <AIGovernanceWorkspace />
            )}

            {(activeRoute === 'crisis_resilience_workspace' || activeTab === 'crisis_resilience_workspace' || activeRoute === 'nav_crisis_resilience' || activeTab === 'nav_crisis_resilience') && (
              <CrisisResilienceWorkspace />
            )}

            {(activeRoute === 'compliance_assurance_workspace' || activeTab === 'compliance_assurance_workspace' || activeRoute === 'nav_compliance_assurance' || activeTab === 'nav_compliance_assurance') && (
              <ComplianceAssuranceWorkspace />
            )}
            {(activeRoute === 'institutional_governance' || activeTab === 'institutional_governance' || activeRoute === 'nav_institutional_governance_workspace' || activeTab === 'nav_institutional_governance_workspace') && (
              <InstitutionalGovernanceWorkspace />
            )}
            {(activeRoute === 'institutional_performance_assurance' || activeTab === 'institutional_performance_assurance' || activeRoute === 'nav_institutional_performance_assurance_workspace' || activeTab === 'nav_institutional_performance_assurance_workspace') && (
              <InstitutionalPerformanceAssuranceWorkspace />
            )}

            {(activeRoute === 'research_innovation_governance' || activeTab === 'research_innovation_governance' || activeRoute === 'research_innovation_governance_workspace' || activeTab === 'research_innovation_governance_workspace' || activeRoute === 'nav_research_innovation_governance' || activeTab === 'nav_research_innovation_governance') && (
              <ResearchInnovationGovernanceWorkspace />
            )}

            {(activeRoute === 'human_capital_governance' || activeTab === 'human_capital_governance' || activeRoute === 'human_capital_governance_workspace' || activeTab === 'human_capital_governance_workspace' || activeRoute === 'nav_human_capital_governance' || activeTab === 'nav_human_capital_governance') && (
              <HumanCapitalGovernanceWorkspace />
            )}

            {(activeRoute === 'financial_governance' || activeTab === 'financial_governance' || activeRoute === 'financial_governance_workspace' || activeTab === 'financial_governance_workspace' || activeRoute === 'nav_financial_governance' || activeTab === 'nav_financial_governance') && (
              <FinancialGovernanceWorkspace />
            )}

            {(activeRoute === 'procurement_governance' || activeTab === 'procurement_governance' || activeRoute === 'procurement_governance_workspace' || activeTab === 'procurement_governance_workspace' || activeRoute === 'nav_procurement_governance' || activeTab === 'nav_procurement_governance') && (
              <ProcurementGovernanceWorkspace />
            )}

            {(activeRoute === 'contract_governance' || activeTab === 'contract_governance' || activeRoute === 'contract_governance_workspace' || activeTab === 'contract_governance_workspace' || activeRoute === 'nav_contract_governance' || activeTab === 'nav_contract_governance') && (
              <ContractGovernanceWorkspace />
            )}

            {(activeRoute === 'asset_facilities_governance' || activeTab === 'asset_facilities_governance' || activeRoute === 'asset_facilities_governance_workspace' || activeTab === 'asset_facilities_governance_workspace' || activeRoute === 'nav_asset_facilities_governance' || activeTab === 'nav_asset_facilities_governance') && (
              <AssetFacilitiesGovernanceWorkspace />
            )}

            {(activeRoute === 'safety_ehs_governance' || activeTab === 'safety_ehs_governance' || activeRoute === 'safety_ehs_governance_workspace' || activeTab === 'safety_ehs_governance_workspace' || activeRoute === 'nav_safety_ehs_governance' || activeTab === 'nav_safety_ehs_governance') && (
              <SafetyEhsGovernanceWorkspace />
            )}

            {(activeRoute === 'quality_assurance_governance' || activeTab === 'quality_assurance_governance' || activeRoute === 'quality_assurance_governance_workspace' || activeTab === 'quality_assurance_governance_workspace' || activeRoute === 'nav_quality_assurance_governance' || activeTab === 'nav_quality_assurance_governance') && (
              <QualityAssuranceGovernanceWorkspace />
            )}

            {(activeRoute === 'student_success_governance' || activeTab === 'student_success_governance' || activeRoute === 'student_success_governance_workspace' || activeTab === 'student_success_governance_workspace' || activeRoute === 'nav_student_success_governance' || activeTab === 'nav_student_success_governance') && (
              <StudentSuccessGovernanceWorkspace />
            )}

            {(activeRoute === 'community_engagement_governance' || activeTab === 'community_engagement_governance' || activeRoute === 'community_engagement_governance_workspace' || activeTab === 'community_engagement_governance_workspace' || activeRoute === 'nav_community_engagement_governance' || activeTab === 'nav_community_engagement_governance') && (
              <CommunityEngagementGovernanceWorkspace />
            )}

            {(activeRoute === 'internationalization_governance' || activeTab === 'internationalization_governance' || activeRoute === 'internationalization_governance_workspace' || activeTab === 'internationalization_governance_workspace' || activeRoute === 'nav_internationalization_governance' || activeTab === 'nav_internationalization_governance') && (
              <InternationalizationGovernanceWorkspace />
            )}

            {(activeRoute === 'internationalization_global_mobility' || activeTab === 'internationalization_global_mobility' || activeRoute === 'internationalization_global_mobility_workspace' || activeRoute === 'internationalization_global_mobility_workspace' || activeRoute === 'nav_internationalization_global_mobility' || activeRoute === 'nav_internationalization_global_mobility') && (
              <InternationalizationGlobalMobilityWorkspace />
            )}

            {(activeRoute === 'institutional_advancement_development' || activeTab === 'institutional_advancement_development' || activeRoute === 'institutional_advancement_development_workspace' || activeRoute === 'institutional_advancement_development_workspace' || activeRoute === 'nav_institutional_advancement_development' || activeRoute === 'nav_institutional_advancement_development') && (
              <InstitutionalAdvancementDevelopmentWorkspace />
            )}

            {(activeRoute === 'digital_technology_governance' || activeTab === 'digital_technology_governance' || activeRoute === 'digital_technology_governance_workspace' || activeTab === 'digital_technology_governance_workspace' || activeRoute === 'nav_digital_technology_governance' || activeTab === 'nav_digital_technology_governance') && (
              <DigitalTechnologyGovernanceWorkspace />
            )}

            {(activeRoute === 'cyber_security_privacy_governance' || activeTab === 'cyber_security_privacy_governance' || activeRoute === 'cyber_security_privacy_governance_workspace' || activeTab === 'cyber_security_privacy_governance_workspace' || activeRoute === 'nav_cyber_security_privacy_governance' || activeTab === 'nav_cyber_security_privacy_governance') && (
              <CyberSecurityPrivacyGovernanceWorkspace />
            )}

            {(activeRoute === 'business_continuity_resilience_governance' || activeTab === 'business_continuity_resilience_governance' || activeRoute === 'business_continuity_resilience_governance_workspace' || activeTab === 'business_continuity_resilience_governance_workspace' || activeRoute === 'nav_business_continuity_resilience_governance' || activeTab === 'nav_business_continuity_resilience_governance') && (
              <BusinessContinuityResilienceGovernanceWorkspace />
            )}

            {(activeRoute === 'enterprise_risk_governance' || activeTab === 'enterprise_risk_governance' || activeRoute === 'enterprise_risk_governance_workspace' || activeTab === 'enterprise_risk_governance_workspace' || activeRoute === 'nav_enterprise_risk_governance' || activeTab === 'nav_enterprise_risk_governance') && (
              <EnterpriseRiskGovernanceWorkspace />
            )}

            {(activeRoute === 'audit_assurance_governance' || activeTab === 'audit_assurance_governance' || activeRoute === 'audit_assurance_governance_workspace' || activeTab === 'audit_assurance_governance_workspace' || activeRoute === 'nav_audit_assurance_governance' || activeTab === 'nav_audit_assurance_governance') && (
              <AuditAssuranceGovernanceWorkspace />
            )}

            {(activeRoute === 'enterprise_workflow_orchestration' || activeTab === 'enterprise_workflow_orchestration' || activeRoute === 'enterprise_workflow_orchestration_workspace' || activeTab === 'enterprise_workflow_orchestration_workspace' || activeRoute === 'nav_enterprise_workflow_orchestration' || activeTab === 'nav_enterprise_workflow_orchestration') && (
              <EnterpriseWorkflowOrchestrationWorkspace />
            )}

            {(activeRoute === 'enterprise_case_governance' || activeTab === 'enterprise_case_governance' || activeRoute === 'enterprise_case_governance_workspace' || activeTab === 'enterprise_case_governance_workspace' || activeRoute === 'nav_enterprise_case_governance' || activeTab === 'nav_enterprise_case_governance') && (
              <EnterpriseCaseGovernanceWorkspace />
            )}

            {(activeRoute === 'document_records_governance' || activeTab === 'document_records_governance' || activeRoute === 'document_records_governance_workspace' || activeTab === 'document_records_governance_workspace' || activeRoute === 'nav_document_records_governance' || activeTab === 'nav_document_records_governance') && (
              <DocumentRecordsGovernanceWorkspace />
            )}

            {(activeRoute === 'enterprise_communication_governance' || activeTab === 'enterprise_communication_governance' || activeRoute === 'enterprise_communication_governance_workspace' || activeTab === 'enterprise_communication_governance_workspace' || activeRoute === 'nav_enterprise_communication_governance' || activeTab === 'nav_enterprise_communication_governance') && (
              <EnterpriseCommunicationGovernanceWorkspace />
            )}

            {(activeRoute === 'enterprise_data_integration_governance' || activeTab === 'enterprise_data_integration_governance' || activeRoute === 'enterprise_data_integration_governance_workspace' || activeTab === 'enterprise_data_integration_governance_workspace' || activeRoute === 'nav_enterprise_data_integration_governance' || activeTab === 'nav_enterprise_data_integration_governance') && (
              <EnterpriseDataIntegrationGovernanceWorkspace />
            )}

            {(activeRoute === 'enterprise_event_automation_governance' || activeTab === 'enterprise_event_automation_governance' || activeRoute === 'enterprise_event_automation_governance_workspace' || activeTab === 'enterprise_event_automation_governance_workspace' || activeRoute === 'nav_enterprise_event_automation_governance' || activeTab === 'nav_enterprise_event_automation_governance') && (
              <EnterpriseEventAutomationGovernanceWorkspace />
            )}

            {(activeRoute === 'enterprise_integration_governance' || activeTab === 'enterprise_integration_governance' || activeRoute === 'enterprise_integration_governance_workspace' || activeTab === 'enterprise_integration_governance_workspace' || activeRoute === 'nav_enterprise_integration_governance' || activeTab === 'nav_enterprise_integration_governance') && (
              <EnterpriseIntegrationGovernanceWorkspace />
            )}

            {(activeRoute === 'institutional_performance_governance' || activeTab === 'institutional_performance_governance' || activeRoute === 'institutional_performance_governance_workspace' || activeTab === 'institutional_performance_governance_workspace' || activeRoute === 'nav_institutional_performance_governance' || activeTab === 'nav_institutional_performance_governance') && (
              <InstitutionalPerformanceGovernanceWorkspace />
            )}

            {(activeRoute === 'institutional_analytics_governance' || activeTab === 'institutional_analytics_governance' || activeRoute === 'institutional_analytics_governance_workspace' || activeTab === 'institutional_analytics_governance_workspace' || activeRoute === 'nav_institutional_analytics_governance' || activeTab === 'nav_institutional_analytics_governance') && (
              <InstitutionalAnalyticsGovernanceWorkspace />
            )}

            {(activeRoute === 'data_intelligence_trust_governance' || activeTab === 'data_intelligence_trust_governance' || activeRoute === 'data_intelligence_trust_governance_workspace' || activeTab === 'data_intelligence_trust_governance_workspace' || activeRoute === 'nav_data_intelligence_trust_governance' || activeTab === 'nav_data_intelligence_trust_governance') && (
              <DataIntelligenceTrustGovernanceWorkspace />
            )}

            {(activeRoute === 'decision_intelligence_governance' || activeTab === 'decision_intelligence_governance' || activeRoute === 'decision_intelligence_governance_workspace' || activeTab === 'decision_intelligence_governance_workspace' || activeRoute === 'nav_decision_intelligence_governance' || activeTab === 'nav_decision_intelligence_governance') && (
              <InstitutionalDecisionGovernanceView />
            )}

            {(activeRoute === 'knowledge_intelligence_governance' || activeTab === 'knowledge_intelligence_governance' || activeRoute === 'knowledge_intelligence_governance_workspace' || activeTab === 'knowledge_intelligence_governance_workspace' || activeRoute === 'nav_knowledge_intelligence_governance' || activeTab === 'nav_knowledge_intelligence_governance') && (
              <KnowledgeIntelligenceGovernanceWorkspace />
            )}

            {(activeRoute === 'planning_budget_portfolio' || activeTab === 'planning_budget_portfolio' || activeRoute === 'planning_budget_resource_governance' || activeTab === 'planning_budget_resource_governance' || activeRoute === 'planning_budget_resource_governance_workspace' || activeTab === 'planning_budget_resource_governance_workspace' || activeRoute === 'nav_planning_budget_resource_governance' || activeTab === 'nav_planning_budget_resource_governance') && (
              <PlanningBudgetResourceGovernanceWorkspace />
            )}

            {(activeRoute === 'process_excellence_governance' || activeTab === 'process_excellence_governance' || activeRoute === 'process_excellence_governance_workspace' || activeTab === 'process_excellence_governance_workspace' || activeRoute === 'nav_process_excellence_governance' || activeTab === 'nav_process_excellence_governance') && (
              <ProcessExcellenceGovernanceWorkspace />
            )}

            {(activeRoute === 'ems_core_readiness' || activeTab === 'ems_core_readiness' || activeRoute === 'ems_core_readiness_workspace' || activeTab === 'ems_core_readiness_workspace' || activeRoute === 'nav_ems_core_readiness' || activeTab === 'nav_ems_core_readiness') && (
              <EMSCoreReadinessWorkspace />
            )}

            {(activeRoute === 'institutional_administration' || activeTab === 'institutional_administration' || activeRoute === 'nav_institutional_administration' || activeTab === 'nav_institutional_administration') && (
              <InstitutionalAdministrationWorkspace />
            )}

            {(activeRoute === 'academic_management' || activeTab === 'academic_management' || activeRoute === 'nav_academic_management' || activeTab === 'nav_academic_management') && (
              <AcademicManagementWorkspace />
            )}

            {(activeRoute === 'admissions_enrollment' || activeTab === 'admissions_enrollment' || activeRoute === 'nav_admissions_enrollment' || activeTab === 'nav_admissions_enrollment') && (
              <AdmissionsEnrollmentWorkspace />
            )}

            {(activeRoute === 'student_lifecycle' || activeTab === 'student_lifecycle' || activeRoute === 'nav_student_lifecycle' || activeTab === 'nav_student_lifecycle') && (
              <StudentLifecycleWorkspace />
            )}

            {(activeRoute === 'student_academic_operations' || activeTab === 'student_academic_operations' || activeRoute === 'nav_student_academic_operations' || activeTab === 'nav_student_academic_operations') && (
              <StudentAcademicOperationsWorkspace />
            )}

            {(activeRoute === 'assessment_examination' || activeTab === 'assessment_examination' || activeRoute === 'nav_assessment_examination' || activeTab === 'nav_assessment_examination') && (
              <AssessmentExaminationWorkspace />
            )}

            {(activeRoute === 'results_transcript_certification' || activeTab === 'results_transcript_certification' || activeRoute === 'nav_results_transcript_certification' || activeTab === 'nav_results_transcript_certification') && (
              <ResultsTranscriptCertificationWorkspace />
            )}

            {(activeRoute === 'graduation_degree_alumni_credential' || activeTab === 'graduation_degree_alumni_credential' || activeRoute === 'nav_graduation_degree_alumni_credential' || activeTab === 'nav_graduation_degree_alumni_credential') && (
              <GraduationDegreeAlumniCredentialWorkspace />
            )}

            {(activeRoute === 'institutional_lifecycle_integration' || activeTab === 'institutional_lifecycle_integration' || activeRoute === 'nav_institutional_lifecycle_integration' || activeTab === 'nav_institutional_lifecycle_integration') && (
              <InstitutionalLifecycleIntegrationWorkspace />
            )}

            {(activeRoute === 'human_resources_workforce' || activeTab === 'human_resources_workforce' || activeRoute === 'nav_human_resources_workforce' || activeTab === 'nav_human_resources_workforce') && (
              <HumanResourcesWorkforceWorkspace />
            )}

            {(activeRoute === 'institutional_finance_operations' || activeTab === 'institutional_finance_operations' || activeRoute === 'nav_institutional_finance_operations' || activeTab === 'nav_institutional_finance_operations') && (
              <InstitutionalFinanceOperationsWorkspace />
            )}

            {(activeRoute === 'institutional_procurement_operations' || activeTab === 'institutional_procurement_operations' || activeRoute === 'nav_institutional_procurement_operations' || activeTab === 'nav_institutional_procurement_operations') && (
              <InstitutionalProcurementOperationsWorkspace />
            )}

            {(activeRoute === 'assets_inventory_facilities' || activeTab === 'assets_inventory_facilities' || activeRoute === 'nav_assets_inventory_facilities' || activeTab === 'nav_assets_inventory_facilities') && (
              <AssetsInventoryFacilitiesWorkspace />
            )}

            {(activeRoute === 'facilities_space_safety' || activeTab === 'facilities_space_safety') && (
              <FacilitiesSpaceSafetyOperationsWorkspace />
            )}

            {(activeRoute === 'transport_fleet_mobility' || activeTab === 'transport_fleet_mobility' || activeRoute === 'nav_transport_fleet_mobility' || activeTab === 'nav_transport_fleet_mobility') && (
              <TransportFleetMobilityWorkspace />
            )}

            {(activeRoute === 'inventory_assets_stores_materials' || activeTab === 'inventory_assets_stores_materials' || activeRoute === 'nav_inventory_assets_stores_materials' || activeTab === 'nav_inventory_assets_stores_materials' || activeRoute === 'inventory-assets') && (
              <InventoryAssetsStoresMaterialsWorkspace />
            )}

            {(activeRoute === 'library_learning_resources' || activeTab === 'library_learning_resources' || activeRoute === 'nav_library_learning_resources' || activeTab === 'nav_library_learning_resources') && (
              <LibraryLearningResourcesWorkspace />
            )}

            {(activeRoute === 'research_grants_projects_innovation' || activeTab === 'research_grants_projects_innovation' || activeRoute === 'nav_research_grants_projects_innovation' || activeTab === 'nav_research_grants_projects_innovation') && (
              <ResearchGrantsProjectsInnovationWorkspace />
            )}

            {(activeRoute === 'library_knowledge_information_services' || activeTab === 'library_knowledge_information_services' || activeRoute === 'nav_library_knowledge_information_services' || activeTab === 'nav_library_knowledge_information_services') && (
              <LibraryKnowledgeInformationServicesWorkspace />
            )}

            {(activeRoute === 'institutional_communications' || activeTab === 'institutional_communications' || activeRoute === 'nav_institutional_communications' || activeTab === 'nav_institutional_communications') && (
              <InstitutionalCommunicationsWorkspace />
            )}

            {(activeRoute === 'institutional_security_safety_continuity' || activeTab === 'institutional_security_safety_continuity' || activeRoute === 'nav_institutional_security_safety_continuity' || activeTab === 'nav_institutional_security_safety_continuity') && (
              <InstitutionalSecuritySafetyContinuityWorkspace />
            )}

            {(activeRoute === 'student_services_support' || activeTab === 'student_services_support' || activeRoute === 'nav_student_services_support' || activeTab === 'nav_student_services_support') && (
              <StudentServicesSupportWorkspace />
            )}

            {(activeRoute === 'institutional_legal_compliance_risk_governance' || activeTab === 'institutional_legal_compliance_risk_governance' || activeRoute === 'institutional_legal_compliance_risk_governance_workspace' || activeRoute === 'institutional_legal_compliance_risk_governance_workspace' || activeRoute === 'nav_institutional_legal_compliance_risk_governance' || activeRoute === 'nav_institutional_legal_compliance_risk_governance') && (
              <InstitutionalLegalComplianceRiskGovernanceWorkspace />
            )}

            {(activeRoute === 'institutional_strategy_planning_performance' || activeTab === 'institutional_strategy_planning_performance' || activeRoute === 'nav_institutional_strategy_planning_performance') && (
              <InstitutionalStrategyPlanningPerformanceWorkspace />
            )}

            {(activeRoute === 'institutional_digital_transformation_technology_operations' || activeTab === 'institutional_digital_transformation_technology_operations' || activeRoute === 'nav_institutional_digital_transformation_technology_operations' || activeTab === 'nav_tech_command_center' || activeRoute === 'nav_tech_command_center') && (
              <InstitutionalDigitalTransformationTechnologyOperationsWorkspace />
            )}

            {(activeRoute === 'institutional_data_governance_records_privacy_digital_trust' || activeTab === 'institutional_data_governance_records_privacy_digital_trust' || activeRoute === 'nav_institutional_data_governance_records_privacy_digital_trust' || activeTab === 'nav_datagov_command_center' || activeRoute === 'nav_datagov_command_center') && (
              <InstitutionalDataGovernanceRecordsPrivacyDigitalTrustWorkspace />
            )}

            {(activeRoute === 'institutional_it_service_management' || activeTab === 'institutional_it_service_management' || activeRoute === 'nav_institutional_it_service_management' || activeTab === 'nav_itsm_command_center' || activeRoute === 'nav_itsm_command_center') && (
              <InstitutionalITServiceManagementWorkspace />
            )}

            {(activeRoute === 'institutional_cybersecurity_identity_ops' || activeTab === 'institutional_cybersecurity_identity_ops' || activeRoute === 'nav_secops_dashboard' || activeTab === 'nav_secops_dashboard') && (
              <InstitutionalCybersecurityIdentitySecurityOperationsWorkspace />
            )}

          </RouteGuard>


        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('my_school');

  return (
    <NotificationProvider>
      <TenantProvider>
        <AuthProvider>
          <NavigationProvider currentTab={currentTab} onSelectTab={setCurrentTab}>
            <AppContent />
          </NavigationProvider>
        </AuthProvider>
      </TenantProvider>
    </NotificationProvider>
  );
}
