import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvvitzkweadgmgrdgehj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dml0emt3ZWFkZ21ncmRnZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTYxNzgsImV4cCI6MjA5Mzk3MjE3OH0.WL1C6luZM86PgHlJvAJqb4kBTe0T1KIrIpZZpJnC7qc";

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);