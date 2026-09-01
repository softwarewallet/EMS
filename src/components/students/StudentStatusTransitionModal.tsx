import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Student, StudentLifecycleStatus } from '../../types';
import { StudentService } from '../../services/studentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowRightLeft, ShieldAlert, CheckCircle2, UserX, Award, Clock } from 'lucide-react';

interface Props {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const StudentStatusTransitionModal: React.FC<Props> = ({
  student,
  isOpen,
  onClose,
  onStatusUpdated
}) => {
  const { notify } = useNotification();
  const { currentUser, hasPermission } = useAuth();

  const [targetStatus, setTargetStatus] = useState<StudentLifecycleStatus>('TRANSFERRED');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [destinationInstitution, setDestinationInstitution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStatusNorm = (student.status ? student.status.toUpperCase() : 'ACTIVE') as StudentLifecycleStatus;

  // Determine allowed transition options based on current status and user permissions
  const getStatusOptions = () => {
    const options: { value: StudentLifecycleStatus; label: string; icon: any; permission: string; desc: string }[] = [];

    if (currentStatusNorm === 'ACTIVE' || (currentStatusNorm as string) === 'ENROLLED') {
      if (hasPermission('student.status.change')) {
        options.push({
          value: 'ON_LEAVE',
          label: 'Place On Leave',
          icon: Clock,
          permission: 'student.status.change',
          desc: 'Temporary sanctioned leave of absence'
        });
        options.push({
          value: 'INACTIVE',
          label: 'Mark Inactive',
          icon: UserX,
          permission: 'student.status.change',
          desc: 'Temporarily deactivate student profile'
        });
      }
      if (hasPermission('student.transfer')) {
        options.push({
          value: 'TRANSFERRED',
          label: 'Official Transfer',
          icon: ArrowRightLeft,
          permission: 'student.transfer',
          desc: 'Transfer student to another institution'
        });
      }
      if (hasPermission('student.withdraw')) {
        options.push({
          value: 'WITHDRAWN',
          label: 'Official Withdrawal',
          icon: UserX,
          permission: 'student.withdraw',
          desc: 'Permanent student withdrawal'
        });
      }
      if (hasPermission('student.graduate')) {
        options.push({
          value: 'GRADUATED',
          label: 'Mark Graduated',
          icon: Award,
          permission: 'student.graduate',
          desc: 'Successfully completed program'
        });
      }
    } else if (currentStatusNorm === 'ON_LEAVE' || currentStatusNorm === 'INACTIVE') {
      if (hasPermission('student.status.change')) {
        options.push({
          value: 'ACTIVE',
          label: 'Reactivate / Return to Active',
          icon: CheckCircle2,
          permission: 'student.status.change',
          desc: 'Reinstate active student status'
        });
      }
    } else if (currentStatusNorm === 'GRADUATED') {
      if (hasPermission('student.graduate')) {
        options.push({
          value: 'ALUMNI',
          label: 'Transition to Alumni',
          icon: Award,
          permission: 'student.graduate',
          desc: 'Move graduated student record to Alumni directory'
        });
      }
    }

    return options;
  };

  const options = getStatusOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      notify('error', 'Reason Required', 'Please state the official reason for this status change.');
      return;
    }

    setIsSubmitting(true);
    try {
      await StudentService.changeStudentStatus(
        student.id,
        targetStatus,
        reason,
        remarks,
        destinationInstitution,
        {
          userId: currentUser?.id || 'usr_admin',
          email: currentUser?.email || 'admin@edutech.edu',
          name: currentUser?.displayName || 'Admin Officer'
        }
      );

      notify('success', 'Lifecycle Status Updated', `${student.firstName} ${student.lastName} status changed to ${targetStatus}.`);
      onStatusUpdated();
      onClose();
    } catch (err: any) {
      notify('error', 'Status Update Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (options.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Unauthorized Status Change"
        subtitle={`Current status: ${currentStatusNorm}`}
      >
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <p className="font-bold">Insufficient Permission or Invalid Transition</p>
            <p>You do not hold the required RBAC authorization (e.g. `student.status.change`, `student.transfer`, `student.withdraw`, `student.graduate`) or the student is in a terminal state ({currentStatusNorm}).</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Status Transition Engine"
      subtitle={`Updating record for ${student.firstName} ${student.lastName} (${student.studentIdNumber})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-2xs uppercase tracking-wider">Current Lifecycle State</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{currentStatusNorm}</span>
          </div>
          <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
          <div>
            <span className="text-slate-400 block text-2xs uppercase tracking-wider">Target State</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{targetStatus}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Target Lifecycle Action *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = targetStatus === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setTargetStatus(opt.value)}
                  className={`p-3 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-2xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {targetStatus === 'TRANSFERRED' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Destination School / Institution
            </label>
            <input
              type="text"
              value={destinationInstitution}
              onChange={(e) => setDestinationInstitution(e.target.value)}
              placeholder="e.g. St. Xavier's High School, Mumbai"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Official Reason for Status Change *
          </label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Parent job relocation / Completed secondary board requirements"
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Additional Administrative Remarks
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional reference TC numbers, board clearance notes, etc."
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1.5"
          >
            {isSubmitting ? 'Updating...' : 'Authorize Status Transition'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
