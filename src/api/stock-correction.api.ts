// api/stock-correction.api.ts

import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  CreateStockCorrectionInput,
  StockCorrection,
  StockCorrectionDetail,
  UpdateStockCorrectionInput,
} from './stock-correction.types';

const ENDPOINT = 'v1/movimentos-estoque';

class StockCorrectionsApi extends BaseApi {
  async getStockCorrections(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<StockCorrection>>(
      `${ENDPOINT}/all`,
      {
        pagina: queryString?.pagina,
        totalPagina: queryString?.totalPagina,
        q: queryString?.q,
      },
      options
    );
  }

  async getStockCorrectionById(id: string) {
    return this.get<StockCorrectionDetail>(`${ENDPOINT}/${id}`);
  }

  async createStockCorrection(stockCorrection: CreateStockCorrectionInput) {
    return this.post<StockCorrection>(ENDPOINT, stockCorrection);
  }

  async updateStockCorrection(stockCorrection: UpdateStockCorrectionInput) {
    return this.put<StockCorrection>(ENDPOINT, stockCorrection);
  }
}

export default new StockCorrectionsApi() as StockCorrectionsApi;
