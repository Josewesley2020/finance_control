import { Details_Origin } from './Details_Origin.model';

export class Record {
  created_at: string;
  details_origin_id: number;
  Details_Origin: Details_Origin;
  id: number;
  month: number;
  year: number;
  type_output_or_input: string;
  value: number;
  idUser: number;
  discounts: number;
  definitive_value: boolean = false;
  payment: boolean = false;
  month_year: string = `JAN-2025`;

  constructor(created_at: string, details_origin_id: number, id: number, month: number, year: number,
  type_output_or_input: string, value: number, idUser: number, Details_Origin: Details_Origin, discounts: number,
  definitive_value: boolean, payment: boolean, month_year: string)
  {
    this.created_at = created_at;
    this.details_origin_id = details_origin_id;
    this.id = id;
    this.month = month;
    this.year = year;
    this.type_output_or_input = type_output_or_input;
    this.value = this.parseCurrency(value.toString());
    this.idUser = idUser;
    this.Details_Origin = Details_Origin;
    this.discounts = this.parseCurrency(discounts.toString());
    this.definitive_value = definitive_value;
    this.payment = payment;
    this.month_year = month_year;
  }

    parseCurrency(value: string) {
    return parseFloat(value.replace('.', ','));
  }
}
