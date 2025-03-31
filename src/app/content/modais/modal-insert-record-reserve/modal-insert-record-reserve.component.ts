import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TableRecordsReserveService } from '../../../services/table-records-reserve.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { RecordReserve } from '../../../models/records-reserve';
import { TableReserveDestinationService } from '../../../services/table-reserve-destination.service';
import { ReserveDestination } from '../../../models/reserve-destination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataSelectedService } from '../../../services/data-selected.service';

@Component({
  selector: 'app-modal-insert-record-reserve',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-record-reserve.component.html',
  styleUrl: './modal-insert-record-reserve.component.css'
})
export class ModalInsertRecordReserveComponent implements OnInit {
  private subscriptionChangeDate: Subscription = new Subscription();
  allDestination: ReserveDestination[] = [];
  value: number = 0;
  idDestination: number = 0;
  safe_in_piggy: boolean = false;
  selectedDate: string = '';
  selectedMonth: number = 0;
  selectedYear: number = 0;

  constructor(
    private dataSelectedService: DataSelectedService,
    private notificacoesService: NotificacoesService,
    private tableReserveDestinationService: TableReserveDestinationService,
    private tableRecordsReserveService: TableRecordsReserveService,
    public dialogRef: MatDialogRef<ModalInsertRecordReserveComponent>) { }

  ngOnInit(): void {
  this.getInReserveDestination();
    this.subscriptionChangeDate = this.dataSelectedService.selectedDate$.subscribe((date) => {
      this.onDateChanged(date);
    });
  }

  ngOnDestroy(): void {
    this.subscriptionChangeDate.unsubscribe();
  }

  onDateChanged(date: string): void {
    this.selectedDate = date;
    this.selectedMonth = this.dataSelectedService.getMonth();
    this.selectedYear = this.dataSelectedService.getYear();
  }

  save() {
    this.tableRecordsReserveService.insertInInRecordsReserve(
      this.value, this.selectedMonth, this.selectedYear, this.idDestination, this.safe_in_piggy).then(() => {
        this.notificacoesService.sucesso('Sucesso ao adicionar reserva.');
        this.dialogRef.close({ success: true });
      }).catch(error => {
        this.notificacoesService.erro('Erro.');
      });
  }

  cancel() {
    this.notificacoesService.info('Ação cancelada.');
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }

  getInReserveDestination() {
    this.tableReserveDestinationService.selectInReserveDestination().then((destination: ReserveDestination[]) => {
      this.allDestination = destination;
    }).catch(error => {
      this.notificacoesService.erro('Erro ao buscar as fontes de renda.');
    });

  }
}
