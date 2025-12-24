'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { productSchema, type CreateProductSchema } from './product.schema';
import { toast } from 'sonner';
import { useCreateProduct } from '@/app/product/api';
import { useProductContext } from '../list';
import { FloatingInput } from '@/components/ui/floating-input';

export default function ProductForm() {
  const { registeringProduct, setRegisteringProduct } = useProductContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      descricao: '',
      aplicacao: '',
      referencia: '',
      codigoBarra: '',
      marca: '',
      grupo: '',
      observacao: '',
      dadosComplementares: {
        fornecedor: '',
        endereco: '',
        statusProduto: 'Ativo',
        estoque: 0,
        tipoUnidade: '',
      },
      dadosFiscalProduto: {
        origemMercadoria: '',
        NCM: '',
        ANP: '',
        regraEspecificaParaEsteItem: '',
      },
      preco: {
        compra: 0,
        venda: 0,
        custo: 0,
        compraFixo: 0,
        dataCompra: new Date().toISOString().split('T')[0],
        dataVenda: new Date().toISOString().split('T')[0],
        dataCusto: new Date().toISOString().split('T')[0],
        dataCompraFixo: new Date().toISOString().split('T')[0],
      },
      markup: {
        produto: 0,
        grupo: 0,
      },
    },
  });

  React.useEffect(() => {
    if (!registeringProduct) {
      reset();
    }
  }, [registeringProduct, reset]);

  const { mutate: createProduct, isPending } = useCreateProduct();

  const onSubmit = (data: CreateProductSchema) => {
    createProduct(data, {
      onSuccess: (result) => {
        if (result) {
          setRegisteringProduct(null);
          toast.success('Produto criado com sucesso!');
        } else {
          toast.error(`Erro ao criar produto: ${result}`);
        }
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          descricao: 'descricao',
          aplicacao: 'aplicacao',
          referencia: 'referencia',
          codigoBarra: 'codigoBarra',
          marca: 'marca',
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
          description: 'Erro(s) encontrado nos dados enviados.',
        });
      },
    });
  };

  const statusProduto = watch('dadosComplementares.statusProduto');

  return (
    <Dialog open={!!registeringProduct} onOpenChange={() => setRegisteringProduct(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="product-descricao"
                  {...register('descricao')}
                  label="Descrição"
                />
                {errors.descricao && (
                  <span className="text-sm text-red-500">{errors.descricao.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Textarea
                  id="product-aplicacao"
                  {...register('aplicacao')}
                  placeholder="Aplicação Restarea"
                  rows={3}
                  className="resize-none"
                />
                {errors.aplicacao && (
                  <span className="text-sm text-red-500">{errors.aplicacao.message}</span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Select
                    value={watch('grupo') || ''}
                    onValueChange={(value) => setValue('grupo', value, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grupo1">Grupo 1</SelectItem>
                      <SelectItem value="grupo2">Grupo 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Select
                    value={watch('marca') || ''}
                    onValueChange={(value) => setValue('marca', value, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marca1">Marca 1</SelectItem>
                      <SelectItem value="marca2">Marca 2</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.marca && (
                    <span className="text-sm text-red-500">{errors.marca.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-referencia"
                    {...register('referencia')}
                    label="Referência"
                  />
                  {errors.referencia && (
                    <span className="text-sm text-red-500">{errors.referencia.message}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="product-codigo-barra"
                  {...register('codigoBarra')}
                  label="Cód. barra"
                />
                {errors.codigoBarra && (
                  <span className="text-sm text-red-500">{errors.codigoBarra.message}</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Dados Complementares */}
            <div className="space-y-3">
              <h3 className="font-semibold">Dados Complementares</h3>

              <div className="flex flex-col gap-2">
                <Select
                  value={watch('dadosComplementares.fornecedor') || ''}
                  onValueChange={(value) =>
                    setValue('dadosComplementares.fornecedor', value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                    <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.dadosComplementares?.fornecedor && (
                  <span className="text-sm text-red-500">
                    {errors.dadosComplementares.fornecedor.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="product-endereco"
                  {...register('dadosComplementares.endereco')}
                  label="Endereço"
                />
                {errors.dadosComplementares?.endereco && (
                  <span className="text-sm text-red-500">
                    {errors.dadosComplementares.endereco.message}
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Select
                    value={watch('dadosComplementares.tipoUnidade') || ''}
                    onValueChange={(value) =>
                      setValue('dadosComplementares.tipoUnidade', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="LT">LT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.dadosComplementares?.tipoUnidade && (
                    <span className="text-sm text-red-500">
                      {errors.dadosComplementares.tipoUnidade.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-estoque"
                    {...register('dadosComplementares.estoque')}
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
                    <RadioGroupItem value="Ativo" id="ativo" />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Desativo" id="desativo" />
                    <Label htmlFor="desativo">Desativo</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Preços e Datas */}
            <div className="space-y-3">
              <h3 className="font-semibold">Valores e Datas</h3>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-valor-compra"
                    {...register('preco.compra')}
                    label="Valor Compra"
                  />
                  {errors.preco?.compra && (
                    <span className="text-sm text-red-500">{errors.preco.compra.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-valor-venda"
                    {...register('preco.venda')}
                    label="Valor Venda"
                  />
                  {errors.preco?.venda && (
                    <span className="text-sm text-red-500">{errors.preco.venda.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-valor-custo"
                    {...register('preco.custo')}
                    label="Valor Custo"
                  />
                  {errors.preco?.custo && (
                    <span className="text-sm text-red-500">{errors.preco.custo.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-valor-compra-fixo"
                    {...register('preco.compraFixo')}
                    label="Valor Compra(Fixo)"
                  />
                  {errors.preco?.compraFixo && (
                    <span className="text-sm text-red-500">{errors.preco.compraFixo.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="data-compra">Data Compra</Label>
                  <Input
                    id="data-compra"
                    type="date"
                    {...register('preco.dataCompra')}
                  />
                  {errors.preco?.dataCompra && (
                    <span className="text-sm text-red-500">{errors.preco.dataCompra.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="data-venda">Data Venda</Label>
                  <Input
                    id="data-venda"
                    type="date"
                    {...register('preco.dataVenda')}
                  />
                  {errors.preco?.dataVenda && (
                    <span className="text-sm text-red-500">{errors.preco.dataVenda.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="data-custo">Data Custo</Label>
                  <Input
                    id="data-custo"
                    type="date"
                    {...register('preco.dataCusto')}
                  />
                  {errors.preco?.dataCusto && (
                    <span className="text-sm text-red-500">{errors.preco.dataCusto.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="data-compra-fixo">Data Compra(Fixo)</Label>
                  <Input
                    id="data-compra-fixo"
                    type="date"
                    {...register('preco.dataCompraFixo')}
                  />
                  {errors.preco?.dataCompraFixo && (
                    <span className="text-sm text-red-500">
                      {errors.preco.dataCompraFixo.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Dados Fiscais */}
            <div className="space-y-3">
              <h3 className="font-semibold">Origem Mercadoria</h3>

              <div className="flex flex-col gap-2">
                <Select
                  value={watch('dadosFiscalProduto.origemMercadoria') || ''}
                  onValueChange={(value) =>
                    setValue('dadosFiscalProduto.origemMercadoria', value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Origem Mercadoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nacional">Nacional</SelectItem>
                    <SelectItem value="importado">Importado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.dadosFiscalProduto?.origemMercadoria && (
                  <span className="text-sm text-red-500">
                    {errors.dadosFiscalProduto.origemMercadoria.message}
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-ncm"
                    {...register('dadosFiscalProduto.NCM')}
                    label="NCM"
                  />
                  {errors.dadosFiscalProduto?.NCM && (
                    <span className="text-sm text-red-500">
                      {errors.dadosFiscalProduto.NCM.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-anp"
                    {...register('dadosFiscalProduto.ANP')}
                    label="ANP"
                  />
                  {errors.dadosFiscalProduto?.ANP && (
                    <span className="text-sm text-red-500">
                      {errors.dadosFiscalProduto.ANP.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Select
                  value={watch('dadosFiscalProduto.regraEspecificaParaEsteItem') || ''}
                  onValueChange={(value) =>
                    setValue('dadosFiscalProduto.regraEspecificaParaEsteItem', value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regra1">Regra 1</SelectItem>
                    <SelectItem value="regra2">Regra 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Markup */}
            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-markup-produto"
                    {...register('markup.produto')}
                    label="Markup para Grupo"
                  />
                  {errors.markup?.produto && (
                    <span className="text-sm text-red-500">{errors.markup.produto.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="product-markup-grupo"
                    {...register('markup.grupo')}
                    label="Markup para este produto"
                  />
                  {errors.markup?.grupo && (
                    <span className="text-sm text-red-500">{errors.markup.grupo.message}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Observações */}
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Textarea
                  id="product-observacao"
                  {...register('observacao')}
                  placeholder="Observações"
                  rows={4}
                  className="resize-none"
                />
                {errors.observacao && (
                  <span className="text-sm text-red-500">{errors.observacao.message}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setRegisteringProduct(null)}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}