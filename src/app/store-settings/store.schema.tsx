import { z } from 'zod';

const contactSchema = z.object({
  tipo: z
    .string()
    .min(1, 'Tipo é obrigatório'),
  numero: z
    .string()
    .min(1, 'Número é obrigatório')
    .regex(/^\d{10,11}$/, 'Número deve ter 10 ou 11 dígitos'),
});

const addressSchema = z.object({
  cep: z
    .string()
    .min(1, 'CEP é obrigatório')
    .regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  logradouro: z
    .string()
    .min(1, 'Logradouro é obrigatório')
    .min(3, 'Logradouro deve ter pelo menos 3 caracteres')
    .max(200, 'Logradouro deve ter no máximo 200 caracteres'),
  numero: z
    .string()
    .min(1, 'Número é obrigatório'),
  complemento: z
    .string()
    .optional(),
  bairro: z
    .string()
    .min(1, 'Bairro é obrigatório')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  estado: z
    .string()
    .min(1, 'Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres')
    .transform((val) => val.toUpperCase()),
  cidade: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
});

export const storeSchema = z.object({
  nomeFantasia: z
    .string()
    .min(1, 'Nome Fantasia é obrigatório')
    .min(2, 'Nome Fantasia deve ter pelo menos 2 caracteres')
    .max(200, 'Nome Fantasia deve ter no máximo 200 caracteres'),

  razaoSocial: z
    .string()
    .min(1, 'Razão Social é obrigatória')
    .min(2, 'Razão Social deve ter pelo menos 2 caracteres')
    .max(200, 'Razão Social deve ter no máximo 200 caracteres'),

  montadora: z
    .string()
    .min(1, 'Montadora é obrigatória')
    .min(2, 'Montadora deve ter pelo menos 2 caracteres')
    .max(100, 'Montadora deve ter no máximo 100 caracteres'),

  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),

  inscricaoEstadual: z
    .string()
    .optional(),

  inscricaoMunicipal: z
    .string()
    .optional(),

  contato: z
    .array(contactSchema)
    .min(1, 'Pelo menos um contato é obrigatório'),

  endereco: addressSchema,

  site: z
    .string()
    .optional(),

  logo: z
    .string()
    .optional(),
});

export type StoreFormSchema = z.infer<typeof storeSchema>;