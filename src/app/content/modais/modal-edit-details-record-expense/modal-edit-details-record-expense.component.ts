import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record } from '../../../models/record.model';
import { CommonModule } from '@angular/common';
import { TableRecordsService } from '../../../services/table-records-expenses.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { FormsModule } from '@angular/forms';
import { Records_another_payer } from '../../../models/records_another_payer';
import { TableRecordsAnotherPayerService } from '../../../services/table-records-another-payer.service';
import { TableOtherPayersService } from '../../../services/table-other-payers.service';
import { OtherPayers } from '../../../models/other_payers';

@Component({
  selector: 'app-modal-edit-details-record-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-details-record-expense.component.html',
  styleUrls: ['./modal-edit-details-record-expense.component.css']
})
export class ModalEditDetailsRecordExpenseComponent implements OnInit {
  record?: Record;
  month: number = 0;
  year: number = 0;
  otherPayers: Records_another_payer[] = [];
  payersMap: { [key: number]: string } = {};

  constructor(
    private tableOtherPayersService: TableOtherPayersService,
    private tableRecordsAnotherPayerService: TableRecordsAnotherPayerService,
    private tableRecordsService: TableRecordsService,
    private notificacoesService: NotificacoesService,
    public dialogRef: MatDialogRef<ModalEditDetailsRecordExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: Record, month: number, year: number }
  ) {
    this.record = data.record;
    this.month = data.month;
    this.year = data.year;
  }

  ngOnInit(): void {
    this.loadPayers(); // Carregar os nomes dos pagadores
    this.loadOtherPayers();
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.record) {
      this.updateInRecords_Expenses(
        this.record.id,
        this.record.value,
        this.record.discounts,
        this.record.definitive_value,
        this.record.payment,
        this.record.obs || '' // Inclui a observação na atualização
      );
    }
  }

  classByStatus(record: Record): string {
    if (record.payment) return 'text-success';
    if (this.isDatePast(record.Details_Origin.due_date, record.month, record.year)) return 'text-danger';
    return 'text-warning';
  }

  isDatePast(day: number, month: number, year: number): boolean {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);

    return inputDate < currentDate;
  }

  formatDate(day: number, month: number, year: number): string {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  }

  updateInRecords_Expenses(
    id: number,
    value: number,
    discounts: number,
    definitive_value: boolean,
    payment: boolean,
    obs: string // Inclui a observação como parâmetro
  ) {
    this.tableRecordsService.updateInRecords_Expenses(id, value, discounts, definitive_value, payment, obs).then(records => {
      this.notificacoesService.sucesso('Despesa atualizada com sucesso.');
      this.dialogRef.close({ success: true });
    }).catch(error => {
      console.error('Erro ao atualizar despesa:', error);
      this.notificacoesService.erro('Erro ao atualizar despesa.');
    });
  }

  loadOtherPayers(): void {
    this.tableRecordsAnotherPayerService.selectInRecords_another_payer().then((records) => {
      this.otherPayers = records.filter(record =>
        record.idOrigin === this.record?.details_origin_id &&
        record.month === this.month &&
        record.year === this.year
      );
    }).catch((error) => {
      console.error('Erro ao carregar outros pagadores:', error);
      this.notificacoesService.erro('Erro ao carregar outros pagadores.');
    });
  }

  loadPayers(): void {
    this.tableOtherPayersService.selectInOther_Payers().then((payers: OtherPayers[]) => {
      this.payersMap = payers.reduce((map, payer) => {
        map[payer.id] = payer.name;
        return map;
      }, {} as { [key: number]: string });
    }).catch((error) => {
      console.error('Erro ao carregar nomes dos pagadores:', error);
      this.notificacoesService.erro('Erro ao carregar nomes dos pagadores.');
    });
  }

  getPayerName(idPayer: number): string {
    return this.payersMap[idPayer] || 'Pagador não encontrado';
  }

  getTotalValue(): number {
    return this.otherPayers.reduce((total, payer) => total + (payer.value || 0), 0);
  }
}
