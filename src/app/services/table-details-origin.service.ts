import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Details_Origin } from '../models/details_Origin.model';

@Injectable({
  providedIn: 'root'
})
export class TableDetailsOriginService {

  constructor(private supabaseService: SupabaseService) { }


  async insertInInDetails_Origin(idUser: string): Promise<Details_Origin[]> {
    try {
      let { data: origin, error } = await this.supabaseService.clientSupabase
        .from('Details_Origin')
        .insert([
          {
            Description: 'APP-FINACE',
            Observation: 'APP-FINACE',
            Closing_day: 19,
            due_date: 21,
            change_value: true,
            idUser: idUser
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
