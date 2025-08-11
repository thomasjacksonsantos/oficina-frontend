import api from "@/services/axios";
import { AxiosError } from "axios";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { SignUpParams } from "@/types/auth";

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SignUpParams) => {
      const response = await api.post("/api/v1/onboarding/admin", params);
      return response.data;
    },
    onSuccess: () => {},
    onError: (error: AxiosError) => {
      switch (error.status) {
        default:
          throw new Error(
            "Ocorreu um erro inesperado. Tente novamente mais tarde."
          );
      }
    },
  });
}
