import React from 'react';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import logoImage from '../../images/logo.png';

const IntroScreen = ({ onStartExam, onStartRoleplay }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-700">
    <div className="p-2">
      <img src={logoImage} alt="MindGuard logo" className="w-28 h-28 object-contain" />
    </div>
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
        Youth Mental Health <span className="text-indigo-600">First Aid</span>
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        Adolescence is a critical time. Choose your training mode below:
        Take the certification exam or practice real-time conversations.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center mt-4">
      <button
        onClick={onStartExam}
        className="flex-1 group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-white border-2 border-indigo-100 px-6 font-bold text-indigo-600 transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-50 shadow-sm"
      >
        <CheckCircle2 className="mr-2 h-5 w-5" />
        <span>Certification Exam</span>
      </button>

      <button
        onClick={onStartRoleplay}
        className="flex-1 group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 px-6 font-bold text-white transition-all duration-300 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
      >
        <span>Play Scenarios</span>
        <MessageSquare className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
);

export default IntroScreen;