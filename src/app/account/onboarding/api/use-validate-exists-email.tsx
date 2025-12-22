import UsersApi from "@/api/users.api";
import { CreateLoginInput } from "@/api/account.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useValidateExistsEmail(email: string) {
  return useQuery({
    queryKey: ['validateExistsEmail', email],
    queryFn: ({ signal }) => UsersApi.validarEmailExistente(email),
  });
}

