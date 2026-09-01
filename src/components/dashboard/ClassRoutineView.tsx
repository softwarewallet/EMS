import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { Calendar, Clock, BookOpen, User, MapPin, Plus, Filter } from 'lucide-react';

interface RoutinePeriod {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'core' | 'lab' | 'break' | 'sports';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ClassRoutineView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState('Class 10');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const schedule: Record<string, RoutinePeriod[]> = {
    Monday: [
      { period: 1, time: '08:30 - 09:15', subject: 'Mathematics (NCERT)', teacher: 'Dr. Sunita Deshmukh', room: 'Room 204', type: 'core' },
      { period: 2, time: '09:20 - 10:05', subject: 'English Core & Literature', teacher: 'Mrs. Meenakshi Sundaram', room: 'Room 204', type: 'core' },
      { period: 3, time: '10:10 - 10:55', subject: 'Physics Practical Lab', teacher: 'Mr. Arvind Swamy', room: 'Physics Lab 1', type: 'lab' },
      { period: 4, time: '11:00 - 11:45', subject: 'Recess / Tiffin Break', teacher: 'Supervised', room: 'Cafeteria', type: 'break' },
      { period: 5, time: '11:50 - 12:35', subject: 'Social Science (History & Civics)', teacher: 'Dr. Rajesh Kulkarni', room: 'Room 204', type: 'core' },
      { period: 6, time: '12:40 - 01:25', subject: 'Physical Education & Yoga', teacher: 'Coach Ramesh Yadav', room: 'Sports Complex', type: 'sports' },
      { period: 7, time: '01:30 - 02:15', subject: 'Arts & Cultural Heritage', teacher: 'Mrs. Anupama Roy', room: 'Art Studio', type: 'core' },
    ],
    Tuesday: [
      { period: 1, time: '08:30 - 09:15', subject: 'Hindi Course A', teacher: 'Acharya Shastri', room: 'Room 204', type: 'core' },
      { period: 2, time: '09:20 - 10:05', subject: 'Mathematics Problem Solving', teacher: 'Dr. Sunita Deshmukh', room: 'Room 204', type: 'core' },
      { period: 3, time: '10:10 - 10:55', subject: 'Computer Applications / Python', teacher: 'Mr. Pradeep Pillai', room: 'IT Lab 2', type: 'lab' },
      { period: 4, time: '11:00 - 11:45', subject: 'Recess / Tiffin Break', teacher: 'Supervised', room: 'Cafeteria', type: 'break' },
      { period: 5, time: '11:50 - 12:35', subject: 'Chemistry Lab Demonstration', teacher: 'Mr. Arvind Swamy', room: 'Chemistry Lab', type: 'lab' },
      { period: 6, time: '12:40 - 01:25', subject: 'Classical Indian Music', teacher: 'Mrs. Anupama Roy', room: 'Music Hall', type: 'core' },
      { period: 7, time: '01:30 - 02:15', subject: 'Library & Reading Period', teacher: 'Dr. Rajesh Kulkarni', room: 'Central Library', type: 'core' },
    ],
    Wednesday: [
      { period: 1, time: '08:30 - 09:15', subject: 'Biology & Environmental Studies', teacher: 'Mr. Arvind Swamy', room: 'Bio Lab', type: 'lab' },
      { period: 2, time: '09:20 - 10:05', subject: 'Mathematics & Geometry', teacher: 'Dr. Sunita Deshmukh', room: 'Room 204', type: 'core' },
      { period: 3, time: '10:10 - 10:55', subject: 'Sanskrit / Third Language', teacher: 'Acharya Shastri', room: 'Room 204', type: 'core' },
      { period: 4, time: '11:00 - 11:45', subject: 'Recess / Tiffin Break', teacher: 'Supervised', room: 'Cafeteria', type: 'break' },
      { period: 5, time: '11:50 - 12:35', subject: 'Geography & Economics', teacher: 'Dr. Rajesh Kulkarni', room: 'Room 204', type: 'core' },
      { period: 6, time: '12:40 - 01:25', subject: 'Robotics & STEM Lab', teacher: 'Mr. Pradeep Pillai', room: 'Innovation Lab', type: 'lab' },
      { period: 7, time: '01:30 - 02:15', subject: 'Class Mentoring & Moral Values', teacher: 'Mrs. Meenakshi Sundaram', room: 'Room 204', type: 'core' },
    ],
    Thursday: [
      { period: 1, time: '08:30 - 09:15', subject: 'Mathematics Board Practice', teacher: 'Dr. Sunita Deshmukh', room: 'Room 204', type: 'core' },
      { period: 2, time: '09:20 - 10:05', subject: 'English Writing & Comprehension', teacher: 'Mrs. Meenakshi Sundaram', room: 'Room 204', type: 'core' },
      { period: 3, time: '10:10 - 10:55', subject: 'Science Demonstration', teacher: 'Mr. Arvind Swamy', room: 'Room 204', type: 'core' },
      { period: 4, time: '11:00 - 11:45', subject: 'Recess / Tiffin Break', teacher: 'Supervised', room: 'Cafeteria', type: 'break' },
      { period: 5, time: '11:50 - 12:35', subject: 'History of Modern India', teacher: 'Dr. Rajesh Kulkarni', room: 'Room 204', type: 'core' },
      { period: 6, time: '12:40 - 01:25', subject: 'Cricket & Athletics', teacher: 'Coach Ramesh Yadav', room: 'Playground', type: 'sports' },
      { period: 7, time: '01:30 - 02:15', subject: 'Debate & Public Speaking', teacher: 'Mrs. Meenakshi Sundaram', room: 'Auditorium', type: 'core' },
    ],
    Friday: [
      { period: 1, time: '08:30 - 09:15', subject: 'Weekly Unit Test / English', teacher: 'Mrs. Meenakshi Sundaram', room: 'Room 204', type: 'core' },
      { period: 2, time: '09:20 - 10:05', subject: 'Weekly Unit Test / Maths', teacher: 'Dr. Sunita Deshmukh', room: 'Room 204', type: 'core' },
      { period: 3, time: '10:10 - 10:55', subject: 'Science Experiments & Viva', teacher: 'Mr. Arvind Swamy', room: 'Science Lab', type: 'lab' },
      { period: 4, time: '11:00 - 11:45', subject: 'Recess / Tiffin Break', teacher: 'Supervised', room: 'Cafeteria', type: 'break' },
      { period: 5, time: '11:50 - 12:35', subject: 'Hindi Literature & Poetry', teacher: 'Acharya Shastri', room: 'Room 204', type: 'core' },
      { period: 6, time: '12:40 - 01:25', subject: 'Social Science Project Work', teacher: 'Dr. Rajesh Kulkarni', room: 'Room 204', type: 'core' },
      { period: 7, time: '01:30 - 02:15', subject: 'Clubs & Co-curricular Activity', teacher: 'Various Mentors', room: 'Activity Hall', type: 'sports' },
    ],
    Saturday: [
      { period: 1, time: '08:30 - 09:15', subject: 'Olympiad & Remedial Maths', teacher: 'Dr. Sunita Deshmukh', room: 'Room 204', type: 'core' },
      { period: 2, time: '09:20 - 10:05', subject: 'Science Quiz & Problem Solving', teacher: 'Mr. Arvind Swamy', room: 'Room 204', type: 'core' },
      { period: 3, time: '10:10 - 10:55', subject: 'House Assembly & Cultural Activity', teacher: 'Faculty Panel', room: 'Auditorium', type: 'sports' },
      { period: 4, time: '11:00 - 11:30', subject: 'Recess & Weekend Dismissal', teacher: 'Supervised', room: 'Main Gate', type: 'break' },
    ]
  };

  const currentPeriods = schedule[selectedDay] || schedule['Monday'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Class Timetable & Daily Academic Routine</h2>
          <p className="text-xs text-slate-500 mt-1">Master timetable schedule, NCERT curriculum periods, and assigned teacher rosters</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            {['Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <button className="px-3.5 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Modify Routine
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Routine Timeline Cards */}
      <div className="space-y-3">
        {currentPeriods.map((p) => (
          <div
            key={p.period}
            className={`p-4 rounded-xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              p.type === 'break'
                ? 'bg-amber-50/60 border-amber-200/80'
                : p.type === 'lab'
                ? 'bg-blue-50/40 border-blue-200/70 hover:border-blue-400'
                : p.type === 'sports'
                ? 'bg-emerald-50/40 border-emerald-200/70 hover:border-emerald-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm shrink-0 shadow-2xs">
                {p.period}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{p.subject}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-3xs font-bold uppercase ${
                    p.type === 'break' ? 'bg-amber-100 text-amber-800' :
                    p.type === 'lab' ? 'bg-blue-100 text-blue-800' :
                    p.type === 'sports' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {p.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> {p.teacher}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {p.room}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start md:self-auto">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{p.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
