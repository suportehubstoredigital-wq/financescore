import { PageContainer } from "@/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
    return (
        <PageContainer>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações</h1>
                <p className="text-muted-foreground">Gerencie suas preferências de conta.</p>
            </div>

            <Card className="max-w-2xl border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Perfil do Usuário</CardTitle>
                    <CardDescription>Informações básicas da sua conta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome Completo</label>
                            <input disabled value="Admin User" className="w-full p-2 rounded-md border border-slate-200 bg-slate-50 text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input disabled value="admin@financescore.com" className="w-full p-2 rounded-md border border-slate-200 bg-slate-50 text-slate-500" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button>Salvar Alterações</Button>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
