import { Component, Inject, OnInit } from '@angular/core';
import { TableRecordsService } from '../../../services/table-records-expenses.service';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record } from '../../../models/record.model';
import { TableDetailsOriginService } from '../../../services/table-details-origin.service';
import { Details_Origin } from '../../../models/details_Origin.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-insert-record-expense',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-insert-record-expense.component.html',
  styleUrls: ['./modal-insert-record-expense.component.css']
})
export class ModalInsertRecordExpenseComponent implements OnInit {
  allRecords: Record[] = [];
  details_origin: Details_Origin[] = [];
  month: number = 0;
  year: number = 0;
  idDetailsOrigin: number = 0;
  description: string = '';
  value: number = 0;
  discounts: number = 0;
  definitive_value: boolean = false;
  payment: boolean = false;
  additionalRecords: { value: number, discounts: number, month: number, year: number }[] = [];

  constructor(
    private tableDetailsOriginService: TableDetailsOriginService,
    private tableRecordsService: TableRecordsService,
    private notificacoesService: NotificacoesService,
    public dialogRef: MatDialogRef<ModalInsertRecordExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { allRecords: Record[], month: number, year: number }
  ) {
    this.allRecords = data.allRecords || [];
    this.month = data.month;
    this.year = data.year;
  }

  ngOnInit(): void {
    this.getRecords();
    this.selectInDetails_Origin();
  }

  onDetailsOriginChange(event: Event): void {
    const selectedId = Number((event.target as HTMLSelectElement).value);
    const selectedOrigin = this.details_origin.find(origin => origin.id === selectedId);
    if (selectedOrigin) {
      this.idDetailsOrigin = selectedOrigin.id;
      this.description = selectedOrigin.Description; // Atualiza a descrição
    }
  }

  selectInDetails_Origin() {
    this.tableDetailsOriginService.selectInDetails_Origin().then(details_origin => {
      console.log('Origens encontradas:', details_origin);
      this.details_origin = details_origin;
    }).catch(error => {
      console.error('Erro ao buscar origens:', error);
    });
  }

  addRecord() {
    const lastRecord = this.additionalRecords.length > 0 ? this.additionalRecords[this.additionalRecords.length - 1] : { month: this.month, year: this.year };
    const nextMonth = lastRecord.month === 12 ? 1 : lastRecord.month + 1;
    const nextYear = lastRecord.month === 12 ? lastRecord.year + 1 : lastRecord.year;
    this.additionalRecords.push({ value: 0, discounts: 0, month: nextMonth, year: nextYear });
  }

  removeLastRecord() {
    if (this.additionalRecords.length > 0) {
      this.additionalRecords.pop();
    }
  }

    insertInRecords_Expenses() {
    const { idDetailsOrigin, value, discounts, definitive_value, payment, month, year } = this;

    // Verifica o registro principal
    const existingRecord = this.allRecords.find(record =>
      record.details_origin_id === idDetailsOrigin &&
      record.month === month &&
      record.year === year
    );

    if (existingRecord) {
      // Atualiza o registro principal existente
      this.upadaRecords_Expenses(existingRecord.id, value, discounts, definitive_value, payment);
    } else {
      // Insere o registro principal
      this.tableRecordsService.insertInInRecords_Expenses(idDetailsOrigin, value, month, year, discounts, definitive_value, payment).then(() => {
        this.notificacoesService.sucesso('Despesa principal adicionada com sucesso.');
      }).catch(error => {
        console.error('Erro ao adicionar despesa principal:', error);
        this.notificacoesService.erro('Erro ao adicionar despesa principal.');
      });
    }

    // Verifica e processa os registros adicionais
    this.additionalRecords.forEach(record => {
      const additionalExistingRecord = this.allRecords.find(r =>
        r.details_origin_id === idDetailsOrigin &&
        r.month === record.month &&
        r.year === record.year
      );

      if (additionalExistingRecord) {
        // Atualiza o registro adicional existente
        this.upadaRecords_Expenses(additionalExistingRecord.id, record.value, record.discounts, definitive_value, payment);
      } else {
        // Insere o registro adicional
        this.tableRecordsService.insertInInRecords_Expenses(idDetailsOrigin, record.value, record.month, record.year, record.discounts, definitive_value, payment).then(() => {
          this.notificacoesService.sucesso(`Despesa adicional para ${record.month}/${record.year} adicionada com sucesso.`);
        }).catch(error => {
          console.error(`Erro ao adicionar despesa adicional para ${record.month}/${record.year}:`, error);
          this.notificacoesService.erro(`Erro ao adicionar despesa adicional para ${record.month}/${record.year}.`);
        });
      }
    });

    // Fecha o modal após o processamento
    this.dialogRef.close({ success: true });
  }

  upadaRecords_Expenses(id: number, value: number, discounts: number, definitive_value: boolean, payment: boolean) {
    this.tableRecordsService.updateInRecords_Expenses(id, value, discounts, definitive_value, payment).then(records => {
      this.notificacoesService.sucesso('Despesa atualizada com sucesso.');
      this.dialogRef.close({ success: true });
    }
    ).catch(error => {
      console.error('Erro ao atualizar despesa:', error);
      this.notificacoesService.erro('Erro ao atualizar despesa.');
    }
    );
  }



  // Método para validar o formulário
  isFormValid(): boolean {
    // Verifica se o valor principal é válido
    if (this.value === undefined || this.value === 0 || this.idDetailsOrigin === 0) {
      return false;
    }

    // Verifica se todos os valores das linhas adicionadas são maiores que 0
    for (const record of this.additionalRecords) {
      if (record.value === 0 || record.value === undefined) {
        return false;
      }
    }

    return true; // Tudo está válido
  }

    getRecords() {
    this.tableRecordsService.selectInRecordsWithDetails_Origin().then(records => {
      this.allRecords = records;
    }).catch(error => {
      this.notificacoesService.erro('Erro ao buscar registros.');
      console.error('Erro ao buscar registros:', error);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
