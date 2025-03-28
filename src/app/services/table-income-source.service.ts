import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Income } from '../models/income.model';
import { User } from '../models/user.model';
import { AuthenticatorService } from './authenticator.service';

@Injectable({
  providedIn: 'root'
})
export class TableIncomeSourceService {
  user?: User;


  constructor(
  private supabaseService: SupabaseService,
  private authService: AuthenticatorService) {
  this.user = this.authService.getUser();
  }

  async selectInIncomeSource(): Promise<Income[]> {
    try {
      let { data: income, error } = await this.supabaseService.clientSupabase
        .from('Income_Source')
        .select(`*`)
        .eq('idUser', this.user?.id)
        .eq('show', true)
      if (error) {
        throw error;
      }
      return income as Income[];
    } catch (err) {
      console.error('Erro ao selecionar fonte de renda:', err);
      throw err;
    }
  }

  async insertInInIncomeSource(idUser: string, description: string, show: boolean = true): Promise<Income[]> {
    try {
      let { data: income, error } = await this.supabaseService.clientSupabase
        .from('Income_Source')
        .insert([
          {
            description: description,
            idUser: idUser,
            show: show
          }
        ])
        .select();
      if (error) {
        console.error('Erro ao adicionar fonte de renda:', error);
        throw error;
      }
      return income as Income[];
    } catch (err) {
      console.error('Erro ao adicionar fonte de renda:', err);
      throw err;
    }
  }
}
