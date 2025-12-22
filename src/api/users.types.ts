import { TipoTelefone } from "./contato.types";

export type User = {
    id: string;
    nome: string;
    email: string;
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
    complemento?: string;
    bairro: string;
    estado: string;
    cidade: string;
    pais: string
}

export enum Sexo {
    Masculino = 'Masculino',
    Feminino = 'Feminino'
}

export type ValidarDocumento = {
    documentoValido: boolean;
    mensagem: string;
}

export type ValidarEmailExistente = {
    emailExistente: boolean;
    mensagem: string;
}