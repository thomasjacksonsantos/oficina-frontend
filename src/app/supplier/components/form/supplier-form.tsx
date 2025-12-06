'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Labels are handled by FloatingInput's label prop or native html <label> elements
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Route, useRouter, useParams } from '@tanstack/react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { supplierSchema, type CreateSupplierSchema } from './supplier.schema';
import { toast, Toaster } from 'sonner';
import { useCreateSupplier } from '@/app/supplier/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { useSupplierContext } from '../list/supplier-context';
import { FloatingInput } from '@/components/ui/floating-input';

export default function SupplierForm() {
  const router = useRouter();
  const { setRegisteringSupplier, registeringSupplier } = useSupplierContext();
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
      emailFornecedor: '',
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
      tipoConsumidor: 'ConsumidorFinal',
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
          setRegisteringSupplier(null);
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
      <Dialog open={!!registeringSupplier} onOpenChange={() => setRegisteringSupplier(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Fornecedor</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Separator className="my-4" />

            {/* Informações Básicas */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Informações Básicas</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="nomeFantasia"
                    {...register('nomeFantasia')}
                    label="Nome Fantasia"
                    className="rounded-md"
                  />
                  {errors.nomeFantasia && (
                    <span className="text-sm text-red-500">{errors.nomeFantasia.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="razaoSocial"
                    {...register('razaoSocial')}
                    label="Razão Social"
                    className="rounded-md"
                  />
                  {errors.razaoSocial && (
                    <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="documento"
                    {...register('documento')}
                    label="CPF/CNPJ"
                    className="rounded-md"
                  />
                  {errors.documento && (
                    <span className="text-sm text-red-500">{errors.documento.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="dataNascimento"
                    {...register('dataNascimento')}
                    type="date"
                    className="peer appearance-none bg-white border border-gray-300 rounded px-3 py-2"
                    label=" "
                    defaultValue="00/00/0000"
                  />
                  {errors.dataNascimento && (
                    <span className="text-sm text-red-500">{errors.dataNascimento.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="inscricaoEstadual"
                    {...register('inscricaoEstadual')}
                    label="Inscrição Estadual"
                    className="rounded-md"
                  />
                  {errors.inscricaoEstadual && (
                    <span className="text-sm text-red-500">{errors.inscricaoEstadual.message}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Contato */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Contato</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="email"
                    {...register('emailFornecedor')}
                    type="email"
                    label="Email"
                    className="rounded-md"
                  />
                  {errors.emailFornecedor && (
                    <span className="text-sm text-red-500">{errors.emailFornecedor.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="site"
                    {...register('site')}
                    label="Site"
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
                  <div className="text-sm font-medium">Telefones</div>
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
                      <FloatingInput
                        {...register(`contatos.${index}.tipoTelefone`)}
                        label="Tipo Telefone"
                        className="rounded-md"
                      />
                      {errors.contatos?.[index]?.tipoTelefone && (
                        <span className="text-sm text-red-500">
                          {errors.contatos[index]?.tipoTelefone?.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <FloatingInput
                        {...register(`contatos.${index}.numero`)}
                        label="Número"
                        className="rounded-md"
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

            <Separator className="my-4" />

            {/* Endereço */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Endereço</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="cep"
                    {...register('endereco.cep')}
                    className="rounded-md"
                    label="CEP"
                  />
                  {errors.endereco?.cep && (
                    <span className="text-sm text-red-500">{errors.endereco.cep.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <FloatingInput
                    id="logradouro"
                    {...register('endereco.logradouro')}
                    placeholder="Rua Exemplo"
                    label="Logradouro"
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
                  <FloatingInput
                    id="numero"
                    {...register('endereco.numero')}
                    label="Número"
                    className="rounded-md"
                  />
                  {errors.endereco?.numero && (
                    <span className="text-sm text-red-500">{errors.endereco.numero.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <FloatingInput
                    id="complemento"
                    {...register('endereco.complemento')}
                    label="Complemento"
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
                  <FloatingInput
                    id="bairro"
                    {...register('endereco.bairro')}
                    label="Bairro"
                    className="rounded-md"
                  />
                  {errors.endereco?.bairro && (
                    <span className="text-sm text-red-500">{errors.endereco.bairro.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="cidade"
                    {...register('endereco.cidade')}
                    label="Cidade"
                    className="rounded-md"
                  />
                  {errors.endereco?.cidade && (
                    <span className="text-sm text-red-500">{errors.endereco.cidade.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="estado"
                    {...register('endereco.estado')}
                    label="Estado"
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

            <Separator className="my-4" />

            {/* Informações Fiscais */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Informações Fiscais</h3>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="inscricaoMunicipal"
                  {...register('inscricaoMunicipal')}
                  label="Inscrição Municipal"
                  className="rounded-md"
                />
                {errors.inscricaoMunicipal && (
                  <span className="text-sm text-red-500">{errors.inscricaoMunicipal.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tipo Consumidor</div>
                <RadioGroup
                  value={watch('tipoConsumidor')}
                  onValueChange={(value) => setValue('tipoConsumidor', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ConsumidorFinal" id="consumidor-final" />
                    <label htmlFor="consumidor-final" className="font-normal">
                      Consumidor Final
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Revenda" id="revenda" />
                    <label htmlFor="revenda" className="font-normal">
                      Revenda
                    </label>
                  </div>
                </RadioGroup>
                {errors.tipoConsumidor && (
                  <span className="text-sm text-red-500">{errors.tipoConsumidor.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Indicador de I.E</div>
                <RadioGroup
                  value={watch('indicadorIE')}
                  onValueChange={(value) => setValue('indicadorIE', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contribuinte de ICMS (COM IE)" id="com-ie" />
                    <label htmlFor="com-ie" className="font-normal">
                      Contribuinte de ICMS (COM IE)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ContribuinteIsentoICMS" id="sem-ie" />
                    <label htmlFor="sem-ie" className="font-normal">
                      Contribuinte Isento de ICMS (Sem IE)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Não Contribuinte de ICMS (Com ou sem IE)"
                      id="nao-contribuinte"
                    />
                    <label htmlFor="nao-contribuinte" className="font-normal">
                      Não Contribuinte de ICMS (Com ou sem IE)
                    </label>
                  </div>
                </RadioGroup>
                {errors.indicadorIE && (
                  <span className="text-sm text-red-500">{errors.indicadorIE.message}</span>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setRegisteringSupplier(null)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Salvando...' : 'Salvar Veículo'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
