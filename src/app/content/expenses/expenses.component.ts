import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Record } from '../../models/record.model';
import { FormsModule } from '@angular/forms';
import { TableRecordsService } from '../../services/table-records-expenses.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificacoesService } from '../shared/notificacoes.service';
import { ModalInsertRecordExpenseComponent } from '../modais/modal-insert-record-expense/modal-insert-record-expense.component';
import { ModalEditDetailsRecordExpenseComponent } from '../modais/modal-edit-details-record-expense/modal-edit-details-record-expense.component';
import { ModalShowDetailsRecordExpenseComponent } from '../modais/modal-show-details-record-expense/modal-show-details-record-expense.component';
import { DataSelectedService } from '../../services/data-selected.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  // informPayment(_t15: Record) {
  // console.log('informPayment', _t15);
  // }
  // editRecords(_t15: Record) {
  // throw new Error('Method not implemented.');
  // }
  // showInfo(_t15: Record) {
  // throw new Error('Method not implemented.');
  // }
  // deleteRecord(_t15: Record) {
  // throw new Error('Method not implemented.');
  // }


  // addNewRecord() {
  //   throw new Error('Method not implemented.');
  // }
  private subscriptionInDate: Subscription = new Subscription();
  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  records: Record[] = [];
  allRecords: Record[] = [];
  selectedMonth: number = 0;
  selectedYear: number = 0;
  totalPayable: number = 0;
  totalPending: number = 0;
  totalDiscount: number = 0;
  totalLate: number = 0;

  constructor(
    private dataSelectedService: DataSelectedService,
    private tableRecordsService: TableRecordsService,
    private notificacoesService: NotificacoesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscriptionInDate = this.dataSelectedService.selectedDate$.subscribe(() => {
      this.onDateChanged();
    });
  }

  onDateChanged() {
    this.selectedMonth = this.dataSelectedService.getMonth();
    this.selectedYear = this.dataSelectedService.getYear();
    this.reload();
  }

  reload() {
    this.getRecords();
  }

  getRecords() {
    this.tableRecordsService.selectInRecordsWithDetails_Origin().then((data) => {
      this.allRecords = data;
      this.filterRecords();
    }).catch((error) => {
      console.error('Erro ao buscar registros:', error);
    });
  }

  filterRecords() {
    // Filtra os registros pelo mês e ano selecionados
    this.records = this.allRecords
      .filter(record => record.month === this.selectedMonth && record.year === this.selectedYear)
    // .sort((a, b) => this.compareDueDates(a.Details_Origin.due_date.toString(), b.Details_Origin.due_date.toString()));

    // Calcula os totais
    const totals = this.calculateTotals(this.records);
    this.totalPayable = parseFloat(totals.totalPayable.toFixed(2));
    this.totalPending = parseFloat(totals.totalPending.toFixed(2));
    this.totalLate = parseFloat(totals.totalLate.toFixed(2));
    this.totalDiscount = parseFloat(totals.totalDiscount.toFixed(2));
  }

  calculateTotals(records: Record[]): { totalPayable: number, totalPending: number, totalLate: number, totalDiscount: number } {
    let totalPayable = 0;
    let totalPending = 0;
    let totalLate = 0;
    let totalDiscount = 0;

    records.forEach(record => {
      const valueAfterDiscount = record.value - record.discounts || 0;

      if (record.payment) {
        totalPayable += valueAfterDiscount;
      } else {
        totalPending += valueAfterDiscount;
        if (this.isDatePast(record.Details_Origin.due_date, record.month, record.year)) {
          totalLate += valueAfterDiscount;
        }
      }
      totalDiscount += record.discounts || 0;
    });

    return { totalPayable, totalPending, totalLate, totalDiscount };
  }

  isDatePast(day: number, month: number, year: number): boolean {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);

    return inputDate < currentDate;
  }


  filterValueNextMonth(details_origin_id: number) {
    const { nextMonth, nextYear } = this.getNextMonthAndYear(this.selectedMonth, this.selectedYear);

    const recordFromNextMonth = this.allRecords.find(record =>
      record.month === nextMonth &&
      record.year === nextYear &&
      record.details_origin_id === details_origin_id &&
      record.payment === false
    );

    if (!recordFromNextMonth) return 0;

    return recordFromNextMonth.value - recordFromNextMonth.discounts || 0;
  }

  parseDateString(dateString: string): { month: number, year: number } {
    const [monthStr, yearStr] = dateString.split('-');
    const month = this.months.indexOf(monthStr) + 1;
    const year = parseInt(yearStr, 10);
    return { month, year };
  }

  getNextMonthAndYear(month: number, year: number) {
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    return { nextMonth, nextYear };
  }

  filterValueAllMonths(details_origin_id: number) {
    const recordsAllMonths = this.allRecords.filter(record => {
      const recordDate = new Date(record.year, record.month - 1);
      const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1);
      return recordDate >= selectedDate &&
        record.details_origin_id === details_origin_id &&
        record.payment === false;
    });

    if (recordsAllMonths.length === 0) return 0;
    const value = recordsAllMonths.reduce((total, record) =>
      total + (record.value - record.discounts || 0), 0
    );
    return parseFloat(value.toFixed(2));
  }

  isClosingDayPast(closingDay: number, month: number, year: number): boolean {
    const currentDate = new Date();
    const closingDate = new Date(year, month - 1, closingDay); // Cria a data de fechamento
    return closingDate < currentDate; // Retorna true se a data de fechamento já passou
  }

  deleteRecord(record: Record): void {
    this.tableRecordsService.deleteInRecords_Expenses(record.id).then(() => {
      this.notificacoesService.sucesso('Despesa excluída com sucesso.');
      this.getRecords();
    }).catch((error) => {
      console.error('Erro ao excluir despesa:', error);
      this.notificacoesService.erro('Erro ao excluir despesa.');
    });
  }

  editRecord(record: Record): void {
    const dialogRef = this.dialog.open(ModalEditDetailsRecordExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '500px',
      minHeight: '300px',
      data: { record, month: this.selectedMonth, year: this.selectedYear }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.getRecords();
      }
    });
  }

  showInfo(record: Record): void {
    const dialogRef = this.dialog.open(ModalShowDetailsRecordExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
      minHeight: '300px',
      data: { record, month: this.selectedMonth, year: this.selectedYear }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal fechado:', result);
    });
  }

  addNewRecord(): void {
    const dialogRef = this.dialog.open(ModalInsertRecordExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '500px',
      data: { allRecords: this.allRecords, month: this.selectedMonth, year: this.selectedYear }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.getRecords();
      }
    });
  }

  informPayment(record: Record): void {
    this.tableRecordsService.updateInRecords_Expenses(
      record.id,
      record.value,
      record.discounts,
      record.definitive_value,
      true // Define como pago
    ).then(() => {
      this.notificacoesService.sucesso('Pagamento informado com sucesso.');
      this.getRecords();
    }).catch((error) => {
      console.error('Erro ao informar pagamento:', error);
      this.notificacoesService.erro('Erro ao informar pagamento.');
    });
  }

}
