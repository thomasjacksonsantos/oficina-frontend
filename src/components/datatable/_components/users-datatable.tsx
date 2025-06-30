"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "../_interfaces/user"
import { DataTable } from "@/components/ui/datatable"
import { Button } from "@/components/ui/button"
import { ArrowBigDown, User2 } from "lucide-react"

export const columns: ColumnDef<User>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: "ID",
    },
    {
        id: "name",
        accessorKey: "name",
        header: "Name"
    },
    {
        id: "username",
        accessorKey: "username",
        header: "Username"
    },
    {
        id: "email",
        accessorKey: "email",
        header: "Email"
    },
    {
        id: "company.name",
        accessorKey: "company.name",
        header: "Company Name"
    }
]

export default function UsersDataTable() {

    return (
        <>
            <div className="flex mb-2 flex-wrap items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Usuarios
                    </h2>
                    <span className="text-muted-foreground">
                        Aqui esta todos os seus clientes
                    </span>
                </div>
                <div>
                    <Button
                        variant="destructive"
                    >
                        Cadastrar Cliente
                        <User2 />
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                url="https://jsonplaceholder.typicode.com/users"
                sortColumns={["id", "name", "username", "email", "company.name"]}
                defaultSortDirection="asc"
            />
        </>
    )
}