import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;
if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase environment variables are not defined');
  }
export const supabase = createClient(supabaseUrl, anonKey);