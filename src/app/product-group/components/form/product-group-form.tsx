'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

export default function ProductGroupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
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
          router.navigate({ to: '/grupos-produtos' });
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
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="rounded-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Grupo de Produtos</h2>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="product-group-descricao">Descrição</Label>
                <Input
                  id="product-group-descricao"
                  {...register('descricao')}
                  placeholder="Lubrificantes Automotivos"
                  className="rounded-md"
                />
                {errors.descricao && (
                  <span className="text-sm text-red-500">{errors.descricao.message}</span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="product-group-area">Área</Label>
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
                  <Label htmlFor="product-group-ncm">NCM</Label>
                  <Input
                    id="product-group-ncm"
                    {...register('ncm')}
                    placeholder="27101210"
                    className="rounded-md"
                    maxLength={10}
                  />
                  {errors.ncm && (
                    <span className="text-sm text-red-500">{errors.ncm.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="product-group-anp">ANP</Label>
                  <Input
                    id="product-group-anp"
                    {...register('anp')}
                    placeholder="LUB-001"
                    className="rounded-md"
                  />
                  {errors.anp && (
                    <span className="text-sm text-red-500">{errors.anp.message}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  router.navigate({ to: '/grupos-produtos' });
                }}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
