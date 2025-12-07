'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { supplierSchema, type CreateSupplierSchema } from './supplier.schema';
import { toast, Toaster } from 'sonner';
import { useSupplierContext } from '../list/supplier-context';
import { useUpdateSupplier, useGetCep } from '@/app/supplier/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2 } from 'lucide-react';
import { formatCep } from '@/helpers/formatCep';
import { formatPhone } from '@/helpers/formatPhone';
import { formatBirthDate } from '@/helpers/formatBirthDate';
import { formatToIso } from '@/helpers/formatDate';
import { useEffect, useState } from 'react';
import { FloatingInput } from '@/components/ui/floating-input';

export default function SupplierEditDialog() {
  const { editingSupplier, setEditingSupplier } = useSupplierContext();
  const { mutate: updateSupplier, isPending } = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSupplierSchema>({
    resolver: zodResolver(supplierSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contatos',
  });

  const [cep, setCep] = useState<string>('');
  const { data: cepData, isLoading: isLoadingCep } = useGetCep(cep);

  // Auto-fill address fields when CEP data arrives
  useEffect(() => {
    if (cepData) {
      setValue('endereco.logradouro', cepData.logradouro || '', {
        shouldValidate: true,
      });
      setValue('endereco.bairro', cepData.bairro || '', {
        shouldValidate: true,
      });
      setValue('endereco.cidade', cepData.cidade || '', {
        shouldValidate: true,
      });
      setValue('endereco.estado', cepData.estado || '', {
        shouldValidate: true,
      });
      setValue('endereco.pais', cepData.pais || 'Brasil', {
        shouldValidate: true,
      });
    }
  }, [cepData, setValue]);

  const handleBuscarCep = () => {
    const cepValue = watch('endereco.cep').replace(/\D/g, '');

    if (cepValue.length !== 8) {
      toast.error('CEP inválido. Deve conter 8 dígitos.');
      return;
    }

    setCep(cepValue);
  };

  React.useEffect(() => {
    if (editingSupplier) {
      reset({
        nomeFantasia: editingSupplier.nomeFantasia || '',
        razaoSocial: editingSupplier.razaoSocial || '',
        documento: editingSupplier.documento || '',
        dataNascimento: editingSupplier.dataNascimento || '',
        emailFornecedor: editingSupplier.emailFornecedor || '',
        site: editingSupplier.site || '',
        contatos: editingSupplier.contatos || [{ numero: '', tipoTelefone: 'Comercial' }],
        endereco: {
          cep: editingSupplier.endereco?.cep || '',
          logradouro: editingSupplier.endereco?.logradouro || '',
          numero: editingSupplier.endereco?.numero || '',
          complemento: editingSupplier.endereco?.complemento || '',
          bairro: editingSupplier.endereco?.bairro || '',
          cidade: editingSupplier.endereco?.cidade || '',
          estado: editingSupplier.endereco?.estado || '',
          pais: editingSupplier.endereco?.pais || 'Brasil',
        },
        inscricaoEstadual: editingSupplier.inscricaoEstadual || '',
        inscricaoMunicipal: editingSupplier.inscricaoMunicipal || '',
        tipoConsumidor: editingSupplier.tipoConsumidor || 'Consumidor Final',
        indicadorIE: editingSupplier.indicadorIE || 'Contribuinte de ICMS (COM IE)',
      });
    }
  }, [editingSupplier, reset]);

  const onSubmit = async (data: CreateSupplierSchema) => {
    if (!editingSupplier?.id) {
      toast.error('ID do fornecedor não encontrado');
      return;
    }

    const submitData = {
      ...data,
      dataNascimento: formatToIso(data.dataNascimento),
    };

    await updateSupplier(
      {
        supplier: submitData,
        id: editingSupplier.id,
      },
      {
        onSuccess: () => {
          toast.success('Fornecedor atualizado com sucesso!');
          setEditingSupplier(null);
        },
        onError: (error: any) => {
          const fieldMapping: Record<string, string> = {
            'fornecedor.NomeFantasia': 'nomeFantasia',
            'fornecedor.RazaoSocial': 'razaoSocial',
            'fornecedor.Documento': 'documento',
            'fornecedor.DataNascimento': 'dataNascimento',
            'fornecedor.Email': 'email',
            'fornecedor.Site': 'site',
            'fornecedor.InscricaoEstadual': 'inscricaoEstadual',
            'fornecedor.InscricaoMunicipal': 'inscricaoMunicipal',
            'fornecedor.TipoConsumidor': 'tipoConsumidor',
            'fornecedor.IndicadorIE': 'indicadorIE',
            'endereco.Cep': 'endereco.cep',
            'endereco.Logradouro': 'endereco.logradouro',
            'endereco.Numero': 'endereco.numero',
            'endereco.Complemento': 'endereco.complemento',
            'endereco.Bairro': 'endereco.bairro',
            'endereco.Cidade': 'endereco.cidade',
            'endereco.Estado': 'endereco.estado',
            'endereco.Pais': 'endereco.pais',
          };

          const errorData = error.response?.data;

          if (errorData?.errors) {
            Object.entries(errorData.errors).forEach(([apiField, messages]) => {
              const formField = fieldMapping[apiField];
              if (formField && Array.isArray(messages) && messages.length > 0) {
                setError(formField as any, {
                  type: 'manual',
                  message: messages[0],
                });
              }
            });
            toast.error('Erro de validação', {
              description: 'Erro(s) encontrados nos dados enviados.',
            });
          } else {
            toast.error(errorData?.message || 'Erro ao atualizar fornecedor');
          }
        },
      }
    );
  };

  if (!editingSupplier) return null;

  return (
    <>
      <Toaster position="top-right" richColors />
      <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Separator className="my-4" />

            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Informações Básicas</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-nomeFantasia">Nome Fantasia</Label>
                    <FloatingInput
                      id="edit-nomeFantasia"
                      {...register('nomeFantasia')}
                      className="rounded-md"
                      label="Nome Fantasia"
                    />
                    {errors.nomeFantasia && (
                      <span className="text-sm text-red-500">{errors.nomeFantasia.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-razaoSocial"
                      {...register('razaoSocial')}
                      className="rounded-md"
                      label="Razão Social"
                    />
                    {errors.razaoSocial && (
                      <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-documento"
                      inputMode="numeric"
                      {...register('documento')}
                      label="CPF/CNPJ"
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
                    <FloatingInput
                      id="edit-dataNascimento"
                      label="Data de Abertura"
                      className="rounded-md bg-transparent"
                      {...register('dataNascimento')}
                      onChange={(e) => {
                        const masked = formatBirthDate(e.target.value);
                        setValue('dataNascimento', masked, { shouldValidate: true });
                      }}
                    />
                    {errors.dataNascimento && (
                      <span className="text-sm text-red-500">{errors.dataNascimento.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-inscricaoEstadual"
                      {...register('inscricaoEstadual')}
                      label="Inscrição Estadual"
                      className="rounded-md"
                    />
                    {errors.inscricaoEstadual && (
                      <span className="text-sm text-red-500">
                        {errors.inscricaoEstadual.message}
                      </span>
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
                    <FloatingInput
                      id="edit-email"
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
                      id="edit-site"
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
                  <Label>Telefones</Label>
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <div className="flex flex-col min-w-32">
                        <Label className="sr-only">Tipo</Label>
                        <Controller
                          control={control}
                          name={`contatos.${idx}.tipoTelefone`}
                          render={({ field }) => (
                            <>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-32 rounded-md">
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Comercial">Comercial</SelectItem>
                                  <SelectItem value="Celular">Celular</SelectItem>
                                  <SelectItem value="Residencial">Residencial</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.contatos?.[idx]?.tipoTelefone && (
                                <span className="text-sm text-red-500">
                                  {errors.contatos[idx]?.tipoTelefone?.message as string}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <FloatingInput
                          inputMode="numeric"
                          label="Número"
                          className="rounded-md"
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
                      <Button variant="ghost" size="icon" type="button" onClick={() => remove(idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                      onClick={() => append({ numero: '', tipoTelefone: 'Comercial' })}
                    >
                      + Add Telefone
                    </Button>
                  </div>

                  {errors.contatos && typeof errors.contatos?.message === 'string' && (
                    <span className="text-sm text-red-500">{errors.contatos.message}</span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Endereço */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Endereço</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-cep"
                      inputMode="numeric"
                      {...register('endereco.cep')}
                      label="CEP"
                      className="rounded-md"
                      onChange={(e) =>
                        setValue('endereco.cep', formatCep(e.target.value), {
                          shouldValidate: true,
                        })
                      }
                    />
                    {/* {errors.endereco?.cep && (
                      <span className="text-sm text-red-500">{errors.endereco.cep.message}</span>
                    )} */}
                  </div>
                  <div className="flex flex-col gap-2 justify-end">
                    <Button
                      id="edit-buscar-cep"
                      type="button"
                      className="w-auto rounded-md"
                      disabled={
                        isLoadingCep || watch('endereco.cep')?.replace(/\D/g, '').length !== 8
                      }
                      onClick={handleBuscarCep}
                    >
                      {isLoadingCep ? 'Buscando...' : 'Buscar CEP'}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <FloatingInput
                      id="edit-logradouro"
                      {...register('endereco.logradouro')}
                      label="Logradouro"
                      className="rounded-md"
                    />
                    {errors.endereco?.logradouro && (
                      <span className="text-sm text-red-500">
                        {errors.endereco.logradouro.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-numero"
                      {...register('endereco.numero')}
                      label="Número"
                      className="rounded-md"
                    />
                    {errors.endereco?.numero && (
                      <span className="text-sm text-red-500">{errors.endereco.numero.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-complemento"
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

                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-bairro"
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
                      id="edit-cidade"
                      {...register('endereco.cidade')}
                      label="Cidade"
                      className="rounded-md"
                    />
                    {errors.endereco?.cidade && (
                      <span className="text-sm text-red-500">{errors.endereco.cidade.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-estado"
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

                  <div className="flex flex-col gap-2">
                    <FloatingInput
                      id="edit-pais"
                      {...register('endereco.pais')}
                      label="País"
                      className="rounded-md"
                    />
                    {errors.endereco?.pais && (
                      <span className="text-sm text-red-500">{errors.endereco.pais.message}</span>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informações Fiscais */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Informações Fiscais</h3>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-inscricaoMunicipal"
                    {...register('inscricaoMunicipal')}
                    label="Inscrição Municipal"
                    className="rounded-md"
                  />
                  {errors.inscricaoMunicipal && (
                    <span className="text-sm text-red-500">
                      {errors.inscricaoMunicipal.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tipo Consumidor</Label>
                  <Controller
                    control={control}
                    name="tipoConsumidor"
                    render={({ field }) => (
                      <>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Consumidor Final" id="edit-consumidor-final" />
                            <Label htmlFor="edit-consumidor-final" className="font-normal">
                              Consumidor Final
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Revenda" id="edit-revenda" />
                            <Label htmlFor="edit-revenda" className="font-normal">
                              Revenda
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.tipoConsumidor && (
                          <span className="text-sm text-red-500">
                            {errors.tipoConsumidor.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Indicador de I.E</Label>
                  <Controller
                    control={control}
                    name="indicadorIE"
                    render={({ field }) => (
                      <>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Contribuinte de ICMS (COM IE)"
                              id="edit-com-ie"
                            />
                            <Label htmlFor="edit-com-ie" className="font-normal">
                              Contribuinte de ICMS (COM IE)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Contribuinte Isento de ICMS (Sem IE)"
                              id="edit-sem-ie"
                            />
                            <Label htmlFor="edit-sem-ie" className="font-normal">
                              Contribuinte Isento de ICMS (Sem IE)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Não Contribuinte de ICMS (Com ou sem IE)"
                              id="edit-nao-contribuinte"
                            />
                            <Label htmlFor="edit-nao-contribuinte" className="font-normal">
                              Não Contribuinte de ICMS (Com ou sem IE)
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.indicadorIE && (
                          <span className="text-sm text-red-500">{errors.indicadorIE.message}</span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditingSupplier(null)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
