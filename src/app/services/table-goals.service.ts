import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class TableGoalsService {

  constructor(private supabaseService: SupabaseService) { }

  async selectInInGoals(idUser: string): Promise<Goal[]> {
    try {
      let { data: goals, error } = await this.supabaseService.clientSupabase
        .from('Goals')
        .select('*')
        .eq('idUser', idUser);

      if (error) {
        console.error('Erro ao buscar metas:', error);
        throw error;
      }

      console.log('Metas encontradas:', goals);
      return goals as Goal[];
    } catch (err) {
      console.error('Erro inesperado:', err);
      throw err;
    }
  }

}
