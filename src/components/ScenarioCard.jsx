import React, { useState } from 'react';
import { Brain, Lightbulb, Zap, Loader2, Sparkles } from 'lucide-react';



const ScenarioCard = ({ scenario, onSubmit, isSubmitting, onGetHint }) => {
  const [response, setResponse] = useState('');
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    onSubmit(response);
    setResponse('');
    setHint(null);
  };

  const handleHintClick = async () => {
    if (hint) return;
    setLoadingHint(true);
    const hintText = await onGetHint(scenario);
    setHint(hintText);
    setLoadingHint(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-start gap-4 justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-1 block">
                Focus Area: {scenario.category}
              </span>
              <h3 className="text-lg font-semibold text-slate-800">
                {scenario.context}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="relative">
            <div className="absolute -left-3 top-6 bottom-6 w-1 bg-slate-200 rounded-full"></div>
            <div className="pl-6 py-2">
              <p className="text-2xl font-medium text-slate-700 italic leading-relaxed font-serif">
                "{scenario.dialogue}"
              </p>
            </div>
          </div>
          
          {/* Hint Section */}
          {hint && (
             <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
               <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-bold text-amber-800 mb-1">AI Coach Tip:</p>
                 <p className="text-sm text-amber-700 italic">{hint}</p>
               </div>
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="block text-sm font-medium text-slate-700">
                  Your Response (How do you answer the student?):
                </label>
                <button
                  type="button"
                  onClick={handleHintClick}
                  disabled={loadingHint}
                  className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                >
                  {loadingHint ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {hint ? "Hint Received" : "Ask AI Coach"}
                </button>
              </div>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full min-h-[150px] p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none text-slate-700 placeholder:text-slate-400"
                placeholder="Type your response to the student here..."
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!response.trim() || isSubmitting}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
              >
                Submit Response
                <Zap className="w-4 h-4 text-indigo-200" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;