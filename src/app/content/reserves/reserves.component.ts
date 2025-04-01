import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TableReserveDestinationService } from '../../services/table-reserve-destination.service';
import { ReserveDestination } from '../../models/reserve-destination';
import { Subscription } from 'rxjs';
import { DataSelectedService } from '../../services/data-selected.service';
import { NotificacoesService } from '../shared/notificacoes.service';
import { TableRecordsReserveService } from '../../services/table-records-reserve.service';
import { RecordReserve } from '../../models/records-reserve';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalInsertRecordReserveComponent } from '../modais/modal-insert-record-reserve/modal-insert-record-reserve.component';
import { GeneralInfo } from '../../models/general-info.model';
import { TableGeneralInformationService } from '../../services/table-general-information.service';

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
  GeneralInfo?: GeneralInfo;
  selectedDate: string = '';
  selectedMonth: number = 0;
  selectedYear: number = 0;

  constructor(
    private dialog: MatDialog,
    private tableGeneralInformationService: TableGeneralInformationService,
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
    this.getGeneralInformation();
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

  deleteRecord(record: RecordReserve) {
    this.tableRecordsReserveService.deleteInRecordsReserve(record.id).then(() => {
      if (record.safe_in_piggy) {
      this.updatePiggy(record.value)
      }
      this.reload();
      this.notificacoesService.sucesso('Registro de reserva excluído com sucesso!');
    }
    ).catch(error => {
      this.notificacoesService.erro('Erro ao excluir registro de reserva.');
    }
    );
  }

  addNewRecord() {
    this.openModalInsertRecordReserve();
  }

  openModalInsertRecordReserve(): void {
    const dialogRef = this.dialog.open(ModalInsertRecordReserveComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.reload();
        console.log('Modal closed with success:', result);
      }
    });
  }

  updatePiggy(subtractValue: number) {
    if (this.GeneralInfo) {
      this.tableGeneralInformationService.updateInGeneralInformation(
        this.GeneralInfo.id,
        this.GeneralInfo.value_in_the_Piggy - subtractValue,
        this.GeneralInfo.goal_value_in_the_piggy,
        this.GeneralInfo.value_in_the_Piggy,
        this.GeneralInfo.last_update_month,
        this.GeneralInfo.last_update_year,
        this.GeneralInfo.last_update_day).then(() => {
          this.notificacoesService.sucesso('Sucesso ao atualizar o valor do cofre.');
        }).catch(error => {
          this.notificacoesService.erro('Erro ao atualizar o valor do cofre.');
        });
    }
  }

  getGeneralInformation() {
    this.tableGeneralInformationService.selectInGeneralInformation()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.GeneralInfo = data[0];
        }
      })
      .catch((error) => {
        console.error('Error fetching general information:', error);
      });
  }

}
