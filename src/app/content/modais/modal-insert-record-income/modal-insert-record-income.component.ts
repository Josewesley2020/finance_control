import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TableRecordsIncomeService } from '../../../services/table-records-income.service';

@Component({
  selector: 'app-modal-insert-record-income',
    imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-record-income.component.html',
  styleUrl: './modal-insert-record-income.component.css'
})
export class ModalInsertRecordIncomeComponent implements OnInit{
  description: string = '';
  value: number = 0; // Valor
  month = 3; // Mês
  year = 2025; // Ano
  idIncome = 6; // ID da renda

  constructor(
    private notificacoesService: NotificacoesService,
    private tableRecordsIncomeService: TableRecordsIncomeService,
    public dialogRef: MatDialogRef<ModalInsertRecordIncomeComponent>) { }


  ngOnInit(): void {
  }

    save() {
      this.tableRecordsIncomeService.insertInInRecodsIncome(this.description, this.value, this.month, this.year, this.idIncome).then(() => {
        this.notificacoesService.sucesso('Sucesso.');
        this.dialogRef.close({ success: true });
      }).catch(error => {
        this.notificacoesService.erro('Erro.');
      });

  }

  cancel() {
    this.notificacoesService.info('Ação cancelada.');
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }

}
