import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { TableReserveDestinationService } from '../../../services/table-reserve-destination.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-insert-reserve-destination',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-reserve-destination.component.html',
  styleUrl: './modal-insert-reserve-destination.component.css'
})
export class ModalInsertReserveDestinationComponent implements OnInit {
  user?: User;
  description: string = '';
  observation: string = '';

  constructor(
    private authService: AuthenticatorService,
    private notificacoesService: NotificacoesService,
    private tableReserveDestinationService: TableReserveDestinationService,
    public dialogRef: MatDialogRef<ModalInsertReserveDestinationComponent>) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  save() {
    if (this.user && this.user.id) {
      this.tableReserveDestinationService.insertInInReserveDestination(this.user.id, this.description, this.observation).then(() => {
        this.notificacoesService.sucesso('Destino da reserva cadastrada com sucesso.');
        this.dialogRef.close({ success: true });
      }).catch(error => {
        this.notificacoesService.erro('Erro ao inserir destino da reserva.');
      });
    } else {
      this.notificacoesService.erro('Usuário inválido. Não é possível destino da reserva.');
    }
  }

  cancel() {
    this.notificacoesService.info('Ação cancelada.');
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }


}
