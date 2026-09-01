import { RankingPolicy, RankingSnapshot, StudentRankRecord } from '../types/ranking';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { MarksService } from './marksService';

const POLICIES_COL = 'ranking_policies';
const SNAPSHOTS_COL = 'ranking_snapshots';

export class RankingService {
  /**
   * Get ranking policies for tenant
   */
  static async getPolicies(tenantId: string): Promise<RankingPolicy[]> {
    let list = await FirebaseService.getTenantCollection<RankingPolicy>(POLICIES_COL, tenantId);
    if (!list) list = [];

    if (list.length === 0) {
      const defaultPolicy: RankingPolicy = {
        policyId: `rp_${tenantId}_default`,
        tenantId,
        academicYearId: 'ay_2027_28',
        name: 'Standard Academic Ranking Policy 2027-28',
        description: 'Standard institutional ranking policy based on total obtained percentage with competition tie policy.',
        status: 'ACTIVE',
        version: '1.0',
        rankingScope: 'CLASS',
        rankingMethod: 'PERCENTAGE',
        minimumAttendancePercentage: 75,
        tiePolicy: 'COMPETITION',
        roundingDecimals: 1,
        effectiveFrom: '2027-04-01',
        effectiveTo: '2028-03-31',
        createdBy: 'System Administrator',
        approvedBy: 'Principal',
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await FirebaseService.setDocument(POLICIES_COL, defaultPolicy.policyId, defaultPolicy);
      list = [defaultPolicy];
    }
    return list;
  }

  /**
   * Get ranking snapshots / runs
   */
  static async getSnapshots(tenantId: string): Promise<RankingSnapshot[]> {
    let list = await FirebaseService.getTenantCollection<RankingSnapshot>(SNAPSHOTS_COL, tenantId);
    if (!list) list = [];

    if (list.length === 0) {
      const demoSnapshot: RankingSnapshot = {
        snapshotId: `snap_demo_1`,
        tenantId,
        policyId: `rp_${tenantId}_default`,
        policyVersion: '1.0',
        academicYearId: 'ay_2027_28',
        scope: 'CLASS',
        scopeId: 'cls_demo',
        status: 'PUBLISHED',
        records: [
          {
            studentId: 'std_demo_1',
            studentName: 'Demo Student',
            enrollmentId: 'enr_demo_1',
            classId: 'cls_demo',
            sectionId: 'sec_demo',
            totalScore: 90,
            maxScore: 100,
            percentage: 90,
            rank: 1,
            eligible: true
          }
        ],
        calculatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      };
      await FirebaseService.setDocument(SNAPSHOTS_COL, demoSnapshot.snapshotId, demoSnapshot);
      list = [demoSnapshot];
    }

    return list;
  }

  /**
   * Calculate and create ranking run snapshot
   */
  static async calculateRanking(
    tenantId: string,
    policyId: string,
    examinationId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<RankingSnapshot> {
    const policies = await this.getPolicies(tenantId);
    const policy = policies.find(p => p.policyId === policyId) || policies[0];

    const marks = await MarksService.getMarks(tenantId, examinationId);

    // Aggregate by student
    const studentMap: Record<string, { name: string; totalObt: number; totalMax: number; enrollmentId: string }> = {};
    marks.forEach(m => {
      if (!studentMap[m.studentId]) {
        studentMap[m.studentId] = { name: m.studentName || 'Student', totalObt: 0, totalMax: 0, enrollmentId: m.enrollmentId };
      }
      studentMap[m.studentId].totalObt += m.obtainedMarks;
      studentMap[m.studentId].totalMax += m.maximumMarks;
    });

    let records: StudentRankRecord[] = Object.keys(studentMap).map(stdId => {
      const data = studentMap[stdId];
      const max = data.totalMax > 0 ? data.totalMax : 100;
      const pct = Number(((data.totalObt / max) * 100).toFixed(policy.roundingDecimals));
      return {
        studentId: stdId,
        studentName: data.name,
        enrollmentId: data.enrollmentId,
        classId: 'cls_demo',
        sectionId: 'sec_demo',
        totalScore: data.totalObt,
        maxScore: max,
        percentage: pct,
        rank: 0,
        eligible: true
      };
    });

    // Sort descending by percentage
    records.sort((a, b) => b.percentage - a.percentage);

    // Assign ranks with competition tie handling (e.g. 1, 1, 3)
    let currentRank = 1;
    for (let i = 0; i < records.length; i++) {
      if (i > 0 && records[i].percentage === records[i - 1].percentage) {
        records[i].rank = records[i - 1].rank;
      } else {
        records[i].rank = i + 1;
      }
    }

    const snapshotId = `snap_${Date.now()}`;
    const now = new Date().toISOString();

    const snapshot: RankingSnapshot = {
      snapshotId,
      tenantId,
      policyId: policy.policyId,
      policyVersion: policy.version,
      academicYearId: policy.academicYearId,
      scope: policy.rankingScope,
      scopeId: 'cls_demo',
      status: 'PUBLISHED',
      records,
      calculatedAt: now,
      publishedAt: now
    };

    await FirebaseService.setDocument(SNAPSHOTS_COL, snapshotId, snapshot);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'RANKING_CALCULATED' as any,
      resource: 'ranking_snapshot' as any,
      resourceId: snapshotId,
      resourceName: `Ranking Run for Exam ${examinationId}`,
      newValue: snapshot,
      result: 'SUCCESS'
    });

    return snapshot;
  }
}
