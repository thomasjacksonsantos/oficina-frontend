"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "../_interfaces/user"
import { DataTable } from "@/components/ui/datatable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Ghost } from "lucide-react"


export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            return <div>{row.getValue("id")}</div>
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (<Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>)
        },
        cell: ({ row }) => {
            return <div>{row.getValue("name")}</div>
        }
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div>{row.getValue("username")}</div>
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div>{row.getValue("email")}</div>
        }
    },
    {
        accessorKey: "company.name",
        id: "companyName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Company
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div>{row.getValue("companyName")}</div>
        }
    }
]

interface Props {
    users: User[],
    pageSize: number
}

export default function UsersDataTable({ users, pageSize }: Props) {
    return (
        <DataTable
            columns={columns}
            data={users}
            pageSize={pageSize}
            searchFields={["id", "name", "username", "email", "companyName"]}
            defaultSearch=""
            searchPlaceholder="Buscar cliente"
        />
    )
}