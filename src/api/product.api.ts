import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
  GrupoProduto,
  UnidadeProduto,
  OrigemMercadoria,
  Fornecedor,
  StatusOption,
} from './product.types';

const ENDPOINT = 'v1/produtos';

class ProductsApi extends BaseApi {
  async getProducts(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Product>>(
      `${ENDPOINT}/all`,
      {
        pagina: queryString?.page,
        limite: queryString?.limit,
        productoStatus: queryString?.productoStatus,
        grupoProdutoId: queryString?.grupoProdutoId,
        unidadeProdutoId: queryString?.unidadeProdutoId,
        descricao: queryString?.descricao,
      },
      options
    );
  }

  async getProductById(id: string) {
    return this.get<UpdateProductInput>(`${ENDPOINT}/edit/${id}`);
  }

  async createProduct(product: CreateProductInput) {
    return this.post<Product>(ENDPOINT, product);
  }

  async updateProduct(product: UpdateProductInput, id: string) {
    return this.put<UpdateProductInput>(`${ENDPOINT}/${id}`, product);
  }

  async deleteProduct(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeProduct(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/ativar`, {});
  }

  async deactiveProduct(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desativar`);
  }

  // Autocomplete/Search endpoints
  async searchGruposProdutos(nome?: string): Promise<GrupoProduto[]> {
    const res = await this.get<{
      paginaAtual: number;
      limite: number;
      totalRegistros: number;
      totalPaginas: number;
      dados: GrupoProduto[];
    }>(`${ENDPOINT}/grupos-produtos/buscar`, {
      nome: nome || '',
    });

    // Support both plain array and paginated envelope { dados: [...] }
    return res?.dados || [];
  }

  async getAllGruposProdutos(): Promise<GrupoProduto[]> {
    // Endpoint returns a paginated envelope { paginaAtual, limite, totalRegistros, totalPaginas, dados: GrupoProduto[] }
    const res = await this.get<{
      paginaAtual: number;
      limite: number;
      totalRegistros: number;
      totalPaginas: number;
      dados: GrupoProduto[];
    }>(`${ENDPOINT}/grupos-produtos/all`);

    return res?.dados || [];
  }

  async searchUnidadesProdutos(nome?: string): Promise<UnidadeProduto[]> {
    const res = await this.get<{
      paginaAtual: number;
      limite: number;
      totalRegistros: number;
      totalPaginas: number;
      dados: UnidadeProduto[];
    }>(`${ENDPOINT}/unidades-produtos/buscar`, {
      nome: nome || '',
    });

    // Support both plain array and paginated envelope { dados: [...] }
    return res?.dados || [];
  }

  async getAllUnidadesProdutos(): Promise<UnidadeProduto[]> {
    const res = await this.get<{
      paginaAtual: number;
      limite: number;
      totalRegistros: number;
      totalPaginas: number;
      dados: UnidadeProduto[];
    }>(`${ENDPOINT}/unidades-produtos/all`);

    return res?.dados || [];
  }

  /**
   * Search products by descricao. Used for autocomplete/search.
   * Calls the `/buscar` endpoint with a `descricao` query parameter.
   */
  async searchProducts(descricao?: string, options?: { signal?: AbortSignal }): Promise<Product[]> {
    const res = await this.get<Product[]>(
      `${ENDPOINT}/buscar`,
      {
        descricao: descricao || '',
      },
      options
    );

    // Support both plain array and paginated envelope { dados: [...] }
    return (res as any)?.dados || (res as any) || [];
  }

  async searchFornecedores(nome?: string): Promise<Fornecedor[]> {
    const res = await this.get<{
      paginaAtual: number;
      limite: number;
      totalRegistros: number;
      totalPaginas: number;
      dados: Fornecedor[];
    }>(`v1/fornecedores/buscar`, {
      nome: nome || '',
    });

    // Support both plain array and paginated envelope { dados: [...] }
    return (res as any)?.dados || (res as any) || [];
  }

  async getAllFornecedores(): Promise<Fornecedor[]> {
    // Reuse the buscar endpoint to fetch all fornecedores by passing an empty name.
    const res = await this.get<{
      paginaAtual?: number;
      limite?: number;
      totalRegistros?: number;
      totalPaginas?: number;
      dados?: Fornecedor[];
    }>(`v1/fornecedores/buscar`, {
      nome: '',
    });

    // Support both paginated envelope and plain array responses
    return (res as any)?.dados || (res as any) || [];
  }

  async getOrigemMercadoria() {
    return this.get<OrigemMercadoria[]>('v1/dados-dominio/origemmercadoria');
  }

  async getProductStatus() {
    return this.get<StatusOption[]>('v1/dados-dominio/produtostatus');
  }
}

export default new ProductsApi() as ProductsApi;
