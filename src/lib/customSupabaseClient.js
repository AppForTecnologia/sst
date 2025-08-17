import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mimizmxjcanajupjsnxl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbWl6bXhqY2FuYWp1cGpzbnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDA5ODYsImV4cCI6MjA3MDExNjk4Nn0.p7sTRyfVvqn7sIrzo9TSgHAMRvdNWNlXG8sMGFRJE00';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);