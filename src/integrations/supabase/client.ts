// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ivooynredmxhnukdanvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b295bnJlZG14aG51a2RhbnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzM4MzUsImV4cCI6MjA2MzM0OTgzNX0.tkHWkGSHtlsjUScRkqAd9jA_CIaePGXXizZZViGKPrk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);