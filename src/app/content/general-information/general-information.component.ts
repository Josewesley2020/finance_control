import { Component, OnInit } from '@angular/core';
import { TableGeneralInformationService } from '../../services/table-general-information.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-general-information',
  imports: [CommonModule, FormsModule],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css'
})
export class GeneralInformationComponent implements OnInit {
  safeValue: number = 0; // Valor no cofre
  goalValue: number = 0; // Meta
  showValues: boolean = true; // Controla a exibição dos valores
  isEditing: boolean = false; // Controla o modo de edição
  last_update_year: number = 0; // Data da última atualização
  last_update_month: number = 0; // Mês da última atualização
  last_update_day: number = 0; // Dia da última atualização

  upDateValue: number = 0; // Valor a ser atualizado no cofre
  upDateGoalValue: number = 0; // Valor a ser atualizado na meta
  old_value_piggy: number = 0; // Valor antigo no cofre
  update_year: number = new Date().getFullYear(); // Ano atual
  update_month: number = new Date().getMonth() + 1; // Mês atual (0-11, então adicionamos 1)
  update_day: number = new Date().getDate(); // Dia atual
  idRecord: number = 0; // ID do registro a ser atualizado

  constructor(private tableGeneralInformationService: TableGeneralInformationService) { }

  ngOnInit(): void {
    this.getGeneralInformation();
  }

  getDaysSinceLastUpdate(): number {
    const lastUpdateDate = new Date(this.last_update_year, this.last_update_month - 1, this.last_update_day);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - lastUpdateDate.getTime();
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Converte milissegundos para dias
  }

  getGeneralInformation() {
    this.tableGeneralInformationService.selectInGeneralInformation()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.safeValue = data[0].value_in_the_Piggy || 0;
          this.goalValue = data[0].goal_value_in_the_piggy || 0;
          this.upDateValue = this.safeValue;
          this.upDateGoalValue = this.goalValue;
          this.last_update_year = data[0].last_update_year;
          this.last_update_month = data[0].last_update_month;
          this.last_update_day = data[0].last_update_day;
          this.idRecord = data[0].id;
        }
      })
      .catch((error) => {
        console.error('Error fetching general information:', error);
      });
  }

  toggleShowValues(): void {
    this.showValues = !this.showValues;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  saveUpdatedValues(): void {
    this.safeValue = this.upDateValue;
    this.goalValue = this.upDateGoalValue;
    this.isEditing = false;

    // Atualiza os valores no banco de dados
    this.tableGeneralInformationService.updateInGeneralInformation(
      this.idRecord,
      this.safeValue,
      this.goalValue,
      this.old_value_piggy,
      this.update_month,
      this.update_year
    )
      .then(() => {
        console.log('Valores atualizados com sucesso!');
        this.getGeneralInformation(); // Atualiza os dados após salvar
      })
      .catch((error) => {
        console.error('Erro ao atualizar os valores:', error);
      });
  }

  getProgressPercentage(): number {
    if (this.goalValue === 0) {
      return 0; // Evita divisão por zero
    }
    const progress = (this.safeValue / this.goalValue) * 100;
    return Math.min(progress, 100); // Limita o progresso a 100%
  }


  cancelEdit(): void {
    // Restaura os valores originais e sai do modo de edição
    this.upDateValue = this.safeValue;
    this.upDateGoalValue = this.goalValue;
    this.isEditing = false;
  }

    calculateProgress(value: number, objectiveValue: number): number {
    if (objectiveValue === 0) {
      return 0;
    }
    return (value / objectiveValue) * 100;
  }
}
