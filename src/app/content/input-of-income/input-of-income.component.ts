import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthenticatorService } from '../../services/authenticator.service';
import { TableRecordsIncomeService } from '../../services/table-records-income.service';
import { RecordIncome } from '../../models/record-income.model';
import { NotificacoesService } from '../shared/notificacoes.service';
import { Subscription } from 'rxjs';
import { DataSelectedService } from '../../services/data-selected.service';
import { TableIncomeSourceService } from '../../services/table-income-source.service';
import { Income } from '../../models/income.model';
import { CommonModule } from '@angular/common';
import { ModalInsertRecordIncomeComponent } from '../modais/modal-insert-record-income/modal-insert-record-income.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-input-of-income',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './input-of-income.component.html',
  styleUrls: ['./input-of-income.component.css'] // Corrigido aqui
})

export class InputOfIncomeComponent implements OnInit, OnDestroy {
  @Output() allRecordsIncomes = new EventEmitter<RecordIncome[]>(); // Emissor de eventos
  allRecordsIncomesArray: RecordIncome[] = []; // Array para armazenar os registros de renda
  user?: User;
  valueTotalOfRecordsIncome: number = 0;
  private subscription: Subscription = new Subscription();
  selectedDate: string = '';
  selectedMonth: number = 0;
  selectedYear: number = 0;
  allIncomeSources: Income[] = [];

  constructor(
    private authenticatorService: AuthenticatorService,
    private tableRecordsIncomeService: TableRecordsIncomeService,
    private notificacoesService: NotificacoesService,
    private dataSelectedService: DataSelectedService,
    private tableIncomeSourceService: TableIncomeSourceService,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.user = this.authenticatorService.getUser();
    this.getIncomeSource();
    this.subscription = this.dataSelectedService.selectedDate$.subscribe((date) => {
      this.onDateChanged(date);
    });
  }
openModalInsertRecordIncome(): void {
  const dialogRef = this.dialog.open(ModalInsertRecordIncomeComponent, {
    width: '500px',
    data: { month: this.selectedMonth, year: this.selectedYear }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.success) {
      this.getRecordsIncome();
    }
  });
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDateChanged(date: string): void {
    this.selectedDate = date;
    this.selectedMonth = this.dataSelectedService.getMonth();
    this.selectedYear = this.dataSelectedService.getYear();
    this.getRecordsIncome();
  }

  getIncomeSource() {
    this.tableIncomeSourceService.selectInIncomeSource().then(incomeSource => {
      this.allIncomeSources = incomeSource
    }
    ).catch(error => {
      this.notificacoesService.erro('Erro ao buscar fontes de renda.');
    }
    );
  }

  getRecordsIncome() {
    this.tableRecordsIncomeService.selectInRecods_income(this.user?.id || "").then(RecordsIncome => {
      const filteredRecords = RecordsIncome.filter(record => record.month === this.selectedMonth && record.year === this.selectedYear);
      this.allRecordsIncomes.emit(filteredRecords);
      this.allRecordsIncomesArray = filteredRecords;
      this.valueTotalOfRecordsIncome = 0;
      this.allRecordsIncomes.subscribe(records => {
        records.forEach(recordIncome => {
          this.valueTotalOfRecordsIncome += parseFloat(recordIncome.value.toFixed(2));
        });
      });
      console.log('Registros de renda:', this.allRecordsIncomes);
      console.log('Valor total de registros de renda:', this.valueTotalOfRecordsIncome);
    }).catch(error => {
      this.notificacoesService.erro('Erro ao buscar registros de renda.');
    });
  }

  deleteRecordIncome(id: number) {
    this.tableRecordsIncomeService.deleteInRecodsIncome(id).then(() => {
      this.getRecordsIncome();
      this.notificacoesService.sucesso('Registro de renda excluído com sucesso!');
    }
    ).catch(error => {
      this.notificacoesService.erro('Erro ao excluir registro de renda.');
    }
    );
  }

  getIncomeDescription(idIncome: number): string | undefined {
    const income = this.allIncomeSources.find(source => source.id === idIncome);
    return income?.description; // Retorna a descrição ou undefined se não encontrar
  }

  addNewIncome() {
    this.openModalInsertRecordIncome();
  }
}
