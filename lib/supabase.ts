import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase client — created only when env vars are present, so the app
// (and the 67 Speed score save) degrades gracefully when unconfigured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
