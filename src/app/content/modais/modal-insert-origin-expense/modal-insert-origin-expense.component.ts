import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-insert-origin-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-origin-expense.component.html',
  styleUrls: ['./modal-insert-origin-expense.component.css']
})
export class ModalInsertOriginExpenseComponent {
  constructor(public dialogRef: MatDialogRef<ModalInsertOriginExpenseComponent>) {}

  save() {
    // Lógica para salvar a despesa
    console.log('Salvar despesa');
    this.dialogRef.close();
  }

  cancel() {
    // Lógica para fechar o modal
    this.dialogRef.close();
  }
}
