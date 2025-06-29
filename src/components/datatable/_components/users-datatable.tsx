"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "../_interfaces/user"
import { DataTable } from "@/components/ui/datatable"

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
        <DataTable
            columns={columns}
            url="https://jsonplaceholder.typicode.com/users"
            sortColumns={["id", "name", "username", "email", "company.name"]}
            defaultSortDirection="asc"
        />
    )
}