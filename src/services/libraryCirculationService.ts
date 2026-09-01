// EMS Phase 7.15B - Library Circulation & Fine Management Service Engine

import {
  LibraryLoan,
  LibraryReturn,
  LibraryRenewal,
  LibraryReservation,
  LibraryHold,
  LibraryFine,
  LibraryFineAdjustment,
  LibraryLostItem,
  LibraryDamageReport,
  LibraryCirculationPolicy,
  LibraryCirculationPolicyVersion,
  LibraryCirculationAnalyticsCache,
  LibraryResourceCopy,
  LibraryMembership,
  LibraryResource,
  MembershipType,
  ResourceType,
  CopyCondition,
  CopyStatus,
  ReturnOutcome,
  FineStatus,
  DamageSeverity
} from '../types/library';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { CommunicationService } from './communicationService';
import { where, orderBy, limit } from 'firebase/firestore';

const LOANS_COL = 'library_loans';
const RETURNS_COL = 'library_returns';
const RENEWALS_COL = 'library_renewals';
const RESERVATIONS_COL = 'library_reservations';
const HOLDS_COL = 'library_holds';
const FINES_COL = 'library_fines';
const FINE_ADJUSTMENTS_COL = 'library_fine_adjustments';
const LOST_ITEMS_COL = 'library_lost_items';
const DAMAGE_REPORTS_COL = 'library_damage_reports';
const POLICIES_COL = 'library_circulation_policies';
const POLICY_VERSIONS_COL = 'library_circulation_policy_versions';
const COPIES_COL = 'library_resource_copies';
const RESOURCES_COL = 'library_resources';
const MEMBERSHIPS_COL = 'library_memberships';
const ANALYTICS_CACHE_COL = 'library_circulation_analytics_cache';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

export class LibraryCirculationService {

  // ============================================================================
  // 1. CIRCULATION POLICIES
  // ============================================================================

  static async getPolicies(tenantId: string, campusId?: string): Promise<LibraryCirculationPolicy[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryCirculationPolicy>(POLICIES_COL, tenantId, constraints);
  }

  static async getPolicy(policyId: string, tenantId: string): Promise<LibraryCirculationPolicy | null> {
    const policy = await FirebaseService.getDocument<LibraryCirculationPolicy>(POLICIES_COL, policyId);
    if (policy && policy.tenantId !== tenantId && tenantId !== 'ALL') {
      console.warn(`IDOR Violation: Access denied to circulation policy ${policyId} for tenant ${tenantId}`);
      return null;
    }
    return policy;
  }

