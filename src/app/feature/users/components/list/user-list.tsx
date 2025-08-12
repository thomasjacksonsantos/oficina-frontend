import React, { useMemo, useState } from 'react'
import { useGetUsers } from '@/app/feature/users/api/use-get-users'
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
import { ArrowUp, Ghost } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import UserHeaderList from './user-header-list'
import { Toaster } from 'sonner'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    sortColumns?: string[];
    defaultSortField?: string;
    defaultSortDirection?: "asc" | "desc";
}

export function UserList<TData, TValue>({
    columns,
    sortColumns,
    defaultSortField,
    defaultSortDirection,
}: DataTableProps<TData, TValue>) {
    const [page, setPage] = useState<number>()
    const [inputValue, setInputValue] = useState('')
    const [q, setQ] = useState('')
    const [limit, setLimit] = useState<number>()
    const [sortField, setSortField] = useState(defaultSortField);
    const [sortDirection, setSortDirection] = useState(defaultSortDirection);

    console.log("user-list")
    const { data, isLoading } = useGetUsers({ page, q, limit, sortField, sortDirection });

    const cols = useMemo(() => [], [columns])

    const { items, meta } = React.useMemo(() => {
        return {
            items: data?.items || [],
            meta: data?.meta || { page: 1, totalPages: 1, total: 0, currentPage: 0, hasNextPage: false, hasPreviousPage: false, limit: 0, totalItems: 0 }
        };
    }, [data]);

    const pagesToRender = React.useMemo(() => {
        if (!meta) return [];

        const maxPagesToRender = 5;

        const pages = [];
        let startIndex = meta.totalPages - 2;
        let endIndex = meta.currentPage + 2;

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

    function handleTextareaChange(e: any) {
        setInputValue(e.target.value);
    }

    const table = useReactTable({
        data: items || [],
        columns: cols,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
            <Toaster
                richColors
                position='bottom-right'
            />

            <UserHeaderList />
            <div className='flex items-center justify-between'>
                <div className='flex flex-1 justify-start gap-2'>
                    <Input
                        className=' w-[272px]'

                        value={inputValue}
                        onChange={handleTextareaChange}
                        placeholder="Digite o nome do usuário"
                    />
                    <div className='flex gap-x-2'>
                        <Button onClick={() => setQ(inputValue)}>
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
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
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
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                Sem resultados.
                            </TableCell>
                        </TableRow>
                    )}
                    {isLoading && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
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
                                        onClick={() => setPage(page || 0 - 1)}
                                    >
                                    </PaginationPrevious>
                                </PaginationItem>

                                {pagesToRender.map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={() => setPage(page)}
                                            className={cn({
                                                underline: page === meta.currentPage,
                                            })}
                                        >
                                            {page}
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
                                        onClick={() => setPage(page || 0 + 1)}
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
                            Página {1} de {10} com{" "}
                            {meta.totalItems} resultados
                        </p>
                    </div>
                </>
            )
            }
        </>
    )
}
