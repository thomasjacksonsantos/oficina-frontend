export type Store = {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  montadora: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  endereco: StoreAddress;
  contato: StoreContact[];
  site: string;
  logo: string;
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
  tipo: string;
  numero: string;
};

export type UpdateStoreInput = Partial<Store>;
