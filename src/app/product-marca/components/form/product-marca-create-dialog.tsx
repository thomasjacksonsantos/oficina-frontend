// app/product-marca/components/form/product-marca-create-dialog.tsx

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
import { useForm } from 'react-hook-form';
import { marcaSchema, type CreateMarcaSchema } from './product-marca.schema';
import { toast } from 'sonner';
import { useCreateMarca } from '@/app/product-marca/api';
import { FloatingInput } from '@/components/ui/floating-input';

interface CreateMarcaDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CreateMarcaDialog({ isOpen, setIsOpen }: CreateMarcaDialogProps) {
  const { mutate: createMarca, isPending } = useCreateMarca();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateMarcaSchema>({
    resolver: zodResolver(marcaSchema),
    defaultValues: {
      descricao: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateMarcaSchema) => {
    createMarca(data, {
      onSuccess: () => {
        toast.success('Unidade criada com sucesso!');
        setIsOpen(false);
        reset();
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          descricao: 'descricao',
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
          toast.error(errorData?.message || 'Erro ao criar unidade');
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Unidade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-descricao">Descrição</Label>
              <FloatingInput
                id="create-descricao"
                {...register('descricao')}
                label="Descrição"
                autoFocus
              />
              {errors.descricao && (
                <span className="text-sm text-red-500">{errors.descricao.message}</span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
