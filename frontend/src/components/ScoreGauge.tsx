import { motion } from 'framer-motion';


interface ScoreGaugeProps {
    score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
    // Color mapping based on score
    const getColor = (s: number) => {
        if (s >= 80) return '#10B981'; // Emerald 500
        if (s >= 50) return '#F59E0B'; // Amber 500
        return '#EF4444'; // Red 500
    };

    const color = getColor(score);

    // Circumference for SVG circle
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-64 h-64 bg-white/5 rounded-full shadow-2xl backdrop-blur-sm border border-white/10">
            {/* 3D Glow Effect */}
            <div
                className="absolute inset-0 rounded-full opacity-20 blur-xl transition-colors duration-1000"
                style={{ backgroundColor: color }}
            />

            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90 drop-shadow-lg"
            >
                <circle
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    stroke={color}
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeDasharray={circumference + ' ' + circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <motion.span
                    className="text-5xl font-bold text-white tracking-tighter"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}
                </motion.span>
                <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Health Score</span>
            </div>
        </div>
    );
};
