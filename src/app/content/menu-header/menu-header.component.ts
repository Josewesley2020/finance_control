import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalInsertOriginExpenseComponent } from '../modais/modal-insert-origin-expense/modal-insert-origin-expense.component';
import { ModalInsertIncomeSourceComponent } from '../modais/modal-insert-income-source/modal-insert-income-source.component';
import { ModalInsertReserveDestinationComponent } from '../modais/modal-insert-reserve-destination/modal-insert-reserve-destination.component';

@Component({
  selector: 'app-menu-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent {

  constructor(private dialog: MatDialog) { }

  addNewIncome() {
    this.openModal_ModalInsertIncomeSourceComponent();
  }

  addNewExpense() {
    this.openModal_ModalInsertOriginExpenseComponent();
  }

  addNewDestinationReserva() {
    this.openModal_ModalInsertReserveDestinationComponent();
  }

  openModal_ModalInsertOriginExpenseComponent() {
    const dialogRef = this.dialog.open(ModalInsertOriginExpenseComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
      minHeight: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log(result.message);
      } else {
        console.log('Ação cancelada ou erro ao inserir a origem.');
      }
    });
  }

  openModal_ModalInsertIncomeSourceComponent() {
    const dialogRef = this.dialog.open(ModalInsertIncomeSourceComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log(result.message);
      } else {
        console.log('Ação cancelada ou erro ao inserir a fonte de renda.');
      }
    });
  }
  openModal_ModalInsertReserveDestinationComponent() {
    const dialogRef = this.dialog.open(ModalInsertReserveDestinationComponent, {
      width: 'auto',
      height: 'auto',
      minWidth: '400px',
      minHeight: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log(result.message);
      } else {
        console.log('Ação cancelada ou erro ao inserir a destino da reserva.');
      }
    });
  }
}
