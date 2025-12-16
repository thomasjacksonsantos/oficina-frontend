import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetProducts, useActiveProduct, useDeactiveProduct } from '@/app/product/api';
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
import { ArrowUp } from 'lucide-react';
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
  const [codigoValue, setCodigoValue] = useState('');
  const [descricaoValue, setDescricaoValue] = useState('');
  const [aplicacaoValue, setAplicacaoValue] = useState('');
  const [grupoFilter, setGrupoFilter] = useState<string>('');
  const [marcaFilter, setMarcaFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [q, setQ] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  const { setViewingProduct, setEditingProduct, setDeletingProduct } = useProductContext();

  const { mutate: activeProduct, isPending: isActivating } = useActiveProduct();
  const { mutate: deactiveProduct, isPending: isDeactivating } = useDeactiveProduct();

  const handlers = useMemo(
    () => ({
      onView: (product: Product) => {
        setViewingProduct(product);
      },
      onEdit: (product: Product) => {
        setEditingProduct(product);
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
    status: statusFilter || undefined,
    grupo: grupoFilter || undefined,
    marca: marcaFilter || undefined,
  });

  const { items, totalRecords } = React.useMemo(() => {
    return {
      items: data?.dados || [],
      totalRecords: data?.totalRegistros || 0,
    };
  }, [data]);

  const table = useReactTable({
    data: items as unknown as TData[],
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
    const searchTerms = [];
    if (codigoValue) searchTerms.push(codigoValue);
    if (descricaoValue) searchTerms.push(descricaoValue);
    if (aplicacaoValue) searchTerms.push(aplicacaoValue);
    
    setQ(searchTerms.join(' '));
    setPagination({ ...pagination, pageIndex: 0 });
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <ProductHeaderList />
        
        <div className="flex flex-col gap-4 mb-4">
          {/* Search Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="w-[150px]"
              value={codigoValue}
              onChange={(e) => setCodigoValue(e.target.value)}
              placeholder="Código"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Input
              className="w-[200px]"
              value={descricaoValue}
              onChange={(e) => setDescricaoValue(e.target.value)}
              placeholder="Descrição"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Input
              className="w-[200px]"
              value={aplicacaoValue}
              onChange={(e) => setAplicacaoValue(e.target.value)}
              placeholder="Aplicação"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={grupoFilter} onValueChange={setGrupoFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="grupo1">Grupo 1</SelectItem>
                <SelectItem value="grupo2">Grupo 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={marcaFilter} onValueChange={setMarcaFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="marca1">Marca 1</SelectItem>
                <SelectItem value="marca2">Marca 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
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