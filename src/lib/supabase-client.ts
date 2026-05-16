import { createBrowserClient as createBrowserClientInternal } from "@supabase/auth-helpers-react";

export const createBrowserClient = (supabaseUrl: string, supabaseKey: string) =>
  createBrowserClientInternal(supabaseUrl, supabaseKey);
