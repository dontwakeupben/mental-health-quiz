import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send } from 'lucide-react';

const ChatInterface = ({ onExit }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "I don't really want to be here. My mom made me come talk to you. I'm fine, okay? Can I just go?"
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // 1. Add User Message to UI
        const userMsg = { id: Date.now(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // ---------------------------------------------------------
            // CONFIGURATION: Connect your n8n / Backend here
            // ---------------------------------------------------------
            const WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

            // Example fetch call (Uncomment and configure when ready):
            /*
            const response = await fetch(WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: inputText })
            });
            const data = await response.json();
            const botResponseText = data.output; // Adjust based on your n8n output structure
            */

            // --- MOCK RESPONSE (Remove this when n8n is connected) ---
            await new Promise(r => setTimeout(r, 1500)); // Fake network delay
            const botResponseText = "I guess... I mean, I'm just tired of everyone acting like I'm broken or something.";
            // ---------------------------------------------------------

            // 2. Add Bot Message to UI
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResponseText
            }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: "Error: Unable to reach the server. Please check your connection."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                        <Bot className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Roleplay Scenario: "Alex" (15y)</h3>
                        <p className="text-xs text-slate-500">Goal: Build rapport & De-escalate defensiveness</p>
                    </div>
                </div>
                <button
                    onClick={onExit}
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                >
                    Exit Session
                </button>
            </div>

            {/* Messages Area */}
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

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your response..."
                        className="flex-1 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all px-4 py-3 text-slate-700"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isTyping}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-100"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;