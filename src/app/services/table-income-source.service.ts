import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Income } from '../models/income.model';

@Injectable({
  providedIn: 'root'
})
export class TableIncomeSourceService {

  constructor(private supabaseService: SupabaseService) {}

  async selectInIncomeSource(idUser: string): Promise<Income[]> {
    let { data: income, error } = await this.supabaseService.clientSupabase
      .from('Income_Source')
      .select(`*`)
      .eq('idUser', idUser);
    if (error) {
      throw error;
    }
    return income as Income[];
  }


}
