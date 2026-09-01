import React, { useState } from 'react';
import { Library, BookOpen, BookmarkCheck, Search, Plus, User, AlertCircle, CheckCircle } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const [search, setSearch] = useState('');

  const books = [
    { id: 'BK-101', title: 'Concepts of Physics (Vol 1 & 2)', author: 'Dr. H.C. Verma', isbn: '978-8177091878', category: 'Physics & Science', totalCopies: 45, availableCopies: 28, shelf: 'SCI-04' },
    { id: 'BK-102', title: 'Mathematics for Class 10 (NCERT & Exemplar)', author: 'R.D. Sharma', isbn: '978-9383182107', category: 'Mathematics', totalCopies: 50, availableCopies: 32, shelf: 'MTH-12' },
    { id: 'BK-103', title: 'Malgudi Days & The Guide', author: 'R.K. Narayan', isbn: '978-8185986173', category: 'Indian Literature', totalCopies: 30, availableCopies: 14, shelf: 'LIT-02' },
    { id: 'BK-104', title: 'Wings of Fire (An Autobiography)', author: 'Dr. A.P.J. Abdul Kalam', isbn: '978-8173711466', category: 'Biography & Science', totalCopies: 35, availableCopies: 18, shelf: 'BIO-09' },
    { id: 'BK-105', title: 'Computer Science with Python (CBSE Class XI & XII)', author: 'Sumita Arora', isbn: '978-9389287341', category: 'Computer Science', totalCopies: 25, availableCopies: 12, shelf: 'CS-01' },
    { id: 'BK-106', title: 'India After Gandhi: The History of the World’s Largest Democracy', author: 'Ramachandra Guha', isbn: '978-9382618652', category: 'History & Social Studies', totalCopies: 20, availableCopies: 9, shelf: 'HIS-07' },
  ];

  const issues = [
    { student: 'Samira Khan', grade: 'Class 4', book: 'Wings of Fire', issueDate: '2026-08-15', dueDate: '2026-08-29', status: 'borrowed' },
    { student: 'Aarav Sharma', grade: 'Class 10', book: 'Concepts of Physics - H.C. Verma', issueDate: '2026-08-10', dueDate: '2026-08-24', status: 'due_today' },
    { student: 'Ananya Verma', grade: 'Class 10', book: 'Mathematics - R.D. Sharma', issueDate: '2026-08-01', dueDate: '2026-08-15', status: 'overdue' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Campus Library & Book Circulation</h2>
          <p className="text-xs text-slate-500 mt-1">NCERT curriculum books, reference materials, barcode checkout, and return ledgers</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add New Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Catalog (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Book Catalog</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, author or ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {books.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{b.title}</h4>
                  <p className="text-2xs text-slate-400 mt-0.5">Author: {b.author} • Shelf: <span className="font-mono font-semibold text-slate-600">{b.shelf}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{b.availableCopies} / {b.totalCopies} Available</span>
                  <span className="block text-3xs text-emerald-600 font-medium">In Stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currently Issued Books */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Active Book Borrowers</h3>
          <div className="space-y-4">
            {issues.map((i, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-slate-800 block">{i.student}</strong>
                    <span className="text-2xs text-slate-400">{i.grade}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-3xs font-bold uppercase ${
                    i.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                    i.status === 'due_today' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {i.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
                <div className="text-2xs text-slate-600">
                  <span className="font-medium text-slate-700">{i.book}</span>
                  <p className="text-slate-400 mt-0.5">Due: {i.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
