import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import ScenarioCard from './components/ScenarioCard';
import FeedbackModal from './components/FeedbackModal';
import LoadingOverlay from './components/LoadingOverlay';
import ProgressBar from './components/ProgressBar';
import ResultsScreen from './components/ResultsScreen';
import IntroScreen from './components/IntroScreen';
import { INITIAL_SCENARIOS, SYSTEM_PROMPT } from './data/scenarios';

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [appState, setAppState] = useState('intro'); // intro, quiz, results
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null); // { score, feedback, pass }

  const handleStart = () => {
    setAppState('quiz');
    setCurrentScenarioIndex(0);
    setResults([]);
  };

  const handleRestart = () => {
    setAppState('intro');
    setResults([]);
    setCurrentScenarioIndex(0);
    // Optionally reset scenarios to default or keep generated ones. 
    // We'll reset to default to allow generation again.
    setScenarios(INITIAL_SCENARIOS);
  };

  // ✨ GEMINI FEATURE 2: AI Coach Hint
  const handleGetHint = async (scenario) => {
    const prompt = `
      Context: ${scenario.context}
      Teen Dialogue: "${scenario.dialogue}"
      
      Without giving the exact answer, provide a 1-sentence pedagogical hint for a Mental Health First Aider. 
      Focus on the key principle (e.g. "Don't judge", "Assess for safety", "Listen non-judgmentally").
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (e) {
      return "Remember ALGEE: Assess for risk, Listen non-judgmentally, Give reassurance, Encourage professional help, Encourage self-help.";
    }
  };

  const evaluateAnswer = async (userAnswer) => {
    setIsEvaluating(true);
    
    const scenario = scenarios[currentScenarioIndex];
    
    const prompt = `
      Scenario Context: ${scenario.context}
      Dialogue said to user (by a teen/youth): "${scenario.dialogue}"
      User's Response: "${userAnswer}"
      
      Evaluate this response based on YOUTH mental health first aid principles.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let evaluation;
      try {
        evaluation = JSON.parse(jsonString);
      } catch (e) {
        console.error("JSON Parse Error", e);
        evaluation = { score: 10, feedback: "Error parsing AI response. Please ensure your answer is clear.", pass: false };
      }

      evaluation.score = Math.max(0, Math.min(20, evaluation.score));

      setCurrentFeedback(evaluation);
      
      setResults(prev => [...prev, {
        question: scenario.dialogue,
        userAnswer: userAnswer,
        score: evaluation.score,
        feedback: evaluation.feedback
      }]);

    } catch (error) {
      console.error('Evaluation failed:', error);
      const fallbackEval = { score: 0, feedback: "There was an error connecting to the evaluation service. Please try again.", pass: false };
      setCurrentFeedback(fallbackEval);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentFeedback(null);
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setAppState('results');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            <span className="font-bold text-xl tracking-tight">MindGuard<span className="text-indigo-600">.Youth</span></span>
          </div>
          {appState === 'quiz' && (
            <div className="text-sm font-medium text-slate-500">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        
        {appState === 'intro' && (
          <IntroScreen 
            onStart={handleStart} 
          />
        )}

        {appState === 'quiz' && (
          <div className="max-w-3xl mx-auto relative">
            <ProgressBar current={currentScenarioIndex} total={scenarios.length} />
            
            <ScenarioCard 
              scenario={scenarios[currentScenarioIndex]} 
              onSubmit={evaluateAnswer}
              isSubmitting={isEvaluating}
              onGetHint={handleGetHint}
            />

            {isEvaluating && <LoadingOverlay message="Evaluating response..." />}
            
            {currentFeedback && (
              <FeedbackModal 
                feedback={currentFeedback.feedback}
                score={currentFeedback.score}
                onNext={handleNextQuestion}
              />
            )}
          </div>
        )}

        {appState === 'results' && (
          <ResultsScreen 
            totalScore={results.reduce((acc, curr) => acc + curr.score, 0)}
            maxScore={scenarios.length * 20}
            results={results}
            onRestart={handleRestart}
          />
        )}

      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} MindGuard Youth Simulator.</p>
        <p className="mt-1">This is a training tool and does not replace professional medical certification.</p>
      </footer>
    </div>
  );
};

export default App;