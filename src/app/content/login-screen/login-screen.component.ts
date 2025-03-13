import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticatorService } from '../../services/authenticator.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {

  @Output() userLogado = new EventEmitter<boolean>();
  @Output() user = new EventEmitter<User>();
  username: string = '';
  password: string = '';
  loading = false;

  constructor(private authenticatorService: AuthenticatorService) {
    // this.logout();
  }

  onLogin() {
    this.loading = true;
    this.userAuth(this.username, this.password);
  }

  userAuth(login: string, password: string) {
    this.authenticatorService.userAuth(login, password).then(user => {
      if (user) {
        this.userLogado.emit(true);
        this.user.emit(user);
      } else {
        alert('Usuário ou senha inválidos');
        this.userLogado.emit(false);
        this.user.emit(undefined);
      }
      this.loading = false;
    }).catch(error => {
      alert('Erro ao buscar usuário: ' + error);
      this.loading = false;
    });
  }

  logout() {
    this.userLogado.emit(false);
    this.user.emit(undefined);
  }

}
