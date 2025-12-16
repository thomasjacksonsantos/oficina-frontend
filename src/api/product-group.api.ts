import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  CreateProductGroupInput,
  ProductGroup,
  UpdateProductGroupInput,
} from './product-group.types';

const ENDPOINT = 'v1/produtos/grupos-produtos';

class ProductGroupsApi extends BaseApi {
  async getProductGroups(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<ProductGroup>>(
      `${ENDPOINT}/all`,
      {
        pagina: queryString?.pagina,
        totalPagina: queryString?.limit,
        q: queryString?.q,
      },
      options
    );
  }

  async getProductGroupById(id: string) {
    return this.get<ProductGroup>(`${ENDPOINT}/${id}`);
  }

  async createProductGroup(productGroup: CreateProductGroupInput) {
    return this.post<ProductGroup>(ENDPOINT, productGroup);
  }

  async updateProductGroup(productGroup: UpdateProductGroupInput, id: string) {
    return this.put<UpdateProductGroupInput>(`${ENDPOINT}`, { id: id, ...productGroup });
  }

  async deleteProductGroup(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeProductGroup(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/ativar`, {});
  }

  async deactiveProductGroup(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desativar`);
  }
}

export default new ProductGroupsApi() as ProductGroupsApi;
