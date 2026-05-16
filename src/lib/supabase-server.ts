import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "", {
    cookies: {
      getAll: () =>
        cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
          options: {},
        })),
    },
  });
};

export const createServiceSupabaseClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
