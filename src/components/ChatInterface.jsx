import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bot, User, Send } from 'lucide-react';

const PERSONAS = [
    {
        id: 'alex',
        name: 'Alex',
        age: 15,
        goal: 'Build rapport & defuse defensiveness',
        openingLine: "I don't really want to be here. My mom made me come talk to you. I'm fine, okay? Can I just go?",
        vibe: 'Guarded student sent to counseling'
    },
    {
        id: 'maya',
        name: 'Maya',
        age: 16,
        goal: 'Validate burnout & explore supports',
        openingLine: "Everyone keeps saying I should talk to someone, but it just feels like more homework. I'm exhausted and nothing helps.",
        vibe: 'Overachiever on the edge of burnout'
    },
    {
        id: 'jordan',
        name: 'Jordan',
        age: 14,
        goal: 'Listen and assess for safety',
        openingLine: "People at school won't leave me alone online. I stopped checking my phone but they just keep finding ways. I kinda just want to disappear.",
        vibe: 'Cyberbullying target afraid to speak up'
    }
];

const getRandomPersona = () => PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
const PASSING_GRADE_THRESHOLD = 75;

const N8N_CHAT_WEBHOOK = '/api/chat-proxy';

const ChatInterface = ({ onExit }) => {
    const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
    const [persona, setPersona] = useState(() => getRandomPersona());
    const personaPrompt = useMemo(() => `
You are ${persona.name}, a ${persona.age}-year-old teen.
Goal: ${persona.goal}.
Vibe: ${persona.vibe}.
Stay in character, speak casually, avoid clinical advice, and focus on feelings/safety.
`, [persona]);

    const [messages, setMessages] = useState(() => ([
        {
            id: 1,
            sender: 'bot',
            text: persona.openingLine
        }
    ]));
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationStatus, setConversationStatus] = useState('active'); // active | paused
    const [conversationSummary, setConversationSummary] = useState('');
    const [latestGrade, setLatestGrade] = useState(null);
    const [latestFeedback, setLatestFeedback] = useState('');
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const resetConversation = (newPersona = null) => {
        const personaToUse = newPersona || persona;
        if (newPersona) {
            setPersona(personaToUse);
        }
        setSessionId(crypto.randomUUID());
        setConversationStatus('active');
        setConversationSummary('');
        setLatestGrade(null);
        setLatestFeedback('');
        setInputText('');
        setIsTyping(false);
        setMessages([
            {
                id: Date.now(),
                sender: 'bot',
                text: personaToUse.openingLine
            }
        ]);
    };

    const handleNewScenario = () => {
        let nextPersona = getRandomPersona();
        if (PERSONAS.length > 1) {
            while (nextPersona.id === persona.id) {
                nextPersona = getRandomPersona();
            }
        }
        resetConversation(nextPersona);
    };

    const handleResumeSession = () => {
        setConversationStatus('active');
        setConversationSummary('');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || conversationStatus === 'paused') return;

        const userMsg = { id: Date.now(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch(N8N_CHAT_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    persona,
                    personaPrompt,
                    message: userMsg.text
                })
            });

            if (!response.ok) {
                throw new Error(`n8n chat webhook error ${response.status}`);
            }

            const raw = await response.text();
            let data;
            try {
                data = raw ? JSON.parse(raw) : {};
            } catch {
                throw new Error('n8n returned invalid JSON');
            }

            const botResponseText = data.reply || data.output || data.message || "I'm still thinking about what you said.";
            const gradeValue = typeof data.grade === 'number' ? data.grade : null;
            const feedbackText = data.feedback?.trim?.() ? data.feedback : '';
            const summaryText = feedbackText || data.summary || (gradeValue !== null ? `Score: ${gradeValue}` : '');
            const shouldStop = gradeValue !== null && gradeValue < PASSING_GRADE_THRESHOLD;

            setLatestGrade(gradeValue);
            setLatestFeedback(summaryText || '');

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResponseText
            }]);

            if (shouldStop) {
                setConversationStatus('paused');
                setConversationSummary(summaryText || 'The situation deteriorated. Review your approach and try again.');
            } else {
                setConversationStatus('active');
                setConversationSummary('');
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: 'Error: Unable to reach the server. Please check your connection.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const feedbackTone = (() => {
        if (latestGrade === null) return 'text-slate-500';
        return latestGrade >= PASSING_GRADE_THRESHOLD ? 'text-emerald-600' : 'text-rose-600';
    })();

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 animate-in slide-in-from-bottom-8">
            <div className="lg:flex-1 h-[600px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <Bot className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Roleplay Scenario: "{persona.name}" ({persona.age}y)</h3>
                            <p className="text-xs text-slate-500">Goal: {persona.goal}</p>
                            <p className="text-[11px] text-slate-400">{persona.vibe}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {conversationStatus === 'paused' && (
                            <button
                                type="button"
                                onClick={handleResumeSession}
                                className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-100 transition-colors"
                            >
                                Resume Session
                            </button>
                        )}
                        {conversationStatus === 'paused' && (
                            <button
                                type="button"
                                onClick={() => resetConversation()}
                                className="text-xs font-semibold text-rose-700 bg-white border border-rose-200 rounded-full px-3 py-1 hover:bg-rose-50 transition-colors"
                            >
                                Retry Scenario
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleNewScenario}
                            className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 hover:bg-indigo-100 transition-colors"
                        >
                            Try New Scenario
                        </button>
                        <button
                            onClick={onExit}
                            className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                        >
                            Exit Session
                        </button>
                    </div>
                </div>

                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-white border border-slate-200'}`}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-slate-600" />}
                                </div>
                                <div
                                    className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-200'
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your response..."
                            className="flex-1 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all px-4 py-3 text-slate-700"
                            disabled={isTyping || conversationStatus === 'paused'}
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || isTyping || conversationStatus === 'paused'}
                            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-100"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            <aside className="lg:w-80 bg-white rounded-2xl shadow-xl border border-slate-200">
                <div className="border-b border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-700">Performance Feedback</p>
                    <p className="text-xs text-slate-400">Updated after every AI reply</p>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Latest Grade</p>
                        <p className={`text-3xl font-bold mt-1 ${feedbackTone}`}>
                            {latestGrade !== null ? `${latestGrade} / 100` : '--'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Passing threshold: {PASSING_GRADE_THRESHOLD}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AI Feedback</p>
                        <p className={`${feedbackTone} text-sm mt-2 leading-relaxed`}>
                            {latestFeedback || 'Your coaching feedback will appear here after your next response.'}
                        </p>
                    </div>
                    {conversationStatus === 'paused' && (
                        <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700">
                            <p className="font-semibold">Session Paused</p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default ChatInterface;
