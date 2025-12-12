import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Company {
    id: string;
    name: string;
    created_at: string;
    // Extended properties for UI (some might be mocked or calculated if not in DB yet)
    cnpj?: string;
    status?: 'active' | 'inactive';
    lastScore?: number;
}

export function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching companies:', error);
                return;
            }

            if (data) {
                // Fetch latest score for each company to show in list
                // This is a bit N+1 but for a small list it's fine. Ideally use a view or join.
                // For now, we will just fetch the companies. Score calculation is complex.
                // We'll trust the KV store or similar if we had one.
                // Let's at least map the fields correctly.
                const companiesWithScores = await Promise.all(data.map(async (c: any) => {
                    const { data: scoreData } = await supabase
                        .from('score_metrics')
                        .select('overall')
                        .eq('company_id', c.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    return {
                        id: c.id,
                        name: c.name,
                        cnpj: c.cnpj || 'Não informado',
                        status: c.status || 'active',
                        lastScore: scoreData?.overall ? Number(scoreData.overall) : undefined,
                        created_at: c.created_at
                    };
                }));

                setCompanies(companiesWithScores);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return { companies, loading, refresh: fetchCompanies };
}
