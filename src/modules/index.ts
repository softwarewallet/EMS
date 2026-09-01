import { ModuleEngine } from '../core/modules/ModuleEngine';
import { AdmissionsModule } from './admissions/AdmissionsModule';
import { AttendanceModule } from './attendance/AttendanceModule';
import { StudentModule } from './student/StudentModule';
import { StudentExitModule } from './studentExit/StudentExitModule';
import { CertificateModule } from './certificate/CertificateModule';
import { TimetableModule } from './timetable/TimetableModule';
import { FinanceModule } from './finance/FinanceModule';
import { TransportModule } from './transport/TransportModule';
import { HostelModule } from './hostel/HostelModule';
import { StudentSupportModule } from './studentSupport/StudentSupportModule';
import { CommunicationModule } from './communication/CommunicationModule';
import { LibraryModule } from './library/LibraryModule';
import { StaffModule } from './staff/StaffModule';
import { ProcurementModule } from './procurement/ProcurementModule';
import { InventoryModule } from './inventory/InventoryModule';
import { AssetModule } from './asset/AssetModule';
import { AlumniPlacementModule } from './alumniPlacement/AlumniPlacementModule';
import { LearningModule } from './learning/LearningModule';
import { ResearchModule } from './research/ResearchModule';
import { GovernanceModule } from './governance/GovernanceModule';
import { AccessGovernanceModule } from './accessGovernance/AccessGovernanceModule';
import { PrivacyGovernanceModule } from './privacyGovernance/PrivacyGovernanceModule';
import { StakeholderGovernanceModule } from './stakeholderGovernance/StakeholderGovernanceModule';
import { InstitutionalPerformanceModule } from './institutionalPerformance/InstitutionalPerformanceModule';
import { InstitutionalCommunicationModule } from './institutionalCommunication/InstitutionalCommunicationModule';
import { InstitutionalRiskModule } from './institutionalRisk/InstitutionalRiskModule';
import { SchedulingModule } from './scheduling/SchedulingModule';
import { StudentSuccessModule } from './studentSuccess/StudentSuccessModule';
import { DataGovernanceModule } from "./dataGovernance/DataGovernanceModule";
import { QualityExecutionModule } from './qualityExecution/QualityExecutionModule';
import { AccreditationReviewModule } from './accreditationReview/AccreditationReviewModule';
import { InstitutionalAnalyticsModule } from './institutionalAnalytics/InstitutionalAnalyticsModule';
import { WorkflowGovernanceModule } from './workflowGovernance/WorkflowGovernanceModule';
import { KnowledgeGovernanceModule } from './knowledgeGovernance/KnowledgeGovernanceModule';
import { ResearchInnovationGovernanceModule } from './researchInnovationGovernance/ResearchInnovationGovernanceModule';
import { HumanCapitalGovernanceModule } from './humanCapitalGovernance/HumanCapitalGovernanceModule';
import { FinancialGovernanceModule } from './financialGovernance/FinancialGovernanceModule';
import { ProcurementGovernanceModule } from './procurementGovernance/ProcurementGovernanceModule';
import { ContractGovernanceModule } from './contractGovernance/ContractGovernanceModule';
import { AssetFacilitiesGovernanceModule } from './assetFacilitiesGovernance/AssetFacilitiesGovernanceModule';
import { SafetyEhsGovernanceModule } from './safetyEhsGovernance/SafetyEhsGovernanceModule';
import { QualityAssuranceGovernanceModule } from './qualityAssuranceGovernance/QualityAssuranceGovernanceModule';
import { StudentSuccessGovernanceModule } from './studentSuccessGovernance/StudentSuccessGovernanceModule';
import { CommunityEngagementGovernanceModule } from './communityEngagementGovernance/CommunityEngagementGovernanceModule';
import { InternationalizationGovernanceModule } from './internationalizationGovernance/InternationalizationGovernanceModule';
import { InternationalizationGlobalMobilityModule } from './internationalizationGlobalMobility/InternationalizationGlobalMobilityModule';
import { InstitutionalAdvancementDevelopmentModule } from './institutionalAdvancementDevelopment/InstitutionalAdvancementDevelopmentModule';
import { DigitalTechnologyGovernanceModule } from './digitalTechnologyGovernance/DigitalTechnologyGovernanceModule';
import { CyberSecurityPrivacyGovernanceModule } from './cyberSecurityPrivacyGovernance/CyberSecurityPrivacyGovernanceModule';
import { BusinessContinuityResilienceGovernanceModule } from './businessContinuityResilienceGovernance/BusinessContinuityResilienceGovernanceModule';
import { EnterpriseRiskGovernanceModule } from './enterpriseRiskGovernance/EnterpriseRiskGovernanceModule';
import { InstitutionalPerformanceGovernanceModule } from './institutionalPerformanceGovernance/InstitutionalPerformanceGovernanceModule';
import { InstitutionalAnalyticsGovernanceModule } from './institutionalAnalyticsGovernance/InstitutionalAnalyticsGovernanceModule';
import { AuditAssuranceGovernanceModule } from './auditAssuranceGovernance/AuditAssuranceGovernanceModule';
import { IntegrationGovernanceModule } from './integrationGovernance/IntegrationGovernanceModule';
import { AutomationGovernanceModule } from './automationGovernance/AutomationGovernanceModule';
import { ResourcePlanningModule } from './resourcePlanning/ResourcePlanningModule';
import { EnterprisePortfolioModule } from './enterprisePortfolio/EnterprisePortfolioModule';
import { ITServiceManagementModule } from './itServiceManagement/ITServiceManagementModule';
import { CybersecurityOperationsModule } from './cybersecurityOperations/CybersecurityOperationsModule';
import { AIGovernanceModule } from './aiGovernance/AIGovernanceModule';
import { CrisisResilienceModule } from './crisisResilience/CrisisResilienceModule';
import { ComplianceAssuranceModule } from './complianceAssurance/ComplianceAssuranceModule';
import { InstitutionalGovernanceModule } from './institutionalGovernance/InstitutionalGovernanceModule';
import { InstitutionalPerformanceAssuranceModule } from './institutionalPerformanceAssurance/InstitutionalPerformanceAssuranceModule';
import { EnterpriseWorkflowOrchestrationModule } from './enterpriseWorkflowOrchestration/EnterpriseWorkflowOrchestrationModule';
import { EnterpriseCaseGovernanceModule } from './enterpriseCaseGovernance/EnterpriseCaseGovernanceModule';
import { DocumentRecordsGovernanceModule } from './documentRecordsGovernance/DocumentRecordsGovernanceModule';
import { EnterpriseCommunicationGovernanceModule } from './enterpriseCommunicationGovernance/EnterpriseCommunicationGovernanceModule';
import { EnterpriseDataIntegrationGovernanceModule } from './enterpriseDataIntegrationGovernance/EnterpriseDataIntegrationGovernanceModule';
import { EnterpriseEventAutomationGovernanceModule } from './enterpriseEventAutomationGovernance/EnterpriseEventAutomationGovernanceModule';
import { EnterpriseIntegrationGovernanceModule } from './enterpriseIntegrationGovernance/EnterpriseIntegrationGovernanceModule';
import { DecisionIntelligenceGovernanceModule } from './decisionIntelligenceGovernance/DecisionIntelligenceGovernanceModule';
import { DataIntelligenceTrustGovernanceModule } from './dataIntelligenceTrustGovernance/DataIntelligenceTrustGovernanceModule';
import { KnowledgeIntelligenceGovernanceModule } from './knowledgeIntelligenceGovernance/KnowledgeIntelligenceGovernanceModule';
import { PlanningBudgetResourceGovernanceModule } from './planningBudgetResourceGovernance/PlanningBudgetResourceGovernanceModule';
import { ProcessExcellenceGovernanceModule } from './processExcellenceGovernance/ProcessExcellenceGovernanceModule';
import { EMSCoreReadinessModule } from './emsCoreReadiness/EMSCoreReadinessModule';
import { InstitutionalAdministrationModule } from './institutionalAdministration/InstitutionalAdministrationModule';
import { AcademicManagementModule } from './academicManagement/AcademicManagementModule';
import { AdmissionsEnrollmentModule } from './admissionsEnrollment/AdmissionsEnrollmentModule';
import { StudentLifecycleModule } from './studentLifecycle/StudentLifecycleModule';
import { StudentAcademicOperationsModule } from './studentAcademicOperations/StudentAcademicOperationsModule';
import { AssessmentExaminationModule } from './assessmentExamination/AssessmentExaminationModule';
import { ResultsTranscriptCertificationModule } from './resultsTranscriptCertification/ResultsTranscriptCertificationModule';
import { GraduationDegreeAlumniCredentialModule } from './graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialModule';
import { InstitutionalLifecycleIntegrationModule } from './institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationModule';
import { HumanResourcesWorkforceModule } from './humanResourcesWorkforce/HumanResourcesWorkforceModule';
import { InstitutionalFinanceOperationsModule } from './institutionalFinanceOperations/InstitutionalFinanceOperationsModule';
import { InstitutionalProcurementOperationsModule } from './institutionalProcurementOperations/InstitutionalProcurementOperationsModule';
import { AssetsInventoryFacilitiesModule } from './assetsInventoryFacilities/AssetsInventoryFacilitiesModule';
import { FacilitiesSpaceSafetyOperationsModule } from './facilitiesSpaceSafetyOperations/FacilitiesSpaceSafetyOperationsModule';
import { TransportFleetMobilityModule } from './transportFleetMobility/TransportFleetMobilityModule';
import { InventoryAssetsStoresMaterialsModule } from './inventoryAssetsStoresMaterials/InventoryAssetsStoresMaterialsModule';
import { LibraryLearningResourcesModule } from './libraryLearningResources/LibraryLearningResourcesModule';
import { ResearchGrantsProjectsInnovationModule } from './researchGrantsProjectsInnovation/ResearchGrantsProjectsInnovationModule';
import { LibraryKnowledgeInformationServicesModule } from './libraryKnowledgeInformationServices/LibraryKnowledgeInformationServicesModule';
import { InstitutionalCommunicationsModule } from './institutionalCommunications/InstitutionalCommunicationsModule';
import { InstitutionalSecuritySafetyContinuityModule } from './institutionalSecuritySafetyContinuity/InstitutionalSecuritySafetyContinuityModule';
import { StudentServicesSupportModule } from './studentServicesSupport/StudentServicesSupportModule';

