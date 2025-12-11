import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScoreGauge } from '../components/ScoreGauge';
import { FinancialInputModal } from '../components/FinancialInputModal';
import { TrendingUp, DollarSign, Activity, AlertTriangle, Lock, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Dashboard = () => {
    const [scoreData, setScoreData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic URL Strategy: 
    // 1. Env Var (Priority)
    // 2. Localhost (Dev fallback)
    // 3. Relative '/api' (Production Monorepo - No CORS needed)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:3000/api' : '/api');

    async function fetchScore() {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/finance/score?companyId=${session.user.id}`);
            if (res.ok) {
                const data = await res.json();
                setScoreData(data);
                setError('');
            } else {
                setError('Falha ao carregar dados.');
            }
        } catch (error) {
            console.error('Error fetching score:', error);
            setError('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchScore();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-pulse text-indigo-500 font-bold text-xl">Loading FinanceScore...</div>
            </div>
        );
    }

    // Default empty data to prevent crash if backend returns null
    const safeScore = scoreData || { overallScore: 0, components: {}, insights: [] };

    const cards = scoreData ? [
        { title: 'Liquidez (Caixa)', value: safeScore.components.liquidity || 0, icon: DollarSign, color: 'text-blue-400' },
        { title: 'Lucratividade', value: safeScore.components.profitability || 0, icon: TrendingUp, color: 'text-green-400' },
        { title: 'Operacional', value: safeScore.components.operational || 0, icon: Activity, color: 'text-purple-400' },
        { title: 'Risco Fiscal', value: safeScore.components.taxRisk || 0, icon: AlertTriangle, color: 'text-yellow-400' },
    ] : [];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-indigo-500/30">
            <FinancialInputModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchScore}
            />

            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        FinanceScore
                    </h1>
                    <p className="text-slate-400">Saúde financeira em tempo real</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition flex items-center gap-2 group"
                    >
                        <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        Configurações
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                        FS
                    </div>
                </div>
            </header>

            {error && (
                <div className="p-4 mb-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
                    {error} <button onClick={fetchScore} className="underline ml-2">Tentar novamente</button>
                </div>
            )}

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Main Score Column */}
                <div className="col-span-1 lg:col-span-1 flex flex-col items-center justify-center bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-700 blur-3xl pointer-events-none" />
                    <ScoreGauge score={safeScore.overallScore || 0} />

                    <div className="mt-8 space-y-3 w-full">
                        {safeScore.insights?.map((msg: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 + i * 0.2 }}
                                className="bg-white/5 p-3 rounded-lg text-sm border-l-2 border-indigo-500 flex items-center"
                            >
                                {msg}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Breakdown Grid */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 * i }}
                            className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group cursor-default"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                                <span className={`text-2xl font-bold ${card.value < 50 ? 'text-red-400' : 'text-white'}`}>
                                    {card.value}
                                </span>
                            </div>
                            <h3 className="text-slate-400 font-medium">{card.title}</h3>
                            <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${card.color.replace('text', 'bg')}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${card.value}%` }}
                                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Upsell Card (Locked Feature) */}
                    <div className="col-span-1 md:col-span-2 bg-slate-900/30 border border-dashed border-slate-700 rounded-2xl p-6 relative overflow-hidden flex items-center justify-center min-h-[150px]">
                        <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                            <Lock className="w-8 h-8 text-amber-500 mb-2" />
                            <h3 className="text-white font-bold text-lg">Previsão de Caixa (30 dias)</h3>
                            <p className="text-slate-400 text-sm mb-4">Disponível no plano PRO</p>
                            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition shadow-lg shadow-orange-500/20">
                                Liberar Agora
                            </button>
                        </div>

                        {/* Fake Content Behind Blur */}
                        <div className="w-full h-full opacity-30 blur-sm pointer-events-none">
                            {/* Fake Graph Lines */}
                            <svg className="w-full h-full text-slate-600" viewBox="0 0 100 20">
                                <path d="M0 10 Q 25 5, 50 15 T 100 8" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
