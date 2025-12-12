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

    useEffect(() => {
        async function fetchCompanies() {
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
                    // Transform data to match UI needs (mocking missing columns for now as DB is simple)
                    const transformed = data.map((c: any) => ({
                        ...c,
                        cnpj: '00.000.000/0001-00', // Placeholder as DB schema was simple
                        status: 'active' as const,
                        lastScore: Math.floor(Math.random() * 300) + 600 // Mock score until we join with score_metrics
                    }));
                    setCompanies(transformed);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCompanies();
    }, []);

    return { companies, loading };
}
