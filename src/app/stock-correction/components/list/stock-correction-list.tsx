// app/stock-correction/components/list/stock-correction-list.tsx

import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetStockCorrections } from '@/app/stock-correction/api';
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
import { createStockCorrectionColumns } from './stock-correction-columns';
import { useStockCorrectionContext } from './stock-correction-context';
import { StockCorrection } from '@/api/stock-correction.types';
import StockCorrectionHeaderList from './stock-correction-header-list';
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

export function StockCorrectionList<TData extends StockCorrection, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  const [inputValue, setInputValue] = useState('');
  const [q, setQ] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  
  const { 
    setViewingStockCorrection, 
    setCorrectingStockCorrection 
  } = useStockCorrectionContext();

  const handlers = useMemo(
    () => ({
      onView: (stockCorrection: StockCorrection) => {
        setViewingStockCorrection(stockCorrection);
      },
      onCorrect: (stockCorrection: StockCorrection) => {
        setCorrectingStockCorrection(stockCorrection);
      },
    }),
    [setViewingStockCorrection, setCorrectingStockCorrection]
  );

  const cols = useMemo(() => {
    return createStockCorrectionColumns(handlers) as ColumnDef<TData, TValue>[];
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

  const { data, isLoading } = useGetStockCorrections({
    pagina,
    q,
    totalPagina,
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
      <Toaster richColors position="bottom-right" />

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <StockCorrectionHeaderList />
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row flex-1 justify-start gap-2">
            <Input
              className="w-full sm:w-[272px]"
              value={inputValue}
              onChange={handleTextareaChange}
              placeholder="Buscar por produto..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setQ(inputValue);
                  setPagination({ ...pagination, pageIndex: 0 });
                }
              }}
            />

            <div className="flex sm:block">
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setQ(inputValue);
                  setPagination({ ...pagination, pageIndex: 0 });
                }}
              >
                Buscar
              </Button>
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