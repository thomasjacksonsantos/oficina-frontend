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
import { useForm, useFieldArray } from 'react-hook-form';
import { supplierSchema, type CreateSupplierSchema } from './supplier.schema';
import { toast } from 'sonner';
import { useSupplierContext } from '../list/supplier-context';
import { useUpdateSupplier } from '@/app/supplier/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
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

  React.useEffect(() => {
    if (editingSupplier) {
      reset({
        nomeFantasia: editingSupplier.nomeFantasia || '',
        razaoSocial: editingSupplier.razaoSocial || '',
        documento: editingSupplier.documento || '',
        dataNascimento: editingSupplier.dataNascimento || '',
        email: editingSupplier.email || '',
        site: editingSupplier.site || '',
        contatos: editingSupplier.contatos || [{ numero: '', tipoTelefone: '' }],
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

  const onSubmit = (data: CreateSupplierSchema) => {
    if (!editingSupplier?.id) {
      toast.error('ID do fornecedor não encontrado');
      return;
    }

    console.log('Submitting update for supplier ID:', editingSupplier.id);
    console.log('Data:', data);

    updateSupplier(
      {
        supplier: data,
        id: editingSupplier.id
      },
      {
        onSuccess: () => {
          toast.success('Fornecedor atualizado com sucesso!');
          setEditingSupplier(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);
          
          const fieldMapping: Record<string, string> = {
            nomeFantasia: 'nomeFantasia',
            razaoSocial: 'razaoSocial',
            documento: 'documento',
            dataNascimento: 'dataNascimento',
            email: 'email',
            site: 'site',
            inscricaoEstadual: 'inscricaoEstadual',
            inscricaoMunicipal: 'inscricaoMunicipal',
            tipoConsumidor: 'tipoConsumidor',
            indicadorIE: 'indicadorIE',
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
            toast.error('Erro de validação nos dados');
          } else {
            toast.error(errorData?.message || 'Erro ao atualizar fornecedor');
          }
        },
      }
    );
  };

  if (!editingSupplier) return null;

  return (
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
                  <FloatingInput
                    id="edit-nomeFantasia"
                    {...register('nomeFantasia')}
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
                    label="Razão Social"
                  />
                  {errors.razaoSocial && (
                    <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-documento"
                    {...register('documento')}
                    maxLength={14}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue('documento', value, { shouldValidate: true });
                    }}
                    label="CPF/CNPJ"
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
                    {...register('dataNascimento')}
                    type="date"
                    defaultValue={'00/00/0000'}
                    label='Data de Abertura'
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
                  <FloatingInput
                    id="edit-email"
                    {...register('email')}
                    type="email"
                    label="Email"
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">{errors.email.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-site"
                    {...register('site')}
                    label="Site"
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
                      <FloatingInput
                        {...register(`contatos.${index}.tipoTelefone`)}
                        label="Tipo"
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
                  <FloatingInput
                    id="edit-cep"
                    {...register('endereco.cep')}
                    label="CEP"
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
                  <FloatingInput
                    id="edit-logradouro"
                    {...register('endereco.logradouro')}
                    label="Logradouro"
                  />
                  {errors.endereco?.logradouro && (
                    <span className="text-sm text-red-500">{errors.endereco.logradouro.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-numero"
                    {...register('endereco.numero')}
                    label='Número'
                  />
                  {errors.endereco?.numero && (
                    <span className="text-sm text-red-500">{errors.endereco.numero.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <FloatingInput
                    id="edit-complemento"
                    {...register('endereco.complemento')}
                    label="Complemento"
                    placeholder="Sala 101"
                  />
                  {errors.endereco?.complemento && (
                    <span className="text-sm text-red-500">{errors.endereco.complemento.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-bairro"
                    {...register('endereco.bairro')}
                    label="Bairro"
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
                  />
                  {errors.endereco?.cidade && (
                    <span className="text-sm text-red-500">{errors.endereco.cidade.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-estado"
                    {...register('endereco.estado')}
                    label="Estado"
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
                <FloatingInput
                  id="edit-inscricaoMunicipal"
                  {...register('inscricaoMunicipal')}
                  label="Inscrição Municipal"
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
                    <RadioGroupItem value="Contribuinte de ICMS (COM IE)" id="edit-com-ie" />
                    <Label htmlFor="edit-com-ie" className="font-normal">
                      Contribuinte de ICMS (COM IE)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contribuinte Isento de ICMS (Sem IE)" id="edit-sem-ie" />
                    <Label htmlFor="edit-sem-ie" className="font-normal">
                      Contribuinte Isento de ICMS (Sem IE)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não Contribuinte de ICMS (Com ou sem IE)" id="edit-nao-contribuinte" />
                    <Label htmlFor="edit-nao-contribuinte" className="font-normal">
                      Não Contribuinte de ICMS (Com ou sem IE)
                    </Label>
                  </div>
                </RadioGroup>
                {errors.indicadorIE && (
                  <span className="text-sm text-red-500">{errors.indicadorIE.message}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
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
  );
}