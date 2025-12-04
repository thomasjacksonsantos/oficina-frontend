import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateSupplierInput, Supplier, UpdateSupplierInput } from './supplier.types';

const ENDPOINT = 'v1/fornecedores';

class SuppliersApi extends BaseApi {
  async getSuppliers(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Supplier>>(`${ENDPOINT}/all`);
  }

  async getSupplierById(id: string) {
    return this.get<Supplier>(`${ENDPOINT}/${id}`);
  }

  async createSupplier(supplier: CreateSupplierInput) {
    return this.post<Supplier>(ENDPOINT, supplier);
  }

  async updateSupplier(supplier: UpdateSupplierInput, id: string) {
    return this.post<CreateSupplierInput>(`${ENDPOINT}/edit/${id}`, supplier);
  }

  async deleteSupplier(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeSupplier(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveSupplier(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new SuppliersApi() as SuppliersApi;
