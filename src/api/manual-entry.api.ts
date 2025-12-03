import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateManualEntryInput, ManualEntry, UpdateManualEntryInput } from './manual-entry.types';

const ENDPOINT = 'v1/manual-entries';

class ManualEntryApi extends BaseApi {
  async getManualEntries(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<ManualEntry>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getManualEntryById(id: string) {
    return this.get<ManualEntry>(`${ENDPOINT}/${id}`);
  }

  async createManualEntry(entry: CreateManualEntryInput) {
    return this.post<ManualEntry>(ENDPOINT, entry);
  }

  async updateManualEntry(entry: UpdateManualEntryInput, id: string) {
    return this.post<CreateManualEntryInput>(`${ENDPOINT}/edit/${id}`, entry);
  }

  async deleteManualEntry(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeManualEntry(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveManualEntry(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new ManualEntryApi() as ManualEntryApi;
