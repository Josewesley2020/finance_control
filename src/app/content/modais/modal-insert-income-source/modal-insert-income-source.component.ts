import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TableIncomeSourceService } from '../../../services/table-income-source.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-insert-income-source',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-income-source.component.html',
  styleUrl: './modal-insert-income-source.component.css'
})
export class ModalInsertIncomeSourceComponent implements OnInit {
  user?: User;
  description: string = '';


  constructor(
    private authService: AuthenticatorService,
    private notificacoesService: NotificacoesService,
    private tableIncomeSourceService: TableIncomeSourceService,
    public dialogRef: MatDialogRef<ModalInsertIncomeSourceComponent>) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  save() {
    if (this.user && this.user.id) {
      this.tableIncomeSourceService.insertInInIncomeSource(this.user.id, this.description).then(() => {
        this.notificacoesService.sucesso('Fonte de renda cadastrada com sucesso.');
        this.dialogRef.close({ success: true });
      }).catch(error => {
        this.notificacoesService.erro('Erro ao inserir origem.');
      });
    } else {
      this.notificacoesService.erro('Usuário inválido. Não é possível inserir a origem.');
    }
  }

  cancel() {
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }

}
