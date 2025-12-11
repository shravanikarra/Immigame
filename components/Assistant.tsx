import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { getImmiResponse } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there! I'm Immi, your personal immigration assistant. 🌍 Whether you have questions about forms, visas, or just need to vent, I'm here. How can I help today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await getImmiResponse(history, userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-[#F7F7F7]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
            <div className="bg-green-100 p-2 rounded-full">
                <Bot className="text-primary" size={24} />
            </div>
            <div>
                <h1 className="font-bold text-gray-800 text-lg">Immi Assistant</h1>
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                </p>
            </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                        ${msg.role === 'user' 
                            ? 'bg-secondary text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 border-2 border-gray-100 rounded-tl-none'}
                    `}>
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                     <div className="bg-white border-2 border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            )}
            <div className="h-4"></div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 border-2 border-transparent focus-within:border-gray-300 transition-colors">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about visas, forms, or laws..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`p-2 rounded-lg transition-colors ${input.trim() ? 'text-primary hover:bg-green-50' : 'text-gray-300'}`}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default Assistant;