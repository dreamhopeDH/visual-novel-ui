import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatArea({ messages, loading, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50 relative">
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 max-w-lg mx-auto p-8 text-center">
            <Bot className="w-16 h-16 text-slate-300" />
            <h1 className="text-2xl font-semibold text-slate-600">How can I help you today?</h1>
            <p className="text-slate-500">Configure your API settings in the sidebar to start a conversation with the assistant.</p>
          </div>
        ) : (
          <div className="w-full flex flex-col pb-32">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`w-full border-b border-slate-200 ${
                  msg.role === 'assistant' ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <div className="max-w-4xl mx-auto p-6 flex gap-6">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-600 text-white'
                  }`}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 prose prose-slate max-w-none prose-p:leading-relaxed break-words whitespace-pre-wrap text-slate-800">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="w-full bg-slate-100 border-b border-slate-200">
                <div className="max-w-4xl mx-auto p-6 flex gap-6">
                  <div className="w-8 h-8 rounded-sm bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1 flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Generating response...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-10 pb-6">
        <div className="max-w-4xl mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end bg-white border border-slate-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message the assistant..."
              className="w-full max-h-48 min-h-[56px] py-4 pl-4 pr-14 resize-none focus:outline-none bg-transparent text-slate-800 placeholder-slate-400"
              rows={1}
              style={{ height: 'auto' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 bottom-3 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center text-xs text-slate-500 mt-3">
            Messages are sent to your configured API provider.
          </div>
        </div>
      </div>
    </div>
  );
}
