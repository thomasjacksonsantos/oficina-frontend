import usersApi from "@/api/users.api";
import { User } from "@/api/users.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: User) => usersApi.createUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getUsers'],
            });
        },
        onError: (error) => {
            console.error("Erro ao criar usuário:", error);
        },
    })
}
