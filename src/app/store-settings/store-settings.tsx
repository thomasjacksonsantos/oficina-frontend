'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { storeSchema, type StoreFormSchema } from './store.schema';
import { toast, Toaster } from 'sonner';
import { useGetStore, useUpdateStore, useSearchCep } from './use-store';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { FloatingInput } from '@/components/ui/floating-input';

export default function StoreSettings() {
  const { data: store, isLoading } = useGetStore();
  const { mutate: updateStore, isPending } = useUpdateStore();
  const { mutate: searchCep, isPending: isSearchingCep } = useSearchCep();
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
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contato',
  });

  React.useEffect(() => {
    if (store) {
      reset({
        nomeFantasia: store.nomeFantasia || '',
        razaoSocial: store.razaoSocial || '',
        cnpj: store.cnpj || '',
        inscricaoEstadual: store.inscricaoEstadual || '',
        inscricaoMunicipal: store.inscricaoMunicipal || '',
        contato: store.contato || [{ tipo: '', numero: '' }],
        endereco: {
          cep: store.endereco?.cep || '',
          logradouro: store.endereco?.logradouro || '',
          numero: store.endereco?.numero || '',
          complemento: store.endereco?.complemento || '',
          bairro: store.endereco?.bairro || '',
          estado: store.endereco?.estado || '',
          cidade: store.endereco?.cidade || '',
        },
        site: store.site || '',
        logo: store.logo || '',
      });

      if (store.logo) {
        setLogoPreview(store.logo);
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
        setValue('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCepSearch = () => {
    const cep = watch('endereco.cep');
    if (cep && cep.length === 8) {
      searchCep(cep, {
        onSuccess: (data) => {
          setValue('endereco.logradouro', data.logradouro, { shouldValidate: true });
          setValue('endereco.bairro', data.bairro, { shouldValidate: true });
          setValue('endereco.cidade', data.cidade, { shouldValidate: true });
          setValue('endereco.estado', data.estado, { shouldValidate: true });
          toast.success('Endereço encontrado!');
        },
        onError: () => {
          toast.error('CEP não encontrado');
        },
      });
    } else {
      toast.warning('Digite um CEP válido');
    }
  };

  const onSubmit = (data: StoreFormSchema) => {
    updateStore(data as any, {
      onSuccess: () => {
        toast.success('Loja atualizada com sucesso!');
      },
      onError: () => {
        toast.error('Erro ao atualizar loja');
      },
    });
  };

  if (isLoading) {
    return <div className="mx-auto w-full max-w-5xl p-6">Carregando...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Toaster position="top-right" richColors />

      <Card className="rounded-lg">
        <CardContent className="p-6">
          {/* Row 1: Nome Fantasia, Razão Social, CNPJ */}
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
                label='Razão Social'
              />
              {errors.razaoSocial && (
                <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <FloatingInput
                id="cnpj"
                {...register('cnpj')}
                label="CNPJ"
                className="rounded-md"
                maxLength={14}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setValue('cnpj', value, { shouldValidate: true });
                }}
              />
              {errors.cnpj && <span className="text-sm text-red-500">{errors.cnpj.message}</span>}
            </div>
          </div>

          {/* Row 2: Ins. Estadual, Ins. Municipal */}
          <div className="grid gap-4 md:grid-cols-2 mb-4">
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

            <div className="flex flex-col gap-2 justify-end">
              <Button
                type="button"
                onClick={handleCepSearch}
                disabled={isSearchingCep}
                className="rounded-md"
              >
                {isSearchingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar Cep'}
              </Button>
            </div>
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
          <div className="space-y-2 mb-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 md:grid-cols-[1fr_2fr_auto]">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    {...register(`contato.${index}.tipo`)}
                    label="Tipo"
                    className="rounded-md"
                  />
                  {errors.contato?.[index]?.tipo && (
                    <span className="text-sm text-red-500">
                      {errors.contato[index]?.tipo?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    {...register(`contato.${index}.numero`)}
                    label="Numero"
                    className="rounded-md"
                  />
                  {errors.contato?.[index]?.numero && (
                    <span className="text-sm text-red-500">
                      {errors.contato[index]?.numero?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {index === 0 && <Label className="invisible">Delete</Label>}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ tipo: '', numero: '' })}
              className="rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Telefone
            </Button>
          </div>

          {/* Row 7: Site/Logo (left), Logo Preview (middle), Buttons (right) */}
          <div className="grid gap-4 md:grid-cols-[200px_200px_1fr] items-end">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="site"
                  {...register('site')}
                  label="Website"
                  className="rounded-md"
                />
                {errors.site && <span className="text-sm text-red-500">{errors.site.message}</span>}
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
                {errors.logo && <span className="text-sm text-red-500">{errors.logo.message}</span>}
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

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => reset()}
                disabled={isPending}
                className="rounded-md px-20"
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="rounded-md px-20"
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
