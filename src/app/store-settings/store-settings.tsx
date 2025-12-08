'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { storeSchema, type StoreFormSchema } from './store.schema';
import { toast, Toaster } from 'sonner';
import { useGetStore, useUpdateStore, useSearchCep, useGetCep } from './use-store';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { FloatingInput } from '@/components/ui/floating-input';
import { UpdateStoreInput } from '@/api/store.types';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { StoreContact } from '@/api/store.types';
import { formatCpfCnpj } from '@/helpers/formatCpfCnpj';
import { formatPhone } from '@/helpers/formatPhone';
import { formatCep } from '@/helpers/formatCep';
import { TipoTelefone } from '@/api/contato.types';
import { Separator } from '@radix-ui/react-separator';

export default function StoreSettings() {
  const { data: store, isLoading } = useGetStore();
  const { mutate: updateStore, isPending } = useUpdateStore();
  const [logoPreview, setLogoPreview] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StoreFormSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      contatos: [{ numero: '', tipoTelefone: TipoTelefone.Celular }],
    },
  });

  const [cep, setCep] = React.useState<string>('');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contatos',
  });

  React.useEffect(() => {
    if (store) {
      reset({
        nomeFantasia: store.nomeFantasia || '',
        razaoSocial: store.razaoSocial || '',
        documento: formatCpfCnpj(store.documento) || '',
        inscricaoEstadual: store.inscricaoEstadual || '',
        inscricaoMunicipal: store.inscricaoMunicipal || '',
        contatos: store.contatos.map((contatos) => ({
          ...contatos,
          numero: formatPhone(contatos.numero),
        })) || [{ numero: '', tipoTelefone: 'Comercial' }],
        endereco: {
          cep: formatCep(store.endereco?.cep) || '',
          logradouro: store.endereco?.logradouro || '',
          numero: store.endereco?.numero || '',
          complemento: store.endereco?.complemento || '',
          bairro: store.endereco?.bairro || '',
          estado: store.endereco?.estado || '',
          cidade: store.endereco?.cidade || '',
        },
        site: store.site || '',
        logoTipo: store.logoTipo || '',
      });

      if (store.logoTipo) {
        setLogoPreview(store.logoTipo);
      }
    }
  }, [store, reset]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setValue('logoTipo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { data: cepData, isLoading: isLoadingCep } = useGetCep(cep);

  // Auto-fill address fields when CEP data arrives
  React.useEffect(() => {
    if (cepData) {
      setValue('endereco.logradouro', cepData.logradouro || ' ', {
        shouldValidate: true,
      });
      setValue('endereco.bairro', cepData.bairro || ' ', {
        shouldValidate: true,
      });
      setValue('endereco.cidade', cepData.cidade || ' ', {
        shouldValidate: true,
      });
      setValue('endereco.estado', cepData.estado || ' ', {
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

  const onSubmit = (data: StoreFormSchema) => {
    console.log('Form data before submit:', data);

    // Build the update payload
    const updatePayload: UpdateStoreInput = {
      nomeFantasia: data.nomeFantasia,
      razaoSocial: data.razaoSocial,
      documento: data.documento,
      inscricaoEstadual: data.inscricaoEstadual || undefined,
      inscricaoMunicipal: data.inscricaoMunicipal || undefined,
      contatos: data.contatos,
      endereco: {
        ...data.endereco,
        complemento: data.endereco.complemento || undefined,
      },
      site: data.site || undefined,
      logoTipo: data.logoTipo || undefined,
    };

    console.log('Update payload:', updatePayload);

    updateStore(
      {
        store: updatePayload,
        id: store?.id,
      },
      {
        onSuccess: () => {
          toast.success('Loja atualizada com sucesso!');
        },
        onError: (error) => {
          console.error('Update error:', error);
          toast.error('Erro ao atualizar loja');
        },
      }
    );
  };

  if (isLoading) {
    return <div className="mx-auto w-full max-w-5xl p-6">Carregando...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Toaster position="top-right" richColors />

      <Card className="rounded-lg">
        <CardContent className="p-6">
          {/* Row 1: Nome Fantasia, Razão Social, Montadora */}
          <div className="grid gap-4 md:grid-cols-3 mb-4">
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
                className="rounded-md"
                label="Razão Social"
              />
              {errors.razaoSocial && (
                <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
              )}
            </div>
          </div>

          {/* Row 2: CNPJ, Ins. Estadual, Ins. Municipal */}
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="documento"
                {...register('documento')}
                label="CNPJ"
                className="rounded-md"
                maxLength={14}
                onChange={(e) => {
                  const masked = formatCpfCnpj(e.target.value);
                  setValue('documento', masked, { shouldValidate: true });
                }}
              />
              {errors.documento && (
                <span className="text-sm text-red-500">{errors.documento.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <FloatingInput
                id="inscricaoEstadual"
                {...register('inscricaoEstadual')}
                label="Ins. Estadual"
                className="rounded-md"
              />
              {errors.inscricaoEstadual && (
                <span className="text-sm text-red-500">{errors.inscricaoEstadual.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <FloatingInput
                id="inscricaoMunicipal"
                {...register('inscricaoMunicipal')}
                label="Ins. Municipal"
                className="rounded-md"
              />
              {errors.inscricaoMunicipal && (
                <span className="text-sm text-red-500">{errors.inscricaoMunicipal.message}</span>
              )}
            </div>
          </div>

          {/* Row 3: CEP, Buscar Cep button */}
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="cep"
                {...register('endereco.cep')}
                label="CEP"
                className="rounded-md"
                maxLength={9}
                onChange={(e) => {
                  const value = formatCep(e.target.value);
                  setValue('endereco.cep', value, { shouldValidate: true });
                }}
              />
            </div>

            <div className="flex flex-col gap-2 justify-end">
              <Button
                type="button"
                onClick={handleBuscarCep}
                disabled={isLoadingCep}
                className="rounded-md"
              >
                {isLoadingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar Cep'}
              </Button>
            </div>
            {errors.endereco?.cep && (
              <span className="text-sm text-red-500">{errors.endereco.cep.message}</span>
            )}
          </div>

          {/* Row 4: Logradouro, Numero, Compl */}
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="logradouro"
                {...register('endereco.logradouro')}
                label="Logradouro"
                className="rounded-md"
              />
              {errors.endereco?.logradouro && (
                <span className="text-sm text-red-500">{errors.endereco.logradouro.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <FloatingInput
                id="numero"
                {...register('endereco.numero')}
                label="Numero"
                className="rounded-md"
              />
              {errors.endereco?.numero && (
                <span className="text-sm text-red-500">{errors.endereco.numero.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <FloatingInput
                id="complemento"
                {...register('endereco.complemento')}
                label="Complemento"
                className="rounded-md"
              />
            </div>
          </div>

          {/* Row 5: Estado, Cidade, Bairro */}
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="estado"
                {...register('endereco.estado')}
                label="Estado"
                className="rounded-md"
                maxLength={2}
              />
              {errors.endereco?.estado && (
                <span className="text-sm text-red-500">{errors.endereco.estado.message}</span>
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
                id="bairro"
                {...register('endereco.bairro')}
                label="Bairro"
                className="rounded-md"
              />
              {errors.endereco?.bairro && (
                <span className="text-sm text-red-500">{errors.endereco.bairro.message}</span>
              )}
            </div>
          </div>

          {/* Row 6: Contatos - Tipo, Numero, Delete button */}
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

                <Button variant="ghost" size="icon" type="button" onClick={() => remove(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                onClick={() => append({ numero: '', tipoTelefone: TipoTelefone.Celular })}
              >
                + Add Telefone
              </Button>
            </div>
            <Separator />

            {errors.contatos && typeof errors.contatos?.message === 'string' && (
              <span className="text-sm text-red-500">{errors.contatos.message}</span>
            )}
          </div>

          {/* Row 7: Site/Logo (left), Logo Preview (middle), Buttons (right) */}
          <div className="flex flex-wrap gap-4 justify-between items-end">
            <div className="flex gap-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="site"
                    {...register('site')}
                    label="Website"
                    className="rounded-md"
                  />
                  {errors.site && (
                    <span className="text-sm text-red-500">{errors.site.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="logo" className="cursor-pointer">
                    <div className="flex items-center justify-center h-10 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                      <Upload className="h-4 w-4 mr-2" />
                      Logo
                    </div>
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {errors.logoTipo && (
                    <span className="text-sm text-red-500">{errors.logoTipo.message}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-[120px] h-[120px] border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      <Upload className="mx-auto h-8 w-8 mb-2" />
                      Logo
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => reset()}
                disabled={isPending}
                className="rounded-md"
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="rounded-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
