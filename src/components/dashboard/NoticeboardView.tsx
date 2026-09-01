import React, { useState } from 'react';
import { Megaphone, Bell, Calendar, Tag, Plus, Pin, AlertCircle, CheckCircle } from 'lucide-react';

export const NoticeboardView: React.FC = () => {
  const [notices, setNotices] = useState([
    {
      id: 'NOT-01',
      title: 'CBSE Mid-Term Examination Datesheet & Guidelines (2025-2026)',
      date: '2026-08-25',
      category: 'Exams & CBSE',
      isPinned: true,
      author: 'Office of the Principal',
      content: 'The official datesheets for Class 9 to Class 12 Mid-Term and Half-Yearly Assessments have been released. Roll number slips and admit cards will be distributed by class teachers on Monday.',
    },
    {
      id: 'NOT-02',
      title: 'Annual Inter-House Science & Robotics Exhibition "Vigyan-2026"',
      date: '2026-08-28',
      category: 'Academic & STEM',
      isPinned: true,
      author: 'Dean of Science Department',
      content: 'All students from Class 4 to Class 12 are invited to present working prototypes in AI, Renewable Energy, and Smart Agriculture. Parents are warmly invited to the school auditorium at 10:00 AM.',
    },
    {
      id: 'NOT-03',
      title: 'Parent-Teacher Meeting (PTM) for Term 1 Progress Reviews',
      date: '2026-08-30',
      category: 'PTM & Advisory',
      isPinned: false,
      author: 'Academic Coordination Committee',
      content: 'One-on-one parent conferences to discuss student academic progress, attendance percentage, and CBSE continuous evaluation portfolios in designated homeroom classrooms.',
    },
    {
      id: 'NOT-04',
      title: 'All-India Inter-School Cricket & Football Championship Trials',
      date: '2026-09-02',
      category: 'Sports & Games',
      isPinned: false,
      author: 'Sports & Physical Education Dept',
      content: 'Selection trials for the Delhi State Inter-School Championship squad will be conducted at 03:30 PM on the main athletic grounds. Proper sports kit is mandatory.',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Circulars & Campus Noticeboard</h2>
          <p className="text-xs text-slate-500 mt-1">Official CBSE circulars, school events, examination notices, and institutional directives</p>
        </div>
        <button className="px-4 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Issue Circular
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.map((n) => (
          <div key={n.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-blue-50 text-blue-700">
                  {n.category}
                </span>
                {n.isPinned && (
                  <span className="flex items-center gap-1 text-2xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{n.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {n.date}
              </span>
              <span className="font-medium text-slate-600">Issued by: {n.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
