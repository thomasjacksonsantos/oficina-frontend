"use client";
import { toast } from "sonner"
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Label,
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

import { formatPhone } from '@/helpers/formatPhone';
import { CreateOnboardingSchema, onboardingSchema } from "./onboarding.schema";
import { TipoTelefone } from "@/api/contato.types";

import { useValidateExistsEmail } from "../../api/use-validate-exists-email";
import { useEffect, useState } from "react";


export default function OnboardingForm() {
  const [cep, setCep] = useState<string>('');
  const [rEmail, setREmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const { mutateAsync: signUp, isPending: isSignUpLoading } = useSignUp();

  const registerForm = useForm<CreateOnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
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
      phones: [{ number: "", phoneType: TipoTelefone.Celular }],
      storePhones: [{ number: "", phoneType: TipoTelefone.Celular }],
    },
  });

  const {
    control,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
    watch,
    setValue,
    register,
    formState: { errors },
  } = registerForm;

  const { data: validarEmailData, isLoading: isLoadingValidarEmail } =
    useValidateExistsEmail(rEmail);

  useEffect(() => {
    if (validarEmailData) {
      if (validarEmailData?.emailExistente) {
        setEmailError(validarEmailData.mensagem);
      } else {
        setEmailError('');
        setValue('rEmail', rEmail, { shouldValidate: true });
      }
    }
  }, [validarEmailData, setValue]);

  const handleValidarEmailExistente = () => {
    const email = watch('rEmail');
    if (!email) return;
    setREmail(email);
  };

  const { fields: storePhones, append: appendStorePhone, remove: removeStorePhone } = useFieldArray({
    control: registerForm.control,
    name: "storePhones",
  });

  const { fields: phones, append, remove } = useFieldArray({
    control: registerForm.control,
    name: "phones",
  });

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSignUp = async (values: CreateOnboardingSchema) => {
    console.log(values);
    const response = await signUp({
      nome: values.rName,
      email: values.rEmail,
      dataNascimento: formatToIso(values.rBirthDate),
      senha: values.rPassword,
      confirmarSenha: values.rconfirmPassword,
      sexo: values.biologicalSex,
      tipoDocumento: detectCpfOrCnpj(values.rDocument),
      documento: values.rDocument,
      contatos: values.phones.map((phone) => ({
        numero: phone.number,
        tipoTelefone: phone.phoneType,
      })),

      loja: {
        nomeFantasia: values.storeName,
        razaoSocial: values.storeLegalName,
        cnpj: values.storeCnpj,
        inscricaoEstadual: values.stateRegistration || "",
        inscricaoMunicipal: values.inscricaoMunicipal || "",
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
          numero: p.number,
          tipoTelefone: p.phoneType,
        })),
      },
    });

    if (response.sucesso) {
      resetRegister();
      toast.success("Cadastro realizado com sucesso!", {
        description: "Verifique seu email para confirmar a conta."
      });
      window.location.href = "/signup-confirmation";
    } else {
      toast.error("Erro ao cadastrar", {
        description: response.mensagem || "Por favor, tente novamente."
      });
    }
  };

  const selectedSex = watch("biologicalSex");

  return (
    <Form {...registerForm}>
      <form onSubmit={handleRegisterSubmit(handleSignUp)} className="space-y-4">
        <FormField
          control={registerForm.control}
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
                  onBlur={handleValidarEmailExistente}
                />
              </FormControl>
              {(errors.rEmail || emailError) && (
                <span className="text-sm text-red-500">
                  {errors.rEmail ? errors.rEmail.message : emailError}
                </span>
              )}
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
          <Label>Contato</Label>

          {phones.map((field, idx) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex flex-col min-w-32">
                <Label className="sr-only">Tipo</Label>
                <Controller
                  control={control}
                  name={`phones.${idx}.phoneType`}
                  render={({ field }) => (
                    <>
                      <Select
                        value={field.value as any}
                        onValueChange={(v: TipoTelefone) => field.onChange(v as TipoTelefone)}
                      >
                        <SelectTrigger className="w-32 rounded-md">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TipoTelefone.Celular}>Celular</SelectItem>
                          <SelectItem value={TipoTelefone.Telefone}>Telefone</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.phones?.[idx]?.phoneType && (
                        <span className="text-sm text-red-500">
                          {errors.phones[idx]?.phoneType?.message as string}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col flex-1">
                <Label className="sr-only">Número</Label>
                <Input
                  inputMode="numeric"
                  placeholder="(99) 99999-9999"
                  className="w-full"
                  {...register(`phones.${idx}.number` as const)}
                  onChange={(e) => {
                    const masked = formatPhone(e.target.value);
                    setValue(`phones.${idx}.number` as const, masked, {
                      shouldValidate: true,
                    });
                  }}
                />
                {errors.phones?.[idx]?.number && (
                  <span className="text-sm text-red-500">
                    {errors.phones[idx]?.number?.message}
                  </span>
                )}
              </div>

              {idx !== 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => remove(idx)}

                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
              onClick={() => append({ number: '', phoneType: TipoTelefone.Celular })}
            >
              + Add Telefone
            </Button>
          </div>

          {errors.phones && typeof errors.phones?.message === 'string' && (
            <span className="text-sm text-red-500">{errors.phones.message}</span>
          )}
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
            name="inscricaoMunicipal"
            render={({ field }) => (
              <FormItem>
                <Label>Inscrição municipal</Label>
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
          <Label>Contato</Label>

          {storePhones.map((field, idx) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex flex-col min-w-32">
                <Label className="sr-only">Tipo</Label>
                <Controller
                  control={control}
                  name={`storePhones.${idx}.phoneType`}
                  render={({ field }) => (
                    <>
                      <Select
                        value={field.value as any}
                        onValueChange={(v: TipoTelefone) => field.onChange(v as TipoTelefone)}
                      >
                        <SelectTrigger className="w-32 rounded-md">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TipoTelefone.Celular}>Celular</SelectItem>
                          <SelectItem value={TipoTelefone.Telefone}>Telefone</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.storePhones?.[idx]?.phoneType && (
                        <span className="text-sm text-red-500">
                          {errors.storePhones[idx]?.phoneType?.message as string}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col flex-1">
                <Label className="sr-only">Número</Label>
                <Input
                  inputMode="numeric"
                  placeholder="(99) 99999-9999"
                  className="w-full"
                  {...register(`storePhones.${idx}.number` as const)}
                  onChange={(e) => {
                    const masked = formatPhone(e.target.value);
                    setValue(`storePhones.${idx}.number` as const, masked, {
                      shouldValidate: true,
                    });
                  }}
                />
                {errors.storePhones?.[idx]?.number && (
                  <span className="text-sm text-red-500">
                    {errors.storePhones[idx]?.number?.message}
                  </span>
                )}
              </div>
              {idx !== 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeStorePhone(idx)}

                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
              onClick={() => appendStorePhone({ number: '', phoneType: TipoTelefone.Celular })}
            >
              + Add Telefone
            </Button>

          </div>

          {errors.phones && typeof errors.phones?.message === 'string' && (
            <span className="text-sm text-red-500">{errors.phones.message}</span>
          )}
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
  );
}
