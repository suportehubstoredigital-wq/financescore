import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <main className={cn("pl-64 pt-16 min-h-screen bg-slate-50/50", className)}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto space-y-8"
            >
                {children}
            </motion.div>
        </main>
    );
}
