"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

import {
  CreateCustomerInput,
  Sexo,
  TipoDocumento,
} from "@/api/customers.types";
import { TipoTelefone } from "@/api/contato.types";

import { customerSchema, type CreateCustomerSchema } from "./customer.schema";

import { useCreateCustomer } from "@/app/customer/api";
import { useGetCep } from "@/app/customer/api";

import { formatCpfCnpj } from "@/helpers/formatCpfCnpj";
import { formatPhone } from "@/helpers/formatPhone";
import { formatCep } from "@/helpers/formatCep";
import { formatBirthDate } from "@/helpers/formatBirthDate";
import { formatToIso } from "@/helpers/formatDate";
import { useEffect, useState } from "react";

export default function CustomerForm() {
  const [cep, setCep] = useState<string>('');

  const { isPending, mutateAsync: createCustomer } = useCreateCustomer();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CreateCustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      dataNascimento: "",
      contatos: [{ numero: "", tipoTelefone: TipoTelefone.Celular }],
      endereco: {
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contatos",
  });

  const { data: cepData, isLoading: isLoadingCep } = useGetCep(cep);

  // Preencher os campos automaticamente quando cepData chegar
  useEffect(() => {
    if (cepData) {
      setValue("endereco.logradouro", cepData.logradouro || "", {
        shouldValidate: true,
      });
      setValue("endereco.bairro", cepData.bairro || "", {
        shouldValidate: true,
      });
      setValue("endereco.cidade", cepData.cidade || "", {
        shouldValidate: true,
      });
      setValue("endereco.estado", cepData.estado || "", {
        shouldValidate: true,
      });
      setValue("endereco.pais", cepData.pais || "Brasil", {
        shouldValidate: true,
      });
    }
  }, [cepData, setValue]);

  const handleBuscarCep = () => {
    const cepValue = watch("endereco.cep").replace(/\D/g, "");

    if (cepValue.length !== 8) {
      alert("CEP inválido. Deve conter 8 dígitos.");
      return;
    }

    // Dispara a busca setando o cep
    setCep(cepValue);
  };

  const onSubmit = async (data: CreateCustomerSchema) => {
    const create: CreateCustomerInput = {
      ...data,
      dataNascimento: formatToIso(data.dataNascimento),
      contatos: data.contatos.map((c) => ({
        ...c,
        ddd: "",
      })),
    };

    await createCustomer(create);

    console.log("Submitting data:", create);
    alert("Form submetido! Veja o console para os dados.");
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="rounded-lg">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-nome">Nome</Label>
                  <Input
                    id="cliente-nome"
                    placeholder="Nome"
                    className="rounded-md"
                    {...register("nome")}
                  />
                  {errors.nome && (
                    <span className="text-sm text-red-500">
                      {errors.nome.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-razaoSocial">Razão Social</Label>
                  <Input
                    id="cliente-razaoSocial"
                    placeholder="Razão Social"
                    className="rounded-md"
                    {...register("razaoSocial")}
                  />
                  {errors.razaoSocial && (
                    <span className="text-sm text-red-500">
                      {errors.razaoSocial.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-documento">CPF | CNPJ</Label>
                  <Input
                    id="cliente-documento"
                    inputMode="numeric"
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className="rounded-md"
                    {...register("documento")}
                    onChange={(e) => {
                      const masked = formatCpfCnpj(e.target.value);
                      setValue("documento", masked, { shouldValidate: true });
                    }}
                  />
                  {errors.documento && (
                    <span className="text-sm text-red-500">
                      {errors.documento.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-email">Email</Label>
                  <Input
                    id="cliente-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    className="rounded-md"
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Sexo</Label>
                  <Controller
                    control={control}
                    name="sexo"
                    render={({ field }) => (
                      <>
                        <Select
                          value={field.value as any}
                          onValueChange={(v: Sexo) => field.onChange(v as Sexo)}
                        >
                          <SelectTrigger className="rounded-md w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(Sexo).map((sx) => (
                              <SelectItem key={sx} value={sx}>
                                {sx}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.sexo && (
                          <span className="text-sm text-red-500">
                            {errors.sexo.message as string}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-dataNasc">Data de Nascimento</Label>
                  <Input
                    id="cliente-dataNasc"
                    className="rounded-md"
                    {...register("dataNascimento")}
                    onChange={(e) => {
                      const masked = formatBirthDate(e.target.value);
                      setValue("dataNascimento", masked, { shouldValidate: true });
                    }}
                  />
                  {errors.dataNascimento && (
                    <span className="text-sm text-red-500">
                      {errors.dataNascimento.message as string}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Contato</Label>

              {fields.map((field, idx) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex flex-col min-w-32">
                    <Label className="sr-only">Tipo</Label>
                    <Controller
                      control={control}
                      name={`contatos.${idx}.tipoTelefone`}
                      render={({ field }) => (
                        <>
                          <Select
                            value={field.value as any}
                            onValueChange={(v: TipoTelefone) =>
                              field.onChange(v as TipoTelefone)
                            }
                          >
                            <SelectTrigger className="w-32 rounded-md">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={TipoTelefone.Celular}>
                                Celular
                              </SelectItem>
                              <SelectItem value={TipoTelefone.Telefone}>
                                Telefone
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.contatos?.[idx]?.tipoTelefone && (
                            <span className="text-sm text-red-500">
                              {
                                errors.contatos[idx]?.tipoTelefone
                                  ?.message as string
                              }
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
                      {...register(`contatos.${idx}.numero` as const)}
                      onChange={(e) => {
                        const masked = formatPhone(e.target.value);
                        setValue(`contatos.${idx}.numero` as const, masked, {
                          shouldValidate: true,
                        });
                      }}
                    />
                    {errors.contatos?.[idx]?.numero && (
                      <span className="text-sm text-red-500">
                        {errors.contatos[idx]?.numero?.message}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => remove(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                  onClick={() =>
                    append({ numero: "", tipoTelefone: TipoTelefone.Celular })
                  }
                >
                  + Add Telefone
                </Button>
              </div>

              {errors.contatos &&
                typeof errors.contatos?.message === "string" && (
                  <span className="text-sm text-red-500">
                    {errors.contatos.message}
                  </span>
                )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-cep">CEP</Label>
                  <Input
                    id="cliente-cep"
                    inputMode="numeric"
                    placeholder="00000-000"
                    className="w-full sm:w-auto"
                    {...register("endereco.cep")}
                    onChange={(e) =>
                      setValue("endereco.cep", formatCep(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                  />
                  {errors.endereco?.cep && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.cep.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <Button
                    id="cliente-buscar-cep"
                    type="button"
                    className="w-auto"
                    disabled={isLoadingCep || watch("endereco.cep").replace(/\D/g, "").length !== 8}
                    onClick={handleBuscarCep}
                  >
                    Buscar Cep
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-logradouro">Logradouro</Label>
                  <Input
                    id="cliente-logradouro"
                    placeholder="Informe o logradouro"
                    className="rounded-md"
                    {...register("endereco.logradouro")}
                  />
                  {errors.endereco?.logradouro && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.logradouro.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-numero">Número</Label>
                  <Input
                    id="cliente-numero"
                    placeholder="Informe o número"
                    className="rounded-md"
                    {...register("endereco.numero")}
                  />
                  {errors.endereco?.numero && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.numero.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-complemento">Complemento</Label>
                  <Input
                    id="cliente-complemento"
                    placeholder="Informe o complemento"
                    className="rounded-md"
                    {...register("endereco.complemento")}
                  />
                  {errors.endereco?.complemento && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.complemento.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-bairro">Bairro</Label>
                  <Input
                    id="cliente-bairro"
                    placeholder="Informe o bairro"
                    className="rounded-md"
                    {...register("endereco.bairro")}
                  />
                  {errors.endereco?.bairro && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.bairro.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-estado">Estado</Label>
                  <Input
                    id="cliente-estado"
                    placeholder="Informe o estado"
                    className="rounded-md"
                    {...register("endereco.estado")}
                  />
                  {errors.endereco?.estado && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.estado.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-cidade">Cidade</Label>
                  <Input
                    id="cliente-cidade"
                    placeholder="Informe a cidade"
                    className="rounded-md"
                    {...register("endereco.cidade")}
                  />
                  {errors.endereco?.cidade && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.cidade.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-pais">País</Label>
                  <Input
                    id="cliente-pais"
                    placeholder="Informe o país"
                    className="rounded-md"
                    {...register("endereco.pais")}
                  />
                  {errors.endereco?.pais && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.pais.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" className="w-auto" type="button">
              Voltar
            </Button>
            <Button type="submit" className="w-auto" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
