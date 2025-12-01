import React, { useMemo, useState } from 'react';
import { useGetCustomers } from '@/app/customer/api';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Toaster } from 'sonner';
import { ServiceOrder } from '@/api/service-orders.types';
import { createCustomerColumns } from './customer-columns';
import { useCustomerContext } from './customer-context';
import { Customer } from '@/api/customers.types';
import CustomerHeaderList from './customer-header-list';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  sortColumns?: string[];
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
}

export function CustomerList<TData extends ServiceOrder, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState('');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState<number>(10);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || 'desc');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { setViewingCustomer, setEditingCustomer, setDeletingCustomer } = useCustomerContext();

  const { data, isLoading } = useGetCustomers({
    page,
    q,
    limit,
    sortField,
    sortDirection,
    status: statusFilter || undefined,
  });

  const handlers = useMemo(
    () => ({
      onView: (customer: Customer) => {
        setViewingCustomer(customer);
      },
      onEdit: (customer: Customer) => {
        setEditingCustomer(customer);
      },
      onDelete: (customer: Customer) => {
        setDeletingCustomer(customer);
      },
    }),
    [setViewingCustomer, setEditingCustomer, setDeletingCustomer]
  );

  const cols = useMemo(() => {
    return createCustomerColumns(handlers) as ColumnDef<TData, TValue>[];
  }, [handlers]);

  const { items, meta } = React.useMemo(() => {
    return {
      items: data?.dados || [],
      meta: {
        page: data?.paginaAtual || 1,
        totalPages: data?.totalPaginas || 1,
        total: data?.totalRegistros || 0,
        currentPage: data?.paginaAtual || 1,
        hasNextPage: (data?.paginaAtual || 1) < (data?.totalPaginas || 1),
        hasPreviousPage: (data?.paginaAtual || 1) > 1,
        limit: 10,
        totalItems: data?.totalRegistros || 0,
      },
    };
  }, [data]);

  const pagesToRender = React.useMemo(() => {
    if (!meta) return [];

    const maxPagesToRender = 5;

    const pages = [];
    let startIndex = Math.max(1, meta.currentPage - 2);
    let endIndex = Math.min(meta.totalPages, meta.currentPage + 2);

    if (meta.totalPages <= maxPagesToRender) {
      startIndex = 1;
      endIndex = meta.totalPages;
    } else {
      if (startIndex < 1) {
        startIndex = 1;
        endIndex = maxPagesToRender;
      }

      if (endIndex > meta.totalPages) {
        startIndex = meta.totalPages - maxPagesToRender + 1;
        endIndex = meta.totalPages;
      }
    }

    for (let i = startIndex; i <= endIndex; i++) {
      pages.push(i);
    }

    return pages;
  }, [meta]);

  function handleUpdateSort(field: string) {
    setPage(1);
    setSortField(field);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  const table = useReactTable({
    data: items as unknown as TData[],
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Toaster richColors position="bottom-right" />

      <CustomerHeaderList />
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-1 justify-start gap-2">
          <Input
            className="w-[272px]"
            value={inputValue}
            onChange={handleTextareaChange}
            placeholder="Buscar por código, cliente, placa..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setQ(inputValue);
                setPage(1);
              }
            }}
          />
          <div className="flex gap-x-2">
            <Button
              onClick={() => {
                setQ(inputValue);
                setPage(1);
              }}
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-border"
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = sortColumns?.includes(header.id);
                  const isSorted = sortField === header.id;
                  return (
                    <TableHead key={header.id} className="font-semibold text-foreground h-12">
                      <div
                        className={cn('flex items-center gap-1', {
                          'cursor-pointer hover:text-primary': isSortable,
                          'text-primary': isSorted,
                        })}
                        onClick={isSortable ? () => handleUpdateSort(header.id) : undefined}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {isSorted && (
                          <ArrowUp
                            className={cn('h-4 w-4', {
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
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handlers.onView(row.original as unknown as Customer)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-4"
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
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={cols.length} className="h-32 text-center text-muted-foreground">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={cols.length} className="h-32 text-center text-muted-foreground">
                  Carregando dados...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && table.getRowModel().rows?.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={!meta.hasPreviousPage}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Primeira página</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={!meta.hasPreviousPage}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Página anterior</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>

            <div className="flex items-center gap-1">
              {pagesToRender.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === meta.currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={cn('h-8 w-8 p-0', {
                    'bg-primary text-primary-foreground hover:bg-primary/90':
                      pageNum === meta.currentPage,
                  })}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
              disabled={!meta.hasNextPage}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Próxima página</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.totalPages)}
              disabled={!meta.hasNextPage}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Última página</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Página <span className="font-semibold text-foreground">{meta.currentPage}</span> de{' '}
            <span className="font-semibold text-foreground">{meta.totalPages}</span> com{' '}
            <span className="font-semibold text-foreground">{meta.totalItems}</span> resultados
          </p>
        </div>
      )}
    </>
  );
}
