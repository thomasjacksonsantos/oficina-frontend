import React, { useMemo, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetPaymentForms, useActivePaymentForm, useDeactivePaymentForm } from '@/app/payment-form/api';
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
import { createPaymentFormColumns } from './payment-form-columns';
import { usePaymentFormContext } from './payment-form-context';
import { PaymentForm } from '@/api/payment-form.types';
import PaymentFormHeaderList from './payment-form-header-list';
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

export function PaymentFormList<TData extends PaymentForm, TValue>({
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
  const { setViewingPaymentForm, setEditingPaymentForm, setDeletingPaymentForm } = usePaymentFormContext();

  // Add the mutation hooks
  const { mutate: activePaymentForm, isPending: isActivating } = useActivePaymentForm();
  const { mutate: deactivePaymentForm, isPending: isDeactivating } = useDeactivePaymentForm();

  const handlers = useMemo(
    () => ({
      onView: (paymentForm: PaymentForm) => {
        setViewingPaymentForm(paymentForm);
      },
      onEdit: (paymentForm: PaymentForm) => {
        setEditingPaymentForm(paymentForm);
      },
      onDelete: (paymentForm: PaymentForm) => {
        setDeletingPaymentForm(paymentForm);
      },
      onActive: (paymentFormId: string) => {
        activePaymentForm(paymentFormId, {
          onSuccess: () => {
            toast.success('Forma de pagamento ativada com sucesso!');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao ativar forma de pagamento';
            toast.error(errorMessage);
          },
        });
      },
      onDeactive: (paymentFormId: string) => {
        deactivePaymentForm(paymentFormId, {
          onSuccess: () => {
            toast.success('Forma de pagamento desativada com sucesso!');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Erro ao desativar forma de pagamento';
            toast.error(errorMessage);
          },
        });
      },
    }),
    [setViewingPaymentForm, setEditingPaymentForm, setDeletingPaymentForm, activePaymentForm, deactivePaymentForm]
  );

  const cols = useMemo(() => {
    return createPaymentFormColumns(handlers) as ColumnDef<TData, TValue>[];
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
    pageIndex: 0, // initial page index
    pageSize: 10, // default page size
  });

  // Calculate page (1-based) from pageIndex
  const page = pagination.pageIndex + 1;
  const limit = pagination.pageSize;

  const { data, isLoading } = useGetPaymentForms({
    page,
    q,
    limit,
    sortField,
    sortDirection,
    status: statusFilter || undefined,
  });

  // Extract data and metadata from response
  const { items, totalRecords } = React.useMemo(() => {
    return {
      items: data?.dados || [],
      totalRecords: data?.totalRegistros || 0,
    };
  }, [data]);

  const table = useReactTable({
    data: items as unknown as TData[],
    columns: cols,
    manualPagination: true, // Manual pagination (server-side)
    pageCount: Math.ceil((totalRecords || 0) / pagination.pageSize), // Calculate total pages
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
        <PaymentFormHeaderList />
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 justify-start gap-2">
            <Input
              className="w-[200px]"
              value={inputValue}
              onChange={handleTextareaChange}
              placeholder="Descrição"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setQ(inputValue);
                  setPagination({ ...pagination, pageIndex: 0 });
                }
              }}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-x-2">
              <Button
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
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {!isLoading &&
                  table.getRowModel().rows?.length > 0 &&
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handlers.onView(row.original as unknown as PaymentForm)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          onClick={(e) => {
                            // Prevent row click when clicking on action buttons
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