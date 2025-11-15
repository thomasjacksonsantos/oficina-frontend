import { z } from "zod";
import { Sexo, TipoDocumento } from "@/api/customers.types";
import { TipoTelefone } from "@/api/contato.types";

// Schema para contatos
const contatoSchema = z.object({
  // ddd: z.string().min(2, "DDD deve ter pelo menos 2 dígitos"),
  numero: z.string().min(8, "Número deve ter pelo menos 8 dígitos"),
  tipoTelefone: z.nativeEnum(TipoTelefone),
});

// Schema para endereço
const enderecoSchema = z.object({
  pais: z.string().min(1, "País é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  // complemento: z.string().min(3, "Complemento deve ter pelo menos 5 caracteres"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP deve ter formato válido (00000-000)"),
});

// Schema principal do cliente
export const customerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  razaoSocial: z.string().min(2, "Razão Social deve ter pelo menos 2 caracteres"),
  documento: z.string()
    .min(11, "Documento deve ter pelo menos 11 dígitos")
    .max(18, "Documento deve ter no máximo 18 caracteres"),
  sexo: z.nativeEnum(Sexo),
  emailCliente: z.string().email("Email deve ter formato válido"),
  dataNascimento: z.string().min(8, "Data de nascimento dd/mm/yyyy é obrigatória"),
  contatos: z.array(contatoSchema).min(1, "Pelo menos um contato é obrigatório"),
  endereco: enderecoSchema,
});

export type CreateCustomerSchema = z.infer<typeof customerSchema>;