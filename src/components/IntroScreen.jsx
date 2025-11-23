import React from 'react';
import { ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';



const IntroScreen = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-700">
    <div className="bg-indigo-50 p-6 rounded-full ring-8 ring-indigo-100/50">
      <ShieldCheck className="w-20 h-20 text-indigo-600" />
    </div>
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
        Youth Mental Health <span className="text-indigo-600">First Aid</span>
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        Adolescence is a critical time. This simulation tests your ability to connect with teens, 
        identify signs of crisis in youth, and navigate sensitive topics like bullying, academic pressure, and self-harm.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 py-2 px-4 rounded-lg inline-flex">
        <AlertCircle className="w-4 h-4" />
        Certification requires a score of 90% or higher.
      </div>
    </div>
    
    <div className="flex justify-center w-full">
      <button 
        onClick={onStart}
        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-indigo-600 px-8 font-medium text-white transition-all duration-300 hover:bg-indigo-700 shadow-lg shadow-indigo-200 w-full sm:w-auto"
      >
        <span className="mr-2">Begin Assessment</span>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
);

export default IntroScreen; 