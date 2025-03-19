import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalInsertOriginExpenseComponent } from '../modais/modal-insert-origin-expense/modal-insert-origin-expense.component';

@Component({
  selector: 'app-menu-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent {

  constructor(private dialog: MatDialog) { }

  addNewIncome() {
    throw new Error('addNewIncome');
  }

  addNewExpense() {
    this.openModal();
  }

  addNewGoal() {
    throw new Error('Method not implemented.');
  }

  openModal() {
    this.dialog.open(ModalInsertOriginExpenseComponent, {
      width: '1100px', // Defina a largura do modal
      height: '500px' // Defina a altura do modal
    });
  }
}
