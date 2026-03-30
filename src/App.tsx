import { useState } from 'react';
import OpenAI from 'openai';
import { Sidebar } from './components/Sidebar';
import { ChatArea, type Message } from './components/ChatArea';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiUrl, setApiUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      alert('Please enter an API Key in the settings.');
      return;
    }

    const newMessage: Message = { role: 'user', content };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: apiUrl,
        dangerouslyAllowBrowser: true, // Required for running in browser
      });

      const completion = await openai.chat.completions.create({
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        model: model,
      });

      const responseMessage = completion.choices[0]?.message?.content;

      if (responseMessage) {
        setMessages(prev => [...prev, { role: 'assistant', content: responseMessage }]);
      }
    } catch (error: any) {
      console.error('Error generating response:', error);
      alert(`Error: ${error.message || 'Failed to generate response'}`);
      // Remove the user message if it failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
      />
      <ChatArea
        messages={messages}
        loading={loading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
