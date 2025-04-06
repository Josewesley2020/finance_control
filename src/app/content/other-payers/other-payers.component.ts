import { Component, OnInit } from '@angular/core';
import { TableRecordsAnotherPayerService } from '../../services/table-records-another-payer.service';
import { NotificacoesService } from '../shared/notificacoes.service';
import { Records_another_payer } from '../../models/records_another_payer';
import { DataSelectedService } from '../../services/data-selected.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableDetailsOriginService } from '../../services/table-details-origin.service';
import { TableOtherPayersService } from '../../services/table-other-payers.service';
import { ModalInsertPayerComponent } from '../modais/modal-insert-payer/modal-insert-payer.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInsertRecordAnotherPayersComponent } from '../modais/modal-insert-record-another-payers/modal-insert-record-another-payers.component';

@Component({
  selector: 'app-other-payers',
  imports: [FormsModule, CommonModule],
  templateUrl: './other-payers.component.html',
  styleUrls: ['./other-payers.component.css']
})
export class OtherPayersComponent implements OnInit {
  recordsAnotherPayer: Records_another_payer[] = [];
  filteredRecords: Records_another_payer[] = [];
  originsMap: { [key: number]: string } = {}; // Mapa para armazenar as descrições das origens
  payersMap: { [key: number]: string } = {}; // Mapa para armazenar os nomes dos pagadores
  loading: boolean = false;
  selectedMonth: number = 0;
  selectedYear: number = 0;

  constructor(
    private tableRecordsAnotherPayerService: TableRecordsAnotherPayerService,
    private notificacoesService: NotificacoesService,
    private dataSelectedService: DataSelectedService,
    private tableDetailsOriginService: TableDetailsOriginService,
    private tableOtherPayersService: TableOtherPayersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadOrigins();
    this.loadPayers(); // Carregar os nomes dos pagadores
    this.selectedMonth = this.dataSelectedService.getMonth();
    this.selectedYear = this.dataSelectedService.getYear();
    this.getRecordsAnotherPayer();

    // Atualiza os registros quando a data selecionada mudar
    this.dataSelectedService.selectedDate$.subscribe(() => {
      this.selectedMonth = this.dataSelectedService.getMonth();
      this.selectedYear = this.dataSelectedService.getYear();
      this.filterRecords();
    });
  }

  loadOrigins(): void {
    this.tableDetailsOriginService.selectInDetails_Origin().then((origins) => {
      this.originsMap = origins.reduce((map, origin) => {
        map[origin.id] = origin.Description;
        return map;
      }, {} as { [key: number]: string });
    }).catch((error) => {
      console.error('Erro ao buscar descrições das origens:', error);
      this.notificacoesService.erro('Erro ao buscar descrições das origens.');
    });
  }

  loadPayers(): void {
    this.tableOtherPayersService.selectInOther_Payers().then((payers) => {
      this.payersMap = payers.reduce((map, payer) => {
        map[payer.id] = payer.name;
        return map;
      }, {} as { [key: number]: string });
    }).catch((error) => {
      console.error('Erro ao buscar nomes dos pagadores:', error);
      this.notificacoesService.erro('Erro ao buscar nomes dos pagadores.');
    });
  }

  getOriginDescription(idOrigin: number): string {
    return this.originsMap[idOrigin] || 'Origem não encontrada';
  }

  getPayerName(idPayer: number): string {
    return this.payersMap[idPayer] || 'Pagador não encontrado';
  }

  getRecordsAnotherPayer(): void {
    this.loading = true;
    this.tableRecordsAnotherPayerService.selectInRecords_another_payer().then((records) => {
      this.recordsAnotherPayer = records;
      this.filterRecords();
      this.loading = false;
    }).catch((error) => {
      console.error('Erro ao buscar registros de outros pagadores:', error);
      this.notificacoesService.erro('Erro ao buscar registros de outros pagadores.');
      this.loading = false;
    });
  }

  filterRecords(): void {
    this.filteredRecords = this.recordsAnotherPayer.filter(record =>
      record.month === this.selectedMonth && record.year === this.selectedYear
    );
    console.log('Filtered Records:', this.filteredRecords);
  }

  deleteRecord(id: number): void {
    this.tableRecordsAnotherPayerService.deleteInRecords_another_payer(id).then(() => {
      this.notificacoesService.sucesso('Registro excluído com sucesso.');
      this.getRecordsAnotherPayer();
    }).catch((error) => {
      console.error('Erro ao excluir registro:', error);
      this.notificacoesService.erro('Erro ao excluir registro.');
    });
  }

  markAsPaid(record: Records_another_payer) {
    this.tableRecordsAnotherPayerService.updateInRecords_another_payer(
      record.id, record.idPayer, record.idOrigin, record.description, record.value, record.month,
      record.year, record.qtd_parcelas_pendentes, record.monthInit, record.yearInit, true).then(() => {
        this.notificacoesService.sucesso('Registro marcado como pago com sucesso.');
        this.getRecordsAnotherPayer();
      }
      ).catch((error) => {
        console.error('Erro ao marcar registro como pago:', error);
        this.notificacoesService.erro('Erro ao marcar registro como pago.');
      });
  }

  creatNewPayer() {
    this.openModal_ModalInsertPayerComponent();
  }

  addNewRecord() {
    this.openModalInsertRecordAnotherPayersComponent();
  }

  openModal_ModalInsertPayerComponent() {
    const dialogRef = this.dialog.open(ModalInsertPayerComponent, {
      width: 'auto',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getRecordsAnotherPayer();
      }
    });
  }

  openModalInsertRecordAnotherPayersComponent() {
    const dialogRef = this.dialog.open(ModalInsertRecordAnotherPayersComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getRecordsAnotherPayer();
      }
    });
  }
}
