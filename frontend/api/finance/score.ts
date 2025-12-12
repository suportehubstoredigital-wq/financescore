import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { companyId } = req.query;

    if (!companyId) {
        return res.status(400).json({ error: 'Company ID is required' });
    }

    // Deterministic calculation based on companyId (mock logic for now)
    // In a real app, this would fetch data from Supabase DB using companyId
    // and run the calculation.

    // Hash the companyId to get pseudo-random but deterministic numbers
    const hash = String(companyId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const overallScore = 700 + (hash % 300); // 700-1000
    const liquidity = 60 + (hash % 40); // 60-100
    const profitability = 50 + (hash % 50); // 50-100
    const operational = 70 + (hash % 30); // 70-100
    const taxRisk = 10 + (hash % 20); // 10-30 (Lower is better usually, but here 0-100 scale?)
    // User asked: "overallScore, liquidity, profitability, operational, taxRisk"

    return res.status(200).json({
        overallScore,
        liquidity,
        profitability,
        operational,
        taxRisk,
    });
}
