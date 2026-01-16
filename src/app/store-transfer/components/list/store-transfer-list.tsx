// app/store-transfer/components/list/store-transfer-list.tsx

import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetStoreTransfers } from '@/app/store-transfer/api';
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
import { Toaster } from 'sonner';
import { createStoreTransferColumns } from './store-transfer-columns';
import { useStoreTransferContext } from './store-transfer-context';
import { StoreTransfer } from '@/api/store-transfer.types';
import StoreTransferHeaderList from './store-transfer-header-list';
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
import { useGetStores } from '@/app/store-transfer/api';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  sortColumns?: string[];
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
}

export function StoreTransferList<TData extends StoreTransfer, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  const [inputValue, setInputValue] = useState('');
  const [q, setQ] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  const [lojaOrigemFilter, setLojaOrigemFilter] = useState('all');
  const [lojaDestinoFilter, setLojaDestinoFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const { setViewingStoreTransfer, setEditingStoreTransfer } = useStoreTransferContext();

  // Fetch stores for filters
  const { data: stores = [] } = useGetStores();

  const handlers = useMemo(
    () => ({
      onView: (storeTransfer: StoreTransfer) => {
        setViewingStoreTransfer(storeTransfer);
      },
      onEdit: (storeTransfer: StoreTransfer) => {
        setEditingStoreTransfer(storeTransfer);
      },
    }),
    [setViewingStoreTransfer, setEditingStoreTransfer]
  );

  const cols = useMemo(() => {
    return createStoreTransferColumns(handlers) as ColumnDef<TData, TValue>[];
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

  const pagina = pagination.pageIndex + 1;
  const totalPagina = pagination.pageSize;

  const { data, isLoading } = useGetStoreTransfers({
    pagina,
    q,
    totalPagina,
    sortField,
    sortDirection,
    lojaOrigemId: lojaOrigemFilter !== 'all' ? lojaOrigemFilter : '',
    lojaDestinoId: lojaDestinoFilter !== 'all' ? lojaDestinoFilter : '',
    dataInicio: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
    dataFim: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined,
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
      <Toaster richColors position="bottom-right" />

      <div className="relative flex flex-col gap-4 overflow-auto px-4 py-4 lg:px-6">
        <StoreTransferHeaderList />

        {/* Filters - Responsive Layout */}
        <div className="flex flex-col gap-4 mb-4">
          {/* First Row: Origem and Destino - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <Label htmlFor="origem-filter" className="text-sm mb-2 block">
                Origem
              </Label>
              <Select value={lojaOrigemFilter} onValueChange={setLojaOrigemFilter}>
                <SelectTrigger id="origem-filter" className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {stores.map((store: any) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.nomeFantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label htmlFor="destino-filter" className="text-sm mb-2 block">
                Destino
              </Label>
              <Select value={lojaDestinoFilter} onValueChange={setLojaDestinoFilter}>
                <SelectTrigger id="destino-filter" className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {stores.map((store: any) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.nomeFantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row: Product Search - Full width on mobile */}
          <div className="w-full">
            <Label htmlFor="product-search" className="text-sm mb-2 block">
              Código Produto
            </Label>
            <Input
              id="product-search"
              value={inputValue}
              onChange={handleTextareaChange}
              placeholder="Buscar por produto..."
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setQ(inputValue);
                  setPagination({ ...pagination, pageIndex: 0 });
                }
              }}
            />
          </div>

          {/* Third Row: Date Range - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <Label className="text-sm mb-2 block">De</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateFrom && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full">
              <Label className="text-sm mb-2 block">Até</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateTo && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search Button - Full width on mobile */}
          <Button
            onClick={() => {
              setQ(inputValue);
              setPagination({ ...pagination, pageIndex: 0 });
            }}
            className="w-full sm:w-auto sm:self-start"
          >
            Buscar
          </Button>
        </div>

        {/* Table - Responsive with horizontal scroll on mobile */}
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]}>
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const isSortable = sortColumns?.includes(header.id);
                        const isSorted = sortField === header.id;
                        return (
                          <TableHead key={header.id} className="whitespace-nowrap">
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
                <TableBody>
                  {!isLoading &&
                    table.getRowModel().rows?.length > 0 &&
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap"
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
        </div>

        {/* Pagination - Responsive Layout */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-4">
          {/* Selection info - Hidden on mobile */}
          <div className="text-muted-foreground hidden sm:flex flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row sm:items-center">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <Label htmlFor="rows-per-page" className="text-sm font-medium whitespace-nowrap">
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

            {/* Page info and navigation */}
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  className="hidden sm:flex h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden sm:flex h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}