import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  constructor(private supabaseService: SupabaseService) { }

  async userAuth(login: string, password: string): Promise<User | null> {
    let { data: Users, error } = await this.supabaseService.clientSupabase
      .from('Users')
      .select('id, Name, Login,Email')
      .eq('Login', login)
      .eq('pass', password);
    if (error) {
      throw error
    }
    const user = Users ? Users[0] as User : null;
    const loginValidate = user ? true : false;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loginValidate', JSON.stringify(loginValidate));
    return Users ? Users[0] as User : null;
  }

  logoutLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(undefined));
      localStorage.setItem('loginValidate', JSON.stringify(false));
    }
  }

  getUserLocalStorage() {
    let user: User | undefined = undefined;
    let loginValidate: boolean = false;

    if (typeof localStorage !== 'undefined') {
      const userLocalStorage = localStorage.getItem('user');
      if (userLocalStorage && userLocalStorage !== 'undefined' && userLocalStorage !== 'null') {
        user = JSON.parse(userLocalStorage);
        const loginValidateLocalStorage = localStorage.getItem('loginValidate');
        if (loginValidateLocalStorage && loginValidateLocalStorage !== 'undefined' && loginValidateLocalStorage !== 'null') {
          loginValidate = JSON.parse(loginValidateLocalStorage);
        }
      }
    }

    return { user, loginValidate };
  }

  getUser(): User | undefined {
    const { user } = this.getUserLocalStorage();
    return user || undefined;
  }

}
