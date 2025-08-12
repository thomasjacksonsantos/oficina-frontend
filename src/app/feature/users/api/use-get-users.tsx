import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UsersApi from "@/api/users.api";
import { User } from "@/api/users.types";

type Params = {
    page?: number
    q?: string
    limit?: number
    sortField?: string
    sortDirection?: string
}

export function useGetUsers(
    { page, q, limit, sortField, sortDirection }: Params
) {
    return useQuery({
        queryKey: ['getUsers', [{ page, q, limit, sortField, sortDirection }]],
        queryFn: ({ signal }) =>
            UsersApi.getUsers({ page, q, limit, sortField, sortDirection }),
    });
}