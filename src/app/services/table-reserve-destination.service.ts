import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '../models/user.model';
import { AuthenticatorService } from './authenticator.service';
import { ReserveDestination } from '../models/reserve-destination';

@Injectable({
  providedIn: 'root'
})
export class TableReserveDestinationService {
  user?: User;

  constructor(
    private authService: AuthenticatorService,
    private supabaseService: SupabaseService) {
    this.user = this.authService.getUser();
  }

  async selectInReserveDestination(): Promise<ReserveDestination[]> {
    try {
      let { data: destinationReserve, error } = await this.supabaseService.clientSupabase
        .from('Reserve_Destination')
        .select('*')
        .eq('idUser',  this.user?.id)
        .order('description', { ascending: true });
      if (error) {
        console.error('Erro ao buscar destinos da reserva:', error);
        throw error;
      }
      return destinationReserve as ReserveDestination[];
    }
    catch (err) {
      console.error('Erro ao buscar destinos da reserva:', err);
      throw err;
    }
  }

  async insertInInReserveDestination(description: string, observation: string, show: boolean = true): Promise<ReserveDestination[]> {
    try {
      let { data: destinationReserve, error } = await this.supabaseService.clientSupabase
        .from('Reserve_Destination')
        .insert([
          {
            description: description,
            idUser: this.user?.id,
            observation: observation,
            show: show
          }
        ])
        .select();
      if (error) {
        console.error('Erro ao adicionar destino da reserva:', error);
        throw error;
      }
      return destinationReserve as ReserveDestination[];
    } catch (err) {
      console.error('Erro ao adicionar destino da reserva:', err);
      throw err;
    }
  }
}
