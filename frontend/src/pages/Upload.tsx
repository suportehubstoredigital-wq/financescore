import { PageContainer } from "@/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function UploadPage() {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<{ name: string, status: 'uploading' | 'done' | 'error' }[]>([]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Mock upload
            const newFile = { name: e.dataTransfer.files[0].name, status: 'uploading' as const };
            setFiles(prev => [newFile, ...prev]);

            setTimeout(() => {
                setFiles(prev => prev.map(f => f.name === newFile.name ? { ...f, status: 'done' } : f));
            }, 2000);
        }
    };

    return (
        <PageContainer>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload de Arquivos</h1>
                <p className="text-muted-foreground">Envie balancetes e DREs para processamento.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle>Nova Importação</CardTitle>
                        <CardDescription>Arraste arquivos PDF, XML ou Excel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`
                                border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                                ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"}
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <UploadCloud className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Arraste e solte ou clique</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                                Suportamos arquivos .pdf, .xlsx e .xml até 10MB.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Arquivos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <AnimatePresence>
                                {files.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum arquivo enviado.</p>
                                )}
                                {files.map((file, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
                                    >
                                        <div className="h-10 w-10 bg-white rounded flex items-center justify-center border border-slate-200 text-slate-500 mr-3">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">Agora mesmo</p>
                                        </div>
                                        <div>
                                            {file.status === 'uploading' && (
                                                <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            )}
                                            {file.status === 'done' && (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            )}
                                            {file.status === 'error' && (
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
