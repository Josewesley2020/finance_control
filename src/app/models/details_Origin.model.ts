export class Details_Origin {
  Closing_day: number;
  Description: string;
  Observation: string;
  change_value: boolean;
  id: number;
  idUser: string;
  due_date: number;

  constructor(Closing_day: number, Description: string, Observation: string, change_value: boolean, id: number, idUser: string, due_date: number) {
    this.Closing_day = Closing_day;
    this.Description = Description;
    this.Observation = Observation;
    this.change_value = change_value;
    this.id = id;
    this.idUser = idUser;
    this.due_date = due_date;
  }
}
