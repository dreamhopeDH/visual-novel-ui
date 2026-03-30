import { useState } from 'react';
import OpenAI from 'openai';
import { Sidebar } from './components/Sidebar';
import { ChatArea, type Message } from './components/ChatArea';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiUrl, setApiUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [proxyUrl, setProxyUrl] = useState('');
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
      // Clean up the API URL in case the user accidentally included the chat completions path
      let cleanUrl = apiUrl.trim();
      if (cleanUrl.endsWith('/chat/completions')) {
        cleanUrl = cleanUrl.replace(/\/chat\/completions$/, '');
      }
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }

      let finalUrl = cleanUrl;
      if (proxyUrl.trim()) {
        let cleanProxyUrl = proxyUrl.trim();
        if (!cleanProxyUrl.endsWith('/')) {
          cleanProxyUrl += '/';
        }
        finalUrl = cleanProxyUrl + cleanUrl;
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: finalUrl,
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

      let errorMessage = error.message || 'Failed to generate response';
      if (errorMessage.toLowerCase().includes('connection error') || errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = `Connection Error: This could be due to an incorrect API URL, or the custom API provider does not support Cross-Origin Resource Sharing (CORS) from the browser.\n\nMake sure the URL is correct (e.g., https://api.openai.com/v1) and check the browser console for details.`;
      }

      alert(`Error: ${errorMessage}`);
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
        proxyUrl={proxyUrl}
        setProxyUrl={setProxyUrl}
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
