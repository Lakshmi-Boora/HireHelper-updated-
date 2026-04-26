import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../../api/axios';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hi! I'm your Task Assistant. Need help organizing, prioritizing, or boosting productivity?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const newMessages = [...messages, { role: 'user', text: trimmed }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const { data } = await api.post("/ai-query", { message: trimmed });
            setMessages([...newMessages, { role: 'ai', text: data.message }]);
        } catch (error) {
            console.error("AI chat error:", error);
            setMessages([...newMessages, { role: 'ai', text: "Sorry, I'm having trouble connecting to the brain center right now. Please try again!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-2">
                    {/* Header */}
                    <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-semibold text-sm">Productivity Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="h-80 bg-gray-50 p-4 overflow-y-auto flex flex-col space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-400 border border-gray-200 rounded-lg px-4 py-2 text-xs flex items-center space-x-2 rounded-bl-none shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Node */}
                    <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-3 flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me how to organize tasks..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 hover:-translate-y-1 transform transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}
        </div>
    );
};

export default AIAssistant;
