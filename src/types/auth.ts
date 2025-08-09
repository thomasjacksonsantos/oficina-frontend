export interface Contact {
  phoneNumber: string;
}

export interface Address {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  contacts: Contact[];
}

export interface Store {
  name: string;
  address: Address;
  contacts: Contact[];
}

export interface SignUpParams {
  usuario: User;
  loja: Store;
}
