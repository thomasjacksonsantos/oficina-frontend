import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateProductInput, Product, UpdateProductInput } from './product.types';

const ENDPOINT = 'v1/products';

class ProductsApi extends BaseApi {
  async getProducts(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Product>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getProductById(id: string) {
    return this.get<Product>(`${ENDPOINT}/${id}`);
  }

  async createProduct(product: CreateProductInput) {
    return this.post<Product>(ENDPOINT, product);
  }

  async updateProduct(product: UpdateProductInput, id: string) {
    return this.post<CreateProductInput>(`${ENDPOINT}/edit/${id}`, product);
  }

  async deleteProduct(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeProduct(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveProduct(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new ProductsApi() as ProductsApi;
