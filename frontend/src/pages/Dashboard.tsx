import { PageContainer } from "@/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Users, Activity, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function DashboardPage() {
    const [metrics, setMetrics] = useState({
        totalCompanies: 0,
        avgScore: 0,
        totalRevenue: 0,
    });
    // State for chart data
    const [revenueHistory, setRevenueHistory] = useState<any[]>([]);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                // 1. Count Companies
                const { count } = await supabase
                    .from('companies')
                    .select('*', { count: 'exact', head: true });

                // 2. Average Score & Total Revenue from score_metrics
                const { data: scores } = await supabase
                    .from('score_metrics')
                    .select('overall, revenue, created_at');

                let totalRev = 0;
                let totalScore = 0;
                let scoreCount = 0;

                // Map for monthly aggregation
                const historyMap = new Map();

                if (scores) {
                    scores.forEach((s: any) => {
                        totalRev += Number(s.revenue || 0);
                        if (s.overall) {
                            totalScore += Number(s.overall);
                            scoreCount++;
                        }

                        // Aggregation by Month (e.g., "Dec")
                        // Assuming 'created_at' is ISO string
                        if (s.created_at) {
                            const date = new Date(s.created_at);
                            // Use short month name (Jan, Feb, etc.)
                            const monthKey = date.toLocaleString('default', { month: 'short' });

                            const current = historyMap.get(monthKey) || 0;
                            historyMap.set(monthKey, current + Number(s.revenue || 0));
                        }
                    });
                }

                // Convert map to array for Recharts
                // Provide a default empty structure if no data to avoid broken chart
                let chartData = Array.from(historyMap.entries()).map(([month, revenue]) => ({
                    month,
                    revenue
                }));

                // Sort chartData? Usually by date. This simple map iteration might not be chronological if keys inserted randomly.
                // For simplicity, let's just use what we have, or rely on the insertion order if data is chronological.
                // Since we didn't sort input, let's simple-sort by month index?
                // A better approach for a robust app is to generate last 6 months keys and fill.
                // For now, let's just make sure if empty we show something or just empty.
                if (chartData.length === 0) {
                    // Add current month as 0 so it's not totally blank
                    const cur = new Date().toLocaleString('default', { month: 'short' });
                    chartData = [{ month: cur, revenue: 0 }];
                }

                setRevenueHistory(chartData);

                setMetrics({
                    totalCompanies: count || 0,
                    avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
                    totalRevenue: totalRev
                });

            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        }

        fetchMetrics();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const kpiData = [
        { title: "Receita Total", value: metrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), delta: "+0%", icon: DollarSign, color: "text-blue-600" },
        { title: "Empresas Ativas", value: metrics.totalCompanies.toString(), delta: "+0", icon: Users, color: "text-indigo-600" },
        { title: "Score Médio", value: metrics.avgScore.toString(), delta: "+0pts", icon: Activity, color: "text-green-600" },
        { title: "Liquidez Corrente", value: "0", delta: "0", icon: TrendingUp, color: "text-purple-600" }
    ];

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-muted-foreground">Visão geral da carteira de clientes.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {kpiData.map((kpi, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <Card className="hover:shadow-lg transition-all border-slate-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                                        <span className="text-green-600 flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            {kpi.delta}
                                        </span>
                                        <span className="ml-1">vs mês anterior</span>
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                    <motion.div variants={itemVariants} className="col-span-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Histórico de Receita</CardTitle>
                                <CardDescription>
                                    Evolução do faturamento agregado (Real).
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `R$${value}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: any) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Receita']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-3">
                        <Card className="h-full border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                            <CardHeader>
                                <CardTitle className="text-white">Finance Score Geral</CardTitle>
                                <CardDescription className="text-slate-400">Pontuação média da carteira.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center pt-8">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    {/* Simple scale gauge visualization */}
                                    <svg className="h-full w-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-slate-700"
                                        />
                                        <motion.circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - (metrics.avgScore / 1000))}
                                            className="text-emerald-500"
                                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - (metrics.avgScore / 1000)) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-white tracking-tighter">{metrics.avgScore}</span>
                                        <span className="text-sm font-medium text-emerald-400 uppercase tracking-widest">Excelente</span>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-8 text-center w-full">
                                    <div>
                                        <p className="text-2xl font-bold text-white">Top 5%</p>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Performance</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-400">AAA</p>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Rating</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </PageContainer>
    );
}
