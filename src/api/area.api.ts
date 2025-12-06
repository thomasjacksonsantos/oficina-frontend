import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateAreaInput, Area, UpdateAreaInput } from './area.types';

const ENDPOINT = 'v1/produtos/areas-produtos';

class AreasApi extends BaseApi {
  async getAreas(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Area>>(
      `${ENDPOINT}/all`,
      {
        pagina: queryString?.page,
        totalPagina: queryString?.limit,
      },
      options
    );
  }

  async getAreaById(id: string) {
    return this.get<Area>(`${ENDPOINT}/${id}`);
  }

  async createArea(area: CreateAreaInput) {
    return this.post<Area>(ENDPOINT, area);
  }

  async updateArea(area: UpdateAreaInput, id: string) {
    return this.put<UpdateAreaInput>(`${ENDPOINT}`, { id: id, ...area });
  }

  async deleteArea(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeArea(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/ativar`, {});
  }

  async deactiveArea(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desativar`);
  }
}

export default new AreasApi() as AreasApi;
