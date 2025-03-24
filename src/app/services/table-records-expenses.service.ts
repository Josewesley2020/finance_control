import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Record } from '../models/record.model';
import { User } from '../models/user.model';
import { AuthenticatorService } from './authenticator.service';


@Injectable({
  providedIn: 'root'
})
export class TableRecordsService {
 user?: User;

  constructor(private supabaseService: SupabaseService,private authService: AuthenticatorService) {
   this.user = this.authService.getUser();
  }
  async selectInRecordsWithDetails_Origin(): Promise<Record[]> {
    let { data: Records, error } = await this.supabaseService.clientSupabase
      .from('Records_Expenses')
      .select(`
        *,
        Details_Origin (
          *
        )
      `)
      .eq('idUser', this.user?.id);
    if (error) {
      throw error;
    }
    return Records as Record[];
  }
  async insertInInRecords_Expenses(details_origin_id: number,value: number, month: number, year: number, discounts: number, definitive_value: boolean, payment: boolean): Promise<Record[]> {
    try {
      let { data: records_expenses, error } = await this.supabaseService.clientSupabase
        .from('Records_Expenses')
        .insert([
          {
            details_origin_id: details_origin_id,
            value: value,
            month: month,
            year: year,
            discounts: discounts,
            definitive_value: definitive_value,
            payment: payment,
            idUser: this.user?.id
          }
        ])
        .select();
      if (error) {
        console.error('Erro ao adicionar despesa:', error);
        throw error;
      }
      return records_expenses as Record[];
    } catch (err) {
      console.error('Erro ao adicionar despesa:', err);
      throw err;
    }
  }
  async deleteInRecords_Expenses(id: number): Promise<Record[]> {
  try {
    let {  error } = await this.supabaseService.clientSupabase
      .from('Records_Expenses')
      .delete()
      .eq('id', id)
      .select();
    if (error) {
      console.error('Erro ao deletar despesa:', error);
      throw error;
    }
    return [];
  }
  catch (err) {
    console.error('Erro ao deletar despesa:', err);
    throw err;
  }
  }
  async updateInRecords_Expenses(id: number, value: number, discounts: number, definitive_value: boolean, payment: boolean): Promise<Record[]> {
    try {
      let { data: records_expenses, error } = await this.supabaseService.clientSupabase
        .from('Records_Expenses')
        .update({
          value: value,
          discounts: discounts,
          definitive_value: definitive_value,
          payment: payment
        })
        .eq('id', id)
        .select();
      if (error) {
        console.error('Erro ao atualizar despesa:', error);
        throw error;
      }
      return records_expenses as Record[];
    } catch (err) {
      console.error('Erro ao atualizar despesa:', err);
      throw err;
    }
  }
}
