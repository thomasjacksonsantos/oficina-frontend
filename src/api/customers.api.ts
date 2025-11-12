import { Page } from '@/typings/page.types'
import { BaseApi } from './base.api';
import { CreateCustomerInput, Customer, UpdateCustomerInput } from './customers.types';

const ENDPOINT = "v1/clientes"

class CustomersApi extends BaseApi {
  async getCustomers(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Customer>>(ENDPOINT, queryString, options);
  }

  async getCustomerById(id: string) {
    return this.get<Customer>(`${ENDPOINT}/${id}`);
  }

  async createCustomer(customer: CreateCustomerInput) {
    return this.post<Customer>(ENDPOINT, customer);
  }

  async updateCustomer(id: string, customer: UpdateCustomerInput) {
    return this.put<Customer>(`${ENDPOINT}/${id}`, customer);
  }

  async deleteCustomer(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }
}

export default new CustomersApi() as CustomersApi

