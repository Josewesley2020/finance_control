export class GeneralInfo {
  id: number;
  idUser: string;
  value_in_the_Piggy: number;
  goal_value_in_the_piggy: number;
  old_value_piggy: number;
  last_update_month: number;
  last_update_year: number;

  constructor(id: number, idUser: string, value_in_the_Piggy: number, goal_value_in_the_piggy: number,
    old_value_piggy: number, last_update_month: number, last_update_year: number) {
    this.id = id;
    this.idUser = idUser;
    this.value_in_the_Piggy = value_in_the_Piggy;
    this.goal_value_in_the_piggy = goal_value_in_the_piggy;
    this.old_value_piggy = old_value_piggy;
    this.last_update_month = last_update_month;
    this.last_update_year = last_update_year;
  }
}
