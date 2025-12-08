// api/product-unit.api.ts

import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  Unit,
  CreateUnitInput,
  UpdateUnitInput,
  GetUnitsParams,
  GetUnitsResponse,
} from './product-unit.types';

const ENDPOINT = 'v1/produtos/unidades-produtos';

class UnitsApi extends BaseApi {
  async getUnits(queryString?: GetUnitsParams, options?: { signal?: AbortSignal }) {
    return await this.get<GetUnitsResponse>(
      `${ENDPOINT}/all`,
      {
        pagina: queryString?.page,
        totalPagina: queryString?.limit,
        q: queryString?.q,
      },
      options
    );
  }

  async getUnitById(id: string) {
    return this.get<Unit>(`${ENDPOINT}/${id}`);
  }

  async createUnit(unit: CreateUnitInput) {
    return this.post<Unit>(ENDPOINT, unit);
  }

  async updateUnit(unit: UpdateUnitInput, id: string) {
    return this.put<Unit>(`${ENDPOINT}`, { id: id, ...unit });
  }

  async deleteUnit(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeUnit(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/ativar`, {});
  }

  async deactiveUnit(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desativar`);
  }
}

export default new UnitsApi() as UnitsApi;
