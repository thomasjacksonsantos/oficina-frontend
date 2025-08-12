
import Axios from "axios";
import { auth } from '@/firebase/config'

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL
});


export class BaseApi {
  async get<T>(
    endpoint: string,
    queryString?: Record<string, any>,
    options?: { signal?: AbortSignal }
  ): Promise<T> {
    const token = await auth.currentUser?.getIdToken()
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`
      return config;
    })

    const { data } = await axios.get<T>(endpoint, {
      params: queryString,
      signal: options?.signal,
    });
    return data;
  }

  // Você pode adicionar POST, PUT, DELETE aqui também.
  protected async post<T>(endpoint: string, body: any): Promise<T> {
    const token = await auth.currentUser?.getIdToken()
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`
      return config;
    })

    const { data } = await axios.post<T>(endpoint, body);
    return data;
  }
}