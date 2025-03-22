import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TableReserveDestinationService {

  constructor(private supabaseService: SupabaseService) { }

    async insertInInReserveDestination(idUser: string, description: string, observation: string, show: boolean = true): Promise<any[]> {
      try {
        let { data: destinationReserve, error } = await this.supabaseService.clientSupabase
          .from('Reserve_Destination')
          .insert([
            {
              description: description,
              idUser: idUser,
              observation: observation,
              show: show
            }
          ])
          .select();
        if (error) {
          console.error('Erro ao adicionar destino da reserva:', error);
          throw error;
        }
        return destinationReserve as any[];
      } catch (err) {
        console.error('Erro ao adicionar destino da reserva:', err);
        throw err;
      }
    }
}
