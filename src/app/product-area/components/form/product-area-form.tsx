'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { areaSchema, type CreateAreaSchema } from './product-area.schema';
import { toast, Toaster } from 'sonner';
import { useCreateArea } from '@/app/product-area/api';

export default function AreaForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateAreaSchema>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      codigo: '',
      descricao: '',
      descricaoEstendida: '',
      garantia: '',
    },
  });

  const { mutate: createArea, isPending } = useCreateArea();

  const onSubmit = (data: CreateAreaSchema) => {
    const create: CreateAreaSchema = {
      ...data,
    };

    createArea(create, {
      onSuccess: (result) => {
        if (result) {
          router.navigate({ to: '/areas-produtos' });
        } else {
          toast.error(`Erro ao criar área: ${result}`);
        }
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          codigo: 'codigo',
          descricao: 'descricao',
          descricaoEstendida: 'descricaoEstendida',
          garantia: 'garantia',
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

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="rounded-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Área</h2>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="area-codigo">Código</Label>
                  <Input
                    id="area-codigo"
                    {...register('codigo')}
                    placeholder="AUTO-001"
                    className="rounded-md"
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      setValue('codigo', upper, { shouldValidate: true });
                    }}
                  />
                  {errors.codigo && (
                    <span className="text-sm text-red-500">{errors.codigo.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="area-descricao">Descrição</Label>
                  <Input
                    id="area-descricao"
                    {...register('descricao')}
                    placeholder="Automotiva"
                    className="rounded-md"
                  />
                  {errors.descricao && (
                    <span className="text-sm text-red-500">{errors.descricao.message}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="area-descricao-estendida">Descrição Estendida</Label>
                <Textarea
                  id="area-descricao-estendida"
                  {...register('descricaoEstendida')}
                  placeholder="Descrição detalhada da área..."
                  className="rounded-md resize-none"
                  rows={4}
                />
                {errors.descricaoEstendida && (
                  <span className="text-sm text-red-500">{errors.descricaoEstendida.message}</span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="area-garantia">Garantia (meses)</Label>
                  <Input
                    id="area-garantia"
                    {...register('garantia')}
                    placeholder="12"
                    className="rounded-md"
                    inputMode="numeric"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue('garantia', value, { shouldValidate: true });
                    }}
                  />
                  {errors.garantia && (
                    <span className="text-sm text-red-500">{errors.garantia.message}</span>
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
                  router.navigate({ to: '/areas-produtos' });
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
