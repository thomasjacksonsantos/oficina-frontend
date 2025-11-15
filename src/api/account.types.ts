export type Login = {
  email: string;
  senha: string;
};

export type CreateLoginInput = Partial<Login>;

export type LoginResponse = {
  token: string;
};