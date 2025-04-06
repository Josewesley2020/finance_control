export class Records_another_payer {
  id: number;
  idPayer: number;
  idOrigin: number;
  description: string;
  value: number;
  month: number;
  year: number;
  qtd_parcelas_pendentes: number;
  monthInit: number;
  yearInit: number;
  payment: boolean = false;
  idUser: string = '';

  constructor(id: number, idPayer: number, idOrigin: number, description: string,
  value: number, month: number, year: number, qtd_parcelas_pendentes: number,
  monthInit: number, yearInit: number, payment: boolean = false, idUser: string = '') {
    this.idUser = idUser;
    this.idPayer = idPayer;
    this.id = id;
    this.idOrigin = idOrigin;
    this.description = description;
    this.value = value;
    this.month = month;
    this.year = year;
    this.qtd_parcelas_pendentes = qtd_parcelas_pendentes;
    this.monthInit = monthInit;
    this.yearInit = yearInit;
    this.payment = payment;
  }
}
