import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { UserActor } from '../types/inventory';
import {
  ResearchProfile,
  ResearchProject,
  ResearchProjectStatus,
  ResearchProposal,
  ResearchProposalVersion,
  ResearchProposalStatus,
  ResearchTeamMember,
  ResearchMilestone,
  MilestoneStatus,
  ResearchFundingReference,
  ResearchApproval,
  ResearchReview,
  ResearchOutput,
  ResearchPublication,
  ResearchDatasetReference,
  ResearchIntellectualProperty,
  IPLifecycleStage,
  InnovationInitiative,
  InnovationStage,
  InstitutionalProject,
  InstitutionalProjectStatus,
  ProjectMilestone,
  ProjectTask,
  ProjectTaskStatus,
  ProjectRisk,
  RiskSeverity,
  ProjectIssue,
  ProjectIssueStatus,
  ProjectDecision,
  ProjectDocument,
  ProjectReview,
  ResearchKnowledgeAsset,
  ResearchEthicsReference,
  ResearchAnalyticsCache,
  FilterResearchParams
} from '../types/research';
import { where } from 'firebase/firestore';

const RESEARCH_PROFILES_COL = 'research_profiles';
const RESEARCH_PROJECTS_COL = 'research_projects';
const RESEARCH_PROPOSALS_COL = 'research_proposals';
const RESEARCH_PROPOSAL_VERSIONS_COL = 'research_proposal_versions';
const RESEARCH_TEAM_COL = 'research_team_members';
const RESEARCH_MILESTONES_COL = 'research_milestones';
const RESEARCH_FUNDING_COL = 'research_funding_references';
const RESEARCH_APPROVALS_COL = 'research_approvals';
const RESEARCH_REVIEWS_COL = 'research_reviews';
const RESEARCH_OUTPUTS_COL = 'research_outputs';
const RESEARCH_PUBLICATIONS_COL = 'research_publications';
const RESEARCH_DATASETS_COL = 'research_dataset_references';
const RESEARCH_IP_COL = 'research_ip_records';
const INNOVATION_INITIATIVES_COL = 'innovation_initiatives';
const INSTITUTIONAL_PROJECTS_COL = 'institutional_projects';
const PROJECT_MILESTONES_COL = 'project_milestones';
const PROJECT_TASKS_COL = 'project_tasks';
const PROJECT_RISKS_COL = 'project_risks';
const PROJECT_ISSUES_COL = 'project_issues';
const PROJECT_DECISIONS_COL = 'project_decisions';
const PROJECT_DOCUMENTS_COL = 'project_documents';
const PROJECT_REVIEWS_COL = 'project_reviews';
const KNOWLEDGE_ASSETS_COL = 'research_knowledge_assets';
const ETHICS_REFERENCES_COL = 'research_ethics_references';
const RESEARCH_ANALYTICS_CACHE_COL = 'research_analytics_cache';

export class ResearchService {

  // ==========================================
  // RESEARCH PROFILES
  // ==========================================

  static async getProfiles(tenantId: string, departmentId?: string): Promise<ResearchProfile[]> {
    const constraints: any[] = [];
    if (departmentId) {
      constraints.push(where('departmentId', '==', departmentId));
    }
    return await FirebaseService.getTenantCollection<ResearchProfile>(RESEARCH_PROFILES_COL, tenantId, constraints);
  }

  static async getProfileByStaffId(tenantId: string, staffOrTeacherId: string): Promise<ResearchProfile | null> {
    const profiles = await FirebaseService.getTenantCollection<ResearchProfile>(RESEARCH_PROFILES_COL, tenantId, [
      where('staffOrTeacherId', '==', staffOrTeacherId)
    ]);
    return profiles.length > 0 ? profiles[0] : null;
  }

