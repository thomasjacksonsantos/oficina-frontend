import React, { useMemo, useState } from 'react'
import { useGetCustomers } from '@/app/customer/api'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  TableHeader,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Toaster } from 'sonner'
import { ServiceOrder } from '@/api/service-orders.types'
import { createCustomerColumns } from './customer-columns'
import { useCustomerContext } from './customer-context'
import { Customer } from '@/api/customers.types'
import CustomerHeaderList from './customer-header-list'


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  sortColumns?: string[];
  defaultSortField?: string;
  defaultSortDirection?: "asc" | "desc";
}

export function CustomerList<TData extends ServiceOrder, TValue>({
  columns,
  sortColumns,
  defaultSortField,
  defaultSortDirection,
}: DataTableProps<TData, TValue>) {
  const [page, setPage] = useState<number>(1)
  const [inputValue, setInputValue] = useState('')
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState<number>(10)
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection || "desc");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { setViewingCustomer, setEditingCustomer, setDeletingCustomer } = useCustomerContext();

  const { data, isLoading } = useGetCustomers({ page, q, limit, sortField, sortDirection, status: statusFilter || undefined });

  const handlers = useMemo(() => ({
    onView: (customer: Customer) => {
      setViewingCustomer(customer);
    },
    onEdit: (customer: Customer) => {
      setEditingCustomer(customer);
    },
    onDelete: (customer: Customer) => {
      setDeletingCustomer(customer);
    },
  }), [setViewingCustomer, setEditingCustomer, setDeletingCustomer]);

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
        hasNextPage: false, 
        hasPreviousPage: false, 
        limit: 10, 
        totalItems: data?.totalRegistros || 0
    }
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
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  const table = useReactTable({
    data: items as unknown as TData[],
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Toaster
        richColors
        position='bottom-right'
      />

      <CustomerHeaderList />
      <div className='flex items-center justify-between gap-4 mb-4'>
        <div className='flex flex-1 justify-start gap-2'>
          <Input
            className='w-[272px]'
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
          <div className='flex gap-x-2'>
            <Button onClick={() => {
              setQ(inputValue);
              setPage(1);
            }}>
              Buscar
            </Button>
          </div>
        </div>
      </div>
      <Table className='mt-6'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = sortColumns?.includes(header.id);
                const isSorted = sortField === header.id;
                return (
                  <TableHead key={header.id}>
                    <div
                      className={cn("flex items-center gap-0.5", {
                        "cursor-pointer hover:text-foreground": isSortable,
                        "text-foreground": isSorted,
                      })}
                      onClick={
                        isSortable
                          ? () => handleUpdateSort(header.id)
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {isSorted && (
                        <ArrowUp
                          className={cn("ml-2 h-4 w-4", {
                            "rotate-180": sortDirection === "desc",
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
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handlers.onView(row.original as unknown as Customer)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} onClick={(e) => {
                    // Prevent row click when clicking on action buttons
                    if (cell.column.id === 'actions') {
                      e.stopPropagation();
                    }
                  }}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isLoading && table.getRowModel().rows?.length <= 0 && (
            <TableRow>
              <TableCell
                colSpan={cols.length}
                className="h-24 text-center"
              >
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={cols.length}
                className="h-24 text-center"
              >
                Carregando dados...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!isLoading && table.getRowModel().rows?.length > 0 && (
        <>
          <footer
            className="w-full mt-6 flex justify-center items-center"
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem disabled={!meta.hasPreviousPage}>
                  <PaginationPrevious
                    href="#"
                    title="Primeira"
                    onClick={() => setPage(1)}
                  >
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem disabled={!meta.hasPreviousPage}>
                  <PaginationPrevious
                    href="#"
                    title="Anterior"
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                  </PaginationPrevious>
                </PaginationItem>

                {pagesToRender.map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={() => setPage(pageNum)}
                      className={cn({
                        underline: pageNum === meta.currentPage,
                      })}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem
                  disabled={!meta.hasNextPage}
                  title='Próxima'
                >
                  <PaginationNext
                    title='Próxima'
                    href="#"
                    onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                  >
                    Próxima
                  </PaginationNext>
                </PaginationItem>
                <PaginationItem disabled={!meta.hasNextPage}>
                  <PaginationNext
                    href="#"
                    title="Última"
                    onClick={() => setPage(meta.totalPages)}
                  >
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </footer>
          <div className='mt-4 flex justify-center'>
            <p className="flex text-sm font-bold">
              Página {meta.currentPage} de {meta.totalPages} com{" "}
              {meta.totalItems} resultados
            </p>
          </div>
        </>
      )}
    </>
  )
}

