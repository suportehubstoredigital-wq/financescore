import { PageContainer } from "@/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from 'recharts';
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const scoreData = [
    { subject: 'Liquidez', A: 120, fullMark: 150 },
    { subject: 'Rentabilidade', A: 98, fullMark: 150 },
    { subject: 'Endividamento', A: 86, fullMark: 150 },
    { subject: 'Eficiência', A: 99, fullMark: 150 },
    { subject: 'Crescimento', A: 85, fullMark: 150 },
    { subject: 'Regularidade', A: 65, fullMark: 150 },
];

const historicalData = [
    { month: 'Jul', score: 750 },
    { month: 'Aug', score: 760 },
    { month: 'Sep', score: 780 },
    { month: 'Oct', score: 820 },
    { month: 'Nov', score: 810 },
    { month: 'Dec', score: 850 },
];

];

export function ScorePage() {
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get("companyId");
    const [financials, setFinancials] = useState({ revenue: '', profit: '', expenses: '' });
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    // Fetch latest score on load
    useEffect(() => {
        if (!companyId) return;

        async function loadScore() {
            const { data } = await supabase
                .from('score_metrics')
                .select('*')
                .eq('company_id', companyId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data?.overall) setScore(Number(data.overall));
        }
        loadScore();
    }, [companyId]);

    const handleCalculateScore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;

        setLoading(true);
        try {
            // Simple logic: Base 500 + (Profit Margin * 500) capped at 950
            const rev = Number(financials.revenue);
            const prof = Number(financials.profit);

            if (!rev || rev === 0) {
                alert("Revenue cannot be zero");
                setLoading(false);
                return;
            }

            const margin = prof / rev; // e.g. 0.20 (20%)
            let calculatedScore = Math.floor(500 + (margin * 1000));
            // Cap logic
            if (calculatedScore > 1000) calculatedScore = 999;
            if (calculatedScore < 0) calculatedScore = 150;

            const { error } = await supabase.from('score_metrics').insert([{
                company_id: companyId,
                overall: calculatedScore,
                revenue: rev,
                profit: prof,
                expenses: Number(financials.expenses),
                components: { margin: margin }
            }]);

            if (error) throw error;
            setScore(calculatedScore);
            alert("Dados Financeiros Salvos e Score Calculado!");

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar dados.");
        } finally {
            setLoading(false);
        }
    };

    if (!companyId) return <PageContainer><div>Empresa não encontrada</div></PageContainer>;

    <PageContainer>
        <div className="flex items-center gap-4 mb-2">
            <Link to="/companies">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Score Detalhado</h1>
                <p className="text-muted-foreground">Análise profunda da empresa #{companyId}</p>
            </div>
            <div className="ml-auto flex gap-2">
                <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                </Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    Exportar Relatório
                </Button>
            </div>
        </div>

        <Card className="mb-6 border-slate-200 shadow-sm border-l-4 border-l-blue-600">
            <CardHeader>
                <CardTitle>Lançamento Financeiro</CardTitle>
                <CardDescription>Insira os dados do último mês para recalcular o score.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCalculateScore} className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Faturamento (R$)</label>
                        <input
                            type="number"
                            value={financials.revenue}
                            onChange={e => setFinancials({ ...financials, revenue: e.target.value })}
                            placeholder="0.00"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lucro Líquido (R$)</label>
                        <input
                            type="number"
                            value={financials.profit}
                            onChange={e => setFinancials({ ...financials, profit: e.target.value })}
                            placeholder="0.00"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Despesas (R$)</label>
                        <input
                            type="number"
                            value={financials.expenses}
                            onChange={e => setFinancials({ ...financials, expenses: e.target.value })}
                            placeholder="0.00"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
                        Calcular Score
                    </Button>
                </form>
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-1 border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Score Atual</CardTitle>
                    <CardDescription>Baseado nos últimos balancetes.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="relative h-40 w-40 flex items-center justify-center bg-blue-50 rounded-full border-8 border-blue-100">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-blue-700 block">{score || "-"}</span>
                            <span className="text-xs font-semibold text-blue-500 uppercase">Excelente</span>
                        </div>
                    </div>
                    <div className="mt-6 w-full space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rank no Setor</span>
                            <span className="font-semibold text-slate-900">Top 5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Prob. Default</span>
                            <span className="font-semibold text-green-600">Baixa (1.2%)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Composição do Score</CardTitle>
                    <CardDescription>Análise vetorial dos componentes.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoreData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Empresa"
                                dataKey="A"
                                stroke="#2563eb"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Histórico de Evolução</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </PageContainer>
    );
}
