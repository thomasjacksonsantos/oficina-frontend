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
import { productGroupSchema, type CreateProductGroupSchema } from './product-group.schema';
import { toast } from 'sonner';
import { useProductGroupContext } from '../list/product-group-context';
import { useUpdateProductGroup } from '@/app/product-group/api';
import { FloatingInput } from '@/components/ui/floating-input';

export default function ProductGroupEditDialog() {
  const { editingProductGroup, setEditingProductGroup } = useProductGroupContext();
  const { mutate: updateProductGroup, isPending } = useUpdateProductGroup();

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
  });

  React.useEffect(() => {
    if (editingProductGroup) {
      reset({
        descricao: editingProductGroup.descricao || '',
        area: editingProductGroup.area || '',
        ncm: editingProductGroup.ncm || '',
        anp: editingProductGroup.anp || '',
      });
    }
  }, [editingProductGroup, reset]);

  const onSubmit = (data: CreateProductGroupSchema) => {
    if (!editingProductGroup?.id) {
      toast.error('ID do grupo de produto não encontrado');
      return;
    }

    console.log('Submitting update for product group ID:', editingProductGroup.id);
    console.log('Data:', data);

    updateProductGroup(
      {
        productGroup: data,
        id: editingProductGroup.id
      },
      {
        onSuccess: () => {
          toast.success('Grupo de produto atualizado com sucesso!');
          setEditingProductGroup(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);
          
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
            toast.error('Erro de validação nos dados');
          } else {
            toast.error(errorData?.message || 'Erro ao atualizar grupo de produto');
          }
        },
      }
    );
  };

  if (!editingProductGroup) return null;

  return (
    <Dialog open={!!editingProductGroup} onOpenChange={() => setEditingProductGroup(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Editar Grupo de Produto</DialogTitle>
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

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-area"
                  {...register('area')}
                  label="Área"
                />
                {errors.area && (
                  <span className="text-sm text-red-500">{errors.area.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-ncm"
                  {...register('ncm')}
                  label="NCM"
                  maxLength={10}
                />
                {errors.ncm && (
                  <span className="text-sm text-red-500">{errors.ncm.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-anp"
                  {...register('anp')}
                  label="ANP"
                />
                {errors.anp && (
                  <span className="text-sm text-red-500">{errors.anp.message}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingProductGroup(null)}
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
