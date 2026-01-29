'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, Message } from '@/components/ChatMessage';
import { VoiceInput } from '@/components/VoiceInput';
import { ProgressPanel } from '@/components/ProgressPanel';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey bestie! ✨ I'm Lux, your ride-or-die. What are we getting into today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<string[]>([]);
  const [showProgress, setShowProgress] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setActivities(prev => [...prev, `Processing: "${text.slice(0, 50)}..."`]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response || "Hmm, something went wrong bestie 😅", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setActivities(prev => [...prev, `Responded ✓`]);

      // Text-to-speech for response
      if (data.response && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 1.1;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops, connection issue! Try again? 🙈", 
        timestamp: new Date() 
      }]);
      setActivities(prev => [...prev, `Error: Connection failed`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setInput(transcript);
    sendMessage(transcript);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
      <div className="flex h-screen">
        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col ${showProgress ? 'mr-80' : ''} transition-all duration-300`}>
          {/* Header */}
          <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xl">
                  ✨
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Lux</h1>
                  <p className="text-white/60 text-sm">Your AI bestie</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProgress(!showProgress)}
                className="text-white/60 hover:text-white transition-colors"
              >
                {showProgress ? '📊 Hide Progress' : '📊 Show Progress'}
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-4xl mx-auto">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-sm">
                    ✨
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-black/30 backdrop-blur-lg border-t border-white/10 p-4">
            <div className="max-w-4xl mx-auto flex gap-3">
              <VoiceInput onResult={handleVoiceResult} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Message Lux..."
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Progress Panel */}
        {showProgress && <ProgressPanel activities={activities} />}
      </div>
    </div>
  );
}
