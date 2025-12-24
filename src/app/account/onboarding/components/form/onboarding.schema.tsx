import { TipoTelefone } from "@/api/contato.types";
import { z } from "zod";

export const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const phoneSchema = z.object({
  number: z
    .string()
    .min(14, "Telefone inválido")
    .max(15, "Telefone inválido"),
  phoneType: z.nativeEnum(TipoTelefone),
});

export const onboardingSchema = z
  .object({
    rName: z.string().min(1, "Nome é obrigatório"),
    rDocument: z
      .string()
      .min(1, "Documento é obrigatório")
      .transform(onlyDigits)
      .refine((v) => v.length === 11 || v.length === 14, {
        message: "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)",
      }),
    rBirthDate: z.string().min(1, "Data de nascimento é obrigatória"),
    rEmail: z.string().email("E-mail inválido"),
    rPassword: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    rconfirmPassword: z
      .string()
      .min(6, "A senha deve ter ao menos 6 caracteres"),

    biologicalSex: z.enum(["Masculino", "Feminino"], {
      errorMap: () => ({
        message: "Sexo biológico é obrigatório é obrigatório",
      }),
    }),

    storeName: z.string().min(1, "Nome fantasia é obrigatório"),
    storeLegalName: z.string().min(1, "Razão social é obrigatória"),
    storeCnpj: z
      .string()
      .min(1, "CNPJ é obrigatório")
      .transform(onlyDigits)
      .refine((v) => v.length === 14, { message: "CNPJ inválido" }),

    stateRegistration: z.string().optional(),
    inscricaoMunicipal: z.string().optional(),
    site: z.string().url("URL inválida").optional().or(z.literal("")),
    logoType: z.string().optional(),
    country: z.string().min(1, "País é obrigatório"),
    state: z.string().min(2, "UF é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    street: z.string().min(1, "Logradouro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    zipCode: z.string().min(8, "CEP é obrigatório"),

    phones: z.array(phoneSchema).min(1, "Informe ao menos um telefone"),
    storePhones: z
      .array(phoneSchema)
      .min(1, "Informe ao menos um telefone da loja"),
  })
  .superRefine((val, ctx) => {
    if (val.rPassword !== val.rconfirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["rconfirmPassword"],
        message: "As senhas não coincidem",
      });
    }
  });

export type CreateOnboardingSchema = z.infer<typeof onboardingSchema>;