import { Component, Inject, OnInit } from '@angular/core';
import { TableRecordsService } from '../../../services/table-records-expenses.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record } from '../../../models/record.model';
import { TableDetailsOriginService } from '../../../services/table-details-origin.service';
import { Details_Origin } from '../../../models/details_Origin.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-insert-record-expense',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-insert-record-expense.component.html',
  styleUrls: ['./modal-insert-record-expense.component.css']
})
export class ModalInsertRecordExpenseComponent implements OnInit {
  allRecords: Record[] = [];
  details_origin: Details_Origin[] = [];
  month: number = 0;
  year: number = 0;
  idDetailsOrigin: number = 0;
  value: number = 0;
  discounts: number = 0;
  definitive_value: boolean = false;
  payment: boolean = false;

  constructor(
    private tableDetailsOriginService: TableDetailsOriginService,
    private tableRecordsService: TableRecordsService,
    private notificacoesService: NotificacoesService,
    public dialogRef: MatDialogRef<ModalInsertRecordExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { allRecords: Record[], month: number, year: number }
  ) {
    this.allRecords = data.allRecords;
    this.month = data.month;
    this.year = data.year;
  }

  ngOnInit(): void {
    this.selectInDetails_Origin();
  }

  selectInDetails_Origin() {
    this.tableDetailsOriginService.selectInDetails_Origin().then(details_origin => {
      console.log('Origens encontradas:', details_origin);
      this.details_origin = details_origin;
    }).catch(error => {
      console.error('Erro ao buscar origens:', error);
    });
  }

  insertInRecords_Expenses() {
    const { idDetailsOrigin, value, discounts, definitive_value, payment, month, year } = this;
    this.tableRecordsService.insertInInRecords_Expenses(idDetailsOrigin, value, month, year, discounts, definitive_value, payment).then(records => {
      this.notificacoesService.sucesso('Despesa adicionada com sucesso.');
      this.dialogRef.close({ success: true });
    }).catch(error => {
      console.error('Erro ao adicionar despesa:', error);
      this.notificacoesService.erro('Erro ao adicionar despesa.');
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
