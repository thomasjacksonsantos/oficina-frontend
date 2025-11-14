import { Contato } from "./contato.types";
import { Endereco } from "./users.types";

// Payment Status
export enum Sexo {
  MASCULINO = "Masculino",
  FEMININO = "Feminino"
}

// Payment Type
export enum TipoDocumento {
  CPF = "Cpf",
  CNPJ = "Cnpj",
  RG = "Rg",
}

// Main Service Order Type
export type Customer = {
  id: number;
  nome: string; // Total Value
  razaoSocial: string; // Company Name
  sexo: Sexo; // Gender
  documento: string; // Document
  email: string; // Employee Id
  dataNascimento: string; // Date of Birth (ISO date)
  contatos: Contato[]; // Contact Information
  endereco: Endereco
};

// Input types for creating/updating
export type CreateCustomerInput = Omit<Customer, 'id' | 'criado' | 'atualizado'> & {
  id?: number; // Optional for creation
};

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
