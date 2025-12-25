// api/entrada-chave-acesso.api.ts

import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  NotaFiscalListItem,
  NotaFiscalDetalhes,
  ConsultaChaveAcessoInput,
  ConsultaXmlInput,
  UpsertProdutosInput,
  GrupoProduto,
  UnidadeProduto,
} from './entrada-chave-acesso.types';

const ENDPOINT = 'v1/estoques';
const PRODUTOS_ENDPOINT = 'v1/produtos';

class EntradaChaveAcessoApi extends BaseApi {
  async getNotasFiscais(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    // Build params: keep pagina and totalPagina, merge other top-level keys and
    // expand `q` object properties to top-level params so backend receives
    // each filter as its own query param (e.g. `codigo=...&nDocumento=...`).
    const params: Record<string, any> = {
      pagina: queryString?.page,
      totalPagina: queryString?.limit,
    };

    if (queryString) {
      // Copy other top-level keys (sortField, sortDirection, etc.)
      Object.entries(queryString).forEach(([key, value]) => {
        if (key === 'page' || key === 'limit' || key === 'q') return;
        if (value !== undefined) params[key] = value;
      });

      // If q is an object, expand its keys to top-level params
      if (typeof queryString.q === 'object' && queryString.q !== null) {
        Object.entries(queryString.q).forEach(([k, v]) => {
          if (v !== undefined) params[k] = v;
        });
      } else if (queryString.q !== undefined) {
        // Keep primitive q as-is
        params.q = queryString.q;
      }
    }

    return await this.get<Page<NotaFiscalListItem>>(
      `${ENDPOINT}/chaves-acesso-consultado`,
      params,
      options
    );
  }

  async getNotaFiscalById(id: string) {
    return this.get<NotaFiscalDetalhes>(`${ENDPOINT}/consultar-nota-fiscal/${id}`);
  }

  async consultarPorChaveAcesso(input: ConsultaChaveAcessoInput) {
    return this.post<NotaFiscalDetalhes>(
      `${ENDPOINT}/consultar-nota-fiscal-por-chave-acesso`,
      input
    );
  }

  async consultarPorXml(input: ConsultaXmlInput) {
    return this.post<NotaFiscalDetalhes>(`${ENDPOINT}/consultar-nota-fiscal-por-xml`, input);
  }

  async upsertProdutosPorNotaFiscal(lojaId: string, input: UpsertProdutosInput) {
    return this.post<void>(`/v1/lojas/estoques/upsert-produtos-por-nota-fiscal`, input);
  }

  async getGruposProdutos() {
    return this.get<Page<GrupoProduto>>(`${PRODUTOS_ENDPOINT}/grupos-produtos/all`);
  }

  async getUnidadesProdutos() {
    return this.get<Page<UnidadeProduto>>(`${PRODUTOS_ENDPOINT}/unidades-produtos/all`);
  }
}

export default new EntradaChaveAcessoApi() as EntradaChaveAcessoApi;
