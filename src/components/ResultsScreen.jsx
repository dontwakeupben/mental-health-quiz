import React from 'react';
import { CheckCircle2, XCircle, Stethoscope, RefreshCcw } from 'lucide-react';


const ResultsScreen = ({ totalScore, maxScore, results, onRestart }) => {
  const percentage = Math.round((totalScore / maxScore) * 100);
  const isCertified = percentage >= 90;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className={`p-12 text-center ${isCertified ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 'bg-gradient-to-br from-red-50 to-orange-50'}`}>
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-6">
            {isCertified ? (
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isCertified ? 'Youth Aid Certification Granted' : 'Certification Failed'}
          </h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            {isCertified 
              ? "You have demonstrated excellent competency in communicating with and supporting adolescents in crisis." 
              : "Connecting with youth requires building trust and validating their unique pressures. Please review the scenarios and try again."}
          </p>
          
          <div className="flex justify-center gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-slate-900">{percentage}%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">Total Score</div>
            </div>
            <div className="w-px bg-slate-300/50"></div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{totalScore}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">Points Earned</div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-slate-500" />
            Performance Breakdown
          </h3>
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">
                    Scenario {idx + 1}
                  </span>
                  <p className="text-sm text-slate-600 line-clamp-2 italic">"{result.question}"</p>
                </div>
                <div className="md:w-1/3 w-full">
                  <p className="text-xs text-slate-500 mb-1">Feedback</p>
                  <p className="text-sm text-slate-800">{result.feedback}</p>
                </div>
                <div className="flex items-center gap-2 md:w-24 w-full justify-end">
                  <div className={`px-3 py-1 rounded-lg font-bold text-sm ${result.score >= 15 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {result.score}/20
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-white border-t border-slate-100 flex justify-center">
          <button 
            onClick={onRestart}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors px-6 py-2 rounded-lg hover:bg-slate-50"
          >
            <RefreshCcw className="w-4 h-4" />
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;