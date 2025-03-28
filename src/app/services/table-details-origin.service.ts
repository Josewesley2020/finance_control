import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Details_Origin } from '../models/details_Origin.model';
import { User } from '../models/user.model';
import { AuthenticatorService } from './authenticator.service';

@Injectable({
  providedIn: 'root'
})
export class TableDetailsOriginService {
  user?: User;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthenticatorService) {
    this.user = this.authService.getUser();
  }

  async selectInDetails_Origin(): Promise<Details_Origin[]> {
    try {
      let { data: details_Origin, error } = await this.supabaseService.clientSupabase
        .from('Details_Origin')
        .select('*')
        .eq('idUser', this.user?.id);

      if (error) {
        console.error('Erro ao buscar metas:', error);
        throw error;
      }
      return details_Origin as Details_Origin[];
    } catch (err) {
      console.error('Erro inesperado:', err);
      throw err;
    }
  }

  async insertInInDetails_Origin(idUser: string,
    description: string, observation: string,
    closing_day: number, due_date: number, change_value: boolean, show_record: boolean = true): Promise<Details_Origin[]> {
    try {
      let { data: origin, error } = await this.supabaseService.clientSupabase
        .from('Details_Origin')
        .insert([
          {
            Description: description,
            Observation: observation,
            Closing_day: closing_day,
            due_date: due_date,
            change_value: change_value,
            idUser: idUser,
            show_record: show_record
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao adicionar origem:', error);
        throw error;
      }
      console.log('Origens encontradas:', origin);
      return origin as Details_Origin[];
    } catch (err) {
      console.error('Erro inesperado:', err);
      throw err;
    }
  }

}
