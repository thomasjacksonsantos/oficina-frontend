"use client"

import React from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    FilterFnOption

} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "./button"
import { Input } from './input'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    pageSize: number,
    searchFields: string[]
    defaultSearch: string
    searchPlaceholder: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSize,
    searchFields = [],
    defaultSearch = "",
    searchPlaceholder = ""
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState(defaultSearch)

    function normalizeString(value: string, whiteSpaceReplace = "-") {
        const alphabetSpecialChars = "àáäâãèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;";
        const alphabetCommonChars = "aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------";

        const normalizedValue = value
            .trim()
            .toLowerCase()
            .trim()
            .replace(/ /g, whiteSpaceReplace)
            .replace(/--/g, "-")
            .replace(/[&/\\#,+()$~%.'":*?<>{}\[\]]/g, "")
            .replace(new RegExp(alphabetSpecialChars.split("").join("|"), "g"), (c) =>
                alphabetCommonChars.charAt(alphabetSpecialChars.indexOf(c))
            );

        return normalizedValue;
    }


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        filterFns: {
            fuzzy: (row, _, value) => {
                const search = normalizeString(value)

                const data = row.original
                data.companyName = data.company.name
                return searchFields.some((field) => 
                    normalizeString(data[field].toString()).includes(search)
                )
            },
        },
        globalFilterFn: "fuzzy" as FilterFnOption<TData>,
        state: {
            sorting,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize
            },
        },
    })

    return (
        <div>
            <div className='flex items-center py-4'>
                <Input
                    placeholder={searchPlaceholder}
                    className='max-w-sm'
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Proxima
                </Button>
            </div>
        </div>
    )
}