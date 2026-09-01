import React, { useState, useEffect } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import { StaffPerformanceCycle, StaffPerformanceReview, RatingBand } from '../../types';
import { TrendingUp, Plus, CheckCircle2, Star, UserCheck, AlertTriangle } from 'lucide-react';

export const PerformanceTab: React.FC = () => {
  const { tenantId, staffList, performanceCycles, currentUser } = useStaffContext();
  const { notify } = useNotification();

  const [selectedCycleId, setSelectedCycleId] = useState<string>(performanceCycles[0]?.id || 'cycle_2026');
  const [reviews, setReviews] = useState<StaffPerformanceReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Review Edit Modal
  const [selectedReview, setSelectedReview] = useState<StaffPerformanceReview | null>(null);
  const [managerRating, setManagerRating] = useState<number>(4);
  const [managerComments, setManagerComments] = useState<string>('');
  const [ratingBand, setRatingBand] = useState<RatingBand>('EXCEEDS_EXPECTATIONS');

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await StaffService.getPerformanceReviews(tenantId, selectedCycleId);
      setReviews(data);
    } catch (err: any) {
      console.error('Failed to load performance reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [tenantId, selectedCycleId]);

  const handleCompleteReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      await StaffService.updatePerformanceReview(
        tenantId,
        selectedReview.id,
        {
          ratingScore: Number(managerRating),
          reviewerComments: managerComments.trim(),
          reviewOutcome: ratingBand,
          status: 'COMPLETED'
        },
        currentUser
      );

      notify('success', 'Appraisal Completed', 'Managerial performance review and score submitted.');

      setSelectedReview(null);
      await loadReviews();
    } catch (err: any) {
      notify('error', 'Submission Blocked', err.message || 'Could not complete appraisal review.');
    }
  };

  const getBandBadge = (band?: RatingBand) => {
    switch (band) {
      case 'OUTSTANDING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'EXCEEDS_EXPECTATIONS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEETS_EXPECTATIONS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NEEDS_IMPROVEMENT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'UNSATISFACTORY':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Performance Appraisals & Merit Ratings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct multi-stage faculty reviews, self-assessments, departmental manager scoring, and rating bands.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <select
            value={selectedCycleId}
            onChange={(e) => setSelectedCycleId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
          >
            {performanceCycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cycleName} ({c.status})
              </option>
            ))}
            {performanceCycles.length === 0 && (
              <option value="cycle_2026">Annual Faculty Appraisal 2026-27</option>
            )}
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Appraisal Roster ({reviews.length})</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Staff Appraisee</th>
                <th className="px-4 py-3.5">Self Rating</th>
                <th className="px-4 py-3.5">Manager Score</th>
                <th className="px-4 py-3.5">Performance Band</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((rev) => {
                const staff = staffList.find((s) => s.id === rev.staffId);
                const isSelf = currentUser.id === rev.staffId || currentUser.email === staff?.email;

                return (
                  <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900 block">{staff?.fullName || 'Faculty Member'}</span>
                      <span className="text-xs text-slate-400 font-mono">{staff?.department}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      {rev.selfRating ? (
                        <span className="font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {rev.selfRating} / 5
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not submitted</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      {rev.managerRating ? (
                        <span className="font-bold text-blue-700 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                          {rev.managerRating} / 5
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending review</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBandBadge(rev.ratingBand)}`}>
                        {rev.ratingBand || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          rev.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {isSelf ? (
                        <span className="text-xs text-slate-400 italic">Self-appraisal only</span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedReview(rev);
                            setManagerRating(rev.managerRating || 4);
                            setManagerComments(rev.managerComments || '');
                            setRatingBand(rev.ratingBand || 'EXCEEDS_EXPECTATIONS');
                          }}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Review & Grade
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs italic">
                    No appraisal reviews initialized for this cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Conduct Manager Review</h3>

            <form onSubmit={handleCompleteReview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Manager Rating (1 - 5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.5}
                  value={managerRating}
                  onChange={(e) => setManagerRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Performance Rating Band</label>
                <select
                  value={ratingBand}
                  onChange={(e) => setRatingBand(e.target.value as RatingBand)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="OUTSTANDING">Outstanding</option>
                  <option value="EXCEEDS_EXPECTATIONS">Exceeds Expectations</option>
                  <option value="MEETS_EXPECTATIONS">Meets Expectations</option>
                  <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                  <option value="UNSATISFACTORY">Unsatisfactory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Manager Feedback & Observations</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide structured feedback on teaching outcomes and contributions..."
                  value={managerComments}
                  onChange={(e) => setManagerComments(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs"
                >
                  Finalize Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
