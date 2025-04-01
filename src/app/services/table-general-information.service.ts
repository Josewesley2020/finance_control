import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticatorService } from './authenticator.service';
import { SupabaseService } from './supabase.service';
import { GeneralInfo } from '../models/general-info.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableGeneralInformationService {
  private infoUpdateSubject = new BehaviorSubject<GeneralInfo>({} as GeneralInfo); // Armazena o valor inicial como um objeto vazio
  infoUpdate$ = this.infoUpdateSubject.asObservable(); // Observable para os componentes se inscreverem

  user?: User;

  constructor(
    private authService: AuthenticatorService,
    private supabaseService: SupabaseService) {
    this.user = this.authService.getUser();
  }


  async selectInGeneralInformation(): Promise<GeneralInfo[]> {
    const { data, error } = await this.supabaseService.clientSupabase
      .from('General_Information')
      .select('*')
      .eq('idUser', this.user?.id)

    if (error) {
      throw new Error(error.message);
    }
    return data as GeneralInfo[];
  }

  // async updateInGeneralInformation1(
  //   id: number,
  //   value_in_the_Piggy: number,
  //   goal_value_in_the_piggy: number,
  //   old_value_piggy: number,
  //   last_update_month: number,
  //   last_update_year: number,
  //   last_update_day: number): Promise<void> {
  //   try {
  //     const { data, error } = await this.supabaseService.clientSupabase
  //       .from('General_Information')
  //       .update({
  //         value_in_the_Piggy,
  //         goal_value_in_the_piggy,
  //         old_value_piggy,
  //         last_update_month,
  //         last_update_year,
  //         last_update_day
  //       })
  //       .eq('id', id);
  //       .select();

  //     if (error) {
  //       throw new Error(error.message);
  //     }

  //     if (data) {
  //       this.infoUpdateSubject.next(data[0] as GeneralInfo);
  //     }
  //   } catch (err) {
  //     console.error('Error updating General_Information:', err);
  //     throw err;
  //   }
  // }

    async updateInGeneralInformation(
    id: number,
    value_in_the_Piggy: number,
    goal_value_in_the_piggy: number,
    old_value_piggy: number,
    last_update_month: number,
    last_update_year: number,
    last_update_day: number
    ): Promise<GeneralInfo[]> {
      try {
        let { data: generalInfo, error } = await this.supabaseService.clientSupabase
          .from('General_Information')
          .update({
           value_in_the_Piggy,
          goal_value_in_the_piggy,
          old_value_piggy,
          last_update_month,
          last_update_year,
          last_update_day
          })
          .eq('id', id)
          .select();
        if (error) {
          console.error('Erro ao atualizar informações gerais:', error);
          throw error;
        }
        if (generalInfo) {
          this.infoUpdateSubject.next(generalInfo[0] as GeneralInfo);
        }
        return generalInfo as GeneralInfo[];
      } catch (err) {
        console.error('Erro ao atualizar informações gerais:', err);
        throw err;
      }
    }

}
