// api/product-marca.api.ts

import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  Marca,
  CreateMarcaInput,
  UpdateMarcaInput,
  GetMarcasParams,
  GetMarcasResponse,
} from './product-marca.types';

const ENDPOINT = 'v1/marcas';

class MarcasApi extends BaseApi {
  async getMarcas(queryString?: GetMarcasParams, options?: { signal?: AbortSignal }) {
    return await this.get<GetMarcasResponse>(ENDPOINT, queryString, options);
  }

  async getMarcaById(id: string) {
    return this.get<Marca>(`${ENDPOINT}/${id}`);
  }

  async createMarca(marca: CreateMarcaInput) {
    return this.post<Marca>(ENDPOINT, marca);
  }

  async updateMarca(marca: UpdateMarcaInput, id: string) {
    return this.put<Marca>(`${ENDPOINT}/${id}`, marca);
  }

  async deleteMarca(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeMarca(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/active`, {});
  }

  async deactiveMarca(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/deactive`);
  }
}

export default new MarcasApi() as MarcasApi;
