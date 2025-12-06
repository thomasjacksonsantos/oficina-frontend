// api/product-unit.types.ts

export interface OrderStatus {
  id: string;
  descricao: string;
  statusPedidoCompraStatus?: string;
}

export interface CreateOrderStatusInput {
  descricao: string;
}

export interface UpdateOrderStatusInput {
  descricao: string;
}

export interface GetOrderStatusParams {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  status?: string;
}

export interface GetOrderStatusResponse {
  dados: OrderStatus[];
  totalRegistros: number;
  paginaAtual: number;
  itensPorPagina: number;
  totalPaginas: number;
}
