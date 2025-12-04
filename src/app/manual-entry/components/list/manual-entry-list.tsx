import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetManualEntries, useActiveManualEntry, useDeactiveManualEntry } from '@/app/manual-entry/api';
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
import { createManualEntryColumns } from './manual-entry-columns';
import { useManualEntryContext } from './manual-entry-context';
import { ManualEntry } from '@/api/manual-entry.types';
import ManualEntryHeaderList from './manual-entry-header-list';
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

export function ManualEntryList<TData extends ManualEntry, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  const [codigoInput, setCodigoInput] = useState('');
  const [numeroDocumentoInput, setNumeroDocumentoInput] = useState('');
  const [numeroPedidoInput, setNumeroPedidoInput] = useState('');
  const [dataInicioInput, setDataInicioInput] = useState('');
  const [dataFimInput, setDataFimInput] = useState('');
  const [tipoDataFiltro, setTipoDataFiltro] = useState<'entrada' | 'entrega' | 'emissao'>('entrada');
  
  const [q, setQ] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { setViewingEntry, setEditingEntry, setDeletingEntry } = useManualEntryContext();

  const { mutate: activeEntry, isPending: isActivating } = useActiveManualEntry();
  const { mutate: deactiveEntry, isPending: isDeactivating } = useDeactiveManualEntry();

  const handlers = useMemo(
    () => ({
      onView: (entry: ManualEntry) => {
        setViewingEntry(entry);
      },
      onEdit: (entry: ManualEntry) => {
        setEditingEntry(entry);
      },
      onDelete: (entry: ManualEntry) => {
        setDeletingEntry(entry);
      },
      onActive: (entryId: string) => {
        activeEntry(entryId, {
          onSuccess: () => {
            toast.success('Entrada manual ativada com sucesso!');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao ativar entrada manual';
            toast.error(errorMessage);
          },
        });
      },
      onDeactive: (entryId: string) => {
        deactiveEntry(entryId, {
          onSuccess: () => {
            toast.success('Entrada manual desativada com sucesso!');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao desativar entrada manual';
            toast.error(errorMessage);
          },
        });
      },
    }),
    [setViewingEntry, setEditingEntry, setDeletingEntry, activeEntry, deactiveEntry]
  );

  const cols = useMemo(() => {
    return createManualEntryColumns(handlers) as ColumnDef<TData, TValue>[];
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

  const { data, isLoading } = useGetManualEntries({
    page,
    q,
    limit,
    sortField,
    sortDirection,
    status: statusFilter || undefined,
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
    // Combine all search inputs into a single query string
    const searchTerms = [
      codigoInput,
      numeroDocumentoInput,
      numeroPedidoInput,
    ].filter(Boolean).join(' ');
    
    setQ(searchTerms);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <ManualEntryHeaderList />
        
        {/* Search Filters */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Código"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Nº Documento"
              value={numeroDocumentoInput}
              onChange={(e) => setNumeroDocumentoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Nº Pedido"
              value={numeroPedidoInput}
              onChange={(e) => setNumeroPedidoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <Input
              placeholder="Chave de acesso"
              className="md:col-span-2"
            />
            <Input
              placeholder="Fornecedor"
            />
            <Button onClick={handleSearch} className="w-full">
              Buscar
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoData"
                  value="entrada"
                  checked={tipoDataFiltro === 'entrada'}
                  onChange={(e) => setTipoDataFiltro(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Dt. Entrada</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoData"
                  value="entrega"
                  checked={tipoDataFiltro === 'entrega'}
                  onChange={(e) => setTipoDataFiltro(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Dt. Entrega</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoData"
                  value="emissao"
                  checked={tipoDataFiltro === 'emissao'}
                  onChange={(e) => setTipoDataFiltro(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Dt. Emissão</span>
              </label>
            </div>
            <div className="flex gap-2 ml-auto">
              <Input
                type="date"
                value={dataInicioInput}
                onChange={(e) => setDataInicioInput(e.target.value)}
                className="w-40"
              />
              <span className="flex items-center px-2">Até</span>
              <Input
                type="date"
                value={dataFimInput}
                onChange={(e) => setDataFimInput(e.target.value)}
                className="w-40"
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
                      onClick={() => handlers.onView(row.original as unknown as ManualEntry)}
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