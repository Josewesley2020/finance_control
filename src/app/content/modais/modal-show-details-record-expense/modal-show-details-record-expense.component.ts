import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record } from '../../../models/record.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-show-details-record-expense',
  imports: [CommonModule],
  templateUrl: './modal-show-details-record-expense.component.html',
  styleUrls: ['./modal-show-details-record-expense.component.css']
})
export class ModalShowDetailsRecordExpenseComponent implements OnInit {
  record?: Record;
  month: number = 0;
  year: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalShowDetailsRecordExpenseComponent>,
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
}
