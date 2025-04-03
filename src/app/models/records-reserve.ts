export class RecordReserve {
  id: number;
  value: number;
  month: number;
  year: number;
  idDestination: number;
  safe_in_piggy: boolean;
  idUser: string;
  obs?: string; // Nova coluna de observação

  constructor(
    id: number,
    value: number,
    month: number,
    year: number,
    idDestination: number,
    safe_in_piggy: boolean,
    idUser: string = '',
    obs: string = '' // Inicializa a observação como string vazia
  ) {
    this.id = id;
    this.value = value;
    this.month = month;
    this.year = year;
    this.idDestination = idDestination;
    this.safe_in_piggy = safe_in_piggy;
    this.idUser = idUser;
    this.obs = obs;
  }
}
