import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function FinancialInputModal({ isOpen, onClose, onSuccess }: ModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cashBalance: '',
        monthlyRevenue: '',
        monthlyExpenses: '',
        totalTaxLiability: '',
        overdueDebts: ''
    });

    // Load existing data when opening
    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    async function loadData() {
        // Fetch current financials
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Use VITE_API_URL or fallback
        const API_URL = import.meta.env.VITE_API_URL || 'https://financescore-api.vercel.app/api';

        try {
            const res = await fetch(`${API_URL}/finance/financials?companyId=${session.user.id}`);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setFormData({
                        cashBalance: data.cashBalance || '',
                        monthlyRevenue: data.monthlyRevenue || '',
                        monthlyExpenses: data.monthlyExpenses || '',
                        totalTaxLiability: data.totalTaxLiability || '',
                        overdueDebts: data.overdueDebts || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error loading financials:', error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const payload = {
                cashBalance: Number(formData.cashBalance),
                monthlyRevenue: Number(formData.monthlyRevenue),
                monthlyExpenses: Number(formData.monthlyExpenses),
                totalTaxLiability: Number(formData.totalTaxLiability),
                overdueDebts: Number(formData.overdueDebts || 0)
            };

            const API_URL = import.meta.env.VITE_API_URL || 'https://financescore-api.vercel.app/api';
            const res = await fetch(`${API_URL}/finance/financials?companyId=${session.user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert('Erro ao salvar dados.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Atualizar Finanças</h2>
                            <p className="text-slate-400 text-sm">Insira seus dados reais para calcularmos seu Score com precisão.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Caixa Atual (R$)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-emerald-500" size={16} />
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="50000.00"
                                            value={formData.cashBalance}
                                            onChange={e => setFormData({ ...formData, cashBalance: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Faturamento Mensal</label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-3 top-3 text-blue-500" size={16} />
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="0.00"
                                            value={formData.monthlyRevenue}
                                            onChange={e => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Custos Mensais</label>
                                    <div className="relative">
                                        <TrendingDown className="absolute left-3 top-3 text-rose-500" size={16} />
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="0.00"
                                            value={formData.monthlyExpenses}
                                            onChange={e => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Impostos Pendentes</label>
                                    <div className="relative">
                                        <AlertCircle className="absolute left-3 top-3 text-amber-500" size={16} />
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="0.00"
                                            value={formData.totalTaxLiability}
                                            onChange={e => setFormData({ ...formData, totalTaxLiability: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Salvando...' : (
                                        <>
                                            <Save size={18} />
                                            Atualizar Score
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
