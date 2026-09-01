import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Download, Plus, Search, Filter } from 'lucide-react';

interface FeeRecord {
  id: string;
  studentName: string;
  rollNo: string;
  grade: string;
  feeType: 'Tuition Fee' | 'Transport Fee' | 'Lab & Library' | 'Uniform & Books';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export const ManageFeesView: React.FC = () => {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([
    { id: 'FEE-101', studentName: 'Samira Khan', rollNo: 'G4-01', grade: 'Grade 4', feeType: 'Tuition Fee', amount: 18500, dueDate: '2026-09-01', status: 'paid', paidDate: '2026-08-20' },
    { id: 'FEE-102', studentName: "Savio D'Souza", rollNo: 'G4-02', grade: 'Grade 4', feeType: 'Tuition Fee', amount: 18500, dueDate: '2026-09-01', status: 'paid', paidDate: '2026-08-22' },
    { id: 'FEE-103', studentName: 'Deepa Iyer', rollNo: 'G4-03', grade: 'Grade 4', feeType: 'Transport Fee', amount: 4200, dueDate: '2026-09-05', status: 'pending' },
    { id: 'FEE-104', studentName: 'Jessica Fernandes', rollNo: 'G4-04', grade: 'Grade 4', feeType: 'Lab & Library', amount: 3500, dueDate: '2026-09-01', status: 'paid', paidDate: '2026-08-19' },
    { id: 'FEE-105', studentName: 'Rohan Gupta', rollNo: 'G4-05', grade: 'Grade 4', feeType: 'Tuition Fee', amount: 18500, dueDate: '2026-08-15', status: 'overdue' },
    { id: 'FEE-106', studentName: 'Ananya Verma', rollNo: 'G4-06', grade: 'Grade 4', feeType: 'Uniform & Books', amount: 5600, dueDate: '2026-09-01', status: 'paid', paidDate: '2026-08-24' },
    { id: 'FEE-107', studentName: 'Aarav Sharma', rollNo: '10A-01', grade: 'Class 10', feeType: 'Tuition Fee', amount: 24500, dueDate: '2026-09-01', status: 'paid', paidDate: '2026-08-21' },
    { id: 'FEE-108', studentName: 'Kavya Nair', rollNo: '10A-02', grade: 'Class 10', feeType: 'Transport Fee', amount: 5000, dueDate: '2026-09-10', status: 'pending' },
  ]);

  const filtered = feeRecords.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || r.status === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const totalCollected = feeRecords.filter(r => r.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = feeRecords.filter(r => r.status === 'pending' || r.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Collected (This Term)</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
          <span className="text-2xs text-slate-400">82% collection rate achieved</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Dues</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
          <span className="text-2xs text-slate-400">18% outstanding fees</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Fee Challans</span>
            <p className="text-2xl font-bold text-slate-800 mt-1">{feeRecords.length}</p>
          </div>
          <button className="px-3 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Issue Fee Challan
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Fee Challans & Receipts</h3>
            <p className="text-xs text-slate-500">Track student tuition fees, bus charges, and annual development heads</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or Challan ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-2xs font-semibold">
              {['All', 'Paid', 'Pending', 'Overdue'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filterType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">CHALLAN ID</th>
                <th className="pb-3">STUDENT</th>
                <th className="pb-3">FEE HEAD</th>
                <th className="pb-3">AMOUNT (INR)</th>
                <th className="pb-3">DUE DATE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-mono text-2xs text-slate-600">{item.id}</td>
                  <td className="py-3.5 font-semibold text-slate-800">
                    {item.studentName}
                    <span className="block text-2xs text-slate-400 font-normal">{item.grade} • {item.rollNo}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{item.feeType}</td>
                  <td className="py-3.5 font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 text-slate-500">{item.dueDate}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                      item.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      item.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {item.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'pending' && <Clock className="w-3 h-3" />}
                      {item.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={() => alert(`Receipt downloaded for ${item.studentName} - Challan ${item.id}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-2xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Receipt PDF
                    </button>
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
