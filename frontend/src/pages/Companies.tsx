import { PageContainer } from "@/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCompanies, type Company } from "@/hooks/useCompanies";
import { Plus, MoreHorizontal, FileText, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function CompaniesPage() {
    const { companies, loading } = useCompanies();

    return (
        <PageContainer>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Empresas</h1>
                    <p className="text-muted-foreground">Gerencie sua carteira de clientes.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Empresa
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Listagem</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-left">
                                    <th className="h-12 px-4 font-medium text-slate-500">Empresa</th>
                                    <th className="h-12 px-4 font-medium text-slate-500">CNPJ</th>
                                    <th className="h-12 px-4 font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 font-medium text-slate-500">Score</th>
                                    <th className="h-12 px-4 font-medium text-slate-500 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0">
                                            <td className="p-4"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-10 bg-slate-100 rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-8 w-8 bg-slate-100 rounded animate-pulse ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    companies.map((company: Company, index: number) => (
                                        <motion.tr
                                            key={company.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                                <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xs">
                                                    {company.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                {company.name}
                                            </td>
                                            <td className="p-4 text-slate-500">{company.cnpj}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${company.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {company.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${(company.lastScore / 1000) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-slate-700">{company.lastScore}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link to={`/score?companyId=${company.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                                            <Activity className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/upload?companyId=${company.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
