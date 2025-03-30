export class ReserveDestination {
  id: number;
  description: string;
  observation: string;
  show: boolean;
  idUser: string;

  constructor(
    id: number,
    description: string,
    observation: string,
    show: boolean,
    idUser: string
  ) {
    this.id = id;
    this.description = description;
    this.observation = observation;
    this.show = show;
    this.idUser = idUser;

  }
}
