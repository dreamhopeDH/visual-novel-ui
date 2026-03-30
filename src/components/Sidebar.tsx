import { Settings } from 'lucide-react';

interface SidebarProps {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
}

export function Sidebar({ apiUrl, setApiUrl, apiKey, setApiKey, model, setModel }: SidebarProps) {
  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 h-screen flex flex-col p-4 text-slate-300">
      <div className="flex items-center gap-2 mb-8 text-white font-semibold text-xl">
        <Settings className="w-6 h-6" />
        <h2>Settings</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="apiUrl" className="text-sm font-medium text-slate-400">
            API Provider URL
          </label>
          <input
            id="apiUrl"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="apiKey" className="text-sm font-medium text-slate-400">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="model" className="text-sm font-medium text-slate-400">
            Model Name
          </label>
          <input
            id="model"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-3.5-turbo"
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500">
        Enter your API details to start chatting. Your key is stored locally in your browser.
      </div>
    </div>
  );
}
