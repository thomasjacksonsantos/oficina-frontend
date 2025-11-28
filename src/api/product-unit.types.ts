// api/product-unit.types.ts

export interface Unit {
  id: string;
  descricao: string;
  status?: string;
}

export interface CreateUnitInput {
  descricao: string;
}

export interface UpdateUnitInput {
  descricao: string;
}

export interface GetUnitsParams {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  status?: string;
}

export interface GetUnitsResponse {
  dados: Unit[];
  totalRegistros: number;
  paginaAtual: number;
  itensPorPagina: number;
  totalPaginas: number;
}
