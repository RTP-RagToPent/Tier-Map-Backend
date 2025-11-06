import { envLoader } from "./loader.ts";

const supabaseUrl = envLoader("SUPABASE_URL");
const supabaseAnonKey = envLoader("SUPABASE_ANON_KEY");
const supabaseServiceRoleKey = envLoader("SUPABASE_SERVICE_ROLE_KEY");

export { supabaseAnonKey, supabaseServiceRoleKey, supabaseUrl };
