export class OtherPayers {
  name: string;
  id: number;
  show: boolean = true;

  constructor(name: string, id: number, show: boolean = true) {
    this.name = name;
    this.id = id;
    this.show = show;
  }
}
