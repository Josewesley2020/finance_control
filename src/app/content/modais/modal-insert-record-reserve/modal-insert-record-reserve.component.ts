import { GeneralInfo } from './../../../models/general-info.model';
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
import { TableGeneralInformationService } from '../../../services/table-general-information.service';

@Component({
  selector: 'app-modal-insert-record-reserve',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-record-reserve.component.html',
  styleUrl: './modal-insert-record-reserve.component.css'
})
export class ModalInsertRecordReserveComponent implements OnInit {
  private subscriptionChangeDate: Subscription = new Subscription();
  allDestination: ReserveDestination[] = [];
  GeneralInfo?: GeneralInfo;
  value: number = 0;
  idDestination: number = 0;
  safe_in_piggy: boolean = true;
  selectedDate: string = '';
  selectedMonth: number = 0;
  selectedYear: number = 0;
  obs: string = ''; //


  constructor(
    private tableGeneralInformationService: TableGeneralInformationService,
    private dataSelectedService: DataSelectedService,
    private notificacoesService: NotificacoesService,
    private tableReserveDestinationService: TableReserveDestinationService,
    private tableRecordsReserveService: TableRecordsReserveService,
    public dialogRef: MatDialogRef<ModalInsertRecordReserveComponent>) { }

  ngOnInit(): void {
    this.getInReserveDestination();
    this.getGeneralInformation();
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
    this.value,
    this.selectedMonth,
    this.selectedYear,
    this.idDestination,
    this.safe_in_piggy,
    this.obs // Inclui a observação
  ).then(() => {
    this.notificacoesService.sucesso('Sucesso ao adicionar reserva.');
    if (this.safe_in_piggy) {
      this.updatePiggy();
    } else {
      this.dialogRef.close({ success: true });
    }
  }).catch(error => {
    this.notificacoesService.erro('Erro ao adicionar reserva.');
  });
}

  updatePiggy() {
    if (this.GeneralInfo) {
      this.tableGeneralInformationService.updateInGeneralInformation(
        this.GeneralInfo.id,
        this.GeneralInfo.value_in_the_Piggy + this.value,
        this.GeneralInfo.goal_value_in_the_piggy,
        this.GeneralInfo.value_in_the_Piggy,
        this.GeneralInfo.last_update_month,
        this.GeneralInfo.last_update_year,
        this.GeneralInfo.last_update_day).then(() => {
          this.notificacoesService.sucesso('Sucesso ao atualizar o valor do cofre.');
          this.dialogRef.close({ success: true });
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
