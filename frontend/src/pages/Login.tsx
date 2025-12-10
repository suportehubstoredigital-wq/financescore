import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
        setLoading(false);
    };

    const handleSignup = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Check your email for the confirmation link!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">FinanceScore</h1>
                <p className="text-slate-400 mb-8">Access your financial health dashboard</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {message && <div className="text-pink-500 text-sm">{message}</div>}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? '...' : 'Login'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignup}
                            disabled={loading}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
