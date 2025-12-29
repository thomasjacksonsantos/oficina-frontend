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
import { FloatingInput } from '@/components/ui/floating-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Autocomplete } from '@/components/ui/autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { productSchema, type CreateProductSchema } from './product.schema';
import { toast, Toaster } from 'sonner';
import {
  useCreateProduct,
  useGetAllGruposProdutos,
  useGetAllUnidadesProdutos,
  useSearchFornecedores,
  useGetAllFornecedores,
  useGetOrigemMercadoria,
  useSearchGruposProdutos,
  useSearchUnidadesProdutos,
} from '@/app/product/api';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function ProductForm({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [grupoSearch, setGrupoSearch] = useState('');
  const [unidadeSearch, setUnidadeSearch] = useState('');
  const [fornecedorSearch, setFornecedorSearch] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      descricao: '',
      grupoProduto: '',
      fornecedorId: '',
      referencia: '',
      unidadeProduto: '',
      origemMercadoria: '',
      ncm: '',
      observacao: '',
    },
  });

  // Fetch all grupos for initial load
  const { data: allGrupos } = useGetAllGruposProdutos();

  // Search grupos
  const { data: searchedGrupos } = useSearchGruposProdutos(grupoSearch);
  const gruposOptions = grupoSearch ? searchedGrupos || [] : allGrupos || [];

  // Fetch all unidades for initial load
  const { data: allUnidades } = useGetAllUnidadesProdutos();

  // Search unidades
  const { data: searchedUnidades } = useSearchUnidadesProdutos(unidadeSearch);
  const unidadesOptions = unidadeSearch ? searchedUnidades || [] : allUnidades || [];

  // Search fornecedores + initial load
  const { data: allFornecedores = [], isLoading: isLoadingFornecedores } = useGetAllFornecedores();
  const { data: searchedFornecedores = [], isLoading: isSearchingFornecedores } =
    useSearchFornecedores(fornecedorSearch);
  const fornecedoresOptions = fornecedorSearch ? searchedFornecedores || [] : allFornecedores || [];
  const fornecedoresLoading = isLoadingFornecedores || isSearchingFornecedores;

  // Fetch origem mercadoria
  const { data: origemMercadoriaOptions = [] } = useGetOrigemMercadoria();

  const { mutate: createProduct, isPending } = useCreateProduct();

  const onSubmit = async (data: CreateProductSchema) => {
    await createProduct(data as any, {
      onSuccess: (result) => {
        if (result) {
          toast.success('Produto criado com sucesso!');
          reset();
          setIsOpen(false);
        } else {
          toast.error('Erro ao criar produto');
        }
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          'produto.Descricao': 'descricao',
          'produto.GrupoProdutoId': 'grupoProdutoId',
          'produto.FornecedorId': 'fornecedorId',
          'produto.Referencia': 'referencia',
          'produto.UnidadeProdutoId': 'unidadeProdutoId',
          'produto.OrigemMercadoria': 'origemMercadoria',
          'produto.Ncm': 'ncm',
          'produto.Observacao': 'observacao',
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

          toast.error('Erro de validação', {
            description: 'Erro(s) encontrados nos dados enviados.',
          });
        } else {
          toast.error(errorData?.message || 'Erro ao criar produto');
        }
      },
    });
  };

  console.log(fornecedoresOptions);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] w-[95vw] sm:w-full overflow-hidden p-0">
          <div className="overflow-y-auto max-h-[95vh] px-3 py-4 sm:p-6">
            <DialogHeader className="space-y-1.5 sm:space-y-2">
              <DialogTitle className="text-base sm:text-lg md:text-xl">Novo Produto</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Separator className="my-3 sm:my-4" />

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <h3 className="text-xs sm:text-sm font-semibold">Informações Básicas</h3>

                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <FloatingInput
                      id="descricao"
                      {...register('descricao')}
                      label="Descrição"
                      className="rounded-md text-sm"
                    />
                    {errors.descricao && (
                      <span className="text-xs text-red-500 break-words">
                        {errors.descricao.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <FloatingInput
                        id="referencia"
                        {...register('referencia')}
                        label="Referência"
                        className="rounded-md text-sm"
                      />
                      {errors.referencia && (
                        <span className="text-xs text-red-500 break-words">
                          {errors.referencia.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <FloatingInput
                        id="ncm"
                        {...register('ncm')}
                        label="NCM"
                        className="rounded-md text-sm"
                      />
                      {errors.ncm && (
                        <span className="text-xs text-red-500 break-words">
                          {errors.ncm.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                      <Label className="text-xs sm:text-sm">Grupo</Label>
                      <Controller
                        control={control}
                        name="grupoProduto"
                        render={({ field }) => (
                          <Autocomplete
                            value={field.value}
                            onValueChange={field.onChange}
                            options={gruposOptions}
                            placeholder="Selecione o grupo"
                            searchPlaceholder="Buscar grupo..."
                            onSearch={setGrupoSearch}
                          />
                        )}
                      />
                      {errors.grupoProduto && (
                        <span className="text-xs text-red-500 break-words">
                          {errors.grupoProduto.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                      <Label className="text-xs sm:text-sm">Unidade</Label>
                      <Controller
                        control={control}
                        name="unidadeProduto"
                        render={({ field }) => (
                          <Autocomplete
                            value={field.value}
                            onValueChange={field.onChange}
                            options={unidadesOptions}
                            placeholder="Selecione a unidade"
                            searchPlaceholder="Buscar unidade..."
                            onSearch={setUnidadeSearch}
                          />
                        )}
                      />
                      {errors.unidadeProduto && (
                        <span className="text-xs text-red-500 break-words">
                          {errors.unidadeProduto.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                    <Label className="text-xs sm:text-sm">Fornecedor</Label>
                    <Controller
                      control={control}
                      name="fornecedorId"
                      render={({ field }) => (
                        <Autocomplete
                          value={field.value}
                          onValueChange={field.onChange}
                          options={fornecedoresOptions}
                          placeholder="Selecione o fornecedor"
                          searchPlaceholder="Buscar fornecedor..."
                          onSearch={setFornecedorSearch}
                          isLoading={fornecedoresLoading}
                        />
                      )}
                    />
                    {errors.fornecedorId && (
                      <span className="text-xs text-red-500 break-words">
                        {errors.fornecedorId.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                    <Label className="text-xs sm:text-sm">Origem da Mercadoria</Label>
                    <Controller
                      control={control}
                      name="origemMercadoria"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Selecione a origem" />
                          </SelectTrigger>
                          <SelectContent>
                            {origemMercadoriaOptions.map((origem) => (
                              <SelectItem key={origem.key} value={origem.key || 'err'}>
                                {origem.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.origemMercadoria && (
                      <span className="text-xs text-red-500 break-words">
                        {errors.origemMercadoria.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                    <Label className="text-xs sm:text-sm">Observação</Label>
                    <Textarea
                      {...register('observacao')}
                      placeholder="Observações adicionais..."
                      className="min-h-[70px] sm:min-h-[80px] md:min-h-[100px] text-sm resize-none"
                    />
                    {errors.observacao && (
                      <span className="text-xs text-red-500 break-words">
                        {errors.observacao.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-3 sm:mt-4 md:mt-6 flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="w-full sm:w-auto text-sm"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm">
                  {isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
