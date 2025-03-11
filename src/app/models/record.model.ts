export class Record {
  created_at: string;
  details_origin_id: number;
  id: number;
  month: number;
  year: number;
  type_output_or_input: string;
  value: number;
  idUser: number;

  constructor(created_at: string, details_origin_id: number, id: number, month: number, year: number, type_output_or_input: string, value: number, idUser: number) {
    this.created_at = created_at;
    this.details_origin_id = details_origin_id;
    this.id = id;
    this.month = month;
    this.year = year;
    this.type_output_or_input = type_output_or_input;
    this.value = value;
    this.idUser = idUser;
  }
}
