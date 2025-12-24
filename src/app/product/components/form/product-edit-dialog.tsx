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
import { productSchema, type CreateProductSchema } from './product.schema';
import { toast } from 'sonner';
import { useProductContext } from '../list/product-context';
import { useUpdateProduct } from '@/app/product/api';
import { FloatingInput } from '@/components/ui/floating-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ProductEditDialog() {
  const { editingProduct, setEditingProduct } = useProductContext();
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProductSchema>({
    resolver: zodResolver(productSchema),
  });

  React.useEffect(() => {
    if (editingProduct) {
      reset({
        descricao: editingProduct.descricao || '',
        aplicacao: editingProduct.aplicacao || '',
        referencia: editingProduct.referencia || '',
        codigoBarra: editingProduct.codigoBarra || '',
        marca: editingProduct.marca || '',
        grupo: editingProduct.grupo || '',
        observacao: editingProduct.observacao || '',
        dadosComplementares: {
          fornecedor: editingProduct.dadosComplementares.fornecedor || '',
          endereco: editingProduct.dadosComplementares.endereco || '',
          statusProduto: editingProduct.dadosComplementares.statusProduto || 'Ativo',
          estoque: editingProduct.dadosComplementares.estoque || 0,
          tipoUnidade: editingProduct.dadosComplementares.tipoUnidade || '',
        },
        dadosFiscalProduto: {
          origemMercadoria: editingProduct.dadosFiscalProduto.origemMercadoria || '',
          NCM: editingProduct.dadosFiscalProduto.NCM || '',
          ANP: editingProduct.dadosFiscalProduto.ANP || '',
          regraEspecificaParaEsteItem:
            editingProduct.dadosFiscalProduto.regraEspecificaParaEsteItem || '',
        },
        preco: {
          compra: editingProduct.preco.compra || 0,
          venda: editingProduct.preco.venda || 0,
          custo: editingProduct.preco.custo || 0,
          compraFixo: editingProduct.preco.compraFixo || 0,
          dataCompra:
            editingProduct.preco.dataCompra?.split('T')[0] ||
            new Date().toISOString().split('T')[0],
          dataVenda:
            editingProduct.preco.dataVenda?.split('T')[0] || new Date().toISOString().split('T')[0],
          dataCusto:
            editingProduct.preco.dataCusto?.split('T')[0] || new Date().toISOString().split('T')[0],
          dataCompraFixo:
            editingProduct.preco.dataCompraFixo?.split('T')[0] ||
            new Date().toISOString().split('T')[0],
        },
        markup: {
          produto: editingProduct.markup.produto || 0,
          grupo: editingProduct.markup.grupo || 0,
        },
      });
    }
  }, [editingProduct, reset]);

  const onSubmit = (data: CreateProductSchema) => {
    if (!editingProduct?.id) {
      toast.error('ID do produto não encontrado');
      return;
    }

    updateProduct(
      {
        product: data,
        id: editingProduct.id,
      },
      {
        onSuccess: () => {
          toast.success('Produto atualizado com sucesso!');
          setEditingProduct(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);

          const fieldMapping: Record<string, string> = {
            descricao: 'descricao',
            aplicacao: 'aplicacao',
            referencia: 'referencia',
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
            toast.error(errorData?.message || 'Erro ao atualizar produto');
          }
        },
      }
    );
  };

  if (!editingProduct) return null;

  const statusProduto = watch('dadosComplementares.statusProduto');

  return (
    <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <FloatingInput id="edit-descricao" {...register('descricao')} label="Descrição" />
              {errors.descricao && (
                <span className="text-sm text-red-500">{errors.descricao.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Textarea
                id="edit-aplicacao"
                {...register('aplicacao')}
                placeholder="Aplicação"
                rows={3}
              />
              {errors.aplicacao && (
                <span className="text-sm text-red-500">{errors.aplicacao.message}</span>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-valor-venda"
                  {...register('preco.venda', { valueAsNumber: true })}
                  label="Valor Venda"
                  type="number"
                />
                {errors.preco?.venda && (
                  <span className="text-sm text-red-500">{errors.preco.venda.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-estoque"
                  {...register('dadosComplementares.estoque', { valueAsNumber: true })}
                  label="Estoque"
                  type="number"
                />
                {errors.dadosComplementares?.estoque && (
                  <span className="text-sm text-red-500">
                    {errors.dadosComplementares.estoque.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status do Produto</Label>
              <RadioGroup
                value={statusProduto}
                onValueChange={(value) =>
                  setValue('dadosComplementares.statusProduto', value as 'Ativo' | 'Desativo', {
                    shouldValidate: true,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ativo" id="edit-ativo" />
                  <Label htmlFor="edit-ativo">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Desativo" id="edit-desativo" />
                  <Label htmlFor="edit-desativo">Desativo</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingProduct(null)}
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
