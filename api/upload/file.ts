import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { filename, companyId } = req.body; // Expecting metadata first, normally this would be multipart

    // Mocking the "Upload" process to Supabase Storage by just inserting a record
    // In a real serverless function, handling multipart/form-data is complex.
    // Best practice: Client uploads directly to Supabase Storage via client-sdk, 
    // then calls this API to register the metadata.
    // OR this API generates a Signed URL.

    // We will assume the Client uploads to Storage and sends the URL here, OR this generates a signed URL.
    // Let's implement "Register Metadata" here as requested: "Registrar metadados na tabela documents"

    const { data, error } = await supabase.from('documents').insert([{
        company_id: companyId,
        file_url: `https://fake-storage/${filename}`, // specific logic depends on client implementation
        status: 'uploaded'
    }]).select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
}
