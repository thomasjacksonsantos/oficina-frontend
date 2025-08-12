
export type User = {
    id: string;
    nome: string;
    documento: string;
    sexo: Sexo;
    dataNascimento: string;
    contato: Contato;
    endereco: Endereco;
}

export type Contato = {
    number: string;
    tipoTelefone: TipoTelefone;
    default: boolean
}

export type Endereco = {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    estado: string;
    cidade: string;
    pais: string
}

export enum Sexo
{
    Masculino= 'Masculino',
    Feminino = 'Feminino'
}

export enum TipoTelefone {
    PHONE = ' PHONE',
    CEL = 'CEL'
}