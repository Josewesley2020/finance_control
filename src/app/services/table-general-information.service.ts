import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticatorService } from './authenticator.service';
import { SupabaseService } from './supabase.service';
import { GeneralInfo } from '../models/general-info.model';

@Injectable({
  providedIn: 'root'
})
export class TableGeneralInformationService {
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

  async updateInGeneralInformation(
    id: number,
    value_in_the_Piggy: number,
    goal_value_in_the_piggy: number,
    old_value_piggy: number,
    last_update_month: number,
    last_update_year: number): Promise<void> {
    const { error } = await this.supabaseService.clientSupabase
      .from('General_Information')
      .update({
        value_in_the_Piggy,
        goal_value_in_the_piggy,
        old_value_piggy,
        last_update_month,
        last_update_year
      })
      .eq('id', id);
  }

}
