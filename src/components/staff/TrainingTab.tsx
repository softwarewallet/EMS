import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffTrainingProgram } from '../../types';
import { BookOpen, Plus, CheckCircle2, Award, Users, Calendar } from 'lucide-react';

export const TrainingTab: React.FC = () => {
  const { staffList } = useStaffContext();

  const [programs, setPrograms] = useState<StaffTrainingProgram[]>([
    {
      id: 'tp_1',
      tenantId: 'tenant_default',
      programTitle: 'Advanced Digital Pedagogy & Hybrid Classroom Orchestration',
      description: 'Mastering interactive smart board tools, digital formative assessments, and adaptive homework modules.',
      category: 'PEDAGOGY',
      deliveryMode: 'BLENDED',
      creditsHours: 16,
      provider: 'National Council of Teacher Education',
      status: 'PUBLISHED',
      mandatoryForCategories: ['TEACHING']
    },
    {
      id: 'tp_2',
      tenantId: 'tenant_default',
      programTitle: 'Child Safeguarding & Mandatory Duty of Care Compliance 2026',
      description: 'Comprehensive statutory protection protocols, recognizing signs of distress, and emergency escalation workflows.',
      category: 'SAFETY_COMPLIANCE',
      deliveryMode: 'ONLINE',
      creditsHours: 8,
      provider: 'Child Protection Authority',
      status: 'PUBLISHED',
      mandatoryForCategories: ['TEACHING', 'NON_TEACHING', 'ADMINISTRATIVE', 'SUPPORT_STAFF']
    },
    {
      id: 'tp_3',
      tenantId: 'tenant_default',
      programTitle: 'Executive Leadership & Curriculum Benchmarking for HODs',
      description: 'Departmental budgeting, performance metrics, peer observation cycles, and academic quality assurance.',
      category: 'LEADERSHIP',
      deliveryMode: 'IN_PERSON',
      creditsHours: 24,
      provider: 'Institute of Educational Leadership',
      status: 'PUBLISHED',
      mandatoryForCategories: ['MANAGEMENT']
    }
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<any>('PEDAGOGY');
  const [provider, setProvider] = useState<string>('');
  const [credits, setCredits] = useState<number>(8);
  const [desc, setDesc] = useState<string>('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newProg: StaffTrainingProgram = {
      id: `tp_${Date.now()}`,
      tenantId: 'tenant_default',
      title: title.trim(),
      description: desc.trim(),
      category,
      deliveryMode: 'IN_PERSON',
      durationHours: Number(credits),
      isMandatory: false,
      provider: provider.trim() || 'Internal Academic Council',
      status: 'PUBLISHED',
      createdAt: now,
      updatedAt: now
    };
    setPrograms([newProg, ...programs]);
    setShowModal(false);
    setTitle('');
    setDesc('');
    setProvider('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Professional Development & CPD Training Catalog
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate certified training workshops, track mandatory compliance credits, and upskill faculty.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Training Program
        </button>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {prog.category}
                </span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {prog.creditsHours} CPD Credits
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-2">{prog.programTitle}</h4>
              <p className="text-xs text-slate-500 line-clamp-3 mb-4">{prog.description}</p>

              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Provider:</span>
                  <span className="font-medium text-slate-800">{prog.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery:</span>
                  <span className="font-medium text-slate-800">{prog.deliveryMode}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Published
              </span>
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-lg text-xs transition-colors cursor-pointer">
                Enroll Faculty
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Professional Development Course</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formative Assessment & Differentiated Instruction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="PEDAGOGY">Pedagogy</option>
                  <option value="SAFETY_COMPLIANCE">Safety & Compliance</option>
                  <option value="LEADERSHIP">Leadership & Management</option>
                  <option value="TECHNOLOGY">Technology & Tools</option>
                  <option value="SPECIAL_EDUCATION">Special Education / Inclusive</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CPD Credits (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Provider Body</label>
                  <input
                    type="text"
                    placeholder="e.g. EdTech Academy"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Overview & Objectives</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Summarize course goals and outcomes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
