// app/stock-correction/components/forms/stock-correction-form.tsx

'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useForm, Controller } from 'react-hook-form';
import { stockCorrectionSchema, type CreateStockCorrectionSchema } from './stock-correction.schema';
import { TIPO_MOVIMENTO_OPTIONS } from './stock-correction.constants';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  useCreateStockCorrection,
  useUpdateStockCorrection,
  useGetStockCorrectionById,
} from '@/app/stock-correction/api';
import { useGetProductById } from '@/app/product/api/use-get-product-by-id';
import { useSearchProducts } from '@/app/product/api';
import { Autocomplete } from '@/components/ui/autocomplete';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useStockCorrectionContext } from '../list/stock-correction-context';
import { FloatingInput } from '@/components/ui/floating-input';
import { Input } from '@/components/ui/input';

export default function StockCorrectionForm() {
  const {
    registeringStockCorrection,
    correctingStockCorrection,
    setRegisteringStockCorrection,
    setCorrectingStockCorrection,
  } = useStockCorrectionContext();

  const isOpen = registeringStockCorrection || !!correctingStockCorrection;
  const isEditing = !!correctingStockCorrection;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateStockCorrectionSchema>({
    resolver: zodResolver(stockCorrectionSchema),
    defaultValues: {
      produtoId: '',
      tipoMovimentoEstoqueId: TIPO_MOVIMENTO_OPTIONS[0].id,
      quantidade: 0,
      valorUnitario: 0,
    },
  });

  // Fetch stock correction details when editing
  const { data: stockCorrectionDetail } = useGetStockCorrectionById(
    correctingStockCorrection?.id || null
  );

  // Watch product id and other fields to compute derived values
  const produtoId = watch('produtoId');
  const productQuery = useGetProductById(produtoId || null);
  const productData = productQuery.data as
    | import('@/api/product.types').UpdateProductInput
    | undefined;

  // Product search state (debounced) and results (minimum 3 chars)
  const [productSearch, setProductSearch] = React.useState('');
  const [debouncedProductSearch, setDebouncedProductSearch] = React.useState('');
  const [selectedProductFromSearch, setSelectedProductFromSearch] = React.useState<any>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedProductSearch(productSearch), 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const { data: searchedProducts = [], isFetching: isSearchingProducts } =
    useSearchProducts(debouncedProductSearch);

  // Derive product current quantity and unit price from search result or fetched product data
  // Priority: search result > fetched product data
  const productAny = (selectedProductFromSearch || productData) as any;
  const productCurrentQuantity = Number(productAny?.quantidade ?? 0) || 0;
  const productUnitValue = Number(productAny?.valorUnitario ?? 0) || 0;

  // When a product is selected, prefill the unit price into the form (only when creating)
  React.useEffect(() => {
    if (productData && !isEditing && productUnitValue > 0) {
      setValue('valorUnitario', productUnitValue);
    }
  }, [productData, productUnitValue, isEditing, setValue]);

  const watchedQuantidade = watch('quantidade');
  const watchedValorUnitario = watch('valorUnitario');

  const newTotal = (Number(watchedQuantidade) || 0) * (Number(watchedValorUnitario) || 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const { mutate: createStockCorrection, isPending: isCreating } = useCreateStockCorrection();
  const { mutate: updateStockCorrection, isPending: isUpdating } = useUpdateStockCorrection();

  const isPending = isCreating || isUpdating;

  // Populate form when editing
  React.useEffect(() => {
    if (correctingStockCorrection && stockCorrectionDetail) {
      reset({
        produtoId: stockCorrectionDetail.produtoId,
        tipoMovimentoEstoqueId:
          stockCorrectionDetail.tipoMovimentoEstoqueId ?? TIPO_MOVIMENTO_OPTIONS[0].id,
        quantidade: stockCorrectionDetail.quantidade,
        valorUnitario: stockCorrectionDetail.valorUnitario,
      });
    } else if (registeringStockCorrection) {
      reset({
        produtoId: '',
        tipoMovimentoEstoqueId: TIPO_MOVIMENTO_OPTIONS[0].id,
        quantidade: 0,
        valorUnitario: 0,
      });
    }
  }, [correctingStockCorrection, stockCorrectionDetail, registeringStockCorrection, reset]);

  const onSubmit = (data: CreateStockCorrectionSchema) => {
    const mutation = isEditing ? updateStockCorrection : createStockCorrection;
    const successMessage = isEditing
      ? 'Correção de estoque atualizada com sucesso!'
      : 'Correção de estoque criada com sucesso!';

    mutation(data, {
      onSuccess: () => {
        toast.success(successMessage);
        handleClose();
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          produtoId: 'produtoId',
          tipoMovimentoEstoqueId: 'tipoMovimentoEstoqueId',
          quantidade: 'quantidade',
          valorUnitario: 'valorUnitario',
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
          description: 'Erro(s) encontrados nos dados enviados.',
        });
      },
    });
  };

  const handleClose = () => {
    setRegisteringStockCorrection(null);
    setCorrectingStockCorrection(null);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Corrigir Estoque' : 'Nova Correção de Estoque'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          {/* Product Description Field */}
          <div className="mb-6">
            <Controller
              name="produtoId"
              control={control}
              render={({ field }) => {
                // Include selected product in options so the display shows descricao when selected
                const opts = searchedProducts.map((p) => ({
                  id: p.id,
                  descricao: p.descricao || p.referencia || p.id,
                }));
                if (productData && productData.id && !opts.find((o) => o.id === productData.id)) {
                  opts.unshift({
                    id: productData.id,
                    descricao: productData.descricao || productData.id,
                  });
                }
                return (
                  <Autocomplete
                    label="Produto"
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      // Store the selected product from search results
                      const selected = searchedProducts.find((p) => p.id === val);
                      setSelectedProductFromSearch(selected || null);
                    }}
                    options={opts}
                    placeholder="Produto Descrição"
                    isLoading={isSearchingProducts}
                    onSearch={(v) => setProductSearch(v)}
                    disabled={isEditing}
                    emptyText={
                      debouncedProductSearch && debouncedProductSearch.length >= 3
                        ? 'Nenhum resultado encontrado.'
                        : 'Digite ao menos 3 caracteres'
                    }
                  />
                );
              }}
            />
          </div>

          {/* First Row: Quantidade, Valor Item, Valor Total */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <Label htmlFor="quantidade" className="text-xs text-muted-foreground mb-2">
                Quantidade
              </Label>
              <Controller
                name="quantidade"
                control={control}
                render={({ field }) => (
                  <Input
                    id="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="rounded-md border"
                  />
                )}
              />
              {errors.quantidade && (
                <span className="text-xs text-red-500 mt-1">{errors.quantidade.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="valorUnitario" className="text-xs text-muted-foreground mb-2">
                Valor Item
              </Label>
              <Controller
                name="valorUnitario"
                control={control}
                render={({ field }) => (
                  <Input
                    id="valorUnitario"
                    type="number"
                    step="0.01"
                    placeholder="R$ 0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="rounded-md border"
                  />
                )}
              />
              {errors.valorUnitario && (
                <span className="text-xs text-red-500 mt-1">{errors.valorUnitario.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">Valor Total</Label>
              <div className="rounded-md border px-3 py-2 text-sm font-medium bg-muted/50">
                {formatCurrency(newTotal)}
              </div>
            </div>
          </div>

          {/* Divider */}
          <Separator className="my-6" />

          {/* Tipo Movimento Dropdown */}
          <div className="mb-6">
            <Label htmlFor="tipoMovimentoEstoqueId" className="text-xs text-muted-foreground mb-2">
              Tipo Movimento
            </Label>
            <Controller
              name="tipoMovimentoEstoqueId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 w-full rounded-md border">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {TIPO_MOVIMENTO_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoMovimentoEstoqueId && (
              <span className="text-xs text-red-500 mt-1">
                {errors.tipoMovimentoEstoqueId.message}
              </span>
            )}
          </div>

          {/* Current Stock / Summary Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">Quantidade Atual</Label>
              <input
                className="rounded-md border px-3 py-2 text-sm bg-muted/50"
                readOnly
                value={
                  isEditing
                    ? (stockCorrectionDetail?.quantidadeAntes ?? 0).toFixed(2)
                    : productCurrentQuantity.toFixed(2)
                }
                placeholder="0"
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">Valor Unitário Atual</Label>
              <input
                className="rounded-md border px-3 py-2 text-sm bg-muted/50"
                readOnly
                value={
                  isEditing
                    ? formatCurrency(stockCorrectionDetail?.valorUnitario || 0)
                    : formatCurrency(productUnitValue)
                }
                placeholder="R$ 0.00"
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">Valor Total Atual</Label>
              <input
                className="rounded-md border px-3 py-2 text-sm bg-muted/50"
                readOnly
                value={
                  isEditing
                    ? formatCurrency(
                        (stockCorrectionDetail?.quantidadeAntes || 0) *
                          (stockCorrectionDetail?.valorUnitario || 0)
                      )
                    : formatCurrency(productCurrentQuantity * productUnitValue)
                }
                placeholder="R$ 0.00"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-8">
            <div className="flex items-center gap-3 ml-auto">
              <Button variant="outline" type="button" onClick={handleClose} disabled={isPending}>
                Voltar
              </Button>
              <Button type="submit" disabled={isPending || isEditing}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
