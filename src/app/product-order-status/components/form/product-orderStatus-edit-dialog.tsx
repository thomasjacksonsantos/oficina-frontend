// app/product-orderStatus/components/form/product-orderStatus-edit-dialog.tsx

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
import { useOrderStatusContext } from '../list/product-orderStatus-context';
import { useUpdateOrderStatus } from '@/app/product-order-status/api';
import { FloatingInput } from '@/components/ui/floating-input';

export default function OrderStatusEditDialog() {
  const { editingOrderStatus, setEditingOrderStatus } = useOrderStatusContext();
  const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatus();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateOrderStatusSchema>({
    resolver: zodResolver(orderStatusSchema),
  });

  React.useEffect(() => {
    if (editingOrderStatus) {
      reset({
        descricao: editingOrderStatus.descricao || '',
      });
    }
  }, [editingOrderStatus, reset]);

  const onSubmit = (data: CreateOrderStatusSchema) => {
    if (!editingOrderStatus?.id) {
      toast.error('ID da unidade não encontrado');
      return;
    }

    updateOrderStatus(
      {
        orderStatus: data,
        id: editingOrderStatus.id,
      },
      {
        onSuccess: () => {
          toast.success('Unidade atualizada com sucesso!');
          setEditingOrderStatus(null);
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
            toast.error(errorData?.message || 'Erro ao atualizar unidade');
          }
        },
      }
    );
  };

  if (!editingOrderStatus) return null;

  return (
    <Dialog open={!!editingOrderStatus} onOpenChange={() => setEditingOrderStatus(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Unidade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="edit-descricao"
                {...register('descricao')}
                label="Descrição"
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
              onClick={() => setEditingOrderStatus(null)}
              disabled={isPending}
            >
              Voltar
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
