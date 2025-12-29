import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  useGetProducts,
  useActiveProduct,
  useDeactiveProduct,
  useGetProduct,
  useGetProductStatus,
  useSearchGruposProdutos,
  useSearchUnidadesProdutos,
  useGetAllGruposProdutos,
  useGetAllUnidadesProdutos,
} from '@/app/product/api';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  TableHeader,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { createProductColumns } from './product-columns';
import { useProductContext } from './product-context';
import { Product } from '@/api/product.types';
import ProductHeaderList from './product-header-list';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { Autocomplete } from '@/components/ui/autocomplete';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  sortColumns?: string[];
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
}

export function ProductList<TData extends Product, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  const [inputValue, setInputValue] = useState('');
  const [q, setQ] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [grupoFilter, setGrupoFilter] = useState<string>('');
  const [unidadeFilter, setUnidadeFilter] = useState<string>('');
  const [grupoSearch, setGrupoSearch] = useState('');
  const [unidadeSearch, setUnidadeSearch] = useState('');

  const { setViewingProduct, setEditingProduct, setDeletingProduct } = useProductContext();

  const { mutate: activeProduct, isPending: isActivating } = useActiveProduct();
  const { mutate: deactiveProduct, isPending: isDeactivating } = useDeactiveProduct();
  const { mutate: getProduct } = useGetProduct();

  // Fetch status options
  const { data: statusOptions = [] } = useGetProductStatus();

  // Fetch all grupos/unidades for initial load and search
  const { data: allGrupos = [] } = useGetAllGruposProdutos();
  const { data: allUnidades = [] } = useGetAllUnidadesProdutos();

  // Search grupos and unidades for filters
  const { data: searchedGrupos = [] } = useSearchGruposProdutos(grupoSearch);
  const { data: searchedUnidades = [] } = useSearchUnidadesProdutos(unidadeSearch);

  // Use searched results when searching, otherwise fall back to full lists
  const gruposOptions = grupoSearch ? searchedGrupos : allGrupos;
  const unidadesOptions = unidadeSearch ? searchedUnidades : allUnidades;

  const handlers = useMemo(
    () => ({
      onView: (product: Product) => {
        setViewingProduct(product);
      },
      onEdit: (id: string) => {
        getProduct(id, {
          onSuccess: (data) => {
            setEditingProduct(data || null);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao buscar produto';
            toast.error(errorMessage);
          },
        });
      },
      onDelete: (product: Product) => {
        setDeletingProduct(product);
      },
      onActive: (productId: string) => {
        activeProduct(productId, {
          onSuccess: () => {
            toast.success('Produto ativado com sucesso!');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao ativar produto';
            toast.error(errorMessage);
          },
        });
      },
      onDeactive: (productId: string) => {
        deactiveProduct(productId, {
          onSuccess: () => {
            toast.success('Produto desativado com sucesso!');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao desativar produto';
            toast.error(errorMessage);
          },
        });
      },
    }),
    [setViewingProduct, setEditingProduct, setDeletingProduct, activeProduct, deactiveProduct]
  );

  const cols = useMemo(() => {
    return createProductColumns(handlers) as ColumnDef<TData, TValue>[];
  }, [handlers]);

  function handleUpdateSort(field: string) {
    setPagination({ ...pagination, pageIndex: 0 });
    setSortField(field);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const page = pagination.pageIndex + 1;
  const limit = pagination.pageSize;

  const { data, isLoading } = useGetProducts({
    page,
    q,
    limit,
    sortField,
    sortDirection,
    produtoStatus: statusFilter && statusFilter !== 'todos' ? statusFilter : undefined,
    grupoProdutoId: grupoFilter || undefined,
    unidadeProdutoId: unidadeFilter || undefined,
  });

  const { items, totalRecords } = React.useMemo(() => {
    return {
      items: data?.dados || [],
      totalRecords: data?.totalRegistros || 0,
    };
  }, [data]);

  // Map grupo/unidade ids to human-readable labels using fetched lists
  const displayItems = React.useMemo(() => {
    return (items || []).map((item: any) => {
      const grupo = allGrupos.find((g: any) => g.id === item.grupoProduto);
      const unidade = allUnidades.find((u: any) => u.id === item.unidadeProduto);
      return {
        ...item,
        grupoProduto: grupo?.descricao || item.grupoProduto || '-',
        unidadeProduto: unidade?.descricao || item.unidadeProduto || '-',
      };
    });
  }, [items, allGrupos, allUnidades]);

  const table = useReactTable({
    data: displayItems as unknown as TData[],
    columns: cols,
    manualPagination: true,
    pageCount: Math.ceil((totalRecords || 0) / pagination.pageSize),
    rowCount: totalRecords || 0,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const handleSearch = () => {
    setQ(inputValue);
    setPagination({ ...pagination, pageIndex: 0 });
  };
  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <ProductHeaderList />

        {/* Search Filters */}
        <div className="flex flex-col gap-4">
          {/* First Row - Text Search */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 gap-2">
              <Input
                className="flex-1"
                value={inputValue}
                onChange={handleTextareaChange}
                placeholder="Buscar por código, referência ou NCM..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Second Row - Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.key} value={status.key || 'err'}>
                      {status.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Grupo</Label>
              <Autocomplete
                value={grupoFilter}
                onValueChange={setGrupoFilter}
                options={gruposOptions}
                placeholder="Todos"
                searchPlaceholder="Buscar grupo..."
                onSearch={setGrupoSearch}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Unidade</Label>
              <Autocomplete
                value={unidadeFilter}
                onValueChange={setUnidadeFilter}
                options={unidadesOptions}
                placeholder="Todos"
                searchPlaceholder="Buscar unidade..."
                onSearch={setUnidadeSearch}
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]}>
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSortable = sortColumns?.includes(header.id);
                      const isSorted = sortField === header.id;
                      return (
                        <TableHead key={header.id}>
                          <div
                            className={cn('flex items-center gap-0.5', {
                              'cursor-pointer hover:text-foreground': isSortable,
                              'text-foreground': isSorted,
                            })}
                            onClick={isSortable ? () => handleUpdateSort(header.id) : undefined}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {isSorted && (
                              <ArrowUp
                                className={cn('ml-2 h-4 w-4', {
                                  'rotate-180': sortDirection === 'desc',
                                })}
                              />
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {!isLoading &&
                  table.getRowModel().rows?.length > 0 &&
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handlers.onView(row.original as unknown as Product)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          onClick={(e) => {
                            if (cell.column.id === 'actions') {
                              e.stopPropagation();
                            }
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!isLoading && table.getRowModel().rows?.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan={cols.length} className="h-24 text-center">
                      Sem resultados.
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={cols.length} className="h-24 text-center">
                      Carregando dados...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Total por páginas:
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
