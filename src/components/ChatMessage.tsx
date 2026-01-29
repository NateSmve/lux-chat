export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
          : 'bg-gradient-to-r from-pink-500 to-purple-500'
      }`}>
        {isUser ? '👤' : '✨'}
      </div>
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-none' 
            : 'bg-white/10 text-white rounded-tl-none'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`text-xs text-white/40 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
