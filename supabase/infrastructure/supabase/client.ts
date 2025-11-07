import { createClient } from "@supabase/supabase-js";

import { isDevelopment } from "../../lib/config/env.ts";
import {
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "../../lib/config/supabase.ts";

function createSupabaseClient(accessToken: string) {
  return isDevelopment
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
}

export { createSupabaseClient };
