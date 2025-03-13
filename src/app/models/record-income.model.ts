export class RecordIncome {
  id: number;
  value: number;
  month: number;
  year: number;
  idIncome: number;
  constructor( id: number, value: number, month: number, year: number, idIncome: number) {
    this.id = id;
    this.value = value;
    this.month = month;
    this.year = year;
    this.idIncome = idIncome;
  }
}
