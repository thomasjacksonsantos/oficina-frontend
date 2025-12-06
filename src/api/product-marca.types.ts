// api/product-unit.types.ts

export interface Marca {
  id: string;
  descricao: string;
  marcaProdutoStatus?: string;
}

export interface CreateMarcaInput {
  descricao: string;
}

export interface UpdateMarcaInput {
  descricao: string;
}

export interface GetMarcasParams {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  status?: string;
}

export interface GetMarcasResponse {
  dados: Marca[];
  totalRegistros: number;
  paginaAtual: number;
  itensPorPagina: number;
  totalPaginas: number;
}
