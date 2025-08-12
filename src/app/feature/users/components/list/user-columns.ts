import { User } from "@/api/users.types";
import { ColumnDef } from "@tanstack/react-table";

export const  UserColumns: ColumnDef<User>[] = [
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
    }
]