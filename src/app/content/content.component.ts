import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Record } from '../models/record.model';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../services/authenticator.service';
import { User } from '../models/user.model';



@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  records: Record[] = [];
  data: any;
  user?: User;

  constructor(private supabaseService: SupabaseService, private authenticatorService: AuthenticatorService) { }

  ngOnInit() {
    this.selectInRecordsWithDetails_Origin();
    this.userAuth("j.wesley", "123@321");
  }

  selectInRecordsWithDetails_Origin() {
    this.supabaseService.selectInRecordsWithDetails_Origin().then(records => {
      this.data = records;
      console.log('Data:', this.data);
    }).catch(error => {
      console.error('Erro ao buscar registros:', error);
    });
  }

  userAuth(login: string, password: string) {
    this.authenticatorService.userAuth(login, password).then(user => {
      if (user) {
        this.user = user;
        console.log('Usuário:', this.user);
      }
    }).catch(error => {
      alert('Erro ao buscar usuário: ' + error);
    });
  }

}
