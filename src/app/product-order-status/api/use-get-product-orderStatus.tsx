// app/product-orderStatus/api/use-get-product-orderStatuss.tsx

import { useQuery } from "@tanstack/react-query";
import OrderStatussApi from "@/api/product-orderStatus.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
}

// Mock data for demonstration
const getMockOrderStatussPage = ({ page = 1, limit = 10, q = '' }: Params) => {
  const allOrderStatuss = [
    { id: '1', descricao: 'Unidade', status: 'Ativo' },
    { id: '2', descricao: 'Caixa', status: 'Ativo' },
    { id: '3', descricao: 'Pacote', status: 'Ativo' },
    { id: '4', descricao: 'Litro', status: 'Ativo' },
    { id: '5', descricao: 'Quilograma', status: 'Inativo' },
    { id: '6', descricao: 'Metro', status: 'Ativo' },
    { id: '7', descricao: 'Peça', status: 'Ativo' },
    { id: '8', descricao: 'Dúzia', status: 'Ativo' },
    { id: '9', descricao: 'Centena', status: 'Ativo' },
    { id: '10', descricao: 'Milheiro', status: 'Ativo' },
    { id: '11', descricao: 'Galão', status: 'Inativo' },
    { id: '12', descricao: 'Barril', status: 'Ativo' },
    { id: '13', descricao: 'Tonelada', status: 'Ativo' },
    { id: '14', descricao: 'Grama', status: 'Ativo' },
    { id: '15', descricao: 'Mililitro', status: 'Ativo' },
  ];

  const filtered = q 
    ? allOrderStatuss.filter(u => 
        u.descricao.toLowerCase().includes(q.toLowerCase())
      )
    : allOrderStatuss;

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filtered.slice(start, end);

  return {
    dados: paginatedData,
    totalRegistros: filtered.length,
    paginaAtual: page,
    itensPorPagina: limit,
    totalPaginas: Math.ceil(filtered.length / limit),
  };
};

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = true;

export function useGetOrderStatuss(
  { page, q, limit, sortField, sortDirection, status }: Params = {}
) {
  return useQuery({
    queryKey: ['getOrderStatuss', [{ page, q, limit, sortField, sortDirection, status }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }
        
        return getMockOrderStatussPage({ page, q, limit, sortField, sortDirection, status });
      }
      
      return OrderStatussApi.getOrderStatus({ page, q, limit, sortField, sortDirection, status }, { signal });
    },
  });
}