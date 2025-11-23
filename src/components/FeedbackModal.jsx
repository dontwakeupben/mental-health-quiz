import React from 'react';


const FeedbackModal = ({ feedback, score, onNext }) => {
  const isPass = score >= 15;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-6 border-b ${isPass ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${isPass ? 'text-green-800' : 'text-amber-800'}`}>
              {isPass ? 'Good Approach' : 'Try a Different Approach'}
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${isPass ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
              <span>{score}/20</span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Evaluation</h4>
            <p className="text-slate-700 leading-relaxed">
              {feedback}
            </p>
          </div>
          <button
            onClick={onNext}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Next Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;