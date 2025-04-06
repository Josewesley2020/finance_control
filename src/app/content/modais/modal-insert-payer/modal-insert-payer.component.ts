import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableOtherPayersService } from '../../../services/table-other-payers.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-insert-payer',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-payer.component.html',
  styleUrl: './modal-insert-payer.component.css'
})
export class ModalInsertPayerComponent {
  name: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalInsertPayerComponent>,
    private tableOtherPayersService: TableOtherPayersService,
    private notificacoesService: NotificacoesService) { }


  save() {
    this.tableOtherPayersService.insertInInOther_Payers(this.name).then(() => {
      this.notificacoesService.sucesso('Pagador cadastrado com sucesso.');
      this.dialogRef.close({ success: true });
    }).catch(error => {
      this.notificacoesService.erro('Erro ao inserir origem.');
    });

  }

  cancel() {
    this.notificacoesService.info('Ação cancelada.');
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }


}
