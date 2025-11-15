import api from "@/services/axios";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { SignUpParams, SignUpResponse } from "@/types/auth";
import { Result } from "@/types/result/result";

export function useSignUp() {
  return useMutation({
    mutationFn: async (params: SignUpParams): Promise<SignUpResponse> => {
      const response = await api.post<SignUpResponse>("/api/v1/onboarding/admin", params);
      return response.data;
    },
    onSuccess: () => { },
    onError: (error: AxiosError): SignUpResponse => {
      throw error?.response?.data as SignUpResponse;
    },
  });
}
