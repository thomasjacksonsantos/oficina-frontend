import { Page } from '@/typings/page.types'
import { Product, CreateProductInput, UpdateProductInput } from './products.types'
import { BaseApi } from './base.api';

const ENDPOINT = "v1/products"

class ProductsApi extends BaseApi {
  async getProducts(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Product>>(ENDPOINT, queryString, options);
  }

  async getProductById(id: string) {
    return this.get<Product>(`${ENDPOINT}/${id}`);
  }

  async createProduct(product: CreateProductInput) {
    return this.post<Product>(ENDPOINT, product);
  }

  async updateProduct(id: string, product: UpdateProductInput) {
    return this.put<Product>(`${ENDPOINT}/${id}`, product);
  }

  async deleteProduct(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }
}

export default new ProductsApi() as ProductsApi

