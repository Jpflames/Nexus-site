import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const createBrowserClient = (
  supabaseUrl: string,
  supabaseKey: string,
): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};
