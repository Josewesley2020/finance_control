export class Income {
  id: number;
  description: string;
  idUser: string;

  constructor(id: number, description: string, idUser: string) {
    this.id = id;
    this.description = description;
    this.idUser = idUser;

  }
}
