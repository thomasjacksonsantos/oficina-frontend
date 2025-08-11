export interface SignUpParams {
  usuario: User;
  loja: Store;
}

export interface User {
  nome: string;
  tipoDocumento: "CPF" | "CNPJ";
  documento: string;
  sexo: "Masculino" | "Feminino";
  email: string;
  senha: string;
  confirmarSenha: string;
  contatos: Contact[];
}

export interface Store {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  site: string;
  logoTipo: string;
  endereco: Address;
  contatos: Contact[];
}

export interface Contact {
  ddd: string;
  numero: string;
  tipoTelefone: "Celular" | "Residencial";
}

export interface Address {
  pais: string;
  estado: string;
  cidade: string;
  logradouro: string;
  bairro: string;
  complemento: string;
  cep: string;
  numero: string;
}
