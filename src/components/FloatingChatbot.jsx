import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, HelpCircle } from 'lucide-react';

const N8N_RAG_WEBHOOK = '/webhook/rag-chat';
const WELCOME_MESSAGE = {
    id: 'welcome',
    sender: 'bot',
    text: "Hello! I'm your Youth MHFA Knowledge Assistant. I can help you with:\n\n• ALGEE action plan steps\n• Crisis intervention protocols\n• Mental health information\n• Communication techniques\n• Platform usage help\n\nWhat would you like to know?"
};

const SUGGESTED_QUESTIONS = [
    "What is the ALGEE framework?",
    "How do I handle a crisis situation?",
    "What are signs of anxiety in youth?",
    "How do I listen non-judgmentally?"
];

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `rag-${crypto.randomUUID()}`);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    // Reset unread count when opening
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    const handleSendMessage = async (text = inputText) => {
        if (!text.trim() || isLoading) return;

        const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);
        setShowSuggestions(false);

        try {
            const response = await fetch(N8N_RAG_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    message: userMsg.text,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`RAG webhook error ${response.status}`);
            }

            const raw = await response.text();
            let data;
            try {
                data = raw ? JSON.parse(raw) : {};
            } catch {
                throw new Error('Invalid JSON response from server');
            }

            const botResponseText = data.reply || data.output || data.message || data.response ||
                "I'm sorry, I couldn't process that request. Please try again.";

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResponseText,
                sources: data.sources || []
            }]);

            // Increment unread if chat is closed
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }

        } catch (error) {
            console.error('RAG Chat Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: "I'm having trouble connecting to the knowledge base. Please check your connection and try again.",
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQuestion = (question) => {
        handleSendMessage(question);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setShowSuggestions(true);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const toggleMinimize = (e) => {
        e.stopPropagation();
        setIsMinimized(!isMinimized);
    };

    // Render the floating button when closed
    if (!isOpen) {
        return (
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                aria-label="Open help chat"
            >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">MHFA Help</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 ${isMinimized
                        ? 'w-72 h-12'
                        : 'w-80 sm:w-96 h-[500px] max-h-[80vh]'
                    }`}
            >
                {/* Header */}
                <div
                    className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between cursor-pointer"
                    onClick={isMinimized ? toggleMinimize : undefined}
                >
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <div>
                            <h3 className="font-semibold text-sm">MHFA Knowledge Assistant</h3>
                            {!isMinimized && (
                                <p className="text-[10px] text-indigo-200">Ask about procedures, help & assistance</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleMinimize}
                            className="p-1.5 hover:bg-indigo-500 rounded-lg transition-colors"
                            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={toggleChat}
                            className="p-1.5 hover:bg-indigo-500 rounded-lg transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 h-[340px]">
                            {messages.map((msg, index) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                                ? 'bg-indigo-600'
                                                : msg.isError
                                                    ? 'bg-rose-100'
                                                    : 'bg-white border border-slate-200'
                                            }`}>
                                            {msg.sender === 'user' ? (
                                                <User className="w-3.5 h-3.5 text-white" />
                                            ) : (
                                                <Bot className={`w-3.5 h-3.5 ${msg.isError ? 'text-rose-600' : 'text-indigo-600'}`} />
                                            )}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : msg.isError
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200 rounded-tl-none'
                                                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            {msg.text}
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400">
                                                    Sources: {msg.sources.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start gap-2">
                                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}

                            {/* Suggested Questions */}
                            {showSuggestions && messages.length === 1 && !isLoading && (
                                <div className="mt-4 pt-2">
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <HelpCircle className="w-3 h-3" />
                                        Suggested questions:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {SUGGESTED_QUESTIONS.map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestedQuestion(question)}
                                                className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors text-left"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-200">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about MHFA procedures..."
                                    disabled={isLoading}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputText.trim() || isLoading}
                                    className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Send message"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between mt-2">
                                <button
                                    onClick={clearChat}
                                    className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Clear chat
                                </button>
                                <p className="text-[10px] text-slate-400">
                                    Powered by Gemini AI
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FloatingChatbot;
