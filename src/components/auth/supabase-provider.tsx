"use client";

import { createBrowserClient } from "@/lib/supabase-client";
import { useState } from "react";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() =>
    createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""),
  );

  // This wrapper is retained for compatibility, but no additional context provider is required.
  return <>{children}</>;
}
