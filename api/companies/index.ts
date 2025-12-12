import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // simple CRUD dispatcher
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('companies').select('*');
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { name } = req.body;
        const { data, error } = await supabase.from('companies').insert([{ name }]).select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
