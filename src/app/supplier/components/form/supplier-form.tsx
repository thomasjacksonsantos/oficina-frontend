'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Route, useRouter, useParams } from '@tanstack/react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { supplierSchema, type CreateSupplierSchema } from './supplier.schema';
import { toast, Toaster } from 'sonner';
import { useCreateSupplier } from '@/app/supplier/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';

export default function SupplierForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateSupplierSchema>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nomeFantasia: '',
      razaoSocial: '',
      documento: '',
      dataNascimento: '',
      email: '',
      site: '',
      contatos: [{ numero: '', tipoTelefone: '' }],
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil',
      },
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      tipoConsumidor: 'Consumidor Final',
      indicadorIE: 'Contribuinte de ICMS (COM IE)',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contatos',
  });

  const { mutate: createSupplier, isPending } = useCreateSupplier();

  const onSubmit = (data: CreateSupplierSchema) => {
    createSupplier(data as any, {
      onSuccess: (result) => {
        if (result) {
          toast.success('Fornecedor criado com sucesso!');
          router.navigate({ to: '/fornecedores' });
        } else {
          toast.error('Erro ao criar fornecedor');
        }
      },
      onError: (error: any) => {
        console.error('Create error:', error);
        toast.error('Erro ao criar fornecedor');
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="rounded-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Novo Fornecedor</h2>
              </div>
            </div>

            <Separator />

            {/* Informações Básicas */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Informações Básicas</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input
                    id="nomeFantasia"
                    {...register('nomeFantasia')}
                    placeholder="Nome fantasia da empresa"
                    className="rounded-md"
                  />
                  {errors.nomeFantasia && (
                    <span className="text-sm text-red-500">{errors.nomeFantasia.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    {...register('razaoSocial')}
                    placeholder="Razão social da empresa"
                    className="rounded-md"
                  />
                  {errors.razaoSocial && (
                    <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="documento">CPF/CNPJ</Label>
                  <Input
                    id="documento"
                    {...register('documento')}
                    placeholder="01010101011001"
                    className="rounded-md"
                    maxLength={14}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue('documento', value, { shouldValidate: true });
                    }}
                  />
                  {errors.documento && (
                    <span className="text-sm text-red-500">{errors.documento.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dataNascimento">Data de Abertura</Label>
                  <Input
                    id="dataNascimento"
                    {...register('dataNascimento')}
                    type="date"
                    className="rounded-md"
                  />
                  {errors.dataNascimento && (
                    <span className="text-sm text-red-500">{errors.dataNascimento.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="inscricaoEstadual">I.E</Label>
                  <Input
                    id="inscricaoEstadual"
                    {...register('inscricaoEstadual')}
                    placeholder="Inscrição Estadual"
                    className="rounded-md"
                  />
                  {errors.inscricaoEstadual && (
                    <span className="text-sm text-red-500">{errors.inscricaoEstadual.message}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contato */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Contato</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="contato@empresa.com"
                    className="rounded-md"
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">{errors.email.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    {...register('site')}
                    placeholder="www.empresa.com"
                    className="rounded-md"
                  />
                  {errors.site && (
                    <span className="text-sm text-red-500">{errors.site.message}</span>
                  )}
                </div>
              </div>

              {/* Telefones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Telefones</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ numero: '', tipoTelefone: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Telefone
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        {...register(`contatos.${index}.tipoTelefone`)}
                        placeholder="Tipo"
                        className="rounded-md"
                      />
                      {errors.contatos?.[index]?.tipoTelefone && (
                        <span className="text-sm text-red-500">
                          {errors.contatos[index]?.tipoTelefone?.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        {...register(`contatos.${index}.numero`)}
                        placeholder="Número"
                        className="rounded-md"
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setValue(`contatos.${index}.numero`, value, { shouldValidate: true });
                        }}
                      />
                      {errors.contatos?.[index]?.numero && (
                        <span className="text-sm text-red-500">
                          {errors.contatos[index]?.numero?.message}
                        </span>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Endereço</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    {...register('endereco.cep')}
                    placeholder="01310100"
                    className="rounded-md"
                    maxLength={8}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue('endereco.cep', value, { shouldValidate: true });
                    }}
                  />
                  {errors.endereco?.cep && (
                    <span className="text-sm text-red-500">{errors.endereco.cep.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    {...register('endereco.logradouro')}
                    placeholder="Av. Paulista"
                    className="rounded-md"
                  />
                  {errors.endereco?.logradouro && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.logradouro.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    {...register('endereco.numero')}
                    placeholder="1000"
                    className="rounded-md"
                  />
                  {errors.endereco?.numero && (
                    <span className="text-sm text-red-500">{errors.endereco.numero.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    {...register('endereco.complemento')}
                    placeholder="Sala 101"
                    className="rounded-md"
                  />
                  {errors.endereco?.complemento && (
                    <span className="text-sm text-red-500">
                      {errors.endereco.complemento.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    {...register('endereco.bairro')}
                    placeholder="Centro"
                    className="rounded-md"
                  />
                  {errors.endereco?.bairro && (
                    <span className="text-sm text-red-500">{errors.endereco.bairro.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    {...register('endereco.cidade')}
                    placeholder="São Paulo"
                    className="rounded-md"
                  />
                  {errors.endereco?.cidade && (
                    <span className="text-sm text-red-500">{errors.endereco.cidade.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    {...register('endereco.estado')}
                    placeholder="SP"
                    className="rounded-md"
                    maxLength={2}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      setValue('endereco.estado', upper, { shouldValidate: true });
                    }}
                  />
                  {errors.endereco?.estado && (
                    <span className="text-sm text-red-500">{errors.endereco.estado.message}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações Fiscais */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Informações Fiscais</h3>

              <div className="flex flex-col gap-2">
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  {...register('inscricaoMunicipal')}
                  placeholder="Inscrição Municipal"
                  className="rounded-md"
                />
                {errors.inscricaoMunicipal && (
                  <span className="text-sm text-red-500">{errors.inscricaoMunicipal.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tipo Consumidor</Label>
                <RadioGroup
                  value={watch('tipoConsumidor')}
                  onValueChange={(value) => setValue('tipoConsumidor', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Consumidor Final" id="consumidor-final" />
                    <Label htmlFor="consumidor-final" className="font-normal">
                      Consumidor Final
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Revenda" id="revenda" />
                    <Label htmlFor="revenda" className="font-normal">
                      Revenda
                    </Label>
                  </div>
                </RadioGroup>
                {errors.tipoConsumidor && (
                  <span className="text-sm text-red-500">{errors.tipoConsumidor.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label>Indicador de I.E</Label>
                <RadioGroup
                  value={watch('indicadorIE')}
                  onValueChange={(value) => setValue('indicadorIE', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contribuinte de ICMS (COM IE)" id="com-ie" />
                    <Label htmlFor="com-ie" className="font-normal">
                      Contribuinte de ICMS (COM IE)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contribuinte Isento de ICMS (Sem IE)" id="sem-ie" />
                    <Label htmlFor="sem-ie" className="font-normal">
                      Contribuinte Isento de ICMS (Sem IE)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Não Contribuinte de ICMS (Com ou sem IE)"
                      id="nao-contribuinte"
                    />
                    <Label htmlFor="nao-contribuinte" className="font-normal">
                      Não Contribuinte de ICMS (Com ou sem IE)
                    </Label>
                  </div>
                </RadioGroup>
                {errors.indicadorIE && (
                  <span className="text-sm text-red-500">{errors.indicadorIE.message}</span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  router.navigate({ to: '/fornecedores' });
                }}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Fornecedor'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
