"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
    id: string
    nome: string
    documento: string
    email: string
    telefone: string
    status: "ativo" | "inativo" | "sucesso" | "falhou"
}

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "documento",
        header: "Documento",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "telefone",
        header: "Telefone",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
]