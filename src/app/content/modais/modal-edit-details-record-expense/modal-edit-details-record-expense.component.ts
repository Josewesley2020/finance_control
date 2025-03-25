import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record } from '../../../models/record.model';
import { CommonModule } from '@angular/common';
import { TableRecordsService } from '../../../services/table-records-expenses.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-details-record-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-details-record-expense.component.html',
  styleUrls: ['./modal-edit-details-record-expense.component.css']
})
export class ModalEditDetailsRecordExpenseComponent implements OnInit {
  record?: Record;
  month: number = 0;
  year: number = 0;

  constructor(
    private tableRecordsService: TableRecordsService,
    private notificacoesService: NotificacoesService,
    public dialogRef: MatDialogRef<ModalEditDetailsRecordExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: Record, month: number, year: number }
  ) {
    this.record = data.record;
    this.month = data.month;
    this.year = data.year;
  }

  ngOnInit(): void {
    // Inicialização do componente
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.record) {
      this.updateInRecords_Expenses(this.record.id, this.record.value, this.record.discounts, this.record.definitive_value, this.record.payment);
    }
  }

  classByStatus(record: Record): string {
    if (record.payment) return 'text-success';
    if (this.isDatePast(record.Details_Origin.due_date, record.month, record.year)) return 'text-danger';
    return 'text-warning';
  }

  isDatePast(day: number, month: number, year: number): boolean {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);

    return inputDate < currentDate;
  }

  formatDate(day: number, month: number, year: number): string {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  }

  updateInRecords_Expenses(id: number, value: number, discounts: number, definitive_value: boolean, payment: boolean) {
    this.tableRecordsService.updateInRecords_Expenses(id, value, discounts, definitive_value, payment).then(records => {
      this.notificacoesService.sucesso('Despesa atualizada com sucesso.');
      this.dialogRef.close({ success: true });
    }).catch(error => {
      console.error('Erro ao atualizar despesa:', error);
      this.notificacoesService.erro('Erro ao atualizar despesa.');
    });
  }
}
