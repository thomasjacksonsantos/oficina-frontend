'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { productGroupSchema, type CreateProductGroupSchema } from './product-group.schema';
import { toast, Toaster } from 'sonner';
import { useCreateProductGroup } from '@/app/product-group/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductGroupContext } from '../list/product-group-context';
import { FloatingInput } from '@/components/ui/floating-input';

export default function ProductGroupForm() {
  const router = useRouter();
  const { registeringProductGroup, setRegisteringProductGroup } = useProductGroupContext();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProductGroupSchema>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: {
      descricao: '',
      area: '',
      ncm: '',
      anp: '',
    },
  });

  const { mutate: createProductGroup, isPending } = useCreateProductGroup();

  const onSubmit = (data: CreateProductGroupSchema) => {
    const create: CreateProductGroupSchema = {
      ...data,
    };

    createProductGroup(create, {
      onSuccess: (result) => {
        if (result) {
          setRegisteringProductGroup(null);
          toast.success('Grupo de produto criado com sucesso!');
        } else {
          toast.error(`Erro ao criar grupo de produto: ${result}`);
        }
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          descricao: 'descricao',
          area: 'area',
          ncm: 'ncm',
          anp: 'anp',
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
        }

        toast.error('Erro de validação', {
          description: 'Erro(es) encontrados nos dados enviados.',
        });
      },
    });
  };

  React.useEffect(() => {
    if (!registeringProductGroup) {
      reset();
    }
  }, [registeringProductGroup, reset]);

  // Common areas for dropdown
  const commonAreas = [
    'Automotiva',
    'Industrial',
    'Combustível',
    'Especial',
    'Proteção',
    'Limpeza',
    'Ecológico',
  ];

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Dialog
        open={!!registeringProductGroup}
        onOpenChange={() => setRegisteringProductGroup(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grupo de Produtos</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="product-group-descricao"
                  {...register('descricao')}
                  label="Descrição"
                  className="rounded-md"
                />
                {errors.descricao && (
                  <span className="text-sm text-red-500">{errors.descricao.message}</span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Select
                    value={watch('area')}
                    onValueChange={(value) => setValue('area', value, { shouldValidate: true })}
                  >
                    <SelectTrigger id="product-group-area" className="rounded-md">
                      <SelectValue placeholder="Selecione uma área" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && (
                    <span className="text-sm text-red-500">{errors.area.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-group-ncm"
                    {...register('ncm')}
                    label="NCM"
                    className="rounded-md"
                    maxLength={10}
                  />
                  {errors.ncm && <span className="text-sm text-red-500">{errors.ncm.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-group-anp"
                    {...register('anp')}
                    label="ANP"
                    className="rounded-md"
                  />
                  {errors.anp && <span className="text-sm text-red-500">{errors.anp.message}</span>}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setRegisteringProductGroup(null)}
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
