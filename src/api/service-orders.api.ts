import { Page } from '@/typings/page.types'
import { ServiceOrder, CreateServiceOrderInput, UpdateServiceOrderInput } from './service-orders.types'
import { BaseApi } from './base.api';

const ENDPOINT = "/service-orders"

class ServiceOrdersApi extends BaseApi {
  async getServiceOrders(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<ServiceOrder>>(ENDPOINT, queryString, options);
  }

  async getServiceOrderById(id: string) {
    return this.get<ServiceOrder>(`${ENDPOINT}/${id}`);
  }

  async createServiceOrder(serviceOrder: CreateServiceOrderInput) {
    return this.post<ServiceOrder>(ENDPOINT, serviceOrder);
  }

  async updateServiceOrder(id: string, serviceOrder: UpdateServiceOrderInput) {
    return this.put<ServiceOrder>(`${ENDPOINT}/${id}`, serviceOrder);
  }

  async deleteServiceOrder(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }
}

export default new ServiceOrdersApi() as ServiceOrdersApi

