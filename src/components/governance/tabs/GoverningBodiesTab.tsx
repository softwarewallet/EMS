import React, { useState } from 'react';
import {
  GovernanceBody,
  GovernanceBodyMember,
  GovernanceMeeting,
  GovernanceResolution,
  GovernanceActionItem
} from '../../../types/governance';
import {
  Users,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  UserCheck,
  Vote,
  ListTodo
} from 'lucide-react';

interface GoverningBodiesTabProps {
  bodies: GovernanceBody[];
  members: GovernanceBodyMember[];
  meetings: GovernanceMeeting[];
  resolutions: GovernanceResolution[];
  actionItems: GovernanceActionItem[];
  onCreateBody: () => void;
  onAddMember: (bodyId: string) => void;
  onScheduleMeeting: (bodyId: string) => void;
  onRecordResolution: (meetingId: string) => void;
  onAddActionItem: (meetingId?: string) => void;
}

export const GoverningBodiesTab: React.FC<GoverningBodiesTabProps> = ({
  bodies,
  members,
  meetings,
  resolutions,
  actionItems,
  onCreateBody,
  onAddMember,
  onScheduleMeeting,
  onRecordResolution,
  onAddActionItem
}) => {
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(
    bodies.length > 0 ? bodies[0].id : null
  );

  const selectedBody = bodies.find((b) => b.id === selectedBodyId) || bodies[0];

  const bodyMembers = selectedBody ? members.filter((m) => m.governanceBodyId === selectedBody.id) : [];
  const bodyMeetings = selectedBody ? meetings.filter((m) => m.governanceBodyId === selectedBody.id) : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Create Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-700" />
            Governing Bodies, Boards & Statutory Committees
          </h3>
          <p className="text-xs text-slate-500">
            Constitute committees, appoint members, record formal meeting resolutions & track action items.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateBody}
            className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Constitute New Body
          </button>
        </div>
      </div>

      {/* Main Grid: Left Body Selector List, Right Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Bodies */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Configured Bodies ({bodies.length})
          </h4>
          <div className="space-y-2">
            {bodies.map((body) => {
              const isSelected = selectedBody?.id === body.id;
              const countMembers = members.filter((m) => m.governanceBodyId === body.id).length;
              const countMeetings = meetings.filter((m) => m.governanceBodyId === body.id).length;

              return (
                <div
                  key={body.id}
                  onClick={() => setSelectedBodyId(body.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{body.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                      {body.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {body.description || 'Statutory committee'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                    <span>{countMembers} Members • {countMeetings} Meetings</span>
                    <span className="text-emerald-600 font-medium">{body.status}</span>
                  </div>
                </div>
              );
            })}

            {bodies.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs space-y-3">
                <p>No governance bodies configured.</p>
                <button
                  onClick={onCreateBody}
                  className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Governance Body
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed View for Selected Body */}
        {selectedBody ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Body Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-800">{selectedBody.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-700">
                      {selectedBody.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{selectedBody.description}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedBody.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-lg p-3 text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Type</span>
                  <span className="font-semibold text-slate-700">{selectedBody.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Quorum Requirement</span>
                  <span className="font-semibold text-slate-700">{selectedBody.quorumRequirement}% Members</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Meeting Frequency</span>
                  <span className="font-semibold text-slate-700">Every {selectedBody.meetingFrequencyMonths} Months</span>
                </div>
              </div>

              {selectedBody.termsOfReference && (
                <div className="text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <span className="font-semibold text-slate-700">Terms of Reference:</span> {selectedBody.termsOfReference}
                </div>
              )}
            </div>

            {/* Member Roster Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-700" />
                  Appointed Member Roster ({bodyMembers.length})
                </h4>
                <button
                  onClick={() => onAddMember(selectedBody.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 rounded-md transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Appoint Member
                </button>
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {bodyMembers.map((m) => (
                  <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <span>{m.userName}</span>
                        {m.votingEligible && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium">
                            Voting Eligible
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {m.designation || 'Member'} • {m.userEmail}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {m.roleInBody}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Term: {m.termStartDate || 'N/A'} - {m.termEndDate || 'Indefinite'}
                      </div>
                    </div>
                  </div>
                ))}

                {bodyMembers.length === 0 && (
                  <p className="py-6 text-center text-xs text-slate-400 italic">
                    No members assigned to this governing body yet.
                  </p>
                )}
              </div>
            </div>

            {/* Meetings & Resolutions Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-700" />
                  Committee Meetings & Minutes ({bodyMeetings.length})
                </h4>
                <button
                  onClick={() => onScheduleMeeting(selectedBody.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 rounded-md transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule Meeting
                </button>
              </div>

              <div className="space-y-3">
                {bodyMeetings.map((m) => {
                  const meetingResolutions = resolutions.filter((r) => r.meetingId === m.id);

                  return (
                    <div key={m.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          {m.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                          {m.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-4">
                        <span>Date: {m.meetingDate} {m.startTime && `at ${m.startTime}`}</span>
                        <span>Venue: {m.venue || 'Main Senate Room'}</span>
                        <span>Attendance: {m.quorumAchieved ? 'Quorum Met' : 'Pending'}</span>
                      </div>

                      {/* Resolutions Sub-block */}
                      {meetingResolutions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
                            <Vote className="w-3 h-3 text-indigo-600" /> Recorded Resolutions
                          </span>
                          {meetingResolutions.map((r) => (
                            <div key={r.id} className="text-[11px] bg-white p-2 rounded border border-slate-200 flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-slate-800">{r.code}: {r.title}</span>
                                <span className="text-slate-400 block text-[10px]">{r.outcomeStatus}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-600">
                                +{r.votesInFavor} / -{r.votesAgainst} / {r.votesAbstain} abst.
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 text-[11px]">
                        <button
                          onClick={() => onRecordResolution(m.id)}
                          className="text-xs text-sky-700 hover:text-sky-800 font-semibold"
                        >
                          + Record Resolution
                        </button>
                      </div>
                    </div>
                  );
                })}

                {bodyMeetings.length === 0 && (
                  <p className="py-6 text-center text-xs text-slate-400 italic">
                    No meetings scheduled or recorded for this committee yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
            Select a governing body from the list to manage member appointments and committee meetings.
          </div>
        )}
      </div>
    </div>
  );
};
