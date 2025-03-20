import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  constructor(private snackBar: MatSnackBar) { }

  info(mensagem: string, duracao = 1000) {
    this.exibir(mensagem, {
      duration: duracao,
      panelClass: 'notificacao-info'
    });
  }

  sucesso(mensagem: string, duracao = 1000) {
    this.exibir(mensagem, {
      duration: duracao,
      panelClass: 'notificacao-sucesso'
    });
  }

  alerta(mensagem: string, duracao = 1000) {
    if (mensagem.length === 0) return;

    this.exibir(mensagem, {
      duration: duracao,
      panelClass: 'notificacao-alerta'
    });
  }

  erro(mensagem: string, duracao = 10000) {
    this.exibir(mensagem, {
      duration: duracao,
      panelClass: 'notificacao-erro'
    });
  }

  private exibir(mensagem: string, configuracao: MatSnackBarConfig) {
    configuracao.horizontalPosition = 'center';
    configuracao.verticalPosition = 'bottom';
    this.snackBar.open(mensagem, 'X', configuracao);
  }
}
