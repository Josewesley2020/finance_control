import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificacoesService } from '../../shared/notificacoes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableRecordsIncomeService } from '../../../services/table-records-income.service';
import { TableIncomeSourceService } from '../../../services/table-income-source.service';
import { Income } from '../../../models/income.model';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-modal-insert-record-income',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-record-income.component.html',
  styleUrls: ['./modal-insert-record-income.component.css']
})
export class ModalInsertRecordIncomeComponent implements OnInit {
  description: string = '';
  value?: number = undefined;
  month: number;
  year: number;
  idIncomeSelecionado = 0;
  allIncomes: Income[] = [];
  user?: User;

  constructor(
    private authService: AuthenticatorService,
    private tableIncomeSourceService: TableIncomeSourceService,
    private notificacoesService: NotificacoesService,
    private tableRecordsIncomeService: TableRecordsIncomeService,
    public dialogRef: MatDialogRef<ModalInsertRecordIncomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { month: number, year: number }
  ) {
    this.month = data.  month;
    this.year = data.year;
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getIncomes();

  }

  getIncomes() {
    if (this.user && this.user.id) {
      this.tableIncomeSourceService.selectInIncomeSource().then((incomes: Income[]) => {
        this.allIncomes = incomes;
      }).catch(error => {
        this.notificacoesService.erro('Erro ao buscar as fontes de renda.');
      });
    }
  }

  save() {
    this.tableRecordsIncomeService.insertInInRecodsIncome(
      this.description, this.value || 0, this.month, this.year, this.idIncomeSelecionado).then(() => {
        this.notificacoesService.sucesso('Sucesso.');
        this.dialogRef.close({ success: true });
      }).catch(error => {
        this.notificacoesService.erro('Erro.');
      });
  }

  cancel() {
    this.notificacoesService.info('Ação cancelada.');
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }
}
