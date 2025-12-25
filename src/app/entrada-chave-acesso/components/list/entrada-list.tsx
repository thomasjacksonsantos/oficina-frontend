// app/entrada-chave-acesso/components/list/entrada-list.tsx

import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetNotasFiscais, useGetNotaFiscal } from '@/app/entrada-chave-acesso/api';
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
import { FloatingInput } from '@/components/ui/floating-input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCpfCnpj } from '@/helpers/formatCpfCnpj';
import { createEntradaColumns } from './entrada-columns';
import { useEntradaContext } from './entrada-context';
import { NotaFiscalListItem } from '@/api/entrada-chave-acesso.types';
import EntradaHeaderList from './entrada-header-list';
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

export function EntradaList<TData extends NotaFiscalListItem, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  interface FiltersState {
    codigo: string;
    nDocumento: string;
    nPedido: string;
    chaveAcesso: string;
    fornecedor: string;
    dataInicio: string;
    dataFim: string;
    tipoData: 'entrada' | 'entrega' | 'emissao';
  }

  const [filters, setFilters] = useState<FiltersState>({
    codigo: '',
    nDocumento: '',
    nPedido: '',
    chaveAcesso: '',
    fornecedor: '',
    dataInicio: '',
    dataFim: '',
    tipoData: 'entrada',
  });
  const [inputValue, setInputValue] = useState('');
  const [q, setQ] = useState<Record<string, any> | undefined>(undefined);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  const { setImportingNotaFiscal } = useEntradaContext();

  const { mutate: getNotaFiscal } = useGetNotaFiscal();

  const handlers = useMemo(
    () => ({
      onImport: (notaFiscal: NotaFiscalListItem) => {
        getNotaFiscal(notaFiscal.id, {
          onSuccess: (data) => {
            setImportingNotaFiscal(notaFiscal);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao buscar nota fiscal';
            toast.error(errorMessage);
          },
        });
      },
    }),
    [setImportingNotaFiscal, getNotaFiscal]
  );

  const cols = useMemo(() => {
    return createEntradaColumns(handlers) as ColumnDef<TData, TValue>[];
  }, [handlers]);

  function handleUpdateSort(field: string) {
    setPagination({ ...pagination, pageIndex: 0 });
    setSortField(field);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  }

  function handleSearch() {
    // Build search object from all filters and send as `q` object
    const searchObj: Record<string, any> = {};
    if (filters.codigo) searchObj.codigo = filters.codigo;
    if (filters.nDocumento) searchObj.nDocumento = filters.nDocumento;
    if (filters.nPedido) searchObj.nPedido = filters.nPedido;
    if (filters.chaveAcesso) searchObj.chaveAcesso = filters.chaveAcesso;
    if (filters.fornecedor) searchObj.fornecedor = filters.fornecedor;
    if (filters.dataInicio) searchObj.dataInicio = filters.dataInicio;
    if (filters.dataFim) searchObj.dataFim = filters.dataFim;
    // always include tipoData
    searchObj.tipoData = filters.tipoData;

    setQ(Object.keys(searchObj).length ? searchObj : undefined);
    setPagination({ ...pagination, pageIndex: 0 });
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

  const { data, isLoading } = useGetNotasFiscais({
    page,
    q,
    limit,
    sortField,
    sortDirection,
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

  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <EntradaHeaderList />

        {/* Filter Section */}
        <div className="space-y-4 mb-4">
          {/* First row - Text filters */}
          <div className="grid gap-2 md:grid-cols-5">
            <FloatingInput
              label="Código"
              value={filters.codigo}
              onChange={(e) => setFilters({ ...filters, codigo: e.target.value })}
              className="w-full"
            />
            <FloatingInput
              label="N. Documento"
              value={formatCpfCnpj(filters.nDocumento)}
              onChange={(e) => setFilters({ ...filters, nDocumento: e.target.value })}
              className="w-full"
            />
            <FloatingInput
              label="N. Pedido"
              value={filters.nPedido}
              onChange={(e) => setFilters({ ...filters, nPedido: e.target.value })}
              className="w-full"
            />
            <FloatingInput
              label="Chave de acesso"
              value={filters.chaveAcesso}
              onChange={(e) => setFilters({ ...filters, chaveAcesso: e.target.value })}
              className="w-full"
            />
            <FloatingInput
              label="Fornecedor"
              value={filters.fornecedor}
              onChange={(e) =>
                setFilters({ ...filters, fornecedor: formatCpfCnpj(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Second row - Date filters and radio buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FloatingInput
                type="date"
                label=" "
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                className="w-40"
              />
              <span className="text-muted-foreground">Até</span>
              <FloatingInput
                type="date"
                label=" "
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                className="w-40"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tipoData"
                  value="entrada"
                  checked={filters.tipoData === 'entrada'}
                  onChange={() => setFilters({ ...filters, tipoData: 'entrada' })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Dt. Entrada</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tipoData"
                  value="entrega"
                  checked={filters.tipoData === 'entrega'}
                  onChange={() => setFilters({ ...filters, tipoData: 'entrega' })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Dt. Entrega</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tipoData"
                  value="emissao"
                  checked={filters.tipoData === 'emissao'}
                  onChange={() => setFilters({ ...filters, tipoData: 'emissao' })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Dt. Emissão</span>
              </label>
            </div>

            <Button onClick={handleSearch} className="ml-auto">
              Buscar
            </Button>
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
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
