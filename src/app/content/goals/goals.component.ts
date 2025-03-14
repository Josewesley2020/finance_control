import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Goal } from '../../models/goal.model';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-goals',
  imports: [CommonModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent implements OnInit {
  @Input() user?: User;
  @Input() allGoals: Goal[] = [];

  constructor() { }

  ngOnInit(): void {
    const allGoals = this.allGoals || '';
    console.log('GOALSCOMPONENT:', allGoals);
  }

  calculateProgress(value: number, objectiveValue: number): number {
    if (objectiveValue === 0) {
      return 0;
    }
    return (value / objectiveValue) * 100;
  }

    shouldShowUpdateButton(goal: Goal): boolean {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    return goal.value < goal.objective_value && (currentYear > goal.year_of_the_last_update || (currentYear === goal.year_of_the_last_update && currentMonth > goal.month_of_the_last_update));
  }

    updateGoal(goal: Goal): void {
    // Lógica para atualizar o valor da meta
    console.log('Atualizando meta:', goal);
    // Aqui você pode adicionar a lógica para atualizar o valor da meta, por exemplo, abrir um modal para o usuário inserir o novo valor
  }

    filteredGoals(): Goal[] {
    return this.allGoals.filter(goal => goal.show_goal);
  }
}
