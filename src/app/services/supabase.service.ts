import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Record } from '../models/record.model';
import { environment } from '../environment/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  clientSupabase = supabase;

  constructor() { }

  async selectInRecordsWithDetails_Origin() {
    let { data: Records, error } = await supabase
      .from('Records')
      .select(`
        *,
        Details_Origin (
          *
        )
      `)
    if (error) {
      throw error;
    }
    return Records;
  }

}
