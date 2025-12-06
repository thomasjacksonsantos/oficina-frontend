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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { areaSchema, type CreateAreaSchema } from './product-area.schema';
import { toast } from 'sonner';
import { useAreaContext } from '../list/product-area-context';
import { useUpdateArea } from '@/app/product-area/api';
import { FloatingInput } from '@/components/ui/floating-input';

export default function AreaEditDialog() {
  const { editingArea, setEditingArea } = useAreaContext();
  const { mutate: updateArea, isPending } = useUpdateArea();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateAreaSchema>({
    resolver: zodResolver(areaSchema),
  });

  React.useEffect(() => {
    if (editingArea) {
      reset({
        descricao: editingArea.descricao || '',
        garantia: editingArea.garantia || '',
      });
    }
  }, [editingArea, reset]);

  const onSubmit = (data: CreateAreaSchema) => {
    if (!editingArea?.id) {
      toast.error('ID da área não encontrado');
      return;
    }

    updateArea(
      {
        area: data,
        id: editingArea.id,
      },
      {
        onSuccess: () => {
          toast.success('Área atualizada com sucesso!');
          setEditingArea(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);

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
            toast.error('Erro de validação nos dados');
          } else {
            toast.error(errorData?.message || 'Erro ao atualizar área');
          }
        },
      }
    );
  };

  if (!editingArea) return null;

  return (
    <Dialog open={!!editingArea} onOpenChange={() => setEditingArea(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Área</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            {/* Full-width Descrição field */}
            <div className="flex flex-col gap-2">
              <FloatingInput id="edit-descricao" {...register('descricao')} label="Descrição" />
              {errors.descricao && (
                <span className="text-sm text-red-500">{errors.descricao.message}</span>
              )}
            </div>

            {/* Full-width Descrição Estendida textarea */}
            <div className="flex flex-col gap-2">
              <Textarea
                id="edit-garantia"
                {...register('garantia')}
                placeholder="Descrição textarea..."
                rows={4}
                className="resize-none"
              />
              {errors.garantia && (
                <span className="text-sm text-red-500">{errors.garantia.message}</span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingArea(null)}
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
