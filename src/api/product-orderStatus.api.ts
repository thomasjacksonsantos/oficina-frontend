// api/product-orderStatus.api.ts
import { BaseApi } from './base.api';
import {
  OrderStatus,
  CreateOrderStatusInput,
  UpdateOrderStatusInput,
  GetOrderStatusParams,
  GetOrderStatusResponse,
} from './product-orderStatus.types';

const ENDPOINT = 'v1/orderStatus';

class OrderStatusApi extends BaseApi {
  async getOrderStatus(queryString?: GetOrderStatusParams, options?: { signal?: AbortSignal }) {
    return await this.get<GetOrderStatusResponse>(ENDPOINT, queryString, options);
  }

  async getOrderStatusById(id: string) {
    return this.get<OrderStatus>(`${ENDPOINT}/${id}`);
  }

  async createOrderStatus(orderStatus: CreateOrderStatusInput) {
    return this.post<OrderStatus>(ENDPOINT, orderStatus);
  }

  async updateOrderStatus(orderStatus: UpdateOrderStatusInput, id: string) {
    return this.put<OrderStatus>(`${ENDPOINT}/${id}`, orderStatus);
  }

  async deleteOrderStatus(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeOrderStatus(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/active`, {});
  }

  async deactiveOrderStatus(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/deactive`);
  }
}

export default new OrderStatusApi() as OrderStatusApi;
