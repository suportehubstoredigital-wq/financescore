import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isConfigured) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuração Pendente</h1>
          <p className="text-slate-600 mb-6">
            O projeto foi implantado com sucesso, mas as variáveis de ambiente do Supabase não foram encontradas.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm font-mono text-slate-700 mb-6 overflow-x-auto">
            VITE_SUPABASE_URL<br />
            VITE_SUPABASE_ANON_KEY
          </div>
          <p className="text-sm text-slate-500">
            Adicione estas chaves nas configurações do projeto na Vercel (Settings &gt; Environment Variables) e faça um Redeploy.
          </p>
        </div>
      </div>
    </StrictMode>
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
