export enum TipoTelefone {
    Telefone = "Telefone",
    Celular = "Celular"
}

export type Contato = {
  ddd: string;
  numero: string;
  tipoTelefone: TipoTelefone;
};