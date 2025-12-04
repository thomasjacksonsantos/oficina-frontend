import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreatePaymentFormInput, PaymentForm, UpdatePaymentFormInput } from './payment-form.types';

const ENDPOINT = 'v1/formas-pagamento';

class PaymentFormsApi extends BaseApi {
  async getPaymentForms(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<PaymentForm>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getPaymentFormById(id: string) {
    return this.get<PaymentForm>(`${ENDPOINT}/${id}`);
  }

  async createPaymentForm(paymentForm: CreatePaymentFormInput) {
    return this.post<PaymentForm>(ENDPOINT, paymentForm);
  }

  async updatePaymentForm(paymentForm: UpdatePaymentFormInput, id: string) {
    return this.post<CreatePaymentFormInput>(`${ENDPOINT}/edit/${id}`, paymentForm);
  }

  async deletePaymentForm(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activePaymentForm(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactivePaymentForm(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new PaymentFormsApi() as PaymentFormsApi;
