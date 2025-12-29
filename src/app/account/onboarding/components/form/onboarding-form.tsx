"use client";
import { toast, Toaster } from "sonner"
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
import { Divide, Plus, Trash2 } from "lucide-react";
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
import { useGetValidarDocumento } from "@/app/customer/api/use-get-validar-documento";
import { useGetCep } from "@/app/customer/api/use-get-cep";
import { formatCep } from "@/helpers/formatCep";


export default function OnboardingForm() {
  const [cep, setCep] = useState<string>('');
  const [documento, setDocumento] = useState<string>('');
  const [documentoError, setDocumentoError] = useState<string>('');
  const [rEmail, setREmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);

  const { mutate: signUp, isPending: isSignUpLoading } = useSignUp();

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

  const { data: validarDocumentoData, isLoading: isLoadingValidarDocumento } =
    useGetValidarDocumento(documento);

  useEffect(() => {
    if (validarDocumentoData) {
      if (!validarDocumentoData.documentoValido) {
        setDocumentoError(validarDocumentoData.mensagem);
      } else {
        setDocumentoError('');
        setValue('rDocument', formatCpfCnpj(documento), { shouldValidate: true });
      }
    }
  }, [validarDocumentoData, setValue]);

  const handleValidarDocumento = () => {
    const documentoValue = watch('rDocument').replace(/\D/g, '');

    if (documentoValue.length === 11 || documentoValue.length === 14) {
      setDocumento(documentoValue);
    }
  };

  const { data: validarEmailData, isLoading: isLoadingValidarEmail } =
    useValidateExistsEmail(rEmail);

  useEffect(() => {
    if (validarEmailData) {
      if (!validarEmailData?.valido) {
        console.log('validarEmailData', validarEmailData.mensagem);
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

  const { data: cepData, isLoading: isLoadingCep } = useGetCep(cep);

  // Preencher os campos automaticamente quando cepData chegar
  useEffect(() => {
    if (cepData) {
      setValue('street', cepData.logradouro || '', {
        shouldValidate: true,
      });
      setValue('neighborhood', cepData.bairro || '', {
        shouldValidate: true,
      });
      setValue('city', cepData.cidade || '', {
        shouldValidate: true,
      });
      setValue('state', cepData.estado || '', {
        shouldValidate: true,
      });
      setValue('country', cepData.pais || 'Brasil', {
        shouldValidate: true,
      });
    }
  }, [cepData, setValue]);

  const handleBuscarCep = () => {
    const cepValue = watch('zipCode').replace(/\D/g, '');

    if (cepValue.length !== 8) {
      alert('CEP inválido. Deve conter 8 dígitos.');
      return;
    }

    // Dispara a busca setando o cep
    setCep(cepValue);
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
    if (documentoError) {
      toast.error("Erro ao cadastrar", {
        description: "Por favor, verifique o documento informado."
      });
      return;
    }

    if (emailError) {
      toast.error("Erro ao cadastrar", {
        description: "Por favor, verifique o email informado."
      });
      return;
    }

    const response = await signUp(
      {
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
      },
      {
        onSuccess: (data) => {
          resetRegister();
          toast.success("Cadastro realizado com sucesso!", {
            description: "Verifique seu email para confirmar a conta."
          });
          window.location.href = "/signup-confirmation";
          return data;
        },
        onError: (error: any) => {
          const errorData = error.response?.data;

          // If the API returned structured validation errors, show them in an alert and toast
          if (errorData?.errors) {
            // Flatten messages into a list
            const messages: string[] = [];
            Object.entries(errorData.errors).forEach(([field, msgs]) => {
              if (Array.isArray(msgs) && msgs.length) {
                msgs.forEach((m) => messages.push(`${field}: ${m}`));
              } else if (typeof msgs === 'string') {
                messages.push(`${field}: ${msgs}`);
              }
            });

            if (messages.length) {
              setValidationErrors(messages);
              toast.error("Erro ao cadastrar", {
                description: messages.join('<br />'),
              });
              return;
            }
          }

          const errorMessage = errorData?.message || 'Erro ao salvar produtos';
          toast.error(errorMessage);
        }
      }
    );
  };

  const selectedSex = watch("biologicalSex");

  return (
    <Form {...registerForm}>
      <Toaster />
      {validationErrors && validationErrors.length > 0 && (
        <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-3">
          <div className="text-sm font-semibold text-red-700">Erros de validação</div>
          <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
            {validationErrors.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

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
                Documento (Cpf / Cnpj)
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
                  onBlur={handleValidarDocumento}
                />
              </FormControl>
              {(documentoError) && (
                <span className="text-sm text-red-400">
                  {documentoError}
                </span>
              ) || (<FormMessage />)}
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
              {(emailError) && (
                <span className="text-sm text-red-400">
                  {emailError}
                </span>
              ) || (<FormMessage />)}
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
                        <span className="text-sm text-red-400">
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
                  <span className="text-sm text-red-400">
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
            <span className="text-sm text-red-400">{errors.phones.message}</span>
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
        </div>
        {/* <div className="grid grid-cols-2 gap-2">
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
        </div> */}
        <div className="flex gap-2">
          <div>
            <FormField
              control={control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <Label>CEP</Label>
                  <FormControl>
                    <Input
                      type="text" {...field}
                      maxLength={9}
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatCep(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.zipCode && (
              <span className="text-sm text-red-400">{errors.zipCode.message}</span>
            ) || (<FormMessage />)}
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <Button
              id="cliente-buscar-cep"
              type="button"
              className="w-auto"
              disabled={isLoadingCep || watch('zipCode').replace(/\D/g, '').length !== 8}
              onClick={handleBuscarCep}
            >
              Buscar Cep
            </Button>
          </div>
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
                        <span className="text-sm text-red-400">
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
                  <span className="text-sm text-red-400">
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
            <span className="text-sm text-red-400">{errors.phones.message}</span>
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
