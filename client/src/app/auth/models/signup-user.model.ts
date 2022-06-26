export class SignupUser {
  id?: number;
  name: string;
  email: string;
  phone: number;
  password: string;
  role?: string;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.password = user.password;
    this.role = user.role;
  }
}

export interface Child {
  id?: string;
  name: string;
  age: number;
}

export class User extends SignupUser {
  children?: Child[];

  constructor(user: any) {
    super(user);
    this.children = user.children;
  }
}
