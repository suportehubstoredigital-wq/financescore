import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseAnonKey

if (!isConfigured) {
    console.error('Missing Supabase environment variables')
}

// Prevent crash during build/runtime if vars are missing
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
            insert: () => ({ select: () => ({ data: [], error: { message: 'Supabase not configured' } }) }),
        }),
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        }
    } as any

