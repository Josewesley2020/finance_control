export class User {
  Login: string;
  Name: string;
  id: string;
  Email: string;

  constructor(Login: string, Name: string, id: string, email: string) {
    this.Login = Login;
    this.Name = Name;
    this.id = id;
    this.Email = email;
  }
}
