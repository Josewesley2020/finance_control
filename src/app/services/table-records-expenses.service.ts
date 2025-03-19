import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Record } from '../models/record.model';


@Injectable({
  providedIn: 'root'
})
export class TableRecordsService {

  constructor(private supabaseService: SupabaseService) { }

  async selectInRecordsWithDetails_Origin(idUser: string): Promise<Record[]> {
    let { data: Records, error } = await this.supabaseService.clientSupabase
      .from('Records_Expenses')
      .select(`
        *,
        Details_Origin (
          *
        )
      `)
      .eq('idUser', idUser);
    if (error) {
      throw error;
    }
    return Records as Record[];
  }
}
