import React, { useState } from 'react';
import { Mail, MessageSquare, Search, Send, User, CheckCheck, Clock } from 'lucide-react';

export const InboxView: React.FC = () => {
  const [activeMessageId, setActiveMessageId] = useState('msg_1');
  const [replyText, setReplyText] = useState('');

  const messages = [
    { id: 'msg_1', sender: 'Dr. Sunita Deshmukh', role: 'Senior PGT Mathematics & Class Mentor', subject: 'Aarav Sharma — CBSE Term 1 Performance & PTM', preview: 'Namaste, confirming our scheduled parent-teacher consultation for 10:00 AM this coming Thursday in Room 204.', date: '10:15 AM', unread: true, thread: [
      { sender: 'Dr. Sunita Deshmukh', time: '10:15 AM', content: 'Namaste, confirming our scheduled parent-teacher consultation for 10:00 AM this coming Thursday in Room 204. We will review Aarav\'s Olympiad preparation and mathematics scorecard.' }
    ] },
    { id: 'msg_2', sender: 'Mrs. Meenakshi Sundaram', role: 'Academic Coordinator', subject: 'Class 10 CBSE Pre-Board Datesheet Approval', preview: 'The draft schedule for Class 10 & 12 Pre-Board examinations is ready for administrative sign-off.', date: 'Yesterday', unread: false, thread: [
      { sender: 'Mrs. Meenakshi Sundaram', time: 'Yesterday', content: 'The draft schedule for Class 10 & 12 Pre-Board examinations is ready for administrative sign-off. All subject faculty have verified zero syllabus overlap.' }
    ] },
    { id: 'msg_3', sender: 'Campus Medical & Health Desk', role: 'Infirmary Station', subject: 'Annual Health Check & Blood Group Verification', preview: 'Please ensure all updated medical records and immunization certificates are verified with the school infirmary.', date: 'Aug 21', unread: false, thread: [
      { sender: 'Campus Medical & Health Desk', time: 'Aug 21', content: 'Please ensure all updated medical records and emergency contact details for enrolled pupils are verified with the school infirmary by Friday.' }
    ] },
  ];

  const current = messages.find(m => m.id === activeMessageId) || messages[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    current.thread.push({
      sender: 'You (Principal / Admin)',
      time: 'Just now',
      content: replyText
    });
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Direct Messages & Parent Inbox</h2>
        <p className="text-xs text-slate-500 mt-1">Official communications between teachers, guardians, and institution management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden min-h-[520px]">
        {/* Message List (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveMessageId(m.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  activeMessageId === m.id ? 'bg-blue-50/60 border-l-4 border-[#0052FF]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    {m.unread && <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />}
                    {m.sender}
                  </span>
                  <span className="text-3xs font-medium text-slate-400">{m.date}</span>
                </div>
                <p className="text-2xs font-semibold text-slate-700 truncate">{m.subject}</p>
                <p className="text-2xs text-slate-500 line-clamp-1 mt-0.5">{m.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail & Reply Box (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-800">{current.subject}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> From: <strong className="text-slate-700">{current.sender}</strong> ({current.role})
                </p>
              </div>
              <span className="text-2xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                Internal Memo
              </span>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {current.thread.map((t, idx) => (
                <div key={idx} className={`p-4 rounded-xl text-xs space-y-1.5 ${
                  t.sender.startsWith('You') ? 'bg-blue-50 border border-blue-100 ml-8' : 'bg-slate-50 border border-slate-100 mr-8'
                }`}>
                  <div className="flex items-center justify-between text-2xs font-semibold text-slate-500">
                    <span>{t.sender}</span>
                    <span>{t.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{t.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Input Form */}
          <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your official reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
