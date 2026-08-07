import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sayokcznlywhwkxasjso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheW9rY3pubHl3aHdreGFzanNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNzk3MzEsImV4cCI6MjEwMTY1NTczMX0.kWK2p6Kz1Dmf_311rKQzZRyoq3lhXG90eLaphZ0iKzU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
