export class Goal {
  id: string;
  description: string;
  idUser: string;
  month_of_the_last_update: number;
  year_of_the_last_update: number;
  value: number;
  objective_value: number;
  previous_value: number;
  show_goal: boolean = true;


  constructor( id: string, description: string, idUser: string, month_of_the_last_update: number, year_of_the_last_update: number, value: number, objective_value: number, previous_value: number, show_goal: boolean) {
    this.id = id;
    this.description = description;
    this.idUser = idUser;
    this.month_of_the_last_update = month_of_the_last_update;
    this.year_of_the_last_update = year_of_the_last_update;
    this.value = value;
    this.objective_value = objective_value;
    this.previous_value = previous_value;
    this.show_goal = show_goal;
  }
}
