import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateProductGroupInput, ProductGroup, UpdateProductGroupInput } from './product-group.types';

const ENDPOINT = 'v1/grupos-produtos';

class ProductGroupsApi extends BaseApi {
  async getProductGroups(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<ProductGroup>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getProductGroupById(id: string) {
    return this.get<ProductGroup>(`${ENDPOINT}/${id}`);
  }

  async createProductGroup(productGroup: CreateProductGroupInput) {
    return this.post<ProductGroup>(ENDPOINT, productGroup);
  }

  async updateProductGroup(productGroup: UpdateProductGroupInput, id: string) {
    return this.post<CreateProductGroupInput>(`${ENDPOINT}/edit/${id}`, productGroup);
  }

  async deleteProductGroup(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeProductGroup(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveProductGroup(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new ProductGroupsApi() as ProductGroupsApi;
