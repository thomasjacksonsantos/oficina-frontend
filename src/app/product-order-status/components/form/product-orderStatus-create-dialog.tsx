// app/product-orderStatus/components/form/product-orderStatus-create-dialog.tsx

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
import { orderStatusSchema, type CreateOrderStatusSchema } from './product-orderStatus.schema';
import { toast } from 'sonner';
import { useCreateOrderStatus } from '@/app/product-order-status/api';
import { FloatingInput } from '@/components/ui/floating-input';

interface CreateOrderStatusDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CreateOrderStatusDialog({ isOpen, setIsOpen }: CreateOrderStatusDialogProps) {
  const { mutate: createOrderStatus, isPending } = useCreateOrderStatus();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateOrderStatusSchema>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      descricao: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateOrderStatusSchema) => {
    createOrderStatus(data, {
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
