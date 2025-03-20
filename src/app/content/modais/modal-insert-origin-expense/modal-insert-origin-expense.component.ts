import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TableDetailsOriginService } from '../../../services/table-details-origin.service';
import { User } from '../../../models/user.model';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-modal-insert-origin-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-insert-origin-expense.component.html',
  styleUrls: ['./modal-insert-origin-expense.component.css']
})
export class ModalInsertOriginExpenseComponent implements OnInit {
  description: string = '';
  observation: string = '';
  closingDay: number = 1;
  dueDate: number = 1;
  changeValue: boolean = true;
  user?: User;
  show_value: boolean = true;
  alertMessage: string = '';
  isError: boolean = false;
  disabledBtnSalve: boolean = false;

  constructor(
    private authService: AuthenticatorService,
    private tableDetailsOriginService: TableDetailsOriginService,
    public dialogRef: MatDialogRef<ModalInsertOriginExpenseComponent>) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  resetValues() {
    this.description = '';
    this.observation = '';
    this.closingDay = 1;
    this.dueDate = 1;
    this.changeValue = true;
    this.show_value = true;
  }

  insertInInDetails_Origin() {
    this.tableDetailsOriginService.insertInInDetails_Origin(
      this.user?.id || '',
      this.description,
      this.observation,
      this.closingDay,
      this.dueDate,
      this.changeValue,
      this.show_value
    ).then(() => {
      this.dialogRef.close(
      { success: true, message: 'Origem inserida com sucesso.' }
      );
    }).catch(error => {
      console.log('Erro ao inserir a origem.');
      this.resetValues();
    });
  }

  save() {
    if (this.user && this.user.id) {
      this.insertInInDetails_Origin();
    } else {
      console.error('Usuário inválido. Não é possível inserir a origem.');
    }
  }

  cancel() {
    this.dialogRef.close({ success: false, message: 'Modal fechado sem alterações' });
  }

}
