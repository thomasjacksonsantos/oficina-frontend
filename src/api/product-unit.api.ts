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

const ENDPOINT = 'v1/units';

class UnitsApi extends BaseApi {
  async getUnits(queryString?: GetUnitsParams, options?: { signal?: AbortSignal }) {
    return await this.get<GetUnitsResponse>(ENDPOINT, queryString, options);
  }

  async getUnitById(id: string) {
    return this.get<Unit>(`${ENDPOINT}/${id}`);
  }

  async createUnit(unit: CreateUnitInput) {
    return this.post<Unit>(ENDPOINT, unit);
  }

  async updateUnit(unit: UpdateUnitInput, id: string) {
    return this.put<Unit>(`${ENDPOINT}/${id}`, unit);
  }

  async deleteUnit(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeUnit(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/active`, {});
  }

  async deactiveUnit(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/deactive`);
  }
}

export default new UnitsApi() as UnitsApi;
