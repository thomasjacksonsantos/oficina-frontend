export type Supplier = {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  documento: string;
  dataNascimento: string;
  email: string;
  site?: string;
  contatos: Contact[];
  endereco: Address;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  tipoConsumidor: string;
  indicadorIE: string;
  status: string;
};

export type Contact = {
  numero: string;
  tipoTelefone: string;
};

export type Address = {
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  complemento?: string;
  cep: string;
  numero: string;
  logradouro: string;
};

export type CreateSupplierInput = Omit<Supplier, 'id' | 'status'> & {
  id?: string;
  site?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
};

export type UpdateSupplierInput = Partial<CreateSupplierInput>;
