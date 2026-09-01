import React from 'react';
import { Modal } from '../common/Modal';
import { StudentDuplicateCandidate } from '../../types';
import { AlertTriangle, UserCheck, Eye, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  candidates: StudentDuplicateCandidate[];
  onCancel: () => void;
  onProceedAnyway: () => void;
  onSelectExistingStudent: (studentId: string) => void;
}

export const StudentDuplicateWarningModal: React.FC<Props> = ({
  isOpen,
  candidates,
  onCancel,
  onProceedAnyway,
  onSelectExistingStudent
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Possible Existing Student Records Detected"
      subtitle="Duplicate prevention algorithm flagged potential matching student profiles."
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <p className="font-bold">Avoid Duplicate Identity Creation</p>
            <p>EMS enforces ONE authoritative student identity. Please review the potential matching student profiles below before proceeding.</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {candidates.map((cand) => {
            const st = cand.student;
            return (
              <div
                key={st.id}
                className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {st.firstName} {st.middleName || ''} {st.lastName}
                    </span>
                    <span className="text-2xs font-mono font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {cand.confidenceScore}% Match
                    </span>
                  </div>
                  <p className="text-2xs text-slate-500 font-mono mt-0.5">
                    Admission ID: {st.studentIdNumber} • DOB: {st.dateOfBirth} • Class: {st.currentClassId}
                  </p>

                  <ul className="mt-1 space-y-0.5">
                    {cand.matchReasons.map((r, idx) => (
                      <li key={idx} className="text-2xs text-indigo-600 dark:text-indigo-400 font-medium">
                        • {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectExistingStudent(st.id)}
                  className="px-3 py-1.5 text-2xs font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-1 shrink-0"
                >
                  <Eye className="w-3 h-3" />
                  View Record
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
          >
            Cancel Registration
          </button>

          <button
            type="button"
            onClick={onProceedAnyway}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 justify-center"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Proceed with Authorized New Record
          </button>
        </div>
      </div>
    </Modal>
  );
};
