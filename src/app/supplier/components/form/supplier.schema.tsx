import { z } from 'zod';

const contactSchema = z.object({
  numero: z
    .string()
    .min(1, 'Número é obrigatório')
    .regex(/^\d{10,11}$/, 'Número deve ter 10 ou 11 dígitos'),
  tipoTelefone: z.string().min(1, 'Tipo de telefone é obrigatório'),
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
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z
    .string()
    .min(1, 'Bairro é obrigatório')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  cidade: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  estado: z
    .string()
    .min(1, 'Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres')
    .transform((val) => val.toUpperCase()),
  pais: z
    .string()
    .min(1, 'País é obrigatório')
    .min(2, 'País deve ter pelo menos 2 caracteres')
    .max(100, 'País deve ter no máximo 100 caracteres'),
});

export const supplierSchema = z.object({
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

  documento: z
    .string()
    .min(1, 'CPF/CNPJ é obrigatório')
    .regex(/^\d{11}$|^\d{14}$/, 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'),

  dataNascimento: z
    .string()
    .min(1, 'Data de abertura é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

  emailFornecedor: z.string().min(1, 'Email é obrigatório').email('Email inválido'),

  site: z.string().optional(),

  contatos: z.array(contactSchema).min(1, 'Pelo menos um contato é obrigatório'),

  endereco: addressSchema,

  inscricaoEstadual: z.string().optional(),

  inscricaoMunicipal: z.string().optional(),

  tipoConsumidor: z.string().min(1, 'Tipo Consumidor é obrigatório'),

  indicadorIE: z.string().min(1, 'Indicador de I.E é obrigatório'),
});

export type CreateSupplierSchema = z.infer<typeof supplierSchema>;
