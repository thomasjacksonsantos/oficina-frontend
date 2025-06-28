// src/components/customer-table.tsx
import { useState } from "react"
import { Table, TableHead, TableRow, TableCell, TableBody } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

type Customer = {
    id: string
    name: string
    email: string
    // outros campos...
}

type Props = {
    data: Customer[]
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onFilter: (filter: string) => void
    loading?: boolean
}

export function CustomerTable({
    data,
    page,
    pageSize,
    total,
    onPageChange,
    onFilter,
    loading,
}: Props) {
    const [filter, setFilter] = useState("")

    const totalPages = Math.ceil(total / pageSize)

    return (
        <div>
            <div>
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Buscar cliente..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                    <Button onClick={() => onFilter(filter)}>Filtrar</Button>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            {/* outros campos */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={2}>Carregando...</TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2}>Nenhum cliente encontrado</TableCell>
                            </TableRow>
                        ) : (
                            data.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    {/* outros campos */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                    <Button
                        disabled={page === 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Anterior
                    </Button>
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        disabled={page === totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Próxima
                    </Button>
                </div>
            </div>
        </div>
    )
}