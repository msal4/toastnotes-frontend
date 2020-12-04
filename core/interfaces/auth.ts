import { ValidationError } from "./error";
import { User } from "./user";

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterForm extends Credentials {
  name: string;
}

export type LoginFunction = (credentials: Credentials) => Promise<void>;
export type RegisterFunction = (form: RegisterForm) => Promise<void>;

export interface Auth {
  isLoading: boolean;
  user: User | null;
  login: LoginFunction;
  register: RegisterFunction;
  logout: () => Promise<void>;
}
