import { Bell, Search } from "lucide-react";

export function Topbar() {
    return (
        <header className="h-16 pl-64 fixed top-0 right-0 left-0 bg-white/80 backdrop-blur-md border-b border-border z-10 flex items-center justify-between px-8">

            {/* Search / Breadcrumb Placeholder */}
            <div className="flex items-center gap-4 bg-slate-100/50 px-4 py-2 rounded-full border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all w-96">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar empresas, scores..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-muted-foreground hover:text-slate-900">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-900">Admin User</p>
                        <p className="text-xs text-muted-foreground">FinanceScore HQ</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg shadow-purple-500/20">
                        AU
                    </div>
                </div>
            </div>
        </header>
    );
}
