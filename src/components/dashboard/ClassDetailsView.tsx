import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';
import { AcademicService } from '../../services/academicService';
import { AttendanceService } from '../../services/attendanceService';
import { Student, ClassGrade, StudentAttendanceRecord } from '../../types';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  MoreVertical, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Trophy,
  Filter,
  Eye,
  Calendar
} from 'lucide-react';

interface ClassDetailsViewProps {
  onNavigate?: (tab: string) => void;
}

const DEFAULT_GRADES = [
  'KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'
];

interface MockStudentRow {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  description: string;
  status: 'present' | 'absent' | 'late';
  rollNumber: string;
}

export const ClassDetailsView: React.FC<ClassDetailsViewProps> = ({ onNavigate }) => {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();

  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 4');
  const [studentTimeframe, setStudentTimeframe] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Today');
  const [examTimeframe, setExamTimeframe] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Today');
  const [competitionTimeframe, setCompetitionTimeframe] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Today');
  const [examsTimeframe, setExamsTimeframe] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Today');
  const [feesTab, setFeesTab] = useState<'Course' | 'Transport' | 'Book' | 'Uniform'>('Course');
  
  const [students, setStudents] = useState<MockStudentRow[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<MockStudentRow | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentDesc, setNewStudentDesc] = useState('Open house On 10:00 am');

  // Sample avatar list for aesthetic realism
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  ];

  // Seed sample students directly matching mockup and syncing with database
  useEffect(() => {
    const initialList: MockStudentRow[] = [
      {
        id: 'stu_1',
        name: 'Samira Khan',
        email: 'samira.khan@gmail.com',
        avatar: avatars[0],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-01'
      },
      {
        id: 'stu_2',
        name: "Savio D'Souza",
        email: 'savio.dsouza@gmail.com',
        avatar: avatars[1],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-02'
      },
      {
        id: 'stu_3',
        name: 'Deepa Iyer',
        email: 'deepa.iyer@gmail.com',
        avatar: avatars[2],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-03'
      },
      {
        id: 'stu_4',
        name: 'Jessica Fernandes',
        email: 'jessica.f@gmail.com',
        avatar: avatars[3],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-04'
      },
      {
        id: 'stu_5',
        name: 'Rohan Gupta',
        email: 'rohan.gupta@gmail.com',
        avatar: avatars[4],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-05'
      },
      {
        id: 'stu_6',
        name: 'Ananya Verma',
        email: 'ananya.verma@gmail.com',
        avatar: avatars[5],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-06'
      },
      {
        id: 'stu_7',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        avatar: avatars[6],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-07'
      },
      {
        id: 'stu_8',
        name: 'Kavya Nair',
        email: 'kavya.nair@gmail.com',
        avatar: avatars[7],
        grade: 'Grade 4',
        description: 'Open house On 10:00 am',
        status: 'present',
        rollNumber: 'G4-08'
      }
    ];

    // Load real students if present
    if (currentTenant) {
      StudentService.getStudents(currentTenant.id).then(dbStudents => {
        if (dbStudents && dbStudents.length > 0) {
          const mapped: MockStudentRow[] = dbStudents.map((s, idx) => ({
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email || `${s.firstName.toLowerCase()}${idx + 1}@gmail.com`,
            avatar: avatars[idx % avatars.length],
            grade: selectedGrade,
            description: 'Open house On 10:00 am',
            status: 'present',
            rollNumber: s.rollNumber || `G4-${idx + 1}`
          }));
          setStudents(mapped);
        } else {
          setStudents(initialList);
        }
      }).catch(() => setStudents(initialList));
    } else {
      setStudents(initialList);
    }
  }, [currentTenant, selectedGrade]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: MockStudentRow = {
      id: `stu_${Date.now()}`,
      name: newStudentName,
      email: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      grade: selectedGrade,
      description: newStudentDesc,
      status: 'present',
      rollNumber: `G4-${students.length + 1}`
    };

    setStudents([newStudent, ...students]);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Section: Class Details Grade Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Class details</h2>
          <span className="text-xs text-slate-400 font-medium">Academic Year 2025–2026</span>
        </div>

        {/* Grade Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DEFAULT_GRADES.map((grade) => {
            const isActive = selectedGrade === grade;
            return (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-6 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0052FF] text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {grade}
              </button>
            );
          })}
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center shrink-0"
            title="Add student to class"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Top Row Grid: Students Table (60%) + Attendance Widgets (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Students Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">Students</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{students.length} Total</span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">NAME</th>
                    <th className="pb-3 font-semibold">CLASS</th>
                    <th className="pb-3 font-semibold">DISCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {students.slice(0, 8).map((stu) => (
                    <tr 
                      key={stu.id} 
                      onClick={() => setSelectedStudent(stu)}
                      className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* Name + Email + Avatar */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.avatar}
                            alt={stu.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {stu.name}
                            </p>
                            <p className="text-2xs text-[#0052FF] font-medium">
                              {stu.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 pr-4 text-slate-500 font-medium">
                        {stu.grade}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 text-slate-400">
                        {stu.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Card: Attendance Dual Donut Widgets */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Attendance</h3>
          </div>

          {/* Section 1: No of students */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">No of students</span>
              <div className="flex items-center gap-2 text-2xs text-slate-400 font-medium">
                {(['Today', 'Week', 'Month', 'Year'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setStudentTimeframe(t)}
                    className={`pb-0.5 transition-colors ${
                      studentTimeframe === t
                        ? 'text-slate-800 font-bold border-b-2 border-slate-800'
                        : 'hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Donut Chart and Legend */}
            <div className="flex items-center justify-between pt-2">
              {/* Legend */}
              <div className="space-y-2 text-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-2xs bg-[#FF3B30] shrink-0" />
                  <span className="text-slate-700 font-medium">97% Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-2xs bg-[#0052FF] shrink-0" />
                  <span className="text-slate-700 font-medium">3% Not Attended</span>
                </div>
              </div>

              {/* Donut Ring Chart with 50 in center */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background full circle / Not attended (Blue 3%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="text-[#0052FF]"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Foreground Attended Arc (Red/Coral 97%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="text-[#FF3B30]"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - 0.97)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-base font-bold text-slate-800">50</span>
              </div>
            </div>
          </div>

          {/* Section 2: Exam Attendance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Exam Attendance</span>
              <div className="flex items-center gap-2 text-2xs text-slate-400 font-medium">
                {(['Today', 'Week', 'Month', 'Year'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setExamTimeframe(t)}
                    className={`pb-0.5 transition-colors ${
                      examTimeframe === t
                        ? 'text-slate-800 font-bold border-b-2 border-slate-800'
                        : 'hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Donut Chart and Legend */}
            <div className="flex items-center justify-between pt-2">
              {/* Legend */}
              <div className="space-y-2 text-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-2xs bg-[#E6007A] shrink-0" />
                  <span className="text-slate-700 font-medium">97% Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-2xs bg-[#0052FF] shrink-0" />
                  <span className="text-slate-700 font-medium">3% Not Attended</span>
                </div>
              </div>

              {/* Donut Ring Chart with 50 in center (Pink/Magenta + Blue) */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="text-[#0052FF]"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="text-[#E6007A]"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - 0.97)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-base font-bold text-slate-800">50</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Bottom Row Grid: 3 Equal Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CARD 1: Competition */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Competition</h3>
              <div className="flex items-center gap-2 text-2xs text-slate-400 font-medium">
                {(['Today', 'Week', 'Month', 'Year'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCompetitionTimeframe(t)}
                    className={`pb-0.5 transition-colors ${
                      competitionTimeframe === t
                        ? 'text-slate-800 font-bold border-b-2 border-slate-800'
                        : 'hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Lush Smooth Wave Area Chart */}
            <div className="relative w-full h-28 my-2 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="compGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00E676" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#2979FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#651FFF" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d="M0,80 Q40,90 70,65 T140,75 T210,40 T270,15 L300,30 L300,100 L0,100 Z"
                  fill="url(#compGradient)"
                />
                {/* Neon Top Stroke */}
                <path
                  d="M0,80 Q40,90 70,65 T140,75 T210,40 T270,15 L300,30"
                  fill="none"
                  stroke="#00E676"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Peak point indicator */}
                <circle cx="270" cy="15" r="5" fill="#FFE600" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              {/* Peak Value Callout Tag */}
              <div className="absolute right-6 top-0 bg-amber-400 text-slate-900 text-3xs font-extrabold px-1.5 py-0.5 rounded-xs shadow-xs">
                711
              </div>
            </div>
          </div>

          {/* Competition Details List */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                <div className="w-2.5 h-2.5 rounded-2xs bg-[#00E676] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Song competition</p>
                  <p className="text-slate-400">12 Team members</p>
                </div>
              </div>
              <span className="font-semibold text-slate-600">Winner team</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                <div className="w-2.5 h-2.5 rounded-2xs bg-[#304FFE] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Dance competition</p>
                  <p className="text-slate-400">6 members</p>
                </div>
              </div>
              <span className="font-semibold text-slate-600">Average points</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Exams */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Exams</h3>
              <div className="flex items-center gap-2 text-2xs text-slate-400 font-medium">
                {(['Today', 'Week', 'Month', 'Year'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setExamsTimeframe(t)}
                    className={`pb-0.5 transition-colors ${
                      examsTimeframe === t
                        ? 'text-slate-800 font-bold border-b-2 border-slate-800'
                        : 'hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Paired Bar Charts: English & Maths */}
            <div className="flex items-end justify-center gap-14 h-28 my-2 border-b border-slate-100 pb-2">
              {/* English Cluster */}
              <div className="flex items-end gap-1.5 h-full">
                <div className="w-3 bg-[#FF3B30] rounded-t-xs h-[85%]" title="English Pass: 92%" />
                <div className="w-3 bg-[#0052FF] rounded-t-xs h-[30%]" title="English Fail: 7%" />
                <div className="w-2 bg-slate-200 rounded-t-xs h-[8%]" title="English Not Attended: 1%" />
              </div>

              {/* Maths Cluster */}
              <div className="flex items-end gap-1.5 h-full">
                <div className="w-3 bg-[#FF3B30] rounded-t-xs h-[75%]" title="Maths Pass: 80%" />
                <div className="w-3 bg-[#0052FF] rounded-t-xs h-[45%]" title="Maths Fail: 19%" />
                <div className="w-2 bg-slate-200 rounded-t-xs h-[8%]" title="Maths Not Attended: 1%" />
              </div>
            </div>
          </div>

          {/* Breakdown Columns */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-2xs">
            {/* English Column */}
            <div>
              <p className="font-bold text-slate-800 mb-1">English</p>
              <div className="space-y-1 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                  <span>92% pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
                  <span>7% fail</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>1% Not attended</span>
                </div>
              </div>
            </div>

            {/* Maths Column */}
            <div>
              <p className="font-bold text-slate-800 mb-1">Maths</p>
              <div className="space-y-1 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                  <span>80% pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
                  <span>19% fail</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>1% Not attended</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Fees */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Fees</h3>
            </div>

            {/* Fee Tabs */}
            <div className="flex items-center gap-3 text-2xs font-medium text-slate-400 mb-4">
              {(['Course', 'Transport', 'Book', 'Uniform'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFeesTab(tab)}
                  className={`pb-0.5 transition-colors ${
                    feesTab === tab
                      ? 'text-slate-800 font-bold border-b-2 border-slate-800'
                      : 'hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Ribbon 3D Vector Graphic Curve */}
            <div className="w-full h-24 my-2 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 260 80">
                {/* Shadow path */}
                <path
                  d="M20,60 Q50,75 80,55 T140,25 T200,60 T240,15"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Gold Secondary Ribbon */}
                <path
                  d="M20,62 Q50,70 80,58 T140,30 T200,65 T240,20"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* Main Blue Glowing Ribbon */}
                <path
                  d="M20,55 Q50,70 80,48 T140,15 T200,50 T240,10"
                  fill="none"
                  stroke="#0052FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-2xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
              <span className="font-semibold text-slate-700">80% Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span className="font-semibold text-slate-700">20% pending</span>
            </div>
          </div>
        </div>

      </div>

      {/* Student Profile Quick Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Student Profile</h3>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 py-2 border-b border-slate-100">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h4>
                <p className="text-xs text-blue-600 font-medium">{selectedStudent.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-2xs font-semibold">
                    {selectedStudent.grade}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-2xs font-semibold">
                    Roll: {selectedStudent.rollNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Current Schedule</span>
                <span className="font-semibold text-slate-800">{selectedStudent.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Attendance Rate</span>
                <span className="font-semibold text-emerald-600">98% (Exemplary)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Fee Status</span>
                <span className="font-semibold text-blue-600">Paid in Full</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              {onNavigate && (
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    onNavigate('students');
                  }}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Full Directory View
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddStudent} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Student to {selectedGrade}</h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Student / Parent Email</label>
                <input
                  type="email"
                  placeholder="e.g. maya@gmail.com"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Routine / Description Note</label>
                <input
                  type="text"
                  value={newStudentDesc}
                  onChange={(e) => setNewStudentDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
              >
                Save Student
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
