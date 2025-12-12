import { PageContainer } from "@/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const kpiVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const
        }
    })
};

export function DashboardPage() {
    return (
        <PageContainer>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">Visão geral do desempenho financeiro.</p>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Saúde Financeira: Ótima</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Receita Total", value: "R$ 45.231,89", delta: "+20.1%", icon: DollarSign, color: "text-blue-600" },
                    { title: "Empresas Ativas", value: "12", delta: "+2", icon: Users, color: "text-indigo-600" },
                    { title: "Score Médio", value: "847", delta: "+15pts", icon: Activity, color: "text-green-600" },
                    { title: "Liquidez Corrente", value: "1.2", delta: "-0.1", icon: TrendingUp, color: "text-purple-600" }
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={kpiVariants}
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
                                    <span className={kpi.delta.startsWith('+') ? "text-green-600 flex items-center" : "text-red-600 flex items-center"}>
                                        {kpi.delta.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
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
                <Card className="col-span-4 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Histórico de Receita</CardTitle>
                        <CardDescription>Evolução semestral do faturamento agregado.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#1e293b", color: "#f8fafc", borderRadius: "8px" }}
                                        labelStyle={{ color: "#94a3b8" }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <Area type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                    <CardHeader>
                        <CardTitle className="text-white">Finance Score Geral</CardTitle>
                        <CardDescription className="text-slate-400">Pontuação média da carteira.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-8">
                        <div className="relative h-48 w-48 flex items-center justify-center">
                            {/* Simple CSS Gauge for visual impact */}
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
                                    strokeDashoffset={2 * Math.PI * 88 * 0.25} // 75% filled
                                    strokeLinecap="round"
                                    className="text-blue-500"
                                    initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 88 * 0.15 }} // Animates to 85%
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    className="text-5xl font-bold text-white tracking-tighter"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                >
                                    850
                                </motion.span>
                                <span className="text-sm text-slate-400 uppercase tracking-widest mt-1">Excelente</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
