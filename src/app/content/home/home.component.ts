import { Component, Input, OnInit } from '@angular/core';
import { TableRecordsService } from '../../services/table-records-expenses.service';
import { Record } from '../../models/record.model';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { Income } from '../../models/income.model';
import { TableRecordsIncomeService } from '../../services/table-records-income.service';
import { RecordIncome } from '../../models/record-income.model';
import { TableGoalsService } from '../../services/table-goals.service';
import { Goal } from '../../models/goal.model';
import { ModalInsertRecordIncomeComponent } from '../modais/modal-insert-record-income/modal-insert-record-income.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificacoesService } from '../shared/notificacoes.service';
import { ModalShowDetailsRecordExpenseComponent } from '../modais/modal-show-details-record-expense/modal-show-details-record-expense.component';
import { ModalEditDetailsRecordExpenseComponent } from '../modais/modal-edit-details-record-expense/modal-edit-details-record-expense.component';
import { ModalInsertRecordExpenseComponent } from '../modais/modal-insert-record-expense/modal-insert-record-expense.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  @Input() user?: User;
  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  allRecords: Record[] = [];
  allIncomes: Income[] = [];
  allRecordsIncomes: RecordIncome[] = [];
  recordsFiltrados: Record[] = [];
  dates: string[] = [];
  selectedDate: string = 'MAR-2025';
  totalPayable: number = 0;
  totalPending: number = 0;
  totalDiscount: number = 0;
  totalLate: number = 0;
  valueRecordsIncome: number = 0;
  allGoals: Goal[] = [];
  loadingGoals: boolean = false;
  totalReserve: number = 0;
  reserveAdded: boolean = false;


  constructor(
    private notificacoesService: NotificacoesService,
    private dialog: MatDialog,
    private tableRecordsService: TableRecordsService,
    private tableRecordsIncomeService: TableRecordsIncomeService,
    private tableGoalsService: TableGoalsService) { }

  ngOnInit() {
    this.loadingGoals = true;
    this.getRecords();
    this.generateDates();
    this.getRecordsIncome();
  }

  openModal_ModalInsertRecordExpenseComponent() {
    const { month, year } = this.parseDateString(this.selectedDate);
    const allRecordsExpense = this.allRecords;
    const dialogRef = this.dialog.open(ModalInsertRecordExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '500px',
      data: { allRecordsExpense, month, year }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRecords();
      console.log('Modal fechado:', result);
    });
  }

  openModal_ModalEditDetailsRecordExpenseComponent(record: Record) {
    const { month, year } = this.parseDateString(this.selectedDate);
    const dialogRef = this.dialog.open(ModalEditDetailsRecordExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
      minHeight: '300px',
      data: { record, month, year }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRecords();
      console.log('Modal fechado:', result);
    });
  }
  openModal_ModalShowDetailsRecordExpenseComponent(record: Record) {
    const { month, year } = this.parseDateString(this.selectedDate);
    const dialogRef = this.dialog.open(ModalShowDetailsRecordExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
      minHeight: '300px',
      data: { record, month, year }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal fechado:', result);
    });
  }

  openModal_ModalInsertRecordIncomeComponent() {
    const { month, year } = this.parseDateString(this.selectedDate);
    const dialogRef = this.dialog.open(ModalInsertRecordIncomeComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
      minHeight: '300px',
      data: { month, year }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getRecordsIncome();
      }
    });
  }

  getRecordsIncome() {
    const userId = this.user?.id || '';
    const { month, year } = this.parseDateString(this.selectedDate);
    this.tableRecordsIncomeService.selectInRecods_income(userId).then(RecordsIncome => {
      this.allRecordsIncomes = RecordsIncome.filter(record => record.month === month && record.year === year);
      this.valueRecordsIncome = 0;
      this.allRecordsIncomes.forEach(recordIncome => {
        this.valueRecordsIncome += parseFloat(recordIncome.value.toFixed(2));
      });
    }).catch(error => {
      this.notificacoesService.erro('Erro ao buscar registros de renda.');
    });
  }

  getRecords() {
    this.tableRecordsService.selectInRecordsWithDetails_Origin().then(records => {
      this.allRecords = records;
      this.filterRecords();
    }).catch(error => {
      this.notificacoesService.erro('Erro ao buscar registros.');
      console.error('Erro ao buscar registros:', error);
    });
  }

  // insertInRecords_Expenses() {
  //   const idDetailsOrigin = 41;
  //   const value = 100;
  //   const month = 3;
  //   const year = 2025;
  //   const disconts = 0;
  //   const definitive_value = false;
  //   const payment = false;
  //   this.tableRecordsService.insertInInRecords_Expenses(idDetailsOrigin, value, month, year, disconts, definitive_value, payment).then(records => {
  //     this.notificacoesService.sucesso('Despesa adicionada com sucesso.');
  //     this.getRecords();
  //   }).catch(error => {
  //     console.error('Erro ao adicionar despesa:', error);
  //   });
  // }

  updateInRecords_Expenses(id: number, value: number, discounts: number, definitive_value: boolean, payment: boolean) {
    this.tableRecordsService.updateInRecords_Expenses(id, value, discounts, definitive_value, payment).then(records => {
      this.notificacoesService.sucesso('Despesa atualizada com sucesso.');
      this.getRecords();
    }).catch(error => {
      console.error('Erro ao atualizar despesa:', error);
    }
    );
  }
  deleteInRecords_Expenses(id: number) {
    this.tableRecordsService.deleteInRecords_Expenses(id).then(records => {
      this.notificacoesService.sucesso('Despesa deletada com sucesso.');
      this.getRecords();
    }).catch(error => {
      this.notificacoesService.erro('Erro ao deletar despesa.');
      console.error('Erro ao deletar despesa:', error);
    });
  }

  informPayment(record: Record) {
    this.updateInRecords_Expenses(record.id, record.value, record.discounts, record.definitive_value, true);
  }

  deleteRecord(record: Record) {
    this.deleteInRecords_Expenses(record.id);
  }

  editRecord(record: Record) {
  this.openModal_ModalEditDetailsRecordExpenseComponent(record);
    console.log('Registro editado:', record);
  }
  showInfo(record: Record) {
  this.openModal_ModalShowDetailsRecordExpenseComponent(record);
    console.log('Registro editado:', record);
  }

  generateDates() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 5; year++) {
      for (let month of this.months) {
        this.dates.push(`${month}-${year}`);
      }
    }
  }

  parseDateString(dateString: string): { month: number, year: number } {
    const [monthStr, yearStr] = dateString.split('-');
    const month = this.months.indexOf(monthStr) + 1;
    const year = parseInt(yearStr, 10);
    return { month, year };
  }

  onchangeDate() {
    this.filterRecords();
    this.getRecordsIncome();

  }

  filterRecords() {
    const { month, year } = this.parseDateString(this.selectedDate);
    this.recordsFiltrados = this.allRecords.filter(record => record.month === month && record.year === year);
    const totals = this.calculateTotals(this.recordsFiltrados);
    this.totalPayable = parseFloat(totals.totalPayable.toFixed(2));
    this.totalPending = parseFloat(totals.totalPending.toFixed(2));
    this.totalLate = parseFloat(totals.totalLate.toFixed(2));
    this.totalDiscount = parseFloat(totals.totalDiscount.toFixed(2));
  }

  calculateTotals(records: any[]): { totalPayable: number, totalPending: number, totalLate: number, totalDiscount: number } {
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

  getNextMonthAndYear(month: number, year: number) {
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    return { nextMonth, nextYear };
  }

  filterValueNextMonth(details_origin_id: number) {
    const { month, year } = this.parseDateString(this.selectedDate);
    const { nextMonth, nextYear } = this.getNextMonthAndYear(month, year);

    const recordFromNextMonth = this.allRecords.find(record =>
      record.month === nextMonth &&
      record.year === nextYear &&
      record.details_origin_id === details_origin_id &&
      record.payment === false
    );

    if (!recordFromNextMonth) return 0;

    return recordFromNextMonth.value - recordFromNextMonth.discounts || 0;
  }

  filterValueAllMonths(details_origin_id: number) {
    const { month, year } = this.parseDateString(this.selectedDate);
    const { nextMonth, nextYear } = this.getNextMonthAndYear(month, year);

    const recordsAllMonths = this.allRecords.filter(record =>
      (record.month !== month || record.year !== year) &&
      (record.month !== nextMonth || record.year !== nextYear) &&
      record.details_origin_id === details_origin_id &&
      record.payment === false
    );

    if (recordsAllMonths.length === 0) return 0;
    const value = recordsAllMonths.reduce((total, record) =>
      total + (record.value - record.discounts || 0), 0
    );
    return parseFloat(value.toFixed(2));
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  classByStatus(record: Record): string {
    if (record.payment) return 'text-success';
    if (this.isDatePast(record.Details_Origin.due_date, record.month, record.year)) return 'text-danger';
    return 'text-warning';
  }

  showBtnUpdateValue(record: Record): string {
    if (record.payment) return 'text-bg-success';
    if (this.isDatePast(record.Details_Origin.due_date, record.month, record.year)) return 'text-bg-danger';
    return 'text-bg-warning';
  }

  isDatePast(day: number, month: number, year: number): boolean {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);

    return inputDate < currentDate;
  }

  addNewGoal(): void {
    // Lógica para adicionar um novo objetivo
    console.log('Adicionar Novo Objetivo');
  }

  addNewExpense(): void {
    this.openModal_ModalInsertRecordExpenseComponent();
  }

  addNewIncome(): void {
    // Lógica para adicionar uma nova renda
    console.log('Adicionar Nova Renda');
  }

  addReserve() {
    this.reserveAdded = true;
    this.totalReserve += 100;
    setTimeout(() => {
      this.reserveAdded = false;
    }, 200);
  }

}
