import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Record } from '../models/record.model';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../services/authenticator.service';
import { User } from '../models/user.model';
import { LoginScreenComponent } from "./login-screen/login-screen.component";
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, LoginScreenComponent, HomeComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  records: Record[] = [];
  data: any;
  user?: User;
  loginValidate: boolean = false;

  constructor(private supabaseService: SupabaseService, private authenticatorService: AuthenticatorService) {
  }
  ngOnInit(): void {
    if (!this.user) {
      this.getUserLocalStorage();
    }
  }

  getUserLocalStorage() {
    const userLocalStorage = localStorage.getItem('user');
    if (userLocalStorage && userLocalStorage != 'undefined' ) {
      this.user = JSON.parse(userLocalStorage);
      const loginValidateLocalStorage = localStorage.getItem('loginValidate');
      if (loginValidateLocalStorage) {
        this.loginValidate = JSON.parse(loginValidateLocalStorage);
      }
    }
  }

  selectInRecordsWithDetails_Origin() {
    this.supabaseService.selectInRecordsWithDetails_Origin().then(records => {
      this.data = records;
      console.log('Data:', this.data);
    }).catch(error => {
      console.error('Erro ao buscar registros:', error);
    });
  }

  setUser($event: User) {
    this.user = $event;
    localStorage.setItem('user', JSON.stringify(this.user));
  }
  validateLogin($event: boolean) {
    this.loginValidate = $event;
    localStorage.setItem('loginValidate', JSON.stringify(this.loginValidate));
  }

  logout() {
    this.user = undefined;
    this.loginValidate = false;
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('loginValidate', JSON.stringify(this.loginValidate));
  }
}
