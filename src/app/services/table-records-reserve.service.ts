import { Injectable } from '@angular/core';
import { AuthenticatorService } from './authenticator.service';
import { SupabaseService } from './supabase.service';
import { User } from '../models/user.model';
import { RecordReserve } from '../models/records-reserve';

@Injectable({
  providedIn: 'root'
})
export class TableRecordsReserveService {
  user?: User;

  constructor(
    private authService: AuthenticatorService,
    private supabaseService: SupabaseService) {
    this.user = this.authService.getUser();
  }

  async selectInRecordsReserve(): Promise<RecordReserve[]> {
    let { data: Records, error } = await this.supabaseService.clientSupabase
      .from('Records_Reserve')
      .select(`*`)
      .eq('idUser', this.user?.id);
    if (error) {
      throw error;
    }
    return Records as RecordReserve[];
  }

  async insertInInRecordsReserve(
    value: number,
    month: number,
    year: number,
    idDestination: number,
    safe_in_piggy: boolean = false,
    obs: string = '' // Novo parâmetro para observação
  ): Promise<RecordReserve[]> {
    try {
      let { data: records, error } = await this.supabaseService.clientSupabase
        .from('Records_Reserve')
        .insert([
          {
            value: value,
            month: month,
            year: year,
            idDestination: idDestination,
            safe_in_piggy: safe_in_piggy,
            idUser: this.user?.id,
            obs: obs // Inclui o campo obs
          }
        ])
        .select();
      if (error) {
        console.error('Erro ao adicionar despesa:', error);
        throw error;
      }
      return records as RecordReserve[];
    } catch (err) {
      console.error('Erro ao adicionar reserva', err);
      throw err;
    }
  }

  async deleteInRecordsReserve(id: number): Promise<RecordReserve[]> {
    try {
      let { error } = await this.supabaseService.clientSupabase
        .from('Records_Reserve')
        .delete()
        .eq('id', id)
        .select();
      if (error) {
        console.error('Erro ao deletar reserva:', error);
        throw error;
      }
      return [];
    }
    catch (err) {
      console.error('Erro ao deletar reserva:', err);
      throw err;
    }
  }
}