  static async upsertProfile(tenantId: string, data: Omit<ResearchProfile, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ResearchProfile> {
    const existing = await this.getProfileByStaffId(tenantId, data.staffOrTeacherId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: ResearchProfile = {
        ...existing,
        ...data,
        updatedAt: now,
        updatedBy: actor.id
      };
      await FirebaseService.setDocument(RESEARCH_PROFILES_COL, existing.id, updated);
      return updated;
    } else {
      const profileId = FirebaseService.generateId('rsch_prf');
      const newProfile: ResearchProfile = {
        ...data,
        id: profileId,
        tenantId,
        totalPublications: data.totalPublications || 0,
        activeProjectsCount: data.activeProjectsCount || 0,
        createdAt: now,
        createdBy: actor.id,
        updatedAt: now,
        updatedBy: actor.id
      };
      await FirebaseService.setDocument(RESEARCH_PROFILES_COL, profileId, newProfile);
      return newProfile;
    }
  }

  // ==========================================
  // RESEARCH PROJECTS
  // ==========================================

  static async getProjects(tenantId: string, filter?: FilterResearchParams): Promise<ResearchProject[]> {
    const constraints: any[] = [];
    if (filter?.departmentId) {
      constraints.push(where('departmentId', '==', filter.departmentId));
    }
    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }
    if (filter?.principalInvestigatorId) {
      constraints.push(where('principalInvestigatorId', '==', filter.principalInvestigatorId));
    }

    const projects = await FirebaseService.getTenantCollection<ResearchProject>(RESEARCH_PROJECTS_COL, tenantId, constraints);
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      return projects.filter(p => p.title.toLowerCase().includes(q) || p.projectCode.toLowerCase().includes(q));
    }
    return projects;
  }

  static async getProjectById(tenantId: string, projectId: string): Promise<ResearchProject | null> {
    const doc = await FirebaseService.getDocument<ResearchProject>(RESEARCH_PROJECTS_COL, projectId);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  static async createProject(tenantId: string, data: Omit<ResearchProject, 'id' | 'tenantId' | 'projectCode' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ResearchProject> {
    const projectId = FirebaseService.generateId('rsch_prj');
    const projectCode = `RP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const sanitizedBudget = Math.max(0, Number(data.budgetAmount) || 0);

    const newProject: ResearchProject = {
      ...data,
      budgetAmount: sanitizedBudget,
      id: projectId,
      tenantId,
      projectCode,
      status: 'DRAFT',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PROJECTS_COL, projectId, newProject);

    // Add PI as team member
    await this.addTeamMember(tenantId, {
      projectId,
      memberId: data.principalInvestigatorId,
      memberName: data.principalInvestigatorName,
      memberType: 'STAFF',
      role: 'PRINCIPAL_INVESTIGATOR',
      startDate: now.split('T')[0],
      isActive: true
    }, actor);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_PROJECT_CREATED' as any,
      targetResource: 'research_project',
      targetId: projectId,
      details: { projectCode, title: newProject.title }
    });

    return newProject;
  }

  static async updateProjectStatus(tenantId: string, projectId: string, newStatus: ResearchProjectStatus, actor: UserActor, notes?: string): Promise<ResearchProject> {
    const project = await this.getProjectById(tenantId, projectId);
    if (!project) throw new Error('Research project not found or cross-tenant access denied.');

    // Valid state transitions
    const validTransitions: Record<ResearchProjectStatus, ResearchProjectStatus[]> = {
      DRAFT: ['SUBMITTED', 'ARCHIVED'],
      SUBMITTED: ['UNDER_REVIEW', 'APPROVED', 'DRAFT'],
      UNDER_REVIEW: ['APPROVED', 'DRAFT', 'ARCHIVED'],
      APPROVED: ['ACTIVE', 'ON_HOLD', 'CLOSED'],
      ACTIVE: ['ON_HOLD', 'COMPLETED', 'CLOSED'],
      ON_HOLD: ['ACTIVE', 'CLOSED'],
      COMPLETED: ['CLOSED', 'ARCHIVED'],
      CLOSED: ['ARCHIVED'],
      ARCHIVED: []
    };

    if (!validTransitions[project.status].includes(newStatus)) {
      throw new Error(`Invalid project state transition from ${project.status} to ${newStatus}.`);
    }

    // Separation of Duties / Self-approval check
    if (newStatus === 'APPROVED' && (actor.id === project.principalInvestigatorId || actor.id === project.createdBy)) {
      throw new Error('Self-approval violation: Principal Investigator or Project Creator cannot approve their own research project.');
    }

    const now = new Date().toISOString();
    const updated: ResearchProject = {
      ...project,
      status: newStatus,
      actualCompletionDate: newStatus === 'COMPLETED' ? now.split('T')[0] : project.actualCompletionDate,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PROJECTS_COL, projectId, updated);

    let auditAction = 'RESEARCH_PROJECT_CREATED';
    if (newStatus === 'SUBMITTED') auditAction = 'RESEARCH_PROJECT_SUBMITTED';
    if (newStatus === 'APPROVED') auditAction = 'RESEARCH_PROJECT_APPROVED';
    if (newStatus === 'COMPLETED') auditAction = 'RESEARCH_PROJECT_COMPLETED';

    await AuditService.log({
      tenantId,
      campusId: project.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: auditAction as any,
      targetResource: 'research_project',
      targetId: projectId,
      details: { fromStatus: project.status, toStatus: newStatus, notes }
    });

    return updated;
  }

  // ==========================================
  // RESEARCH PROPOSALS & VERSIONS
  // ==========================================

  static async getProposals(tenantId: string, departmentId?: string): Promise<ResearchProposal[]> {
    const constraints: any[] = [];
    if (departmentId) {
      constraints.push(where('departmentId', '==', departmentId));
    }
    return await FirebaseService.getTenantCollection<ResearchProposal>(RESEARCH_PROPOSALS_COL, tenantId, constraints);
  }

  static async createProposal(tenantId: string, data: Omit<ResearchProposal, 'id' | 'tenantId' | 'proposalCode' | 'currentVersionNumber' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, fullProposalText: string, methodologyOverview: string, actor: UserActor): Promise<ResearchProposal> {
    const proposalId = FirebaseService.generateId('rsch_prp');
    const proposalCode = `PROP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const sanitizedRequestedFunding = Math.max(0, Number(data.requestedFundingAmount) || 0);

    const proposal: ResearchProposal = {
      ...data,
      requestedFundingAmount: sanitizedRequestedFunding,
      id: proposalId,
      tenantId,
      proposalCode,
      currentVersionNumber: 1,
      status: 'DRAFT',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PROPOSALS_COL, proposalId, proposal);

    // Create Initial Version 1 Record
    const versionId = FirebaseService.generateId('prp_ver');
    const versionRecord: ResearchProposalVersion = {
      id: versionId,
      tenantId,
      proposalId,
      versionNumber: 1,
      title: data.title,
      fullProposalText,
      methodologyOverview,
      expectedDeliverables: [],
      status: 'DRAFT',
      createdAt: now,
      createdBy: actor.id
    };
    await FirebaseService.setDocument(RESEARCH_PROPOSAL_VERSIONS_COL, versionId, versionRecord);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_PROPOSAL_CREATED' as any,
      targetResource: 'research_proposal',
      targetId: proposalId,
      details: { proposalCode, title: proposal.title }
    });

    return proposal;
  }

  static async createProposalVersion(tenantId: string, proposalId: string, fullProposalText: string, methodologyOverview: string, expectedDeliverables: string[], actor: UserActor): Promise<ResearchProposalVersion> {
    const proposal = await FirebaseService.getDocument<ResearchProposal>(RESEARCH_PROPOSALS_COL, proposalId);
    if (!proposal || proposal.tenantId !== tenantId) throw new Error('Proposal not found or cross-tenant access denied.');

    if (proposal.status === 'UNDER_REVIEW') {
      throw new Error('Cannot create a new version while proposal is currently under review.');
    }

    const newVersionNum = proposal.currentVersionNumber + 1;
    const now = new Date().toISOString();
    const versionId = FirebaseService.generateId('prp_ver');

    const newVersion: ResearchProposalVersion = {
      id: versionId,
      tenantId,
      proposalId,
      versionNumber: newVersionNum,
      title: proposal.title,
      fullProposalText,
      methodologyOverview,
      expectedDeliverables,
      status: 'DRAFT',
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PROPOSAL_VERSIONS_COL, versionId, newVersion);

    await FirebaseService.setDocument(RESEARCH_PROPOSALS_COL, proposalId, {
      ...proposal,
      currentVersionNumber: newVersionNum,
      status: 'DRAFT',
      updatedAt: now,
      updatedBy: actor.id
    });

    return newVersion;
  }

  static async submitProposal(tenantId: string, proposalId: string, actor: UserActor): Promise<ResearchProposal> {
    const proposal = await FirebaseService.getDocument<ResearchProposal>(RESEARCH_PROPOSALS_COL, proposalId);
    if (!proposal || proposal.tenantId !== tenantId) throw new Error('Proposal not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const updated: ResearchProposal = {
      ...proposal,
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PROPOSALS_COL, proposalId, updated);

    await AuditService.log({
      tenantId,
      campusId: proposal.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_PROPOSAL_SUBMITTED' as any,
      targetResource: 'research_proposal',
      targetId: proposalId,
      details: { title: proposal.title }
    });

    return updated;
  }

  static async approveProposal(tenantId: string, proposalId: string, comments: string, actor: UserActor): Promise<ResearchProposal> {
    const proposal = await FirebaseService.getDocument<ResearchProposal>(RESEARCH_PROPOSALS_COL, proposalId);
    if (!proposal || proposal.tenantId !== tenantId) throw new Error('Proposal not found or cross-tenant access denied.');

    // Separation of duties / self approval check
    if (actor.id === proposal.principalInvestigatorId || actor.id === proposal.createdBy) {
      throw new Error('Self-approval violation: Proposal creator or PI cannot approve their own proposal.');
    }

    const now = new Date().toISOString();
    const updated: ResearchProposal = {
      ...proposal,
      status: 'APPROVED',
      approvedAt: now,
      approvedById: actor.id,
      approvedByName: actor.displayName,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PROPOSALS_COL, proposalId, updated);

    // Record formal approval entry
    const approvalId = FirebaseService.generateId('rsch_appr');
    const approval: ResearchApproval = {
      id: approvalId,
      tenantId,
      campusId: proposal.campusId,
      targetType: 'PROPOSAL',
      targetId: proposalId,
      approverId: actor.id,
      approverName: actor.displayName,
      approverRole: actor.role || 'RESEARCH_DIRECTOR',
      action: 'APPROVED',
      comments,
      approvedAt: now
    };
    await FirebaseService.setDocument(RESEARCH_APPROVALS_COL, approvalId, approval);

    await AuditService.log({
      tenantId,
      campusId: proposal.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_PROPOSAL_APPROVED' as any,
      targetResource: 'research_proposal',
      targetId: proposalId,
      details: { comments }
    });

    return updated;
  }

  // ==========================================
  // RESEARCH TEAM MEMBERS
  // ==========================================

  static async getTeamMembers(tenantId: string, projectId: string): Promise<ResearchTeamMember[]> {
    return await FirebaseService.getTenantCollection<ResearchTeamMember>(RESEARCH_TEAM_COL, tenantId, [
      where('projectId', '==', projectId)
    ]);
  }

  static async addTeamMember(tenantId: string, data: Omit<ResearchTeamMember, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>, actor: UserActor): Promise<ResearchTeamMember> {
    const project = await this.getProjectById(tenantId, data.projectId);
    if (!project) throw new Error('Research project not found or cross-tenant access denied.');

    const memberId = FirebaseService.generateId('rsch_tm');
    const now = new Date().toISOString();

    const member: ResearchTeamMember = {
      ...data,
      id: memberId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_TEAM_COL, memberId, member);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_TEAM_UPDATED' as any,
      targetResource: 'research_team_member',
      targetId: memberId,
      details: { memberName: data.memberName, role: data.role }
    });

    return member;
  }

  // ==========================================
  // MILESTONES
  // ==========================================

  static async getMilestones(tenantId: string, projectId: string): Promise<ResearchMilestone[]> {
    return await FirebaseService.getTenantCollection<ResearchMilestone>(RESEARCH_MILESTONES_COL, tenantId, [
      where('projectId', '==', projectId)
    ]);
  }

  static async createMilestone(tenantId: string, data: Omit<ResearchMilestone, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ResearchMilestone> {
    const project = await this.getProjectById(tenantId, data.projectId);
    if (!project) throw new Error('Research project not found or cross-tenant access denied.');

    const milestoneId = FirebaseService.generateId('rsch_mls');
    const now = new Date().toISOString();
    const sanitizedCompletion = Math.min(100, Math.max(0, Number(data.completionPercentage) || 0));

    const milestone: ResearchMilestone = {
      ...data,
      completionPercentage: sanitizedCompletion,
      id: milestoneId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_MILESTONES_COL, milestoneId, milestone);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_MILESTONE_UPDATED' as any,
      targetResource: 'research_milestone',
      targetId: milestoneId,
      details: { title: milestone.title, status: milestone.status }
    });

    return milestone;
  }

  static async updateMilestoneStatus(tenantId: string, milestoneId: string, status: MilestoneStatus, completionPercentage: number, actor: UserActor): Promise<ResearchMilestone> {
    const milestone = await FirebaseService.getDocument<ResearchMilestone>(RESEARCH_MILESTONES_COL, milestoneId);
    if (!milestone || milestone.tenantId !== tenantId) throw new Error('Milestone not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const sanitizedCompletion = Math.min(100, Math.max(0, Number(completionPercentage) || 0));

    const updated: ResearchMilestone = {
      ...milestone,
      status,
      completionPercentage: sanitizedCompletion,
      actualEnd: status === 'COMPLETED' ? now.split('T')[0] : milestone.actualEnd,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_MILESTONES_COL, milestoneId, updated);

    await AuditService.log({
      tenantId,
      campusId: milestone.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_MILESTONE_UPDATED' as any,
      targetResource: 'research_milestone',
      targetId: milestoneId,
      details: { title: milestone.title, status, completionPercentage }
    });

    return updated;
  }

  // ==========================================
  // FUNDING & ETHICS REFERENCES
  // ==========================================

  static async getFundingReferences(tenantId: string, projectId?: string): Promise<ResearchFundingReference[]> {
    const constraints: any[] = [];
    if (projectId) {
      constraints.push(where('projectId', '==', projectId));
    }
    return await FirebaseService.getTenantCollection<ResearchFundingReference>(RESEARCH_FUNDING_COL, tenantId, constraints);
  }

  static async createFundingReference(tenantId: string, data: Omit<ResearchFundingReference, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ResearchFundingReference> {
    const fundingId = FirebaseService.generateId('rsch_fnd');
    const now = new Date().toISOString();

    const funding: ResearchFundingReference = {
      ...data,
      id: fundingId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_FUNDING_COL, fundingId, funding);
    return funding;
  }

  static async getEthicsReference(tenantId: string, projectId: string): Promise<ResearchEthicsReference | null> {
    const refs = await FirebaseService.getTenantCollection<ResearchEthicsReference>(ETHICS_REFERENCES_COL, tenantId, [
      where('projectId', '==', projectId)
    ]);
    return refs.length > 0 ? refs[0] : null;
  }

  static async upsertEthicsReference(tenantId: string, data: Omit<ResearchEthicsReference, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>, actor: UserActor): Promise<ResearchEthicsReference> {
    const existing = await this.getEthicsReference(tenantId, data.projectId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: ResearchEthicsReference = {
        ...existing,
        ...data
      };
      await FirebaseService.setDocument(ETHICS_REFERENCES_COL, existing.id, updated);
      return updated;
    } else {
      const ethicsId = FirebaseService.generateId('rsch_eth');
      const newRef: ResearchEthicsReference = {
        ...data,
        id: ethicsId,
        tenantId,
        createdAt: now,
        createdBy: actor.id
      };
      await FirebaseService.setDocument(ETHICS_REFERENCES_COL, ethicsId, newRef);
      return newRef;
    }
  }

  // ==========================================
  // OUTPUTS & PUBLICATIONS
  // ==========================================

  static async getOutputs(tenantId: string, projectId?: string): Promise<ResearchOutput[]> {
    const constraints: any[] = [];
    if (projectId) {
      constraints.push(where('projectId', '==', projectId));
    }
    return await FirebaseService.getTenantCollection<ResearchOutput>(RESEARCH_OUTPUTS_COL, tenantId, constraints);
  }

  static async createOutput(tenantId: string, data: Omit<ResearchOutput, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ResearchOutput> {
    const outputId = FirebaseService.generateId('rsch_out');
    const now = new Date().toISOString();

    const output: ResearchOutput = {
      ...data,
      id: outputId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_OUTPUTS_COL, outputId, output);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_OUTPUT_CREATED' as any,
      targetResource: 'research_output',
      targetId: outputId,
      details: { title: output.title, outputType: output.outputType }
    });

    return output;
  }

  static async getPublications(tenantId: string, projectId?: string): Promise<ResearchPublication[]> {
    const constraints: any[] = [];
    if (projectId) {
      constraints.push(where('projectId', '==', projectId));
    }
    return await FirebaseService.getTenantCollection<ResearchPublication>(RESEARCH_PUBLICATIONS_COL, tenantId, constraints);
  }

  static async registerPublication(tenantId: string, data: Omit<ResearchPublication, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>, actor: UserActor): Promise<ResearchPublication> {
    const pubId = FirebaseService.generateId('rsch_pub');
    const now = new Date().toISOString();

    const publication: ResearchPublication = {
      ...data,
      id: pubId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_PUBLICATIONS_COL, pubId, publication);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_PUBLICATION_REGISTERED' as any,
      targetResource: 'research_publication',
      targetId: pubId,
      details: { title: publication.title, journal: publication.journalOrConferenceName }
    });

    return publication;
  }

  // ==========================================
  // INTELLECTUAL PROPERTY & INNOVATION
  // ==========================================

  static async getIPRecords(tenantId: string): Promise<ResearchIntellectualProperty[]> {
    return await FirebaseService.getTenantCollection<ResearchIntellectualProperty>(RESEARCH_IP_COL, tenantId);
  }

  static async createIPRecord(tenantId: string, data: Omit<ResearchIntellectualProperty, 'id' | 'tenantId' | 'disclosureNumber' | 'stage' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ResearchIntellectualProperty> {
    const ipId = FirebaseService.generateId('rsch_ip');
    const disclosureNumber = `IP-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const ipRecord: ResearchIntellectualProperty = {
      ...data,
      id: ipId,
      tenantId,
      disclosureNumber,
      stage: 'DISCLOSED',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_IP_COL, ipId, ipRecord);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_IP_CREATED' as any,
      targetResource: 'research_ip',
      targetId: ipId,
      details: { disclosureNumber, title: ipRecord.title }
    });

    return ipRecord;
  }

  static async updateIPStage(tenantId: string, ipId: string, newStage: IPLifecycleStage, actor: UserActor): Promise<ResearchIntellectualProperty> {
    const ip = await FirebaseService.getDocument<ResearchIntellectualProperty>(RESEARCH_IP_COL, ipId);
    if (!ip || ip.tenantId !== tenantId) throw new Error('IP Record not found or cross-tenant access denied.');

    // Separation of Duties: Inventors cannot self-approve advanced IP stages
    if ((newStage === 'GRANTED' || newStage === 'FILED' || newStage === 'APPROVED') && ip.inventors?.some(inv => inv.inventorId === actor.id)) {
      throw new Error('Self-approval violation: Inventors cannot self-approve IP stage advancement.');
    }

    const now = new Date().toISOString();
    const updated: ResearchIntellectualProperty = {
      ...ip,
      stage: newStage,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(RESEARCH_IP_COL, ipId, updated);

    await AuditService.log({
      tenantId,
      campusId: ip.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RESEARCH_IP_APPROVED' as any,
      targetResource: 'research_ip',
      targetId: ipId,
      details: { fromStage: ip.stage, toStage: newStage }
    });

    return updated;
  }

  static async getInnovations(tenantId: string): Promise<InnovationInitiative[]> {
    return await FirebaseService.getTenantCollection<InnovationInitiative>(INNOVATION_INITIATIVES_COL, tenantId);
  }

  static async createInnovation(tenantId: string, data: Omit<InnovationInitiative, 'id' | 'tenantId' | 'stage' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<InnovationInitiative> {
    const invId = FirebaseService.generateId('rsch_inv');
    const now = new Date().toISOString();

    const innovation: InnovationInitiative = {
      ...data,
      id: invId,
      tenantId,
      stage: 'IDEA',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(INNOVATION_INITIATIVES_COL, invId, innovation);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INNOVATION_INITIATIVE_CREATED' as any,
      targetResource: 'innovation_initiative',
      targetId: invId,
      details: { title: innovation.title }
    });

    return innovation;
  }

  // ==========================================
  // INSTITUTIONAL PROJECTS, TASKS, RISKS, ISSUES
  // ==========================================

  static async getInstitutionalProjects(tenantId: string): Promise<InstitutionalProject[]> {
    return await FirebaseService.getTenantCollection<InstitutionalProject>(INSTITUTIONAL_PROJECTS_COL, tenantId);
  }

  static async createInstitutionalProject(tenantId: string, data: Omit<InstitutionalProject, 'id' | 'tenantId' | 'projectCode' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<InstitutionalProject> {
    const projId = FirebaseService.generateId('proj_inst');
    const projectCode = `INST-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const project: InstitutionalProject = {
      ...data,
      id: projId,
      tenantId,
      projectCode,
      status: 'APPROVED',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(INSTITUTIONAL_PROJECTS_COL, projId, project);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INSTITUTIONAL_PROJECT_CREATED' as any,
      targetResource: 'institutional_project',
      targetId: projId,
      details: { projectCode, title: project.title }
    });

    return project;
  }

  static async getTasks(tenantId: string, projectId: string): Promise<ProjectTask[]> {
    return await FirebaseService.getTenantCollection<ProjectTask>(PROJECT_TASKS_COL, tenantId, [
      where('projectId', '==', projectId)
    ]);
  }

  static async createTask(tenantId: string, data: Omit<ProjectTask, 'id' | 'tenantId' | 'status' | 'completionPercentage' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ProjectTask> {
    const taskId = FirebaseService.generateId('proj_tsk');
    const now = new Date().toISOString();

    const task: ProjectTask = {
      ...data,
      id: taskId,
      tenantId,
      status: 'TODO',
      completionPercentage: 0,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(PROJECT_TASKS_COL, taskId, task);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PROJECT_TASK_UPDATED' as any,
      targetResource: 'project_task',
      targetId: taskId,
      details: { title: task.title, status: task.status }
    });

    return task;
  }

  static async getRisks(tenantId: string, projectId: string): Promise<ProjectRisk[]> {
    return await FirebaseService.getTenantCollection<ProjectRisk>(PROJECT_RISKS_COL, tenantId, [
      where('projectId', '==', projectId)
    ]);
  }

  static async createRisk(tenantId: string, data: Omit<ProjectRisk, 'id' | 'tenantId' | 'severityScore' | 'severityLevel' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ProjectRisk> {
    const project = await this.getProjectById(tenantId, data.projectId);
    if (!project) throw new Error('Research project not found or cross-tenant access denied.');

    const riskId = FirebaseService.generateId('proj_rsk');
    const probability = Math.min(5, Math.max(1, Math.round(Number(data.probability) || 1)));
    const impact = Math.min(5, Math.max(1, Math.round(Number(data.impact) || 1)));
    const score = Math.min(25, Math.max(1, probability * impact));

    let level: RiskSeverity = 'LOW';
    if (score > 5) level = 'MEDIUM';
    if (score > 10) level = 'HIGH';
    if (score > 16) level = 'CRITICAL';

    const now = new Date().toISOString();

    const risk: ProjectRisk = {
      ...data,
      probability,
      impact,
      id: riskId,
      tenantId,
      severityScore: score,
      severityLevel: level,
      status: 'IDENTIFIED',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(PROJECT_RISKS_COL, riskId, risk);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PROJECT_RISK_CREATED' as any,
      targetResource: 'project_risk',
      targetId: riskId,
      details: { title: risk.title, severityScore: score, severityLevel: level }
    });

    return risk;
  }

  static async getIssues(tenantId: string, projectId: string): Promise<ProjectIssue[]> {
    return await FirebaseService.getTenantCollection<ProjectIssue>(PROJECT_ISSUES_COL, tenantId, [
      where('projectId', '==', projectId)
    ]);
  }

  static async createIssue(tenantId: string, data: Omit<ProjectIssue, 'id' | 'tenantId' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, actor: UserActor): Promise<ProjectIssue> {
    const issueId = FirebaseService.generateId('proj_iss');
    const now = new Date().toISOString();

    const issue: ProjectIssue = {
      ...data,
      id: issueId,
      tenantId,
      status: 'OPEN',
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(PROJECT_ISSUES_COL, issueId, issue);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PROJECT_ISSUE_CREATED' as any,
      targetResource: 'project_issue',
      targetId: issueId,
      details: { title: issue.title, priority: issue.priority }
    });

    return issue;
  }

  static async recordDecision(tenantId: string, data: Omit<ProjectDecision, 'id' | 'tenantId' | 'approvedAt' | 'createdAt' | 'createdBy'>, actor: UserActor): Promise<ProjectDecision> {
    const decisionId = FirebaseService.generateId('proj_dec');
    const now = new Date().toISOString();

    const decision: ProjectDecision = {
      ...data,
      id: decisionId,
      tenantId,
      approvedAt: now,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(PROJECT_DECISIONS_COL, decisionId, decision);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PROJECT_DECISION_RECORDED' as any,
      targetResource: 'project_decision',
      targetId: decisionId,
      details: { title: decision.decisionTitle }
    });

    return decision;
  }

  // ==========================================
  // KNOWLEDGE ASSETS & ANALYTICS
  // ==========================================

  static async getKnowledgeAssets(tenantId: string): Promise<ResearchKnowledgeAsset[]> {
    return await FirebaseService.getTenantCollection<ResearchKnowledgeAsset>(KNOWLEDGE_ASSETS_COL, tenantId);
  }

  static async createKnowledgeAsset(tenantId: string, data: Omit<ResearchKnowledgeAsset, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>, actor: UserActor): Promise<ResearchKnowledgeAsset> {
    const assetId = FirebaseService.generateId('knw_ast');
    const now = new Date().toISOString();

    const asset: ResearchKnowledgeAsset = {
      ...data,
      id: assetId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(KNOWLEDGE_ASSETS_COL, assetId, asset);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'KNOWLEDGE_ASSET_CREATED' as any,
      targetResource: 'research_knowledge_asset',
      targetId: assetId,
      details: { title: asset.title, category: asset.category }
    });

    return asset;
  }

  static async getResearchAnalytics(tenantId: string, campusId?: string): Promise<ResearchAnalyticsCache> {
    const cacheId = campusId ? `cache_${campusId}` : 'cache_tenant_default';
    const cached = await FirebaseService.getDocument<ResearchAnalyticsCache>(RESEARCH_ANALYTICS_CACHE_COL, cacheId);

    if (cached) return cached;

    // Derived metric projections
    const projects = await this.getProjects(tenantId);
    const proposals = await this.getProposals(tenantId);
    const publications = await this.getPublications(tenantId);
    const ips = await this.getIPRecords(tenantId);
    const innovations = await this.getInnovations(tenantId);
    const profiles = await this.getProfiles(tenantId);

    const activePrj = projects.filter(p => p.status === 'ACTIVE').length;
    const completedPrj = projects.filter(p => p.status === 'COMPLETED').length;
    const propsUnderRev = proposals.filter(p => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED').length;

    // Turnaround calculation for approved proposals
    const approvedProposals = proposals.filter(p => p.status === 'APPROVED' && p.submittedAt && p.approvedAt);
    let avgTurnaround = 0;
    if (approvedProposals.length > 0) {
      const totalDays = approvedProposals.reduce((sum, p) => {
        const diff = new Date(p.approvedAt!).getTime() - new Date(p.submittedAt!).getTime();
        return sum + Math.max(0, diff / (1000 * 60 * 60 * 24));
      }, 0);
      avgTurnaround = Math.round((totalDays / approvedProposals.length) * 10) / 10;
    }

    // Milestone completion rate calculation across tenant
    const allMilestones = await FirebaseService.getTenantCollection<ResearchMilestone>(RESEARCH_MILESTONES_COL, tenantId);
    let milestoneCompletionRate = 0;
    if (allMilestones.length > 0) {
      const completedCount = allMilestones.filter(m => m.status === 'COMPLETED').length;
      milestoneCompletionRate = Math.round((completedCount / allMilestones.length) * 1000) / 10;
    }

    // Delayed projects calculation (targetCompletionDate passed and not completed)
    const todayStr = new Date().toISOString().split('T')[0];
    const delayedProjectsCount = projects.filter(p => p.targetCompletionDate && p.targetCompletionDate < todayStr && p.status !== 'COMPLETED' && p.status !== 'CLOSED' && p.status !== 'ARCHIVED').length;

    // At-risk projects calculation from risks collection
    const allRisks = await FirebaseService.getTenantCollection<ProjectRisk>(PROJECT_RISKS_COL, tenantId);
    const atRiskProjectIds = new Set(allRisks.filter(r => r.severityLevel === 'HIGH' || r.severityLevel === 'CRITICAL').map(r => r.projectId));
    const atRiskProjectsCount = atRiskProjectIds.size;

    const freshCache: ResearchAnalyticsCache = {
      id: cacheId,
      tenantId,
      campusId,
      totalActiveProjects: activePrj,
      totalCompletedProjects: completedPrj,
      proposalsUnderReview: propsUnderRev,
      averageApprovalTurnaroundDays: avgTurnaround,
      milestoneCompletionRate,
      delayedProjectsCount,
      atRiskProjectsCount,
      totalPublicationsCount: publications.length,
      totalIPDisclosuresCount: ips.length,
      activeInnovationsCount: innovations.filter(i => i.stage !== 'ARCHIVED').length,
      activeResearchersCount: profiles.length,
      lastUpdated: new Date().toISOString()
    };

    await FirebaseService.setDocument(RESEARCH_ANALYTICS_CACHE_COL, cacheId, freshCache);
    return freshCache;
  }
}
