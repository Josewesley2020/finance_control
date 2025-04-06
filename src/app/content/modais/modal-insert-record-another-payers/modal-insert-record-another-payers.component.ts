import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalInsertPayerComponent } from '../modal-insert-payer/modal-insert-payer.component';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { TableRecordsAnotherPayerService } from '../../../services/table-records-another-payer.service';
import { FormsModule } from '@angular/forms';
import { DataSelectedService } from '../../../services/data-selected.service';
import { TableOtherPayersService } from '../../../services/table-other-payers.service';
import { OtherPayers } from '../../../models/other_payers';
import { TableDetailsOriginService } from '../../../services/table-details-origin.service';
import { Details_Origin } from '../../../models/details_Origin.model';

@Component({
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-record-another-payers.component.html',
  styleUrl: './modal-insert-record-another-payers.component.css'
})
export class ModalInsertRecordAnotherPayersComponent implements OnInit {
  idPlayer: number = 0;
  idOrigin: number = 0;
  description: string = '';
  value: number = 0;
  qtd_parcelas: number = 0;
  monthInit: number = 0;
  yearInit: number = 0;
  payment: boolean = false;
  selectedMonth: number = 0;
  selectedYear: number = 0;
  payers: OtherPayers[] = [];
  origins: Details_Origin[] = [];


  constructor(
    private tableDetailsOriginService: TableDetailsOriginService,
    private tableOtherPayersService: TableOtherPayersService,
    private dataSelectedService: DataSelectedService,
    private tableRecordsAnotherPayerService: TableRecordsAnotherPayerService,
    public dialogRef: MatDialogRef<ModalInsertPayerComponent>,
    private notificacoesService: NotificacoesService) { }


  ngOnInit(): void {
    this.dataSelectedService.selectedDate$.subscribe(() => {
      this.selectedMonth = this.dataSelectedService.getMonth();
      this.selectedYear = this.dataSelectedService.getYear();
      this.monthInit = this.selectedMonth;
      this.yearInit = this.selectedYear;
    });

    this.loadPayers();
    this.loadOrigins();
  }

  loadPayers(): void {
    this.tableOtherPayersService.selectInOther_Payers().then((payers) => {
      this.payers = payers;
    }).catch((error) => {
      console.error('Erro ao buscar nomes dos pagadores:', error);
      this.notificacoesService.erro('Erro ao buscar nomes dos pagadores.');
    });
  }

  loadOrigins(): void {
    this.tableDetailsOriginService.selectInDetails_Origin().then((origins) => {
      this.origins = origins;
    }).catch((error) => {
      console.error('Erro ao buscar descrições das origens:', error);
      this.notificacoesService.erro('Erro ao buscar descrições das origens.');
    });
  }

  // formatValue(): void {
  //   if (this.value) {
  //     this.value = parseFloat(
  //       this.currencyPipe.transform(this.value, 'BRL', 'symbol', '1.2-2')?.replace(/[^\d.-]/g, '') || '0'
  //     );
  //   }
  // }

save() {
  const registros: any[] = [];
  let currentMonth = this.monthInit;
  let currentYear = this.yearInit;

  for (let i = 0; i < this.qtd_parcelas; i++) {
    registros.push({
      idPayer: this.idPlayer,
      idOrigin: this.idOrigin,
      description: this.description,
      value: this.value,
      month: currentMonth,
      year: currentYear,
      qtd_parcelas_pendentes: this.qtd_parcelas - i,
      mothInit: this.monthInit,
      yearInit: this.yearInit,
      payment: this.payment,
      idUser: this.tableRecordsAnotherPayerService.user?.id
    });

    // Incrementa o mês e ajusta o ano, se necessário
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  this.tableRecordsAnotherPayerService.insertMultipleRecords(registros)
    .then(() => {
      this.notificacoesService.sucesso('Registros cadastrados com sucesso.');
      this.dialogRef.close({ success: true });
    })
    .catch(error => {
      console.error('Erro ao inserir registros:', error);
      this.notificacoesService.erro('Erro ao inserir registros.');
    });
}

  cancel() {
    this.notificacoesService.info('Ação cancelada.');
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }

}
