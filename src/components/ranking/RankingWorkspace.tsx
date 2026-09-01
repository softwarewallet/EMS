import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Play, 
  Users, 
  BarChart3,
  Sliders
} from 'lucide-react';
import { RankingPolicy, RankingSnapshot } from '../../types/ranking';
import { RankingService } from '../../services/rankingService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const RankingWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [policies, setPolicies] = useState<RankingPolicy[]>([]);
  const [snapshots, setSnapshots] = useState<RankingSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'rankings' | 'policies'>('rankings');
  const [selectedSnapshot, setSelectedSnapshot] = useState<RankingSnapshot | null>(null);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const pols = await RankingService.getPolicies(tenantId);
      setPolicies(pols);
      const snaps = await RankingService.getSnapshots(tenantId);
      setSnapshots(snaps);
      if (snaps.length > 0) setSelectedSnapshot(snaps[0]);
    } catch (err) {
      console.error('Error loading ranking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunRanking = async () => {
    if (policies.length === 0) return;
    try {
      await RankingService.calculateRanking(tenantId, policies[0].policyId, 'exam_default', user);
      setSuccessMessage('Ranking calculation completed successfully with competition tie policy.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Ranking calculation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Merit, Ranking & Comparative Performance</h2>
          <p className="text-sm text-slate-500">Phase 7.6B Authoritative Ranking Calculations, Tie Handling, and Merit Lists.</p>
        </div>
        <button
          onClick={handleRunRanking}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
        >
          <Play className="w-4 h-4" />
          Run Ranking Calculation
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('rankings')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'rankings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Ranking Runs ({snapshots.length})
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'policies' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Ranking Policies ({policies.length})
        </button>
      </div>

      {activeTab === 'rankings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Official Ranking Snapshots</h3>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
              {snapshots.map(snap => (
                <div 
                  key={snap.snapshotId}
                  onClick={() => setSelectedSnapshot(snap)}
                  className={`p-4 cursor-pointer transition-colors ${selectedSnapshot?.snapshotId === snap.snapshotId ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{snap.scope} Ranking</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {snap.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Academic Year: {snap.academicYearId}</p>
                  <p className="text-xs text-slate-600 mt-2">Students Ranked: <strong>{snap.records.length}</strong></p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {selectedSnapshot ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">MERIT & RANKING REGISTER</h3>
                    <p className="text-xs text-slate-500">Calculated At: {new Date(selectedSnapshot.calculatedAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                    Scope: {selectedSnapshot.scope}
                  </span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200">
                        <th className="p-3">Rank</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Total Score</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedSnapshot.records.map(rec => (
                        <tr key={rec.studentId} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              rec.rank === 1 ? 'bg-amber-100 text-amber-800' :
                              rec.rank === 2 ? 'bg-slate-200 text-slate-800' :
                              rec.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {rec.rank}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-900">{rec.studentName}</td>
                          <td className="p-3 font-mono text-slate-700">{rec.totalScore} / {rec.maxScore}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{rec.percentage}%</td>
                          <td className="p-3">
                            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                              Eligible
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">Select a ranking run snapshot to view details.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Configurable Ranking Policies</h3>
            <span className="text-xs text-slate-500 font-medium">{policies.length} Policies Registered</span>
          </div>
          <div className="divide-y divide-slate-100">
            {policies.map(pol => (
              <div key={pol.policyId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{pol.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg">{pol.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pol.description || 'No description.'}</p>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  Method: {pol.rankingMethod} | Tie Policy: {pol.tiePolicy}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
