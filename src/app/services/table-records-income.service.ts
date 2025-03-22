import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RecordIncome } from '../models/record-income.model';

@Injectable({
  providedIn: 'root'
})
export class TableRecordsIncomeService {

  constructor(private supabaseService: SupabaseService) { }

  async selectInRecods_income(idUser: string): Promise<RecordIncome[]> {
    let { data: records_income, error } = await this.supabaseService.clientSupabase
      .from('Recods_income')
      .select(`
          *,
          Income_Source (
            *
          )
        `)
      .eq('Income_Source.idUser', idUser);
    if (error) {
      throw error;
    }
    return records_income as RecordIncome[];
  }

  async insertInInRecodsIncome( description: string, value: number, month: number, year: number,idIncome: number): Promise<RecordIncome[]> {
      try {
        let { data: recordIncome, error } = await this.supabaseService.clientSupabase
          .from('Recods_income')
          .insert([
            {
              description: description,
              value: value,
              month: month,
              year: year,
              idIncome: idIncome
            }
          ])
          .select();
        if (error) {
          throw error;
        }
        return recordIncome as RecordIncome[];
      } catch (err) {
        throw err;
      }
    }



}
