import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    PieChart,
    UploadCloud,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Building2, label: "Empresas", path: "/companies" },
    { icon: PieChart, label: "Score Financeiro", path: "/score" },
    { icon: UploadCloud, label: "Upload Arquivos", path: "/upload" },
    { icon: Settings, label: "Configurações", path: "/settings" },
];

export function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border flex flex-col z-20 shadow-sm">
            <div className="p-6 flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">FinanceScore</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                    : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 relative z-10", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                                <span className="relative z-10">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-slate-50 hover:text-red-600 transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
}