export function registerAllModules() {
  try {
    ModuleEngine.register(StudentServicesSupportModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalSecuritySafetyContinuityModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalCommunicationsModule);
  } catch (err) {}
  try {
    ModuleEngine.register(LibraryKnowledgeInformationServicesModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ResearchGrantsProjectsInnovationModule);
  } catch (err) {}
  try {
    ModuleEngine.register(LibraryLearningResourcesModule);
  } catch (err) {}

  try {
    ModuleEngine.register(StudentLifecycleModule);
  } catch (err) {}

  try {
    ModuleEngine.register(StudentAcademicOperationsModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AssessmentExaminationModule);
  } catch (err) {}

  try {
    ModuleEngine.register(ResultsTranscriptCertificationModule);
  } catch (err) {}

  try {
    ModuleEngine.register(GraduationDegreeAlumniCredentialModule);
  } catch (err) {}

  try {
    ModuleEngine.register(InstitutionalLifecycleIntegrationModule);
  } catch (err) {}

  try {
    ModuleEngine.register(HumanResourcesWorkforceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(InstitutionalFinanceOperationsModule);
  } catch (err) {}

  try {
    ModuleEngine.register(InstitutionalProcurementOperationsModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AssetsInventoryFacilitiesModule);
  } catch (err) {}

  try {
    ModuleEngine.register(FacilitiesSpaceSafetyOperationsModule);
  } catch (err) {}

  try {
    ModuleEngine.register(TransportFleetMobilityModule);
  } catch (err) {}

  try {
    ModuleEngine.register(InventoryAssetsStoresMaterialsModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AdmissionsEnrollmentModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AcademicManagementModule);
  } catch (err) {}

  try {
    ModuleEngine.register(InstitutionalAdministrationModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EMSCoreReadinessModule);
  } catch (err) {}

  try {
    ModuleEngine.register(ProcessExcellenceGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(PlanningBudgetResourceGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(DecisionIntelligenceGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(DataIntelligenceTrustGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(KnowledgeIntelligenceGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AccessGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EnterpriseWorkflowOrchestrationModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EnterpriseCaseGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(DocumentRecordsGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EnterpriseCommunicationGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EnterpriseDataIntegrationGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EnterpriseEventAutomationGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(EnterpriseIntegrationGovernanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(StudentModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AdmissionsModule);
  } catch (err) {}

  try {
    ModuleEngine.register(AttendanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(StudentExitModule);
  } catch (err) {}

  try {
    ModuleEngine.register(CertificateModule);
  } catch (err) {}

  try {
    ModuleEngine.register(TimetableModule);
  } catch (err) {}

  try {
    ModuleEngine.register(FinanceModule);
  } catch (err) {}

  try {
    ModuleEngine.register(TransportModule);
  } catch (err) {}

  try {
    ModuleEngine.register(HostelModule);
  } catch (err) {}

  try {
    ModuleEngine.register(StudentSupportModule);
  } catch (err) {}

  try {
    ModuleEngine.register(CommunicationModule);
  } catch (err) {}

  try {
    ModuleEngine.register(LibraryModule);
  } catch (err) {}

  try {
    ModuleEngine.register(StaffModule);
  } catch (err) {}

  try {
    ModuleEngine.register(ProcurementModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InventoryModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AssetModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AlumniPlacementModule);
  } catch (err) {}
  try {
    ModuleEngine.register(LearningModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ResearchModule);
  } catch (err) {}
  try {
    ModuleEngine.register(GovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(PrivacyGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalPerformanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalCommunicationModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalRiskModule);
  } catch (err) {}
  try {
    ModuleEngine.register(SchedulingModule);
  } catch (err) {}
  try {
    ModuleEngine.register(StudentSuccessModule);
  } catch (err) {}
  try {
    ModuleEngine.register(QualityExecutionModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AccreditationReviewModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalAnalyticsModule);
  } catch (err) {}
  try {
    ModuleEngine.register(WorkflowGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(KnowledgeGovernanceModule);
  try {
    ModuleEngine.register(DataGovernanceModule);
  } catch (err) {}
  } catch (err) {}
  try {
    ModuleEngine.register(IntegrationGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AutomationGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ResourcePlanningModule);
  } catch (err) {}
  try {
    ModuleEngine.register(EnterprisePortfolioModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ITServiceManagementModule);
  } catch (err) {}
  try {
    ModuleEngine.register(CybersecurityOperationsModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AIGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(CrisisResilienceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ComplianceAssuranceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalPerformanceAssuranceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ResearchInnovationGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(HumanCapitalGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(FinancialGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ProcurementGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(ContractGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AssetFacilitiesGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(SafetyEhsGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(QualityAssuranceGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(StudentSuccessGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(CommunityEngagementGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InternationalizationGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InternationalizationGlobalMobilityModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalAdvancementDevelopmentModule);
  } catch (err) {}
  try {
    ModuleEngine.register(DigitalTechnologyGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(CyberSecurityPrivacyGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(BusinessContinuityResilienceGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(EnterpriseRiskGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(AuditAssuranceGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalPerformanceGovernanceModule);
  } catch (err) {}
  try {
    ModuleEngine.register(InstitutionalAnalyticsGovernanceModule);
  } catch (err) {}
}

// Auto-run module registration on import
registerAllModules();

export {
  AssetFacilitiesGovernanceModule,
  SafetyEhsGovernanceModule,
  QualityAssuranceGovernanceModule,
  StudentSuccessGovernanceModule,
  CommunityEngagementGovernanceModule,
  InternationalizationGovernanceModule,
  InternationalizationGlobalMobilityModule,
  InstitutionalAdvancementDevelopmentModule,
  DigitalTechnologyGovernanceModule,
  CyberSecurityPrivacyGovernanceModule,
  BusinessContinuityResilienceGovernanceModule,
  EnterpriseRiskGovernanceModule,
  AuditAssuranceGovernanceModule
};
