export interface SignUpParams {
  nome: string;
  tipoDocumento: "Cpf" | "Cnpj";
  documento: string;
  sexo: "Masculino" | "Feminino";
  dataNascimento: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  contatos: Contact[];
  loja: Store;
}

export interface User {
  nome: string;
  tipoDocumento: "Cpf" | "Cnpj";
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
  inscricaoMunicipal: string;
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

export interface SignUpResponse {
  sucesso: boolean;
  mensagem: string;
}