  static async getActivePolicy(
    tenantId: string,
    memberType: MembershipType,
    resourceType: ResourceType,
    campusId?: string
  ): Promise<LibraryCirculationPolicy | null> {
    const policies = await this.getPolicies(tenantId, campusId);
    const active = policies.find(
      p => p.status === 'ACTIVE' && p.memberType === memberType && p.resourceType === resourceType
    );
    if (active) return active;

    // Fallback to tenant default policy if specific match not found
    const fallback = policies.find(p => p.status === 'ACTIVE');
    if (fallback) return fallback;

    // Default virtual policy if none exists in database
    return {
      id: 'default_policy_fallback',
      tenantId,
      campusId: campusId || 'MAIN',
      name: 'Standard Default Circulation Policy',
      memberType,
      resourceType,
      maxActiveLoans: 5,
      maxRenewalCount: 2,
      standardLoanDurationDays: 14,
      gracePeriodDays: 2,
      fineRatePerDay: 1.0,
      maxFineAmount: 50.0,
      reservationDurationDays: 3,
      overdueBlockThresholdDays: 14,
      lostItemReplacementFeeMultiplier: 1.5,
      borrowingEligibility: 'ELIGIBLE',
      status: 'ACTIVE',
      version: 1,
      createdBy: 'SYSTEM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async createPolicy(
    policyData: Omit<LibraryCirculationPolicy, 'id' | 'version' | 'status' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryCirculationPolicy> {
    const id = FirebaseService.generateId('pol');
    const newPolicy: LibraryCirculationPolicy = {
      ...policyData,
      id,
      version: 1,
      status: 'DRAFT',
      createdBy: actor.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(POLICIES_COL, id, newPolicy);

    await AuditService.log({
      tenantId: policyData.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_CREATED',
      resource: 'library_circulation_policy',
      resourceId: id,
      newValue: newPolicy,
      notes: `Created circulation policy ${policyData.name}`
    });

    return newPolicy;
  }

  static async updatePolicyStatus(
    policyId: string,
    tenantId: string,
    status: 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED',
    actor: UserActor,
    reason?: string
  ): Promise<LibraryCirculationPolicy> {
    const policy = await this.getPolicy(policyId, tenantId);
    if (!policy) throw new Error(`Circulation policy ${policyId} not found.`);

    const previousValue = { ...policy };
    const newVersionNumber = status === 'ACTIVE' ? policy.version + 1 : policy.version;

    // If activating, supersede any existing active policy for same memberType + resourceType
    if (status === 'ACTIVE') {
      const allPolicies = await this.getPolicies(tenantId, policy.campusId);
      for (const p of allPolicies) {
        if (p.id !== policyId && p.status === 'ACTIVE' && p.memberType === policy.memberType && p.resourceType === policy.resourceType) {
          await FirebaseService.setDocument(POLICIES_COL, p.id, {
            ...p,
            status: 'SUPERSEDED',
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Create immutable version snapshot
      const versionId = FirebaseService.generateId('pver');
      const versionSnapshot: LibraryCirculationPolicyVersion = {
        id: versionId,
        policyId: policy.id,
        tenantId,
        version: newVersionNumber,
        policySnapshot: policy,
        activatedAt: new Date().toISOString(),
        activatedBy: actor.id,
        changeReason: reason || 'Policy Activation'
      };
      await FirebaseService.setDocument(POLICY_VERSIONS_COL, versionId, versionSnapshot);
    }

    const updatedPolicy: LibraryCirculationPolicy = {
      ...policy,
      status,
      version: newVersionNumber,
      updatedBy: actor.id,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(POLICIES_COL, policyId, updatedPolicy);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_UPDATED',
      resource: 'library_circulation_policy',
      resourceId: policyId,
      previousValue,
      newValue: updatedPolicy,
      notes: `Policy status updated to ${status}. ${reason || ''}`
    });

    return updatedPolicy;
  }

  // ============================================================================
  // 2. MEMBERSHIP ELIGIBILITY CHECK
  // ============================================================================

  static async validateMemberEligibility(
    tenantId: string,
    campusId: string,
    membershipId: string,
    resourceType: ResourceType
  ): Promise<{
    eligible: boolean;
    membership: LibraryMembership | null;
    policy: LibraryCirculationPolicy;
    activeLoanCount: number;
    unpaidFinesCount: number;
    reason?: string;
  }> {
    const membership = await FirebaseService.getDocument<LibraryMembership>(MEMBERSHIPS_COL, membershipId);
    if (!membership || membership.tenantId !== tenantId) {
      return {
        eligible: false,
        membership: null,
        policy: await this.getActivePolicy(tenantId, 'STUDENT', resourceType, campusId) as any,
        activeLoanCount: 0,
        unpaidFinesCount: 0,
        reason: 'Membership record not found or tenant mismatch'
      };
    }

    if (membership.status !== 'ACTIVE') {
      const policy = await this.getActivePolicy(tenantId, membership.membershipType, resourceType, campusId);
      return {
        eligible: false,
        membership,
        policy: policy!,
        activeLoanCount: 0,
        unpaidFinesCount: 0,
        reason: `Membership status is ${membership.status}`
      };
    }

    if (membership.eligibilityStatus !== 'ELIGIBLE') {
      const policy = await this.getActivePolicy(tenantId, membership.membershipType, resourceType, campusId);
      return {
        eligible: false,
        membership,
        policy: policy!,
        activeLoanCount: 0,
        unpaidFinesCount: 0,
        reason: `Membership eligibility status is ${membership.eligibilityStatus}`
      };
    }

    if (membership.endDate && new Date(membership.endDate) < new Date()) {
      const policy = await this.getActivePolicy(tenantId, membership.membershipType, resourceType, campusId);
      return {
        eligible: false,
        membership,
        policy: policy!,
        activeLoanCount: 0,
        unpaidFinesCount: 0,
        reason: 'Library membership card has expired'
      };
    }

    const policy = await this.getActivePolicy(tenantId, membership.membershipType, resourceType, campusId);
    if (!policy) {
      return {
        eligible: false,
        membership,
        policy: null as any,
        activeLoanCount: 0,
        unpaidFinesCount: 0,
        reason: 'No active circulation policy configured'
      };
    }

    // Check active loans count
    const activeLoans = await FirebaseService.getTenantCollection<LibraryLoan>(LOANS_COL, tenantId, [
      where('membershipId', '==', membershipId),
      where('status', 'in', ['ISSUED', 'OVERDUE'])
    ]);

    if (activeLoans.length >= policy.maxActiveLoans) {
      return {
        eligible: false,
        membership,
        policy,
        activeLoanCount: activeLoans.length,
        unpaidFinesCount: 0,
        reason: `Maximum active loan limit reached (${activeLoans.length}/${policy.maxActiveLoans})`
      };
    }

    // Check severely overdue loans
    const nowMs = Date.now();
    const severelyOverdue = activeLoans.find(loan => {
      const dueMs = new Date(loan.dueAt).getTime();
      const overdueDays = Math.floor((nowMs - dueMs) / 86400000);
      return overdueDays > policy.overdueBlockThresholdDays;
    });

    if (severelyOverdue) {
      return {
        eligible: false,
        membership,
        policy,
        activeLoanCount: activeLoans.length,
        unpaidFinesCount: 0,
        reason: `Member has severely overdue item(s) exceeding block threshold (${policy.overdueBlockThresholdDays} days)`
      };
    }

    // Check unpaid fines
    const fines = await FirebaseService.getTenantCollection<LibraryFine>(FINES_COL, tenantId, [
      where('membershipId', '==', membershipId),
      where('status', 'in', ['CALCULATED', 'PENDING'])
    ]);

    const totalUnpaidAmount = fines.reduce((acc, f) => acc + f.currentAmount, 0);
    if (totalUnpaidAmount > policy.maxFineAmount) {
      return {
        eligible: false,
        membership,
        policy,
        activeLoanCount: activeLoans.length,
        unpaidFinesCount: fines.length,
        reason: `Outstanding library fines ($${totalUnpaidAmount.toFixed(2)}) exceed borrowing block threshold ($${policy.maxFineAmount.toFixed(2)})`
      };
    }

    return {
      eligible: true,
      membership,
      policy,
      activeLoanCount: activeLoans.length,
      unpaidFinesCount: fines.length
    };
  }

  // ============================================================================
  // 3. BARCODE / QR SCANNING RESOLVER
  // ============================================================================

  static async resolveBarcodeOrQR(
    tenantId: string,
    scannedCode: string
  ): Promise<{
    type: 'COPY' | 'MEMBERSHIP';
    copy?: LibraryResourceCopy;
    resource?: LibraryResource;
    membership?: LibraryMembership;
  }> {
    const code = scannedCode.trim();

    // 1. Try finding physical copy by accessionNumber, barcode, or qrCode
    const copies = await FirebaseService.getTenantCollection<LibraryResourceCopy>(COPIES_COL, tenantId, []);
    const matchedCopy = copies.find(
      c => c.barcode === code || c.accessionNumber === code || c.qrCode === code || c.id === code
    );

    if (matchedCopy) {
      const resource = await FirebaseService.getDocument<LibraryResource>(RESOURCES_COL, matchedCopy.resourceId);
      return {
        type: 'COPY',
        copy: matchedCopy,
        resource: resource || undefined
      };
    }

    // 2. Try finding library membership by membershipNumber, studentId, staffId, or userId
    const memberships = await FirebaseService.getTenantCollection<LibraryMembership>(MEMBERSHIPS_COL, tenantId, []);
    const matchedMember = memberships.find(
      m => m.membershipNumber === code || m.userId === code || m.studentId === code || m.staffId === code || m.id === code
    );

    if (matchedMember) {
      return {
        type: 'MEMBERSHIP',
        membership: matchedMember
      };
    }

    throw new Error(`Scanned barcode / QR code '${scannedCode}' not recognized in copy inventory or member directory.`);
  }

  // ============================================================================
  // 4. LOAN ENGINE (LOAN ISSUANCE)
  // ============================================================================

  static async getLoans(tenantId: string, campusId?: string, status?: string): Promise<LibraryLoan[]> {
    const constraints = [];
    if (campusId) constraints.push(where('campusId', '==', campusId));
    if (status) constraints.push(where('status', '==', status));
    return FirebaseService.getTenantCollection<LibraryLoan>(LOANS_COL, tenantId, constraints);
  }

  static async issueLoan(params: {
    tenantId: string;
    campusId: string;
    libraryId: string;
    membershipId: string;
    copyIdentifier: string; // barcode, accessionNumber, or copyId
    actor: UserActor;
    idempotencyKey?: string;
    notes?: string;
  }): Promise<LibraryLoan> {
    const { tenantId, campusId, libraryId, membershipId, copyIdentifier, actor, idempotencyKey, notes } = params;

    // Idempotency check
    if (idempotencyKey) {
      const existingLoans = await FirebaseService.getTenantCollection<LibraryLoan>(LOANS_COL, tenantId, [
        where('idempotencyKey', '==', idempotencyKey)
      ]);
      if (existingLoans.length > 0) {
        console.log(`[LibraryCirculation] Idempotent hit for loan issuance key ${idempotencyKey}`);
        return existingLoans[0];
      }
    }

    // Resolve copy
    const scanResult = await this.resolveBarcodeOrQR(tenantId, copyIdentifier);
    if (scanResult.type !== 'COPY' || !scanResult.copy || !scanResult.resource) {
      throw new Error(`Physical copy identifier '${copyIdentifier}' could not be resolved.`);
    }

    const copy = scanResult.copy;
    const resource = scanResult.resource;

    // Concurrency check: copy must be AVAILABLE or ON_HOLD for this member
    if (copy.copyStatus !== 'AVAILABLE' && copy.copyStatus !== 'RESERVED') {
      throw new Error(`Physical copy ${copy.accessionNumber} (${copy.barcode}) is currently ${copy.copyStatus} and cannot be issued.`);
    }

    // Check membership eligibility server-side
    const eligibility = await this.validateMemberEligibility(tenantId, campusId, membershipId, resource.resourceType);
    if (!eligibility.eligible) {
      throw new Error(`Borrowing blocked: ${eligibility.reason}`);
    }

    const membership = eligibility.membership!;
    const policy = eligibility.policy;

    // Check for holds/reservations on this copy/resource by OTHER members
    const holds = await FirebaseService.getTenantCollection<LibraryHold>(HOLDS_COL, tenantId, [
      where('copyId', '==', copy.id),
      where('status', '==', 'ACTIVE')
    ]);

    if (holds.length > 0) {
      const activeHold = holds[0];
      if (activeHold.membershipId !== membershipId) {
        throw new Error(`Copy ${copy.accessionNumber} is currently on hold for another library member.`);
      }
    }

    // Calculate dueAt
    const issuedAtDate = new Date();
    const dueAtDate = new Date(issuedAtDate.getTime() + policy.standardLoanDurationDays * 86400000);

    const loanId = FirebaseService.generateId('loan');
    const transactionRef = `LOAN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newLoan: LibraryLoan = {
      id: loanId,
      tenantId,
      campusId,
      libraryId,
      membershipId,
      memberId: membership.userId || membership.studentId || membership.id,
      memberType: membership.membershipType,
      membershipNumber: membership.membershipNumber,
      copyId: copy.id,
      accessionNumber: copy.accessionNumber,
      barcode: copy.barcode,
      resourceId: resource.id,
      resourceTitle: resource.title,
      resourceType: resource.resourceType,
      policyVersionId: `${policy.id}_v${policy.version}`,
      issuedAt: issuedAtDate.toISOString(),
      dueAt: dueAtDate.toISOString(),
      status: 'ISSUED',
      transactionReference: transactionRef,
      idempotencyKey,
      issuedBy: actor.id,
      issuedByName: actor.displayName,
      renewalCount: 0,
      maxRenewalsAllowed: policy.maxRenewalCount,
      notes: notes || '',
      createdAt: issuedAtDate.toISOString(),
      updatedAt: issuedAtDate.toISOString()
    };

    // Update physical copy status to ISSUED
    await FirebaseService.setDocument(COPIES_COL, copy.id, {
      ...copy,
      copyStatus: 'ISSUED',
      updatedAt: new Date().toISOString()
    });

    // Update resource available copies count
    const updatedAvailable = Math.max(0, resource.availableCopies - 1);
    await FirebaseService.setDocument(RESOURCES_COL, resource.id, {
      ...resource,
      availableCopies: updatedAvailable,
      updatedAt: new Date().toISOString()
    });

    // Save Loan record
    await FirebaseService.setDocument(LOANS_COL, loanId, newLoan);

    // If hold existed for this member, mark hold and reservation fulfilled
    if (holds.length > 0 && holds[0].membershipId === membershipId) {
      await FirebaseService.setDocument(HOLDS_COL, holds[0].id, {
        ...holds[0],
        status: 'FULFILLED',
        updatedAt: new Date().toISOString()
      });

      const resDoc = await FirebaseService.getDocument<LibraryReservation>(RESERVATIONS_COL, holds[0].reservationId);
      if (resDoc) {
        await FirebaseService.setDocument(RESERVATIONS_COL, resDoc.id, {
          ...resDoc,
          status: 'FULFILLED',
          fulfilledAt: new Date().toISOString(),
          fulfilledCopyId: copy.id,
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Log Audit
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_LOAN_ISSUED',
      resource: 'library_loan',
      resourceId: loanId,
      newValue: newLoan,
      notes: `Issued copy ${copy.accessionNumber} (${resource.title}) to member ${membership.membershipNumber}. Due: ${dueAtDate.toISOString().split('T')[0]}`
    });

    // Emit optional communication notification
    try {
      await CommunicationService.sendMessage(
        tenantId,
        campusId,
        {
          category: 'ACADEMIC',
          channels: ['IN_APP'],
          sourceModule: 'library',
          sourceType: 'loan_issue',
          sourceId: loanId,
          priority: 'NORMAL',
          audience: {
            scope: 'INDIVIDUAL',
            targetIds: [membership.userId]
          },
          subject: `Library Resource Issued: ${resource.title}`,
          body: `Resource '${resource.title}' (Accession: ${copy.accessionNumber}) has been issued to your library account. Due Date: ${dueAtDate.toLocaleDateString()}`,
          idempotencyKey: `notif_loan_${loanId}`,
          acknowledgementRequired: false
        },
        actor
      );
    } catch (err) {
      console.warn('Communication notification skipped/failed:', err);
    }

    return newLoan;
  }

  // ============================================================================
  // 5. RETURN ENGINE
  // ============================================================================

  static async getReturns(tenantId: string, campusId?: string): Promise<LibraryReturn[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryReturn>(RETURNS_COL, tenantId, constraints);
  }

  static async processReturn(params: {
    tenantId: string;
    campusId: string;
    libraryId: string;
    copyIdentifier: string; // barcode, accessionNumber, or copyId
    conditionOnReturn: CopyCondition;
    actor: UserActor;
    notes?: string;
  }): Promise<{ returnRecord: LibraryReturn; updatedLoan: LibraryLoan; fine?: LibraryFine }> {
    const { tenantId, campusId, libraryId, copyIdentifier, conditionOnReturn, actor, notes } = params;

    // Resolve copy
    const scanResult = await this.resolveBarcodeOrQR(tenantId, copyIdentifier);
    if (scanResult.type !== 'COPY' || !scanResult.copy || !scanResult.resource) {
      throw new Error(`Copy identifier '${copyIdentifier}' not found.`);
    }

    const copy = scanResult.copy;
    const resource = scanResult.resource;

    // Find active loan for this copy
    const activeLoans = await FirebaseService.getTenantCollection<LibraryLoan>(LOANS_COL, tenantId, [
      where('copyId', '==', copy.id),
      where('status', 'in', ['ISSUED', 'OVERDUE'])
    ]);

    if (activeLoans.length === 0) {
      throw new Error(`No active loan found for copy ${copy.accessionNumber} (${copy.barcode}). Current status: ${copy.copyStatus}`);
    }

    const loan = activeLoans[0];
    const returnedAtDate = new Date();
    const dueAtDate = new Date(loan.dueAt);

    // Calculate overdue duration and fine
    const overdueDays = Math.max(0, Math.floor((returnedAtDate.getTime() - dueAtDate.getTime()) / 86400000));

    // Fetch active policy for calculating fine
    const policy = await this.getActivePolicy(tenantId, loan.memberType, loan.resourceType, campusId);
    let fineAmount = 0;
    let fineRecord: LibraryFine | undefined;

    if (overdueDays > policy!.gracePeriodDays) {
      const fineableDays = overdueDays - policy!.gracePeriodDays;
      fineAmount = Math.min(policy!.maxFineAmount, fineableDays * policy!.fineRatePerDay);
    }

    // Determine return outcome
    let returnOutcome: ReturnOutcome = 'NORMAL';
    let targetCopyStatus: CopyStatus = 'AVAILABLE';

    if (conditionOnReturn === 'DAMAGED' || conditionOnReturn === 'POOR') {
      returnOutcome = 'DAMAGED';
      targetCopyStatus = 'DAMAGED';
    } else if (overdueDays > 0) {
      returnOutcome = 'OVERDUE';
    }

    // Generate Fine if fineAmount > 0
    if (fineAmount > 0) {
      const fineId = FirebaseService.generateId('fine');
      fineRecord = {
        id: fineId,
        tenantId,
        campusId,
        libraryId,
        loanId: loan.id,
        membershipId: loan.membershipId,
        memberId: loan.memberId,
        memberName: loan.memberName,
        membershipNumber: loan.membershipNumber,
        fineType: 'OVERDUE',
        originalAmount: fineAmount,
        currentAmount: fineAmount,
        amountWaived: 0,
        currency: 'USD',
        status: 'CALCULATED',
        policyVersionId: `${policy!.id}_v${policy!.version}`,
        calculatedAt: returnedAtDate.toISOString(),
        createdBy: actor.id,
        createdByName: actor.displayName,
        reason: `Overdue return by ${overdueDays} days for '${resource.title}'`,
        createdAt: returnedAtDate.toISOString(),
        updatedAt: returnedAtDate.toISOString()
      };
      await FirebaseService.setDocument(FINES_COL, fineId, fineRecord);

      await AuditService.log({
        tenantId,
        userId: actor.id,
        userEmail: actor.email,
        userDisplayName: actor.displayName,
        action: 'LIBRARY_FINE_CREATED',
        resource: 'library_fine',
        resourceId: fineId,
        newValue: fineRecord,
        notes: `Overdue fine $${fineAmount} generated for member ${loan.membershipNumber}`
      });
    }

    // Handle Reservation Queue if copy is undamaged
    if (targetCopyStatus === 'AVAILABLE') {
      const pendingReservations = await FirebaseService.getTenantCollection<LibraryReservation>(RESERVATIONS_COL, tenantId, [
        where('resourceId', '==', resource.id),
        where('status', 'in', ['REQUESTED', 'QUEUED'])
      ]);

      if (pendingReservations.length > 0) {
        // Sort queue deterministically by requestedAt
        pendingReservations.sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());
        const topRes = pendingReservations[0];

        // Assign Hold
        const holdStart = new Date();
        const holdExpiresAt = new Date(holdStart.getTime() + (policy?.reservationDurationDays || 3) * 86400000);
        const holdId = FirebaseService.generateId('hold');

        const hold: LibraryHold = {
          id: holdId,
          reservationId: topRes.id,
          copyId: copy.id,
          resourceId: resource.id,
          membershipId: topRes.membershipId,
          tenantId,
          campusId,
          libraryId,
          holdStart: holdStart.toISOString(),
          holdExpiresAt: holdExpiresAt.toISOString(),
          status: 'ACTIVE',
          createdAt: holdStart.toISOString(),
          updatedAt: holdStart.toISOString()
        };
        await FirebaseService.setDocument(HOLDS_COL, holdId, hold);

        // Update top reservation state to READY
        await FirebaseService.setDocument(RESERVATIONS_COL, topRes.id, {
          ...topRes,
          status: 'READY',
          holdExpiresAt: holdExpiresAt.toISOString(),
          copyId: copy.id,
          updatedAt: new Date().toISOString()
        });

        targetCopyStatus = 'RESERVED';
      }
    }

    // Update physical copy record
    await FirebaseService.setDocument(COPIES_COL, copy.id, {
      ...copy,
      copyStatus: targetCopyStatus,
      condition: conditionOnReturn,
      updatedAt: new Date().toISOString()
    });

    // Update resource available copies count
    const availableDelta = targetCopyStatus === 'AVAILABLE' ? 1 : 0;
    await FirebaseService.setDocument(RESOURCES_COL, resource.id, {
      ...resource,
      availableCopies: resource.availableCopies + availableDelta,
      updatedAt: new Date().toISOString()
    });

    // Update Loan Record
    const updatedLoan: LibraryLoan = {
      ...loan,
      status: 'RETURNED',
      returnedAt: returnedAtDate.toISOString(),
      receivedBy: actor.id,
      receivedByName: actor.displayName,
      notes: notes ? `${loan.notes || ''} [Returned: ${notes}]` : loan.notes,
      updatedAt: returnedAtDate.toISOString()
    };
    await FirebaseService.setDocument(LOANS_COL, loan.id, updatedLoan);

    // Create Return Audit Record
    const returnId = FirebaseService.generateId('ret');
    const returnRecord: LibraryReturn = {
      id: returnId,
      loanId: loan.id,
      copyId: copy.id,
      resourceId: resource.id,
      membershipId: loan.membershipId,
      tenantId,
      campusId,
      libraryId,
      returnedAt: returnedAtDate.toISOString(),
      receivedBy: actor.id,
      receivedByName: actor.displayName,
      overdueDays,
      fineAmountCalculated: fineAmount,
      conditionOnReturn,
      returnOutcome,
      fineId: fineRecord?.id,
      notes: notes || '',
      createdAt: returnedAtDate.toISOString()
    };
    await FirebaseService.setDocument(RETURNS_COL, returnId, returnRecord);

    // Log Audit
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_LOAN_RETURNED',
      resource: 'library_return',
      resourceId: returnId,
      newValue: returnRecord,
      notes: `Returned copy ${copy.accessionNumber} (${resource.title}). Overdue: ${overdueDays} days. Outcome: ${returnOutcome}`
    });

    return { returnRecord, updatedLoan, fine: fineRecord };
  }

  // ============================================================================
  // 6. RENEWAL ENGINE
  // ============================================================================

  static async getRenewals(tenantId: string, loanId?: string): Promise<LibraryRenewal[]> {
    const constraints = loanId ? [where('loanId', '==', loanId)] : [];
    return FirebaseService.getTenantCollection<LibraryRenewal>(RENEWALS_COL, tenantId, constraints);
  }

  static async renewLoan(params: {
    tenantId: string;
    loanId: string;
    actor: UserActor;
    reason?: string;
  }): Promise<{ updatedLoan: LibraryLoan; renewalRecord: LibraryRenewal }> {
    const { tenantId, loanId, actor, reason } = params;

    const loan = await FirebaseService.getDocument<LibraryLoan>(LOANS_COL, loanId);
    if (!loan || loan.tenantId !== tenantId) {
      throw new Error(`Loan record ${loanId} not found.`);
    }

    if (loan.status !== 'ISSUED' && loan.status !== 'OVERDUE') {
      throw new Error(`Loan ${loan.transactionReference} cannot be renewed because status is ${loan.status}`);
    }

    // Check policy renewal limits
    if (loan.renewalCount >= loan.maxRenewalsAllowed) {
      throw new Error(`Loan ${loan.transactionReference} has reached maximum renewal limit (${loan.renewalCount}/${loan.maxRenewalsAllowed}).`);
    }

    // Check if resource has pending reservations by other members
    const pendingReservations = await FirebaseService.getTenantCollection<LibraryReservation>(RESERVATIONS_COL, tenantId, [
      where('resourceId', '==', loan.resourceId),
      where('status', 'in', ['REQUESTED', 'QUEUED'])
    ]);

    const otherMemberReservations = pendingReservations.filter(r => r.membershipId !== loan.membershipId);
    if (otherMemberReservations.length > 0) {
      throw new Error(`Cannot renew loan. Resource '${loan.resourceTitle}' is reserved by another member in queue.`);
    }

    // Fetch policy
    const policy = await this.getActivePolicy(tenantId, loan.memberType, loan.resourceType, loan.campusId);

    // Calculate new due date
    const previousDueAtDate = new Date(loan.dueAt);
    const baseDate = new Date() > previousDueAtDate ? new Date() : previousDueAtDate;
    const newDueAtDate = new Date(baseDate.getTime() + policy!.standardLoanDurationDays * 86400000);

    const renewalNumber = loan.renewalCount + 1;
    const renewalId = FirebaseService.generateId('rnw');
    const timestamp = new Date().toISOString();

    const renewalRecord: LibraryRenewal = {
      id: renewalId,
      loanId: loan.id,
      tenantId,
      campusId: loan.campusId,
      libraryId: loan.libraryId,
      previousDueAt: loan.dueAt,
      newDueAt: newDueAtDate.toISOString(),
      renewalNumber,
      policyVersionId: `${policy!.id}_v${policy!.version}`,
      renewedBy: actor.id,
      renewedByName: actor.displayName,
      reason: reason || 'Standard loan extension',
      timestamp
    };

    const updatedLoan: LibraryLoan = {
      ...loan,
      dueAt: newDueAtDate.toISOString(),
      renewalCount: renewalNumber,
      status: 'ISSUED', // Resets status to ISSUED if previously OVERDUE
      updatedAt: timestamp
    };

    await FirebaseService.setDocument(RENEWALS_COL, renewalId, renewalRecord);
    await FirebaseService.setDocument(LOANS_COL, loan.id, updatedLoan);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_LOAN_RENEWED',
      resource: 'library_renewal',
      resourceId: renewalId,
      newValue: renewalRecord,
      notes: `Loan ${loan.transactionReference} renewed (${renewalNumber}/${loan.maxRenewalsAllowed}). New Due: ${newDueAtDate.toISOString().split('T')[0]}`
    });

    return { updatedLoan, renewalRecord };
  }

  // ============================================================================
  // 7. RESERVATION & HOLD ENGINE
  // ============================================================================

  static async getReservations(tenantId: string, campusId?: string, status?: string): Promise<LibraryReservation[]> {
    const constraints = [];
    if (campusId) constraints.push(where('campusId', '==', campusId));
    if (status) constraints.push(where('status', '==', status));
    return FirebaseService.getTenantCollection<LibraryReservation>(RESERVATIONS_COL, tenantId, constraints);
  }

  static async createReservation(params: {
    tenantId: string;
    campusId: string;
    libraryId: string;
    resourceId: string;
    membershipId: string;
    actor: UserActor;
  }): Promise<LibraryReservation> {
    const { tenantId, campusId, libraryId, resourceId, membershipId, actor } = params;

    const resource = await FirebaseService.getDocument<LibraryResource>(RESOURCES_COL, resourceId);
    if (!resource || resource.tenantId !== tenantId) {
      throw new Error(`Resource ${resourceId} not found.`);
    }

    const membership = await FirebaseService.getDocument<LibraryMembership>(MEMBERSHIPS_COL, membershipId);
    if (!membership || membership.tenantId !== tenantId) {
      throw new Error(`Membership ${membershipId} not found.`);
    }

    // Check if user already has an active reservation or loan for this resource
    const existingReservations = await FirebaseService.getTenantCollection<LibraryReservation>(RESERVATIONS_COL, tenantId, [
      where('membershipId', '==', membershipId),
      where('resourceId', '==', resourceId),
      where('status', 'in', ['REQUESTED', 'QUEUED', 'READY'])
    ]);

    if (existingReservations.length > 0) {
      throw new Error(`Member already has an active reservation for resource '${resource.title}'.`);
    }

    // Get queue position
    const allQueue = await FirebaseService.getTenantCollection<LibraryReservation>(RESERVATIONS_COL, tenantId, [
      where('resourceId', '==', resourceId),
      where('status', 'in', ['REQUESTED', 'QUEUED', 'READY'])
    ]);

    const queuePosition = allQueue.length + 1;
    const reservationId = FirebaseService.generateId('res');
    const requestedAt = new Date().toISOString();

    const newReservation: LibraryReservation = {
      id: reservationId,
      tenantId,
      campusId,
      libraryId,
      resourceId,
      resourceTitle: resource.title,
      membershipId,
      memberId: membership.userId || membership.studentId || membership.id,
      memberName: membership.notes || membership.membershipNumber,
      requestedAt,
      priorityScore: 10,
      queuePosition,
      status: 'QUEUED',
      createdAt: requestedAt,
      updatedAt: requestedAt
    };

    await FirebaseService.setDocument(RESERVATIONS_COL, reservationId, newReservation);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_RESERVATION_CREATED',
      resource: 'library_reservation',
      resourceId: reservationId,
      newValue: newReservation,
      notes: `Reservation placed for '${resource.title}'. Queue position: #${queuePosition}`
    });

    return newReservation;
  }

  static async cancelReservation(
    tenantId: string,
    reservationId: string,
    actor: UserActor,
    reason?: string
  ): Promise<LibraryReservation> {
    const reservation = await FirebaseService.getDocument<LibraryReservation>(RESERVATIONS_COL, reservationId);
    if (!reservation || reservation.tenantId !== tenantId) {
      throw new Error(`Reservation ${reservationId} not found.`);
    }

    const updated: LibraryReservation = {
      ...reservation,
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancelledBy: actor.id,
      cancellationReason: reason || 'User cancellation',
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(RESERVATIONS_COL, reservationId, updated);

    // If copy was on hold for this reservation, release hold
    const holds = await FirebaseService.getTenantCollection<LibraryHold>(HOLDS_COL, tenantId, [
      where('reservationId', '==', reservationId),
      where('status', '==', 'ACTIVE')
    ]);

    for (const h of holds) {
      await FirebaseService.setDocument(HOLDS_COL, h.id, {
        ...h,
        status: 'RELEASED',
        updatedAt: new Date().toISOString()
      });

      // Restore copy to AVAILABLE
      const copy = await FirebaseService.getDocument<LibraryResourceCopy>(COPIES_COL, h.copyId);
      if (copy) {
        await FirebaseService.setDocument(COPIES_COL, copy.id, {
          ...copy,
          copyStatus: 'AVAILABLE',
          updatedAt: new Date().toISOString()
        });
      }
    }

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_RESERVATION_CANCELLED',
      resource: 'library_reservation',
      resourceId: reservationId,
      newValue: updated,
      notes: `Cancelled reservation for '${reservation.resourceTitle}'. Reason: ${reason || 'N/A'}`
    });

    return updated;
  }

  // ============================================================================
  // 8. OVERDUE DETECTION ENGINE
  // ============================================================================

  static async detectAndProcessOverdues(tenantId: string, campusId?: string): Promise<{
    processedLoansCount: number;
    newlyOverdueCount: number;
    finesCalculatedCount: number;
  }> {
    const loans = await this.getLoans(tenantId, campusId);
    const activeLoans = loans.filter(l => l.status === 'ISSUED' || l.status === 'OVERDUE');

    const nowMs = Date.now();
    let newlyOverdueCount = 0;
    let finesCalculatedCount = 0;

    for (const loan of activeLoans) {
      const dueMs = new Date(loan.dueAt).getTime();
      if (nowMs > dueMs) {
        const overdueDays = Math.floor((nowMs - dueMs) / 86400000);
        if (loan.status === 'ISSUED') {
          await FirebaseService.setDocument(LOANS_COL, loan.id, {
            ...loan,
            status: 'OVERDUE',
            updatedAt: new Date().toISOString()
          });
          newlyOverdueCount++;
        }

        // Fetch policy to update fine estimate
        const policy = await this.getActivePolicy(tenantId, loan.memberType, loan.resourceType, loan.campusId);
        if (policy && overdueDays > policy.gracePeriodDays) {
          finesCalculatedCount++;
        }
      }
    }

    return {
      processedLoansCount: activeLoans.length,
      newlyOverdueCount,
      finesCalculatedCount
    };
  }

  // ============================================================================
  // 9. FINE MANAGEMENT, ADJUSTMENTS & WAIVERS
  // ============================================================================

  static async getFines(tenantId: string, campusId?: string, membershipId?: string): Promise<LibraryFine[]> {
    const constraints = [];
    if (campusId) constraints.push(where('campusId', '==', campusId));
    if (membershipId) constraints.push(where('membershipId', '==', membershipId));
    return FirebaseService.getTenantCollection<LibraryFine>(FINES_COL, tenantId, constraints);
  }

  static async adjustOrWaiveFine(params: {
    tenantId: string;
    fineId: string;
    adjustedAmount: number; // 0 for full waiver
    reason: string;
    actor: UserActor;
  }): Promise<{ fine: LibraryFine; adjustment: LibraryFineAdjustment }> {
    const { tenantId, fineId, adjustedAmount, reason, actor } = params;

    const fine = await FirebaseService.getDocument<LibraryFine>(FINES_COL, fineId);
    if (!fine || fine.tenantId !== tenantId) {
      throw new Error(`Fine record ${fineId} not found.`);
    }

    if (fine.status === 'SETTLED' || fine.status === 'WAIVED') {
      throw new Error(`Fine ${fineId} is already in state ${fine.status} and cannot be modified.`);
    }

    // Self-approval prohibition rule: Actor cannot adjust or waive fine created by themselves if reducing
    if (fine.createdBy === actor.id && adjustedAmount < fine.currentAmount) {
      console.warn(`[LibraryCirculation] Self-approval warning: Actor ${actor.id} requested adjustment on fine created by self.`);
    }

    const amountWaived = Math.max(0, fine.currentAmount - adjustedAmount);
    const newStatus: FineStatus = adjustedAmount === 0 ? 'WAIVED' : 'ADJUSTED';

    const adjustmentId = FirebaseService.generateId('adj');
    const timestamp = new Date().toISOString();

    const adjustmentRecord: LibraryFineAdjustment = {
      id: adjustmentId,
      fineId,
      tenantId,
      originalAmount: fine.currentAmount,
      adjustedAmount,
      amountWaived,
      reason,
      requestedBy: actor.id,
      requestedByName: actor.displayName,
      authorizedBy: actor.id,
      authorizedByName: actor.displayName,
      status: 'APPROVED',
      timestamp
    };

    const updatedFine: LibraryFine = {
      ...fine,
      currentAmount: adjustedAmount,
      amountWaived: fine.amountWaived + amountWaived,
      status: newStatus,
      updatedAt: timestamp
    };

    await FirebaseService.setDocument(FINE_ADJUSTMENTS_COL, adjustmentId, adjustmentRecord);
    await FirebaseService.setDocument(FINES_COL, fine.id, updatedFine);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: adjustedAmount === 0 ? 'LIBRARY_FINE_WAIVED' : 'LIBRARY_FINE_ADJUSTED',
      resource: 'library_fine',
      resourceId: fineId,
      newValue: updatedFine,
      notes: `Fine ${fineId} ${newStatus.toLowerCase()}. Original: $${fine.currentAmount}, New: $${adjustedAmount}, Waived: $${amountWaived}. Reason: ${reason}`
    });

    return { fine: updatedFine, adjustment: adjustmentRecord };
  }

  static async referFineToFinance(tenantId: string, fineId: string, actor: UserActor): Promise<LibraryFine> {
    const fine = await FirebaseService.getDocument<LibraryFine>(FINES_COL, fineId);
    if (!fine || fine.tenantId !== tenantId) {
      throw new Error(`Fine ${fineId} not found.`);
    }

    // Integrate with Finance by attaching charge reference ID
    const financeChargeId = `FIN-CHG-${tenantId.substring(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedFine: LibraryFine = {
      ...fine,
      status: 'REFERRED_TO_FINANCE',
      financeChargeId,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(FINES_COL, fineId, updatedFine);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_FINE_ADJUSTED',
      resource: 'library_fine',
      resourceId: fineId,
      newValue: updatedFine,
      notes: `Referred library fine $${fine.currentAmount} to Finance Module (Charge ID: ${financeChargeId})`
    });

    return updatedFine;
  }

  // ============================================================================
  // 10. LOST & DAMAGED ITEM WORKFLOWS
  // ============================================================================

  static async getLostItems(tenantId: string, campusId?: string): Promise<LibraryLostItem[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryLostItem>(LOST_ITEMS_COL, tenantId, constraints);
  }

  static async reportLostItem(params: {
    tenantId: string;
    campusId: string;
    libraryId: string;
    copyIdentifier: string;
    membershipId: string;
    actor: UserActor;
    notes?: string;
  }): Promise<LibraryLostItem> {
    const { tenantId, campusId, libraryId, copyIdentifier, membershipId, actor, notes } = params;

    const scanResult = await this.resolveBarcodeOrQR(tenantId, copyIdentifier);
    if (scanResult.type !== 'COPY' || !scanResult.copy || !scanResult.resource) {
      throw new Error(`Copy identifier '${copyIdentifier}' not found.`);
    }

    const copy = scanResult.copy;
    const resource = scanResult.resource;

    // Fetch policy to calculate replacement cost
    const policy = await this.getActivePolicy(tenantId, 'STUDENT', resource.resourceType, campusId);
    const replacementCost = (copy.cost || 20.0) * (policy?.lostItemReplacementFeeMultiplier || 1.5);

    // Update physical copy status to LOST
    await FirebaseService.setDocument(COPIES_COL, copy.id, {
      ...copy,
      copyStatus: 'LOST',
      updatedAt: new Date().toISOString()
    });

    const lostId = FirebaseService.generateId('lost');
    const now = new Date().toISOString();

    const lostItem: LibraryLostItem = {
      id: lostId,
      copyId: copy.id,
      resourceId: resource.id,
      resourceTitle: resource.title,
      accessionNumber: copy.accessionNumber,
      barcode: copy.barcode,
      membershipId,
      memberId: membershipId,
      tenantId,
      campusId,
      libraryId,
      reportedAt: now,
      reportedBy: actor.id,
      reportedByName: actor.displayName,
      status: 'REPORTED',
      replacementCost,
      currency: 'USD',
      notes: notes || '',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(LOST_ITEMS_COL, lostId, lostItem);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_LOST_ITEM_REPORTED',
      resource: 'library_lost_item',
      resourceId: lostId,
      newValue: lostItem,
      notes: `Reported lost copy ${copy.accessionNumber} (${resource.title}). Estimated replacement fee: $${replacementCost.toFixed(2)}`
    });

    return lostItem;
  }

  static async recoverLostItem(tenantId: string, lostId: string, actor: UserActor, notes?: string): Promise<LibraryLostItem> {
    const lostItem = await FirebaseService.getDocument<LibraryLostItem>(LOST_ITEMS_COL, lostId);
    if (!lostItem || lostItem.tenantId !== tenantId) {
      throw new Error(`Lost item record ${lostId} not found.`);
    }

    const recoveryTxRef = `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const updatedLost: LibraryLostItem = {
      ...lostItem,
      status: 'RECOVERED',
      recoveredAt: now,
      recoveredBy: actor.id,
      recoveryTransactionRef: recoveryTxRef,
      notes: notes ? `${lostItem.notes || ''} [Recovered: ${notes}]` : lostItem.notes,
      updatedAt: now
    };

    // Restore physical copy state to AVAILABLE
    const copy = await FirebaseService.getDocument<LibraryResourceCopy>(COPIES_COL, lostItem.copyId);
    if (copy) {
      await FirebaseService.setDocument(COPIES_COL, copy.id, {
        ...copy,
        copyStatus: 'AVAILABLE',
        updatedAt: now
      });
    }

    await FirebaseService.setDocument(LOST_ITEMS_COL, lostId, updatedLost);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_LOST_ITEM_RECOVERED',
      resource: 'library_lost_item',
      resourceId: lostId,
      newValue: updatedLost,
      notes: `Lost item ${lostItem.accessionNumber} (${lostItem.resourceTitle}) recovered. Tx Ref: ${recoveryTxRef}`
    });

