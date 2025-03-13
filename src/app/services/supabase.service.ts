import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { environment } from '../environment/environment';
const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  clientSupabase = supabase;
}
