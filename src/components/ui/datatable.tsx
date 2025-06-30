import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { Input } from './input'
import { Button } from './button'
import qs from 'qs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination'

async function fetchUsers<TData>(url: string): Promise<DataTableData<TData>> {
    const response = await fetch(
        `${url}`
    )
    if (!response.ok) throw new Error('Erro ao buscar usuários')
    const responseData = await response.json()
    return {
        items: responseData as TData[],
        metadata: {
            total: 100,
            page: 2,
            limit: 10,
            totalPages: 10,
            hasNextPage: true,
            hasPreviousPage: true
        }
    }
}

interface DataTableProps<TData, TValue> {
    url: string;
    columns: ColumnDef<TData, TValue>[];
    sortColumns?: string[];
    defaultSortField?: string;
    defaultSortDirection?: "asc" | "desc";
}

interface DataTableData<TData> {
    items: TData[];
    metadata: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export function DataTable<TData, TValue>({
    url,
    columns,
    sortColumns,
    defaultSortField,
    defaultSortDirection,
}: DataTableProps<TData, TValue>) {
    const [page, setPage] = useState<Number>()
    const [inputValue, setInputValue] = useState('')
    const [q, setQ] = useState('')
    const [limit, setLimit] = useState('')
    const [sortField, setSortField] = useState(defaultSortField);
    const [sortDirection, setSortDirection] = useState(defaultSortDirection);

    const { data, isLoading } = useQuery({
        queryKey: ['users', page, q, limit, sortField, sortDirection],
        queryFn: () => fetchUsers(`${url}?${qs.stringify(
            { page, q, limit, sortField, sortDirection })}`)
    })

    const { items, metadata } = React.useMemo<DataTableData<TData>>(() => {
        if (!data?.items) {
            return {
                items: [] as TData,
                metadata: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false
                }
            };
        }
        return { items: data.items || [], metadata: data.metadata };
    }, [data]);

    const pagesToRender = React.useMemo(() => {
        if (!metadata) return [];

        metadata.totalPages = 10
        metadata.page = 2
        metadata.total = 100

        const maxPagesToRender = 5;

        const pages = [];
        let startIndex = metadata.page - 2;
        let endIndex = metadata.page + 2;

        if (metadata.totalPages <= maxPagesToRender) {
            startIndex = 1;
            endIndex = metadata.totalPages;
        } else {
            if (startIndex < 1) {
                startIndex = 1;
                endIndex = maxPagesToRender;
            }

            if (endIndex > metadata.totalPages) {
                startIndex = metadata.totalPages - maxPagesToRender + 1;
                endIndex = metadata.totalPages;
            }
        }

        for (let i = startIndex; i <= endIndex; i++) {
            pages.push(i);
        }

        return pages;
    }, [metadata]);

    function handleUpdateSort(field: string) {
        setPage(1);
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    const table = useReactTable({
        data: data?.items || [],
        columns: columns as ColumnDef<unknown, any>[],
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
            <div className='flex items-center justify-between'>
                <div className='flex flex-1 justify-start gap-2'>
                    <Input
                        className=' w-[272px]'
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
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
                            <PaginationContent                                >
                                <PaginationItem disabled={!metadata.hasPreviousPage}>
                                    <PaginationPrevious 
                                        href="#" 
                                        title="Primeira"
                                        onClick={() => setPage(1)}
                                        defaultValue={"thomas"}
                                    >                                        
                                    </PaginationPrevious>
                                </PaginationItem>
                                <PaginationItem disabled={!metadata.hasPreviousPage}>
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
                                                underline: page === metadata.page,
                                            })}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem
                                    disabled={!metadata.hasNextPage}
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
                                <PaginationItem disabled={!metadata.hasNextPage}>
                                    <PaginationNext
                                        href="#"
                                        title="Última"
                                        onClick={() => setPage(metadata.totalPages)}
                                    >                                        
                                    </PaginationNext>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </footer>
                    <div className='mt-4 flex justify-center'>
                        <p className="flex text-sm font-bold">
                            Página {1} de {10} com{" "}
                            {metadata.total} resultados
                        </p>
                    </div>
                </>
            )
            }
        </>
    )
}
