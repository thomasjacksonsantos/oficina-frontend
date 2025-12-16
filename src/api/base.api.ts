import Axios from 'axios';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
});

// Interceptor de requisição para adicionar token
axios.interceptors.request.use(
  async (config) => {
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar 401
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se for 401 e não for uma retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenta forçar refresh do token
        const token = await auth.currentUser?.getIdToken(true);

        if (token) {
          // Atualiza o header da requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          // Tenta novamente a requisição
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar ao renovar o token, desloga o usuário
        await signOut(auth);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Se não for 401 ou já tentou retry, rejeita
    return Promise.reject(error);
  }
);

export class BaseApi {
  async get<T>(
    endpoint: string,
    queryString?: Record<string, any>,
    options?: { signal?: AbortSignal }
  ): Promise<T> {
    const { data } = await axios.get<T>(endpoint, {
      params: queryString,
      signal: options?.signal,
    });
    return data;
  }

  protected async post<T>(
    endpoint: string,
    body: any,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    const { data } = await axios.post<T>(endpoint, body, {
      headers: options?.headers,
    });
    return data;
  }

  protected async put<T>(
    endpoint: string,
    body: any,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    const { data } = await axios.put<T>(endpoint, body, {
      headers: options?.headers,
    });
    return data;
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    const { data } = await axios.delete<T>(endpoint);
    return data;
  }
}
