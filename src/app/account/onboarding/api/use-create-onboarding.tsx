import customersApi from "@/api/account.api";
import { CreateLoginInput } from "@/api/account.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOnboarding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (login: CreateLoginInput) =>
            customersApi.createLogin(login),
        onSuccess: () => { },
        onError: (error) => {
            console.error("Erro ao criar login:", error);
        },
    })
}

