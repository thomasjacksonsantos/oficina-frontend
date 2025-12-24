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
    return await this.get<Page<NotaFiscalListItem>>(
      `${ENDPOINT}/chaves-acesso-consultado`,
      {
        pagina: queryString?.page,
        totalPagina: queryString?.limit,
        q: queryString?.q,
      },
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
