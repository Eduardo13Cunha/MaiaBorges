import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://womzetihjapjkstdqget.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbXpldGloamFwamtzdGRxZ2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MzU2NzMsImV4cCI6MjA1NDQxMTY3M30.1_cttJ5d48-85uCtmZYc7QsZYKWPoFOfxmo4xG6vZEE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;