import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { 
  ADRStatus, 
  PortfolioItemStatus, 
  RationalizationCategory, 
  TechnicalDebtStatus, 
  ReviewStatus, 
  ClassificationLevel, 
  ArchitectureDomainType,
  EnterpriseArchitectureRepository,
  ArchitecturePrinciple,
  ArchitectureStandard,
  ArchitectureDecisionRecord,
  ArchitectureReview,
  ArchitectureException,
  ArchitectureRoadmap,
  TechnologyPortfolio,
  TechnologyProduct,
  ApplicationPortfolioItem,
  ApplicationLifecycleAssessment,
  TechnologyLifecycleAssessment,
  DigitalService,
  TechnologyDependency,
  TechnologyRiskItem,
  TechnicalDebtItem,
  TechnologyInvestmentRequest,
  TechnologyDataQualityIssue,
  ArchitectureAuditEvent
} from '../types';

export class EnterpriseArchitectureService {
  // 1. ARCHITECTURE REPOSITORY METHODS
  static async createArchitectureRepository(
    data: Omit<EnterpriseArchitectureRepository, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EnterpriseArchitectureRepository> {
    const id = FirebaseService.generateId('ear');
    const repo: EnterpriseArchitectureRepository = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('enterprise_architecture_repositories', id, repo);
    return repo;
  }

  static async getArchitectureRepositories(tenantId: string): Promise<EnterpriseArchitectureRepository[]> {
    return FirebaseService.getTenantCollection<EnterpriseArchitectureRepository>('enterprise_architecture_repositories', tenantId);
  }

  static async createArchitecturePrinciple(
    data: Omit<ArchitecturePrinciple, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ArchitecturePrinciple> {
    const id = FirebaseService.generateId('eap');
    const principle: ArchitecturePrinciple = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('enterprise_architecture_principles', id, principle);
    return principle;
  }

  static async getArchitecturePrinciples(tenantId: string): Promise<ArchitecturePrinciple[]> {
    return FirebaseService.getTenantCollection<ArchitecturePrinciple>('enterprise_architecture_principles', tenantId);
  }

  static async createArchitectureStandard(
    data: Omit<ArchitectureStandard, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ArchitectureStandard> {
    const id = FirebaseService.generateId('eas');
    const standard: ArchitectureStandard = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('enterprise_architecture_standards', id, standard);
    return standard;
  }

  static async getArchitectureStandards(tenantId: string): Promise<ArchitectureStandard[]> {
    return FirebaseService.getTenantCollection<ArchitectureStandard>('enterprise_architecture_standards', tenantId);
  }

  // 2. ARCHITECTURE DECISION RECORDS (ADR)
  static async createADR(
    data: Omit<ArchitectureDecisionRecord, 'id' | 'status' | 'version' | 'createdAt' | 'updatedAt'>
  ): Promise<ArchitectureDecisionRecord> {
    const id = FirebaseService.generateId('adr');
    const adr: ArchitectureDecisionRecord = {
      ...data,
      id,
      status: ADRStatus.DRAFT,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('architecture_decision_records', id, adr);
    return adr;
  }

  static async getADRs(tenantId: string): Promise<ArchitectureDecisionRecord[]> {
    return FirebaseService.getTenantCollection<ArchitectureDecisionRecord>('architecture_decision_records', tenantId);
  }

  static async submitADR(adrId: string, userId: string): Promise<void> {
    const adr = await FirebaseService.getDocument<ArchitectureDecisionRecord>('architecture_decision_records', adrId);
    if (!adr) throw new Error('Architecture Decision Record not found');
    await FirebaseService.updateDocument('architecture_decision_records', adrId, {
      status: ADRStatus.SUBMITTED,
      updatedAt: new Date().toISOString()
    });
  }

  static async approveADR(
    adrId: string, 
    approverId: string, 
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const adr = await FirebaseService.getDocument<ArchitectureDecisionRecord>('architecture_decision_records', adrId);
    if (!adr) throw new Error('Architecture Decision Record not found');

    // Segregation of duties checks: Creator cannot be the approver
    if (adr.creatorId === approverId) {
      throw new Error('Segregation of Duties Violation: Creator of an ADR cannot be the approver');
    }

    await FirebaseService.updateDocument('architecture_decision_records', adrId, {
      status: ADRStatus.APPROVED,
      approverId,
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      tenantId: adr.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADR_APPROVED' as any,
      resource: 'architecture_decision_record' as any,
      resourceId: adrId,
      resourceName: adr.title,
      newValue: { status: ADRStatus.APPROVED, approverId },
      result: 'SUCCESS',
      notes: `Architecture Decision Record approved by ${performedBy.name}`
    });
  }

  static async makeADRActive(adrId: string): Promise<void> {
    const adr = await FirebaseService.getDocument<ArchitectureDecisionRecord>('architecture_decision_records', adrId);
    if (!adr) throw new Error('Architecture Decision Record not found');
    await FirebaseService.updateDocument('architecture_decision_records', adrId, {
      status: ADRStatus.EFFECTIVE,
      updatedAt: new Date().toISOString()
    });
  }

  static async supersedeADR(
    oldAdrId: string, 
    newAdrId: string, 
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const oldAdr = await FirebaseService.getDocument<ArchitectureDecisionRecord>('architecture_decision_records', oldAdrId);
    const newAdr = await FirebaseService.getDocument<ArchitectureDecisionRecord>('architecture_decision_records', newAdrId);
    if (!oldAdr || !newAdr) throw new Error('One or both Architecture Decision Records not found');

    await FirebaseService.updateDocument('architecture_decision_records', oldAdrId, {
      status: ADRStatus.SUPERSEDED,
      supersededByAdrId: newAdrId,
      updatedAt: new Date().toISOString()
    });

    await FirebaseService.updateDocument('architecture_decision_records', newAdrId, {
      supersedesAdrId: oldAdrId,
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      tenantId: oldAdr.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADR_SUPERSEDED' as any,
      resource: 'architecture_decision_record' as any,
      resourceId: oldAdrId,
      resourceName: oldAdr.title,
      newValue: { status: ADRStatus.SUPERSEDED, supersededByAdrId: newAdrId },
      result: 'SUCCESS',
      notes: `ADR ${oldAdr.title} superseded by ${newAdr.title}`
    });
  }

  // 3. REVIEWS & EXCEPTIONS
  static async createArchitectureReview(
    data: Omit<ArchitectureReview, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ArchitectureReview> {
    const id = FirebaseService.generateId('arv');
    const review: ArchitectureReview = {
      ...data,
      id,
      status: ReviewStatus.REQUESTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('architecture_reviews', id, review);
    return review;
  }

  static async getArchitectureReviews(tenantId: string): Promise<ArchitectureReview[]> {
    return FirebaseService.getTenantCollection<ArchitectureReview>('architecture_reviews', tenantId);
  }

  static async approveArchitectureReview(
    reviewId: string,
    reviewerId: string,
    findings: string,
    recommendations: string
  ): Promise<void> {
    await FirebaseService.updateDocument('architecture_reviews', reviewId, {
      status: ReviewStatus.APPROVED,
      reviewerId,
      findings,
      recommendations,
      updatedAt: new Date().toISOString()
    });
  }

  static async requestArchitectureException(
    data: Omit<ArchitectureException, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ArchitectureException> {
    const id = FirebaseService.generateId('aex');
    const exception: ArchitectureException = {
      ...data,
      id,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('architecture_exceptions', id, exception);
    return exception;
  }

  static async getArchitectureExceptions(tenantId: string): Promise<ArchitectureException[]> {
    return FirebaseService.getTenantCollection<ArchitectureException>('architecture_exceptions', tenantId);
  }

  static async approveArchitectureException(
    exceptionId: string,
    approvingAuthority: string,
    status: 'APPROVED' | 'REJECTED',
    compensatingControls?: string
  ): Promise<void> {
    await FirebaseService.updateDocument('architecture_exceptions', exceptionId, {
      status,
      approvingAuthority,
      compensatingControls,
      updatedAt: new Date().toISOString()
    });
  }

  // 4. TECHNOLOGY PORTFOLIO & APPLICATION PORTFOLIO
  static async createTechnologyPortfolio(
    data: Omit<TechnologyPortfolio, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnologyPortfolio> {
    const id = FirebaseService.generateId('tp');
    const portfolio: TechnologyPortfolio = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('technology_portfolios', id, portfolio);
    return portfolio;
  }

  static async getTechnologyPortfolios(tenantId: string): Promise<TechnologyPortfolio[]> {
    return FirebaseService.getTenantCollection<TechnologyPortfolio>('technology_portfolios', tenantId);
  }

  static async createTechnologyProduct(
    data: Omit<TechnologyProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnologyProduct> {
    const id = FirebaseService.generateId('tprd');
    const product: TechnologyProduct = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('technology_products', id, product);
    return product;
  }

  static async getTechnologyProducts(tenantId: string): Promise<TechnologyProduct[]> {
    return FirebaseService.getTenantCollection<TechnologyProduct>('technology_products', tenantId);
  }

  // DETERMINISTIC MATHEMATICAL RATIONALIZATION ALGORITHM
  static calculateRationalization(item: Partial<ApplicationPortfolioItem>): {
    score: number;
    category: RationalizationCategory;
  } {
    const bizCrit = item.businessCriticality || 3;
    const stratAlign = item.strategicAlignment || 3;
    const techHealth = item.technicalHealth || 3;
    const opCost = item.operatingCostReference || 3;
    const secRisk = item.securityRisk || 3;
    const techDebt = item.technicalDebtScore || 3;
    const userAdop = item.userAdoption || 3;

    // Standard scoring logic combining value, risk, and technical quality
    // Weight parameters
    const valueScore = (bizCrit * 0.35) + (stratAlign * 0.35) + (userAdop * 0.30); // Max 5.0
    const technicalScore = (techHealth * 0.50) + ((6 - techDebt) * 0.30) + ((6 - secRisk) * 0.20); // Max 5.0
    const riskCostPenalty = (opCost * 0.50) + (secRisk * 0.50); // Max 5.0

    // Final consolidated score
    const finalScore = Number(((valueScore * 0.4) + (technicalScore * 0.4) - (riskCostPenalty * 0.2) + 1).toFixed(2));

    // TIME-TESTED Gartner TIME Decision logic:
    // High Value & High Technical Quality -> INVEST
    // High Value & Low Technical Quality -> MODERNIZE
    // Low Value & High Technical Quality -> TOLERATE
    // Low Value & Low Technical Quality -> RETIRE
    // Moderate levels of both -> MIGRATE

    let category = RationalizationCategory.MIGRATE;
    if (valueScore >= 3.5 && technicalScore >= 3.5) {
      category = RationalizationCategory.INVEST;
    } else if (valueScore >= 3.5 && technicalScore < 3.5) {
      category = RationalizationCategory.MODERNIZE;
    } else if (valueScore < 2.5 && technicalScore >= 3.5) {
      category = RationalizationCategory.TOLERATE;
    } else if (valueScore < 2.5 && technicalScore < 2.5) {
      category = RationalizationCategory.RETIRE;
    }

    return { score: Math.max(1, Math.min(5, finalScore)), category };
  }

  static async createApplicationPortfolioItem(
    data: Omit<ApplicationPortfolioItem, 'id' | 'rationalizationCategory' | 'rationalizationScore' | 'createdAt' | 'updatedAt'>
  ): Promise<ApplicationPortfolioItem> {
    const id = FirebaseService.generateId('api');
    const { score, category } = this.calculateRationalization(data);

    const item: ApplicationPortfolioItem = {
      ...data,
      id,
      rationalizationCategory: category,
      rationalizationScore: score,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument('application_portfolio_items', id, item);
    return item;
  }

  static async getApplicationPortfolioItems(tenantId: string): Promise<ApplicationPortfolioItem[]> {
    return FirebaseService.getTenantCollection<ApplicationPortfolioItem>('application_portfolio_items', tenantId);
  }

  static async assessApplication(
    itemId: string,
    inputs: Pick<ApplicationPortfolioItem, 'businessCriticality' | 'technicalHealth' | 'strategicAlignment' | 'operatingCostReference' | 'securityRisk' | 'integrationComplexity' | 'userAdoption' | 'technicalDebtScore' | 'lifecyclePosition'>
  ): Promise<ApplicationPortfolioItem> {
    const item = await FirebaseService.getDocument<ApplicationPortfolioItem>('application_portfolio_items', itemId);
    if (!item) throw new Error('Application portfolio item not found');

    const updatedData = { ...item, ...inputs };
    const { score, category } = this.calculateRationalization(updatedData);

    const updatedItem: ApplicationPortfolioItem = {
      ...updatedData,
      rationalizationScore: score,
      rationalizationCategory: category,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument('application_portfolio_items', itemId, updatedItem);

    // Write historical record
    const assessmentId = FirebaseService.generateId('ala');
    const assessment: ApplicationLifecycleAssessment = {
      id: assessmentId,
      tenantId: item.tenantId,
      campusId: item.campusId,
      applicationId: itemId,
      assessmentDate: new Date().toISOString(),
      technicalHealthScore: inputs.technicalHealth,
      strategicValueScore: inputs.strategicAlignment,
      rationalizationRecommendation: category,
      createdBy: item.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('application_lifecycle_assessments', assessmentId, assessment);

    return updatedItem;
  }

  // 5. LIFECYCLE & DIGITAL SERVICES
  static async assessTechnologyLifecycle(
    data: Omit<TechnologyLifecycleAssessment, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnologyLifecycleAssessment> {
    const id = FirebaseService.generateId('tla');
    
    // Automatically flag technology lifecycle security states
    let status = 'SECURE';
    if (data.endOfLifeDate) {
      const eol = new Date(data.endOfLifeDate).getTime();
      const now = Date.now();
      const diffDays = (eol - now) / (1000 * 3600 * 24);

      if (diffDays < 0) {
        status = 'OBSOLETE';
      } else if (diffDays <= 180) {
        status = 'CRITICAL';
      } else if (diffDays <= 365) {
        status = 'UPGRADE_REQUIRED';
      }
    }

    const assessment: TechnologyLifecycleAssessment = {
      ...data,
      id,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument('technology_lifecycle_assessments', id, assessment);
    return assessment;
  }

  static async getTechnologyLifecycleAssessments(tenantId: string): Promise<TechnologyLifecycleAssessment[]> {
    return FirebaseService.getTenantCollection<TechnologyLifecycleAssessment>('technology_lifecycle_assessments', tenantId);
  }

  static async createDigitalService(
    data: Omit<DigitalService, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DigitalService> {
    const id = FirebaseService.generateId('ds');
    const service: DigitalService = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('digital_services', id, service);
    return service;
  }

  static async getDigitalServices(tenantId: string): Promise<DigitalService[]> {
    return FirebaseService.getTenantCollection<DigitalService>('digital_services', tenantId);
  }

  // 6. DEPENDENCIES GRAPH OPERATIONS
  static async createTechnologyDependency(
    data: Omit<TechnologyDependency, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnologyDependency> {
    const id = FirebaseService.generateId('tdep');
    const dependency: TechnologyDependency = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('technology_dependencies', id, dependency);
    return dependency;
  }

  static async getTechnologyDependencies(tenantId: string): Promise<TechnologyDependency[]> {
    return FirebaseService.getTenantCollection<TechnologyDependency>('technology_dependencies', tenantId);
  }

  static async analyzeDependencyGraph(tenantId: string): Promise<{
    hasCircular: boolean;
    cycles: string[][];
    blastRadii: Record<string, number>;
  }> {
    const dependencies = await this.getTechnologyDependencies(tenantId);
    
    // Build adjacency lists
    const adj: Record<string, string[]> = {};
    const nodes = new Set<string>();

    for (const d of dependencies) {
      nodes.add(d.sourceId);
      nodes.add(d.targetId);
      if (!adj[d.sourceId]) adj[d.sourceId] = [];
      adj[d.sourceId].push(d.targetId);
    }

    // 1. Detect Cycle using standard DFS (colors: 0 = unvisited, 1 = visiting, 2 = visited)
    const state: Record<string, number> = {};
    const cycles: string[][] = [];
    const currentPath: string[] = [];

    const dfsCycle = (u: string): boolean => {
      state[u] = 1;
      currentPath.push(u);

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (state[v] === 1) {
          // Cycle found!
          const idx = currentPath.indexOf(v);
          if (idx !== -1) {
            cycles.push([...currentPath.slice(idx), v]);
          }
          return true;
        }
        if (!state[v]) {
          if (dfsCycle(v)) return true;
        }
      }

      state[u] = 2;
      currentPath.pop();
      return false;
    };

    let hasCircular = false;
    for (const u of nodes) {
      if (!state[u]) {
        if (dfsCycle(u)) {
          hasCircular = true;
        }
      }
    }

    // 2. Blast Radius Calculation: Count total reachable nodes (transitive dependents)
    // To find dependents, we reverse the dependency graph: targetId depends on sourceId.
    const reverseAdj: Record<string, string[]> = {};
    for (const d of dependencies) {
      if (!reverseAdj[d.targetId]) reverseAdj[d.targetId] = [];
      reverseAdj[d.targetId].push(d.sourceId);
    }

    const calculateBlastRadius = (startNode: string): number => {
      const visited = new Set<string>();
      const queue = [startNode];
      visited.add(startNode);

      while (queue.length > 0) {
        const u = queue.shift()!;
        const parents = reverseAdj[u] || [];
        for (const p of parents) {
          if (!visited.has(p)) {
            visited.add(p);
            queue.push(p);
          }
        }
      }

      // Blast radius is the total count of dependent components minus the component itself
      return visited.size - 1;
    };

    const blastRadii: Record<string, number> = {};
    for (const node of nodes) {
      blastRadii[node] = calculateBlastRadius(node);
    }

    return { hasCircular, cycles, blastRadii };
  }

  // 7. TECHNOLOGY RISK MANAGEMENT
  static async createTechnologyRisk(
    data: Omit<TechnologyRiskItem, 'id' | 'exposure' | 'severity' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnologyRiskItem> {
    const id = FirebaseService.generateId('tr');
    const exposure = data.probability * data.impact;
    
    // Server calculated exposure & severity 5x5 Matrix
    let severity = 'LOW';
    if (exposure >= 16) severity = 'CRITICAL';
    else if (exposure >= 12) severity = 'HIGH';
    else if (exposure >= 6) severity = 'MEDIUM';

    const risk: TechnologyRiskItem = {
      ...data,
      id,
      exposure,
      severity,
      status: 'IDENTIFIED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument('technology_risks', id, risk);
    return risk;
  }

  static async getTechnologyRisks(tenantId: string): Promise<TechnologyRiskItem[]> {
    return FirebaseService.getTenantCollection<TechnologyRiskItem>('technology_risks', tenantId);
  }

  static async approveTechnologyRisk(
    riskId: string, 
    approverId: string, 
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const risk = await FirebaseService.getDocument<TechnologyRiskItem>('technology_risks', riskId);
    if (!risk) throw new Error('Technology risk item not found');

    if (risk.creatorId === approverId) {
      throw new Error('Segregation of Duties Violation: Creator of a Risk Item cannot be the approver');
    }

    await FirebaseService.updateDocument('technology_risks', riskId, {
      status: 'APPROVED',
      approverId,
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      tenantId: risk.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'RISK_APPROVED' as any,
      resource: 'technology_risk' as any,
      resourceId: riskId,
      resourceName: risk.title,
      newValue: { status: 'APPROVED', approverId },
      result: 'SUCCESS',
      notes: `Technology Risk approved by ${performedBy.name}`
    });
  }

  // 8. TECHNICAL DEBT MANAGEMENT
  static async createTechnicalDebt(
    data: Omit<TechnicalDebtItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnicalDebtItem> {
    const id = FirebaseService.generateId('tdi');
    const item: TechnicalDebtItem = {
      ...data,
      id,
      status: TechnicalDebtStatus.IDENTIFIED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('technical_debt_items', id, item);
    return item;
  }

  static async getTechnicalDebtItems(tenantId: string): Promise<TechnicalDebtItem[]> {
    return FirebaseService.getTenantCollection<TechnicalDebtItem>('technical_debt_items', tenantId);
  }

  static async verifyTechnicalDebtClosure(
    debtId: string, 
    verifierId: string, 
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const debt = await FirebaseService.getDocument<TechnicalDebtItem>('technical_debt_items', debtId);
    if (!debt) throw new Error('Technical debt item not found');

    if (debt.creatorId === verifierId) {
      throw new Error('Segregation of Duties Violation: Creator of Technical Debt cannot be the verifier');
    }

    await FirebaseService.updateDocument('technical_debt_items', debtId, {
      status: TechnicalDebtStatus.VERIFIED,
      verifierId,
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      tenantId: debt.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'TECH_DEBT_CLOSED' as any,
      resource: 'technical_debt_item' as any,
      resourceId: debtId,
      resourceName: debt.title,
      newValue: { status: TechnicalDebtStatus.VERIFIED, verifierId },
      result: 'SUCCESS',
      notes: `Technical Debt marked closed and verified by ${performedBy.name}`
    });
  }

  // 9. INVESTMENTS & SCENARIOS
  static async createTechnologyInvestment(
    data: Omit<TechnologyInvestmentRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<TechnologyInvestmentRequest> {
    const id = FirebaseService.generateId('ti');
    const req: TechnologyInvestmentRequest = {
      ...data,
      id,
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('technology_investments', id, req);
    return req;
  }

  static async getTechnologyInvestments(tenantId: string): Promise<TechnologyInvestmentRequest[]> {
    return FirebaseService.getTenantCollection<TechnologyInvestmentRequest>('technology_investments', tenantId);
  }

  static async runTechnologyScenario(
    tenantId: string, 
    assumptions: { retireUnsupportedTech: boolean; remediateHighDebt: boolean; resolveCriticalRisks: boolean }
  ): Promise<{
    currentRisksCount: number;
    projectedRisksCount: number;
    currentDebtCost: number;
    projectedDebtCost: number;
    appsToModernizeCount: number;
  }> {
    const risks = await this.getTechnologyRisks(tenantId);
    const debts = await this.getTechnicalDebtItems(tenantId);
    const apps = await this.getApplicationPortfolioItems(tenantId);

    const currentRisksCount = risks.length;
    let projectedRisksCount = currentRisksCount;
    if (assumptions.resolveCriticalRisks) {
      projectedRisksCount = risks.filter(r => r.severity !== 'CRITICAL' && r.severity !== 'HIGH').length;
    }

    const currentDebtCost = debts.reduce((sum, d) => sum + (d.estimatedRemediationEffort || 0), 0);
    let projectedDebtCost = currentDebtCost;
    if (assumptions.remediateHighDebt) {
      projectedDebtCost = debts
        .filter(d => d.priority !== 'CRITICAL' && d.priority !== 'HIGH')
        .reduce((sum, d) => sum + (d.estimatedRemediationEffort || 0), 0);
    }

    const appsToModernizeCount = apps.filter(a => a.rationalizationCategory === RationalizationCategory.MODERNIZE).length;

    return {
      currentRisksCount,
      projectedRisksCount,
      currentDebtCost,
      projectedDebtCost,
      appsToModernizeCount
    };
  }

  // 10. REAL-TIME DATA QUALITY SCANNER
  static async scanTechnologyDataQuality(tenantId: string): Promise<TechnologyDataQualityIssue[]> {
    const issues: TechnologyDataQualityIssue[] = [];

    const apps = await this.getApplicationPortfolioItems(tenantId);
    const exceptions = await this.getArchitectureExceptions(tenantId);
    const lifecycle = await this.getTechnologyLifecycleAssessments(tenantId);
    const deps = await this.getTechnologyDependencies(tenantId);

    // 1. Orphan Records
    for (const app of apps) {
      if (!app.businessOwner || !app.technicalOwner) {
        issues.push({
          id: FirebaseService.generateId('tdqi'),
          tenantId,
          campusId: app.campusId,
          title: `Orphan Application Portfolio Item: ${app.name}`,
          description: `Application ${app.name} lacks defined business or technical ownership details.`,
          category: 'ORPHAN',
          sourceRecordId: app.id,
          sourceCollection: 'application_portfolio_items',
          detectedAt: new Date().toISOString(),
          status: 'OPEN',
          createdBy: 'SYSTEM',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 2. Expired Exceptions
    for (const ex of exceptions) {
      if (ex.expiryDate && new Date(ex.expiryDate).getTime() < Date.now() && ex.status === 'APPROVED') {
        issues.push({
          id: FirebaseService.generateId('tdqi'),
          tenantId,
          campusId: ex.campusId,
          title: `Expired Architecture Exception: ${ex.title}`,
          description: `Architecture exception ${ex.title} has exceeded its authorized expiration timeline.`,
          category: 'EXPIRED_EXCEPTION',
          sourceRecordId: ex.id,
          sourceCollection: 'architecture_exceptions',
          detectedAt: new Date().toISOString(),
          status: 'OPEN',
          createdBy: 'SYSTEM',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 3. Unsupported Tech
    for (const lc of lifecycle) {
      if (lc.status === 'OBSOLETE' || lc.status === 'CRITICAL') {
        issues.push({
          id: FirebaseService.generateId('tdqi'),
          tenantId,
          campusId: lc.campusId,
          title: `Unsupported/Obsolete Technology Stack: ${lc.technologyName}`,
          description: `Technology ${lc.technologyName} is currently operating in status ${lc.status} with end-of-life status.`,
          category: 'UNSUPPORTED_TECH',
          sourceRecordId: lc.id,
          sourceCollection: 'technology_lifecycle_assessments',
          detectedAt: new Date().toISOString(),
          status: 'OPEN',
          createdBy: 'SYSTEM',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 4. Circular Dependencies
    const analysis = await this.analyzeDependencyGraph(tenantId);
    if (analysis.hasCircular) {
      for (const cycle of analysis.cycles) {
        issues.push({
          id: FirebaseService.generateId('tdqi'),
          tenantId,
          title: 'Circular Dependency Path Detected',
          description: `A circular technology loop was detected: ${cycle.join(' -> ')}`,
          category: 'CIRCULAR_DEPENDENCY',
          sourceRecordId: cycle[0],
          sourceCollection: 'technology_dependencies',
          detectedAt: new Date().toISOString(),
          status: 'OPEN',
          createdBy: 'SYSTEM',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Write issues to Firestore
    for (const issue of issues) {
      await FirebaseService.setDocument('technology_data_quality_issues', issue.id, issue);
    }

    return issues;
  }
}
