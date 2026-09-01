import React, { useState } from 'react';
import { Award, BookOpen, Calendar, CheckCircle, Clock, Download, Plus, Search, Filter } from 'lucide-react';

export const ExamsView: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState('Term 1 Half-Yearly (CBSE)');

  const examSchedules = [
    { code: 'EX-1001', subject: 'Mathematics (NCERT 041)', grade: 'Class 10', date: '2026-09-15', time: '09:00 AM - 12:00 PM', room: 'Senior Exam Hall A', totalMarks: 100, passMarks: 33 },
    { code: 'EX-1002', subject: 'Science (Theory & Lab Practical)', grade: 'Class 10', date: '2026-09-17', time: '09:00 AM - 12:00 PM', room: 'Senior Exam Hall A', totalMarks: 100, passMarks: 33 },
    { code: 'EX-1003', subject: 'English Language & Literature', grade: 'Class 10', date: '2026-09-19', time: '09:00 AM - 12:00 PM', room: 'Senior Exam Hall B', totalMarks: 100, passMarks: 33 },
    { code: 'EX-1004', subject: 'Social Science (History, Civics, Geo)', grade: 'Class 10', date: '2026-09-22', time: '09:00 AM - 12:00 PM', room: 'Senior Exam Hall B', totalMarks: 100, passMarks: 33 },
    { code: 'EX-1005', subject: 'Hindi Course A / Sanskrit', grade: 'Class 10', date: '2026-09-25', time: '09:00 AM - 12:00 PM', room: 'Senior Exam Hall A', totalMarks: 100, passMarks: 33 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Examination Central & Assessment Board</h2>
          <p className="text-xs text-slate-500 mt-1">CBSE datesheets, marking rubrics, passing thresholds, and official admit cards</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option>Term 1 Half-Yearly (CBSE)</option>
            <option>CBSE Pre-Board Assessment</option>
            <option>Annual Board Examination</option>
            <option>Monthly Unit Test</option>
          </select>
          <button className="px-4 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Schedule Exam
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Official Datesheet — {selectedTerm}</h3>
          <button 
            onClick={() => alert('CBSE Exam Datesheet PDF downloaded successfully.')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Datesheet PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">EXAM CODE</th>
                <th className="pb-3">SUBJECT</th>
                <th className="pb-3">CLASS</th>
                <th className="pb-3">DATE</th>
                <th className="pb-3">TIMING</th>
                <th className="pb-3">EXAM HALL</th>
                <th className="pb-3 text-right">TOTAL / PASS MARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examSchedules.map((ex) => (
                <tr key={ex.code} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-mono text-2xs text-slate-500">{ex.code}</td>
                  <td className="py-3.5 font-bold text-slate-800">{ex.subject}</td>
                  <td className="py-3.5 text-blue-600 font-semibold">{ex.grade}</td>
                  <td className="py-3.5 text-slate-700 font-medium">{ex.date}</td>
                  <td className="py-3.5 text-slate-500">{ex.time}</td>
                  <td className="py-3.5 text-slate-600">{ex.room}</td>
                  <td className="py-3.5 text-right font-semibold text-slate-900">
                    {ex.totalMarks} / <span className="text-emerald-600">{ex.passMarks}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
