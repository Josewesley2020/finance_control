import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { SupabaseService } from './supabase.service';
import { AuthenticatorService } from './authenticator.service';
import { Records_another_payer } from '../models/records_another_payer';

@Injectable({
  providedIn: 'root'
})
export class TableRecordsAnotherPayerService {
  user?: User;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthenticatorService) {
    this.user = this.authService.getUser();
  }

  async insertMultipleRecords(records: Records_another_payer[]): Promise<void> {
  try {
    const { data, error } = await this.supabaseService.clientSupabase
      .from('Records_another_payer')
      .insert(records);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Erro ao inserir múltiplos registros:', error);
    throw error;
  }
}

  async selectInRecords_another_payer(): Promise<Records_another_payer[]> {
    let { data: records, error } = await this.supabaseService.clientSupabase
      .from('Records_another_payer')
      .select(`*`)
      .eq('idUser', this.user?.id);
    if (error) {
      throw error;
    }
    return records as Records_another_payer[];
  }

  async insertInRecords_another_payer(
    idPayer: number,
    idOrigin: number,
    description: string,
    value: number,
    month: number,
    year: number,
    qtd_parcelas_total: number,
    qtd_parcelas_pagas: number,
    monthInit: number,
    yearInit: number,
    payment: boolean = false,
    idUser: string = ''
  ): Promise<Records_another_payer[]> {
    try {
      let { data: records_another_payer, error } = await this.supabaseService.clientSupabase
        .from('Records_another_payer')
        .insert([
          {
            idPayer: idPayer,
            idOrigin: idOrigin,
            description: description,
            value: value,
            month: month,
            year: year,
            qtd_parcelas_total: qtd_parcelas_total,
            qtd_parcelas_pagas: qtd_parcelas_pagas,
            mothInit: monthInit,
            yearInit: yearInit,
            payment: payment,
            idUser: this.user?.id
          }
        ])
      if (error) {
        throw error;
      }
      return records_another_payer as unknown as Records_another_payer[];
    } catch (error) {
      console.error('Error inserting record:', error);
      throw error;
    }
  }

  async updateInRecords_another_payer(
    id: number,
    idPayer: number,
    idOrigin: number,
    description: string,
    value: number,
    month: number,
    year: number,
    qtd_parcelas_pagas: number,
    qtd_parcelas_total: number,
    monthInit: number,
    yearInit: number,
    payment: boolean = false,
    idUser: string = ''
  ): Promise<Records_another_payer[]> {
    try {
      let { data: records_another_payer, error } = await this.supabaseService.clientSupabase
        .from('Records_another_payer')
        .update({
          idPayer: idPayer,
          idOrigin: idOrigin,
          description: description,
          value: value,
          month: month,
          year: year,
          qtd_parcelas_total: qtd_parcelas_total,
          qtd_parcelas_pagas: qtd_parcelas_pagas,
          monthInit: monthInit,
          yearInit: yearInit,
          payment: payment,
          idUser: this.user?.id
        })
        .eq('id', id)
        .select();
      if (error) {
        throw error;
      }
      return records_another_payer as unknown as Records_another_payer[];
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }

  async deleteInRecords_another_payer(id: number): Promise<Records_another_payer[]> {
    try {
      let { data: records_another_payer, error } = await this.supabaseService.clientSupabase
        .from('Records_another_payer')
        .delete()
        .eq('id', id)
        .select();
      if (error) {
        throw error;
      }
      return records_another_payer as unknown as Records_another_payer[];
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }
}
