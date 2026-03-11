import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'CRITICAL: Supabase URL or Anon Key is missing. Check your .env.local file.\n' +
        `URL: ${supabaseUrl ? 'Found' : 'Missing'}\n` +
        `Key: ${supabaseAnonKey ? 'Found' : 'Missing'}`
    );
}

// Fallback values to prevent crash, but calls will fail if keys are missing.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
