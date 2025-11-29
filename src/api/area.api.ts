import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateAreaInput, Area, UpdateAreaInput } from './area.types';

const ENDPOINT = 'v1/areas';

class AreasApi extends BaseApi {
  async getAreas(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Area>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getAreaById(id: string) {
    return this.get<Area>(`${ENDPOINT}/${id}`);
  }

  async createArea(area: CreateAreaInput) {
    return this.post<Area>(ENDPOINT, area);
  }

  async updateArea(area: UpdateAreaInput, id: string) {
    return this.post<CreateAreaInput>(`${ENDPOINT}/edit/${id}`, area);
  }

  async deleteArea(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeArea(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveArea(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new AreasApi() as AreasApi;
