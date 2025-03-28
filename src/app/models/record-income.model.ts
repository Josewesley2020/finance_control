export class RecordIncome {
  id: number;
  value: number;
  month: number;
  year: number;
  idIncome: number;
  description: string = '';
  constructor( id: number, value: number, month: number, year: number, idIncome: number, description: string = '') {
    this.id = id;
    this.value = value;
    this.month = month;
    this.year = year;
    this.idIncome = idIncome;
    this.description = description;
  }
}
