import { Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environment/environment';
import { User } from '../models/user.model';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService implements OnInit {

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() {
     console.log("SUPABASE")
    console.log(this.supabaseService.clientSupabase)
    console.log(supabase)
  }

  async userAuth(login: string, password: string): Promise<User | null> {
    let { data: Users, error } = await this.supabaseService.clientSupabase
      .from('Users')
      .select('id, Name, Login,Email')
      .eq('Login', login)
      .eq('pass', password);
    if (error) {
      throw error
    }
    return Users ? Users[0] as User : null;
  }

}
