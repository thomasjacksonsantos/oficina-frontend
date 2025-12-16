export type Store = {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  documento: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  endereco: StoreAddress;
  contatos: StoreContact[];
  site: string;
  logoTipo: string;
};

export type StoreAddress = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | undefined;
  bairro: string;
  estado: string;
  cidade: string;
};

export type StoreContact = {
  tipoTelefone: string;
  numero: string;
};

export type UpdateStoreInput = Partial<Store>;
