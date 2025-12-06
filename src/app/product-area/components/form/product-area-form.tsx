'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { areaSchema, type CreateAreaSchema } from './product-area.schema';
import { toast, Toaster } from 'sonner';
import { useCreateArea } from '@/app/product-area/api';
import { useAreaContext } from '../list';
import { FloatingInput } from '@/components/ui/floating-input';

export default function AreaForm() {
  const router = useRouter();
  const { registeringArea, setRegisteringArea } = useAreaContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateAreaSchema>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      descricao: '',
      garantia: '',
    },
  });

  React.useEffect(() => {
    if (!registeringArea) {
      reset();
    }
  }, [registeringArea, reset]);

  const { mutate: createArea, isPending } = useCreateArea();

  const onSubmit = (data: CreateAreaSchema) => {
    const create: CreateAreaSchema = {
      ...data,
    };

    createArea(create, {
      onSuccess: (result) => {
        if (result) {
          setRegisteringArea(null);
          toast.success('Área criada com sucesso!');
        } else {
          toast.error(`Erro ao criar área: ${result}`);
        }
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          descricao: 'descricao',
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
      <Dialog open={!!registeringArea} onOpenChange={() => setRegisteringArea(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grupo de Produtos</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex flex-col gap-2">

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="area-descricao"
                    {...register('descricao')}
                    label="Descrição"
                    className="rounded-md"
                  />
                  {errors.descricao && (
                    <span className="text-sm text-red-500">{errors.descricao.message}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Textarea
                  id="area-garantia"
                  {...register('garantia')}
                  placeholder="Descrição textarea..."
                  className="rounded-md resize-none"
                  rows={4}
                />
                {errors.garantia && (
                  <span className="text-sm text-red-500">{errors.garantia.message}</span>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setRegisteringArea(null)}
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
