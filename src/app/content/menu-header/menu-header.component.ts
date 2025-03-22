import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalInsertOriginExpenseComponent } from '../modais/modal-insert-origin-expense/modal-insert-origin-expense.component';
import { ModalInsertIncomeSourceComponent } from '../modais/modal-insert-income-source/modal-insert-income-source.component';

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
    throw new Error('Method not implemented.');
  }

  openModal_ModalInsertOriginExpenseComponent() {
    const dialogRef = this.dialog.open(ModalInsertOriginExpenseComponent, {
      width: 'auto',
      height: 'auto'
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
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log(result.message);
      } else {
        console.log('Ação cancelada ou erro ao inserir a fonte de renda.');
      }
    });
  }
}
