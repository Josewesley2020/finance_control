import { Injectable } from '@angular/core';
import { AuthenticatorService } from './authenticator.service';
import { SupabaseService } from './supabase.service';
import { User } from '../models/user.model';
import { OtherPayers } from '../models/other_payers';
import { NotificacoesService } from '../content/shared/notificacoes.service';

@Injectable({
  providedIn: 'root'
})
export class TableOtherPayersService {
  user?: User;

  constructor(
    private notificacoesService: NotificacoesService,
    private authService: AuthenticatorService,
    private supabaseService: SupabaseService) {
    this.user = this.authService.getUser();
  }

  async selectInOther_Payers(): Promise<OtherPayers[]> {
    try {
      let { data: otherPayer, error } = await this.supabaseService.clientSupabase
        .from('Other_Payers')
        .select('*')
      if (error) {
        this.notificacoesService.erro('Erro ao buscar registros de outros pagadores');
        throw error;
      }
      if (otherPayer?.length === 0) {
        this.notificacoesService.info('Nenhum registro encontrado');
      }
      return otherPayer as OtherPayers[];
    }
    catch (err) {
      this.notificacoesService.erro('Erro ao buscar registros de outros pagadores');
      console.error('Erro ao buscar destinos da reserva:', err);
      throw err;
    }
  }

  async insertInInOther_Payers(name: string, show: boolean = true): Promise<OtherPayers[]> {
    try {
      let { data: otherPayers, error } = await this.supabaseService.clientSupabase
        .from('Other_Payers')
        .insert([
          {
            name: name,
            show: show
          }
        ])
        .select();
      if (error) {
        this.notificacoesService.erro('Erro ao adicionar registro de outro pagador');
        throw error;
      }
      return otherPayers as OtherPayers[];
    } catch (err) {
      this.notificacoesService.erro('Erro ao adicionar registro de outro pagador');
      throw err;
    }
  }
}
