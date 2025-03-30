import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TableReserveDestinationService } from '../../services/table-reserve-destination.service';
import { ReserveDestination } from '../../models/reserve-destination';
import { Subscription } from 'rxjs';
import { DataSelectedService } from '../../services/data-selected.service';
import { NotificacoesService } from '../shared/notificacoes.service';
import { TableRecordsReserveService } from '../../services/table-records-reserve.service';
import { RecordReserve } from '../../models/records-reserve';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserves',
  imports: [CommonModule],
  templateUrl: './reserves.component.html',
  styleUrl: './reserves.component.css'
})
export class ReservesComponent implements OnInit {
  @Output() allRecordsReserveEvent = new EventEmitter<RecordReserve[]>();
  @Output() valueTotalOfRecordsReserve = new EventEmitter<Number>();


  private subscription: Subscription = new Subscription();
  allDestinationReserve: ReserveDestination[] = [];
  allRecordsReserve: RecordReserve[] = [];
  selectedDate: string = '';
  selectedMonth: number = 0;
  selectedYear: number = 0;

  constructor(
    private notificacoesService: NotificacoesService,
    private dataSelectedService: DataSelectedService,
    private tableRecordsReserveService: TableRecordsReserveService,
    private tableReserveDestinationService: TableReserveDestinationService) { }

  ngOnInit(): void {
    this.reload();
    this.subscription = this.dataSelectedService.selectedDate$.subscribe((date) => {
      this.onDateChanged(date);
    });
  }

  reload() {
    this.selectRecordsReserve();
    this.selectReservesDestination();
  }

  onDateChanged(date: string): void {
    this.selectedDate = date;
    this.selectedMonth = this.dataSelectedService.getMonth();
    this.selectedYear = this.dataSelectedService.getYear();
    this.reload();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectRecordsReserve() {
    this.tableRecordsReserveService.selectInRecordsReserve().then((res) => {
      const filteredRecords = res.filter(record =>
        record.month === this.selectedMonth &&
        record.year === this.selectedYear);
      this.allRecordsReserve = filteredRecords;
      this.allRecordsReserveEvent.emit(filteredRecords);
       this.allRecordsReserveEvent.subscribe((res) => {
       this.valueTotalOfRecordsReserve.emit(res.reduce((acc, record) => acc + record.value, 0));
      });
    }).catch((error) => {
      this.notificacoesService.erro('Erro ao buscar reservas.');
    });
  }


  selectReservesDestination() {
    this.tableReserveDestinationService.selectInReserveDestination().then((res) => {
      this.allDestinationReserve = res;
      console.log('Reserves:', res);
    }).catch((error) => {
      this.notificacoesService.erro('Erro ao buscar destinos.');
    });
  }

  getDestinationDescription(idDestination: number): string | undefined {
    const destination = this.allDestinationReserve.find(source => source.id === idDestination);
    return destination?.description;
  }
  getDestinationObservation(idDestination: number): string | undefined {
    const destination = this.allDestinationReserve.find(source => source.id === idDestination);
    return destination?.observation;
  }

  convertBoleanInString(arg0: boolean) {
    return arg0 ? 'Sim' : 'Não';
  }

  deleteRecord(id: number) {
    this.tableRecordsReserveService.deleteInRecordsReserve(id).then(() => {
      this.reload();
      this.notificacoesService.sucesso('Registro de reserva excluído com sucesso!');
    }
    ).catch(error => {
      this.notificacoesService.erro('Erro ao excluir registro de reserva.');
    }
    );
  }

    addNewIncome() {
    throw new Error('Method not implemented.');
  }
  deleteRecordIncome(arg0: any) {
    throw new Error('Method not implemented.');
  }

}
