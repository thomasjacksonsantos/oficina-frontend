import { z } from 'zod';

export const vehicleSchema = z.object({
  placa: z
    .string()
    .min(1, 'Placa é obrigatória')
    .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, 'Placa inválida. Use o formato ABC1D23 ou ABC1234')
    .transform((val) => val.toUpperCase()),

  modelo: z
    .string()
    .min(1, 'Modelo é obrigatório')
    .min(2, 'Modelo deve ter pelo menos 2 caracteres')
    .max(100, 'Modelo deve ter no máximo 100 caracteres'),

  montadora: z
    .string()
    .min(1, 'Montadora é obrigatória')
    .min(2, 'Montadora deve ter pelo menos 2 caracteres')
    .max(50, 'Montadora deve ter no máximo 50 caracteres'),

  hodrometro: z
    .number({
      required_error: 'Hodômetro é obrigatório',
      invalid_type_error: 'Hodômetro deve ser um número',
    })
    .int('Hodômetro deve ser um número inteiro')
    .nonnegative('Hodômetro não pode ser negativo')
    .max(9999999, 'Hodômetro inválido'),

  cor: z
    .string()
    .min(1, 'Cor é obrigatória')
    .min(3, 'Cor deve ter pelo menos 3 caracteres')
    .max(30, 'Cor deve ter no máximo 30 caracteres'),

  motorizacao: z
    .string()
    .min(1, 'Motorização é obrigatória')
    .max(50, 'Motorização deve ter no máximo 50 caracteres'),

  ano: z
    .string()
    .min(1, 'Ano é obrigatório')
    .regex(/^\d{4}$/, 'Ano deve ter 4 dígitos')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }, 'Ano deve estar entre 1900 e o próximo ano'),
  numeroSerie: z
    .string()
    .min(1, 'Número de série é obrigatório')
    .min(5, 'Número de série deve ter pelo menos 5 caracteres')
    .max(30, 'Número de série deve ter no máximo 30 caracteres'),
  chassi: z
    .string()
    .min(1, 'Chassi é obrigatório')
    .length(17, 'Chassi deve ter exatamente 17 caracteres')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Chassi inválido. Não pode conter I, O ou Q')
    .transform((val) => val.toUpperCase()),
});

export type CreateVehicleSchema = z.infer<typeof vehicleSchema>;
