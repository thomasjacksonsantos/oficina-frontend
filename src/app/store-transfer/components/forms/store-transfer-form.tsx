// app/store-transfer/components/forms/store-transfer-form.tsx

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
import { storeTransferSchema, type CreateStoreTransferSchema } from './store-transfer.schema';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  useCreateStoreTransfer,
  useGetStores,
  useUpdateStoreTransfer,
  useGetStoreTransferById,
} from '@/app/store-transfer/api';
import { useGetProductById } from '@/app/product/api/use-get-product-by-id';
import { useSearchProducts } from '@/app/product/api';
import { Autocomplete } from '@/components/ui/autocomplete';
import { useStoreTransferContext } from '../list/store-transfer-context';
import { Input } from '@/components/ui/input';

export default function StoreTransferForm() {
  const {
    registeringStoreTransfer,
    setRegisteringStoreTransfer,
    editingStoreTransfer,
    setEditingStoreTransfer,
  } = useStoreTransferContext();

  const isOpen = registeringStoreTransfer || !!editingStoreTransfer;
  const isEditing = !!editingStoreTransfer;

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateStoreTransferSchema>({
    resolver: zodResolver(storeTransferSchema),
    defaultValues: {
      lojaOrigemId: '',
      lojaDestinoId: '',
      produtoId: '',
      quantidade: 0,
    },
  });

  // Fetch stores for dropdowns
  const { data: stores = [], isLoading: isLoadingStores } = useGetStores();

  // Watch fields
  const lojaOrigemId = watch('lojaOrigemId');
  const lojaDestinoId = watch('lojaDestinoId');
  const produtoId = watch('produtoId');
  const quantidade = watch('quantidade');

  // Product search state
  const [productSearch, setProductSearch] = React.useState('');
  const [debouncedProductSearch, setDebouncedProductSearch] = React.useState('');
  const [selectedProductFromSearch, setSelectedProductFromSearch] = React.useState<any>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedProductSearch(productSearch), 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const { data: searchedProducts = [], isFetching: isSearchingProducts } =
    useSearchProducts(debouncedProductSearch);

  // Fetch product details
  const productQuery = useGetProductById(produtoId || null);
  const productData = productQuery.data as any;

  // Derive product info
  const productAny = (selectedProductFromSearch || productData) as any;
  const productCurrentQuantity = Number(productAny?.quantidade ?? 0) || 0;

  const { mutate: createStoreTransfer, isPending: isCreating } = useCreateStoreTransfer();
  const { mutate: updateStoreTransfer, isPending: isUpdating } = useUpdateStoreTransfer();
  const { data: storeTransferDetail } = useGetStoreTransferById(editingStoreTransfer?.id || null);

  const isPending = isCreating || isUpdating;

  // Calculate new quantities after transfer
  const quantidadeTransferir = Number(quantidade) || 0;
  const estoqueAtual = productCurrentQuantity;
  const estoqueAposTransferencia = estoqueAtual - quantidadeTransferir;
  const estoqueDestino = quantidadeTransferir;

  // Reset form when opening
  React.useEffect(() => {
    if (editingStoreTransfer && storeTransferDetail) {
      reset({
        lojaOrigemId: storeTransferDetail.origemId,
        lojaDestinoId: storeTransferDetail.destinoId,
        produtoId: storeTransferDetail.produtoId,
        quantidade: storeTransferDetail.movimentoSaida?.quantidade || 0,
      });
      setSelectedProductFromSearch(null);
      setProductSearch('');
    } else if (registeringStoreTransfer) {
      reset({
        lojaOrigemId: '',
        lojaDestinoId: '',
        produtoId: '',
        quantidade: 0,
      });
      setSelectedProductFromSearch(null);
      setProductSearch('');
    }
  }, [editingStoreTransfer, storeTransferDetail, registeringStoreTransfer, reset]);

  const onSubmit = (data: CreateStoreTransferSchema) => {
    const mutation = isEditing ? updateStoreTransfer : createStoreTransfer;
    const successMessage = isEditing
      ? 'Transferência de estoque atualizada com sucesso!'
      : 'Transferência de estoque criada com sucesso!';

    const submitData =
      isEditing && editingStoreTransfer ? { ...data, id: editingStoreTransfer.id } : data;

    mutation(submitData as any, {
      onSuccess: () => {
        toast.success(successMessage);
        handleClose();
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          lojaOrigemId: 'lojaOrigemId',
          lojaDestinoId: 'lojaDestinoId',
          produtoId: 'produtoId',
          quantidade: 'quantidade',
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
    setRegisteringStoreTransfer(false);
    setEditingStoreTransfer(null);
    reset();
    setSelectedProductFromSearch(null);
    setProductSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Transferência de Estoque' : 'Nova Transferência de Estoque'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          {/* Loja Origem */}
          <div className="mb-6">
            <Label htmlFor="lojaOrigemId" className="text-sm font-medium mb-2 block">
              Loja Origem
            </Label>
            <Controller
              name="lojaOrigemId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoadingStores || stores.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingStores
                          ? 'Carregando...'
                          : stores.length === 0
                            ? 'Nenhuma loja encontrada'
                            : 'Selecione a loja de origem...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store: any) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.nomeFantasia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.lojaOrigemId && (
              <span className="text-xs text-red-500 mt-1">{errors.lojaOrigemId.message}</span>
            )}
          </div>

          {/* Product Field */}
          <div className="mb-6">
            <Controller
              name="produtoId"
              control={control}
              render={({ field }) => {
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
                      const selected = searchedProducts.find((p) => p.id === val);
                      setSelectedProductFromSearch(selected || null);
                    }}
                    options={opts}
                    placeholder="Digite o produto..."
                    isLoading={isSearchingProducts}
                    onSearch={(v) => setProductSearch(v)}
                    emptyText={
                      debouncedProductSearch && debouncedProductSearch.length >= 3
                        ? 'Nenhum resultado encontrado.'
                        : 'Digite ao menos 3 caracteres'
                    }
                  />
                );
              }}
            />
            {errors.produtoId && (
              <span className="text-xs text-red-500 mt-1">{errors.produtoId.message}</span>
            )}
          </div>

          {/* Stock Summary Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">Total estoque</Label>
              <input
                className="rounded-md border px-3 py-2 text-sm bg-muted/50 font-mono"
                readOnly
                value={estoqueAtual.toFixed(2)}
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="quantidade" className="text-xs text-muted-foreground mb-2">
                Quantidade a Transferir
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
                    className="rounded-md border font-mono"
                  />
                )}
              />
              {errors.quantidade && (
                <span className="text-xs text-red-500 mt-1">{errors.quantidade.message}</span>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Loja Destino */}
          <div className="mb-6">
            <Label htmlFor="lojaDestinoId" className="text-sm font-medium mb-2 block">
              Destino
            </Label>
            <Controller
              name="lojaDestinoId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoadingStores || stores.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingStores
                          ? 'Carregando...'
                          : stores.length === 0
                            ? 'Nenhuma loja encontrada'
                            : 'Selecione a loja de destino...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {stores
                      .filter((store: any) => store.id !== lojaOrigemId)
                      .map((store: any) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.nomeFantasia}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.lojaDestinoId && (
              <span className="text-xs text-red-500 mt-1">{errors.lojaDestinoId.message}</span>
            )}
          </div>

          {/* After Transfer Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">Estoque atual</Label>
              <input
                className="rounded-md border px-3 py-2 text-sm bg-muted/50 font-mono"
                readOnly
                value={quantidadeTransferir.toFixed(2)}
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-2">
                Estoque com transferência
              </Label>
              <input
                className="rounded-md border px-3 py-2 text-sm bg-muted/50 font-mono font-semibold"
                readOnly
                value={estoqueDestino.toFixed(2)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-8">
            <div className="flex items-center gap-3 ml-auto">
              <Button variant="outline" type="button" onClick={handleClose} disabled={isPending}>
                Voltar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