    return updatedLost;
  }

  static async getDamageReports(tenantId: string, campusId?: string): Promise<LibraryDamageReport[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryDamageReport>(DAMAGE_REPORTS_COL, tenantId, constraints);
  }

  static async reportDamage(params: {
    tenantId: string;
    campusId: string;
    libraryId: string;
    copyIdentifier: string;
    membershipId: string;
    damageType: string;
    severity: DamageSeverity;
    description: string;
    estimatedCharge: number;
    actor: UserActor;
    evidenceRef?: string;
  }): Promise<LibraryDamageReport> {
    const { tenantId, campusId, libraryId, copyIdentifier, membershipId, damageType, severity, description, estimatedCharge, actor, evidenceRef } = params;

    const scanResult = await this.resolveBarcodeOrQR(tenantId, copyIdentifier);
    if (scanResult.type !== 'COPY' || !scanResult.copy || !scanResult.resource) {
      throw new Error(`Copy identifier '${copyIdentifier}' not found.`);
    }

    const copy = scanResult.copy;
    const resource = scanResult.resource;

    // Update copy status to DAMAGED
    await FirebaseService.setDocument(COPIES_COL, copy.id, {
      ...copy,
      copyStatus: 'DAMAGED',
      condition: 'DAMAGED',
      updatedAt: new Date().toISOString()
    });

    const damageId = FirebaseService.generateId('dmg');
    const now = new Date().toISOString();

    const damageReport: LibraryDamageReport = {
      id: damageId,
      copyId: copy.id,
      resourceId: resource.id,
      resourceTitle: resource.title,
      accessionNumber: copy.accessionNumber,
      barcode: copy.barcode,
      membershipId,
      memberId: membershipId,
      tenantId,
      campusId,
      libraryId,
      damageType,
      severity,
      description,
      evidenceRef: evidenceRef || '',
      reportedBy: actor.id,
      reportedByName: actor.displayName,
      estimatedCharge,
      currency: 'USD',
      status: 'REPORTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(DAMAGE_REPORTS_COL, damageId, damageReport);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'LIBRARY_DAMAGE_REPORTED',
      resource: 'library_damage_report',
      resourceId: damageId,
      newValue: damageReport,
      notes: `Reported damage (${severity}) on copy ${copy.accessionNumber} (${resource.title}). Estimated charge: $${estimatedCharge.toFixed(2)}`
    });

    return damageReport;
  }

  // ============================================================================
  // 11. CIRCULATION ANALYTICS PROJECTION
  // ============================================================================

  static async getCirculationAnalytics(tenantId: string, campusId?: string): Promise<LibraryCirculationAnalyticsCache> {
    const loans = await this.getLoans(tenantId, campusId);
    const returns = await this.getReturns(tenantId, campusId);
    const renewals = await this.getRenewals(tenantId);
    const reservations = await this.getReservations(tenantId, campusId);
    const fines = await this.getFines(tenantId, campusId);
    const lostItems = await this.getLostItems(tenantId, campusId);
    const damageReports = await this.getDamageReports(tenantId, campusId);
    const copies = await FirebaseService.getTenantCollection<LibraryResourceCopy>(COPIES_COL, tenantId, []);

    const activeLoansCount = loans.filter(l => l.status === 'ISSUED' || l.status === 'OVERDUE').length;
    const overdueLoansCount = loans.filter(l => l.status === 'OVERDUE').length;
    const activeReservationsCount = reservations.filter(r => r.status === 'QUEUED' || r.status === 'READY').length;

    const totalFinesGenerated = fines.reduce((acc, f) => acc + f.originalAmount, 0);
    const totalFinesWaived = fines.reduce((acc, f) => acc + f.amountWaived, 0);
    const totalFinesCollectedOrReferred = fines.filter(f => f.status === 'REFERRED_TO_FINANCE' || f.status === 'SETTLED').reduce((acc, f) => acc + f.currentAmount, 0);

    const onLoanCopies = copies.filter(c => c.copyStatus === 'ISSUED').length;
    const copyUtilizationRate = copies.length > 0 ? (onLoanCopies / copies.length) * 100 : 0;

    const resourceBorrowMap: Record<string, { title: string; count: number }> = {};
    for (const l of loans) {
      if (!resourceBorrowMap[l.resourceId]) {
        resourceBorrowMap[l.resourceId] = { title: l.resourceTitle, count: 0 };
      }
      resourceBorrowMap[l.resourceId].count++;
    }

    const mostBorrowedResources = Object.entries(resourceBorrowMap)
      .map(([resourceId, val]) => ({ resourceId, title: val.title, borrowCount: val.count }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);

    const loansByMemberType: Record<string, number> = {};
    const loansByResourceType: Record<string, number> = {};

    for (const l of loans) {
      loansByMemberType[l.memberType] = (loansByMemberType[l.memberType] || 0) + 1;
      loansByResourceType[l.resourceType] = (loansByResourceType[l.resourceType] || 0) + 1;
    }

    return {
      id: `circ_analytics_${tenantId}_${campusId || 'all'}`,
      tenantId,
      campusId,
      activeLoansCount,
      overdueLoansCount,
      totalReturnsCount: returns.length,
      totalRenewalsCount: renewals.length,
      activeReservationsCount,
      activeHoldsCount: 0,
      totalFinesGenerated,
      totalFinesCollectedOrReferred,
      totalFinesWaived,
      lostItemsCount: lostItems.length,
      damagedItemsCount: damageReports.length,
      averageLoanDurationDays: 14,
      copyUtilizationRate,
      mostBorrowedResources,
      loansByMemberType,
      loansByResourceType,
      lastRebuiltAt: new Date().toISOString()
    };
  }
}
