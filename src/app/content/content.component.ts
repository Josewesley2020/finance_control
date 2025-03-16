import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../services/authenticator.service';
import { User } from '../models/user.model';
import { LoginScreenComponent } from "./login-screen/login-screen.component";
import { HomeComponent } from "./home/home.component";
import { MenuHeaderComponent } from "./menu-header/menu-header.component";

@Component({
    selector: 'app-content',
    imports: [CommonModule, LoginScreenComponent, HomeComponent, MenuHeaderComponent],
    templateUrl: './content.component.html',
    styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  // records: Record[] = [];
  // data: any;
  user?: User;
  loginValidate: boolean = false;
  loading: boolean = false;

  constructor(private authenticatorService: AuthenticatorService) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.getUserLocalStorage();
  }

  getUserLocalStorage() {
    const { user, loginValidate } = this.authenticatorService.getUserLocalStorage();
    this.user = user;
    this.loginValidate = loginValidate;
    this.loading = false;
  }

  // selectInRecordsWithDetails_Origin() {
  //   this.supabaseService.selectInRecordsWithDetails_Origin().then(records => {
  //     this.data = records;
  //     console.log('Data:', this.data);
  //   }).catch(error => {
  //     console.error('Erro ao buscar registros:', error);
  //   });
  // }

  setUser($event: User) {
    this.user = $event;
  }
  validateLogin($event: boolean) {
    this.loginValidate = $event;
  }

  getUser() {
    return this.user;
  }

  logout() {
    this.user = undefined;
    this.loginValidate = false;
    this.authenticatorService.logoutLocalStorage();
  }
}
