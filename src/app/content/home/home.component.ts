import { Component, Input, OnInit } from '@angular/core';
import { TableRecordsService } from '../../services/table-records-expenses.service';
import { Record } from '../../models/record.model';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { Income } from '../../models/income.model';
import { TableRecordsIncomeService } from '../../services/table-records-income.service';
import { RecordIncome } from '../../models/record-income.model';
import { Goal } from '../../models/goal.model';
import { MatDialog } from '@angular/material/dialog';
import { NotificacoesService } from '../shared/notificacoes.service';
import { InputOfIncomeComponent } from "../input-of-income/input-of-income.component";
import { DataSelectedService } from '../../services/data-selected.service';
import { ReservesComponent } from "../reserves/reserves.component";
import { ExpensesComponent } from "../expenses/expenses.component";
import { OtherPayersComponent } from "../other-payers/other-payers.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, InputOfIncomeComponent, ReservesComponent, ExpensesComponent, OtherPayersComponent],
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
  showRecordsIncome: boolean = false;
  outputSaldo: boolean = false;
  inputSaldo: boolean = false;
  activeTab: string = 'despesas'; // Aba ativa inicial


  constructor(
    private notificacoesService: NotificacoesService,
    private tableRecordsIncomeService: TableRecordsIncomeService,
    private dataSelectedService: DataSelectedService) { }

  ngOnInit() {
    this.loadingGoals = true;
    this.selectedDate = this.getCurrentMonthAndYear(); // Define o mês e ano atual
    this.generateDates();
    this.getRecordsIncome();
    this.dataSelectedService.setDate(this.selectedDate);
  }

updateTotalPayable(value: number): void {
    this.totalPayable = value;
  }

  updateTotalPending(value: number): void {
    this.totalPending = value;
  }

  updateTotalLate(value: number): void {
    this.totalLate = value;
  }

  updateTotalDiscount(value: number): void {
    this.totalDiscount = value;
  }

  getCurrentMonthAndYear(): string {
    const currentDate = new Date();
    const currentMonth = this.months[currentDate.getMonth()]; // Obtém o mês atual
    const currentYear = currentDate.getFullYear(); // Obtém o ano atual
    return `${currentMonth}-${currentYear}`; // Retorna no formato "MMM-YYYY"
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }


  alertCardSaldo() {
    this.toggleCardState('inputSaldo')
  }


  onChangeRecordsIncome() {
    this.getRecordsIncome();
    this.alertCardSaldo();
  }

  onChangeRecordsReserve(value: any) {
    if (this.totalReserve != value) {
      this.totalReserve = value;
      // this.toggleCardState('reserveAdded');
    }
    this.toggleCardState('reserveAdded');
  }

  toggleCardState(cardVariable: keyof this): void {
    (this[cardVariable] as boolean) = true;
    setTimeout(() => {
      (this[cardVariable] as boolean) = false;
    }, 200);
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
    this.dataSelectedService.setDate(this.selectedDate);
  }

  filterRecords() {
    const { month, year } = this.parseDateString(this.selectedDate);

    // Filtra os registros pelo mês e ano selecionados
    this.recordsFiltrados = this.allRecords
      .filter(record => record.month === month && record.year === year)
      .sort((a, b) => this.compareDueDates(a.Details_Origin.due_date.toString(), b.Details_Origin.due_date.toString()));

  }

  compareDueDates(dueDateA: string, dueDateB: string): number {
    const dateA = new Date(dueDateA);
    const dateB = new Date(dueDateB);
    return dateA.getTime() - dateB.getTime(); // Ordena em ordem crescente
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
    const { month: selectedMonth, year: selectedYear } = this.parseDateString(this.selectedDate);

    const recordsAllMonths = this.allRecords.filter(record => {
      const recordDate = new Date(record.year, record.month - 1);
      const selectedDate = new Date(selectedYear, selectedMonth - 1);
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


}
