import { Component, Input, OnInit } from '@angular/core';
import { TableRecordsService } from '../../services/table-records.service';
import { Record } from '../../models/record.model';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
    selector: 'app-home',
    imports: [CommonModule, FormsModule, NgxCurrencyDirective  ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @Input() user?: User;
  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  allRecords: Record[] = [];
  recordsFiltrados: Record[] = [];
  dates: string[] = [];
  selectedDate: string = 'MAR-2025';


  constructor(private tableRecordsService: TableRecordsService) { }

  ngOnInit() {
    this.getRecords();
    this.generateDates();
  }

  getRecords() {
    const userId = this.user?.id || '';
    this.tableRecordsService.selectInRecordsWithDetails_Origin(userId).then(records => {
      console.log('Data:', records);
      this.allRecords = records;
      this.filterRecords();
    }).catch(error => {
      console.error('Erro ao buscar registros:', error);
    });
  }

  informPayment(record: Record) {
    console.log('Pagamento informado:', record);
  }
  deleteRecord(record: Record) {
    console.log('Registro deletado:', record);
  }
  editRecord(record: Record) {
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

  filterRecords() {
    const { month, year } = this.parseDateString(this.selectedDate);
    this.recordsFiltrados = this.allRecords.filter(record => record.month === month && record.year === year);
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
    console.log(recordsAllMonths);
    const value = recordsAllMonths.reduce((total, record) =>
      total + (record.value - record.discounts || 0), 0
    );
    return parseFloat(value.toFixed(2));
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
  // onDateChange($event: any) {
  //   this.filterRecords();
  // }

}
