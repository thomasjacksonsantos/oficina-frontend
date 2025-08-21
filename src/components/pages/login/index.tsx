"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Label,
  Separator,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms";
import { Plus, Trash2 } from "lucide-react";
import { useSignUp } from "@/services/auth";
import {
  detectCpfOrCnpj,
  formatCnpj,
  formatCpfCnpj,
} from "@/helpers/formatCpfCnpj";
import { formatBirthDate } from "@/helpers/formatBirthDate";
import { formatToIso } from "@/helpers/formatDate";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

const phoneSchema = z.object({
  ddd: z
    .string()
    .min(2, "DDD inválido")
    .max(3, "DDD inválido")
    .regex(/^\d+$/, "Apenas números"),
  number: z
    .string()
    .min(8, "Telefone inválido")
    .max(11, "Telefone inválido")
    .regex(/^\d+$/, "Apenas números"),
  phoneType: z.enum(["Celular", "Residencial"], {
    required_error: "Tipo é obrigatório",
  }),
});

const registerSchema = z
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

type RegisterForm = z.infer<typeof registerSchema>;

export default function Login() {
  const { mutateAsync: signUp, isPending: isSignUpLoading } = useSignUp();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      rName: "",
      rDocument: "",
      rEmail: "",
      rBirthDate: "",
      rPassword: "",
      rconfirmPassword: "",
      biologicalSex: undefined,

      storeName: "",
      storeLegalName: "",
      storeCnpj: "",
      site: "",
      logoType: "",
      country: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      zipCode: "",

      phones: [{ ddd: "", number: "", phoneType: "Celular" }],
      storePhones: [{ ddd: "", number: "", phoneType: "Celular" }],
    },
  });

  const {
    control,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
    watch,
  } = registerForm;

  const userPhonesFA = useFieldArray({
    control,
    name: "phones",
  });

  const storePhonesFA = useFieldArray({
    control,
    name: "storePhones",
  });

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleLogin = loginForm.handleSubmit(async (values) => {
    console.log("login values", values);
  });

  const handleSignUp = handleRegisterSubmit(async (values) => {
    console.log(values);
    await signUp({
      nome: values.rName,
      email: values.rEmail,
      dataNascimento: formatToIso(values.rBirthDate),
      senha: values.rPassword,

      confirmarSenha: values.rconfirmPassword,
      sexo: values.biologicalSex,
      tipoDocumento: detectCpfOrCnpj(values.rDocument),
      documento: values.rDocument,
      contatos: values.phones.map((phone) => ({
        ddd: phone.ddd,
        numero: phone.number,
        tipoTelefone: phone.phoneType,
      })),

      loja: {
        nomeFantasia: values.storeName,
        razaoSocial: values.storeLegalName,
        cnpj: values.storeCnpj,
        inscricaoEstadual: values.stateRegistration || "",
        site: values.site || "",
        logoTipo: values.logoType || "",
        endereco: {
          pais: values.country,
          estado: values.state,
          cidade: values.city,
          bairro: values.neighborhood,
          numero: values.number,
          logradouro: values.street,
          complemento: values.complement ?? "",
          cep: values.zipCode,
        },
        contatos: values.storePhones.map((p) => ({
          ddd: p.ddd,
          numero: p.number,
          tipoTelefone: p.phoneType,
        })),
      },
    });

    resetRegister();
  });

  const selectedSex = watch("biologicalSex");

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Bem-vindo à oficina
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Entre com a sua conta ou crie uma nova.
          </p>

          <Tabs defaultValue="login" className="mt-8">
            <div className="flex items-center justify-center">
              <TabsList className="grid w-[260px] grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login" className="mt-6">
              <Form {...loginForm}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Senha</Label>
                        <FormControl>
                          <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11">
                    Entrar
                  </Button>

                  <div className="relative py-2">
                    <Separator />
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <Form {...registerForm}>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <FormField
                    control={control}
                    name="rName"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="r-name">Nome</Label>
                        <FormControl>
                          <Input
                            id="r-name"
                            type="text"
                            placeholder="nome"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="rDocument"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="r-document">
                          Documento (cpf / cnpj)
                        </Label>
                        <FormControl>
                          <Input
                            id="r-document"
                            type="numeric"
                            placeholder="documento"
                            {...field}
                            onChange={(e) =>
                              field.onChange(formatCpfCnpj(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="rEmail"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="r-email">Email</Label>
                        <FormControl>
                          <Input
                            id="r-email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="rPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Senha</Label>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="rconfirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Confirmar senha</Label>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="rBirthDate"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="r-birthDate">Data de nascimento</Label>
                        <FormControl>
                          <Input
                            id="r-birthDate"
                            type="text"
                            placeholder="data de nascimento"
                            {...field}
                            onChange={(e) =>
                              field.onChange(formatBirthDate(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="biologicalSex"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Sexo biológico</Label>
                        <div className="mt-2 flex gap-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedSex === "Masculino"}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked ? "Masculino" : undefined
                                )
                              }
                            />
                            <span className="text-sm">Masculino</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedSex === "Feminino"}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? "Feminino" : undefined)
                              }
                            />
                            <span className="text-sm">Feminino</span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Telefones do usuário</Label>
                    {userPhonesFA.fields.map((f, index) => (
                      <div key={f.id} className="flex items-start gap-2">
                        <FormField
                          control={control}
                          name={`phones.${index}.ddd`}
                          render={({ field }) => (
                            <FormItem className="w-20">
                              <FormControl>
                                <Input
                                  inputMode="numeric"
                                  maxLength={3}
                                  placeholder="DDD"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`phones.${index}.number`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  inputMode="numeric"
                                  placeholder={
                                    index === 0
                                      ? "Telefone principal"
                                      : "Telefone"
                                  }
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`phones.${index}.phoneType`}
                          render={({ field }) => (
                            <FormItem className="w-40">
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Celular">
                                      Celular
                                    </SelectItem>
                                    <SelectItem value="Residencial">
                                      Residencial
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-1"
                            onClick={() => userPhonesFA.remove(index)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        ) : (
                          <div className="w-9" />
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        userPhonesFA.append({
                          ddd: "",
                          number: "",
                          phoneType: "Celular",
                        })
                      }
                      className="h-9"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar telefone
                    </Button>
                  </div>

                  <div className="pt-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Dados da loja
                    </span>
                  </div>

                  <FormField
                    control={control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Nome fantasia</Label>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="storeLegalName"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Razão social</Label>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="storeCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <Label>CNPJ</Label>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              placeholder="00.000.000/0000-00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(formatCnpj(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="stateRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Inscrição estadual</Label>
                          <FormControl>
                            <Input placeholder="Opcional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="site"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Site</Label>
                          <FormControl>
                            <Input
                              placeholder="https://minhaloja.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="logoType"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Logo (arquivo)</Label>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) {
                                    field.onChange("");
                                    return;
                                  }

                                  if (!file.type.startsWith("image/")) {
                                    return;
                                  }
                                  if (file.size > 2 * 1024 * 1024) {
                                    return;
                                  }

                                  const base64 = await fileToBase64(file);
                                  field.onChange(base64);
                                }}
                              />

                              {field.value ? (
                                <img
                                  src={field.value}
                                  alt="Logo preview"
                                  className="h-10 w-10 rounded object-cover border"
                                />
                              ) : null}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <Label>País</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Estado (UF)</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Cidade</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Bairro</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Label>Logradouro</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Número</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Complemento</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <Label>CEP</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefones da loja</Label>
                    {storePhonesFA.fields.map((f, index) => (
                      <div key={f.id} className="flex items-start gap-2">
                        <FormField
                          control={control}
                          name={`storePhones.${index}.ddd`}
                          render={({ field }) => (
                            <FormItem className="w-20">
                              <FormControl>
                                <Input
                                  inputMode="numeric"
                                  maxLength={3}
                                  placeholder="DDD"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`storePhones.${index}.number`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  inputMode="numeric"
                                  placeholder={
                                    index === 0
                                      ? "Telefone principal"
                                      : "Telefone"
                                  }
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`storePhones.${index}.phoneType`}
                          render={({ field }) => (
                            <FormItem className="w-40">
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Celular">
                                      Celular
                                    </SelectItem>
                                    <SelectItem value="Residencial">
                                      Residencial
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-1"
                            onClick={() => storePhonesFA.remove(index)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        ) : (
                          <div className="w-9" />
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        storePhonesFA.append({
                          ddd: "",
                          number: "",
                          phoneType: "Celular",
                        })
                      }
                      className="h-9"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar telefone
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isSignUpLoading}
                  >
                    {isSignUpLoading ? "Enviando..." : "Criar conta"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-500 dark:from-zinc-800 dark:via-zinc-900 dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(transparent_0,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-40 w-40 rounded-full border border-white/30 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border border-white/30" />
          </div>
        </div>

        <div className="absolute bottom-10 left-8 right-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow">
            Oficina
          </h2>
          <p className="text-white/90 mt-2 max-w-md">
            DocChat é a forma mais fácil de compartilhar documentos com
            segurança.
          </p>
        </div>
      </div>
    </div>
  );
}
