import { useQuery } from "@tanstack/react-query";
import PaymentFormsApi from "@/api/payment-form.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
}

// Mock data for demonstration
const getMockPaymentFormsPage = ({ page = 1, limit = 10, q = '', status = '' }: Params) => {
  const allPaymentForms = [
    { 
      id: '1', 
      descricao: 'Dinheiro', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'Sem parcelamento',
      status: 'Ativo' 
    },
    { 
      id: '2', 
      descricao: 'Cartão de Crédito', 
      numeroParcela: 3, 
      tipoPagamento: 'Parcelado', 
      planoParcelamento: '3x sem juros',
      status: 'Ativo' 
    },
    { 
      id: '3', 
      descricao: 'Cartão de Débito', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'Débito em conta',
      status: 'Ativo' 
    },
    { 
      id: '4', 
      descricao: 'PIX', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'Pagamento instantâneo',
      status: 'Ativo' 
    },
    { 
      id: '5', 
      descricao: 'Boleto Bancário', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'Vencimento 7 dias',
      status: 'Ativo' 
    },
    { 
      id: '6', 
      descricao: 'Crediário Loja', 
      numeroParcela: 10, 
      tipoPagamento: 'Parcelado', 
      planoParcelamento: '10x com juros',
      status: 'Ativo' 
    },
    { 
      id: '7', 
      descricao: 'Transferência Bancária', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'TED/DOC',
      status: 'Inativo' 
    },
    { 
      id: '8', 
      descricao: 'Cheque', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'Compensação bancária',
      status: 'Inativo' 
    },
    { 
      id: '9', 
      descricao: 'Cartão Parcelado 6x', 
      numeroParcela: 6, 
      tipoPagamento: 'Parcelado', 
      planoParcelamento: '6x sem juros',
      status: 'Ativo' 
    },
    { 
      id: '10', 
      descricao: 'Cartão Parcelado 12x', 
      numeroParcela: 12, 
      tipoPagamento: 'Parcelado', 
      planoParcelamento: '12x com juros',
      status: 'Ativo' 
    },
    { 
      id: '11', 
      descricao: 'Carnê da Loja', 
      numeroParcela: 5, 
      tipoPagamento: 'Parcelado', 
      planoParcelamento: '5x mensais',
      status: 'Ativo' 
    },
    { 
      id: '12', 
      descricao: 'Vale Alimentação', 
      numeroParcela: 1, 
      tipoPagamento: 'À Vista', 
      planoParcelamento: 'Cartão benefício',
      status: 'Ativo' 
    },
  ];

  let filtered = allPaymentForms;

  // Apply search filter
  if (q) {
    filtered = filtered.filter(f => 
      f.descricao.toLowerCase().includes(q.toLowerCase()) ||
      f.tipoPagamento.toLowerCase().includes(q.toLowerCase()) ||
      f.planoParcelamento.toLowerCase().includes(q.toLowerCase())
    );
  }

  // Apply status filter
  if (status) {
    filtered = filtered.filter(f => f.status === status);
  }

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

export function useGetPaymentForms(
  { page, q, limit, sortField, sortDirection, status }: Params = {}
) {
  return useQuery({
    queryKey: ['getPaymentForms', [{ page, q, limit, sortField, sortDirection, status }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }
        
        return getMockPaymentFormsPage({ page, q, limit, sortField, sortDirection, status });
      }
      
      return PaymentFormsApi.getPaymentForms({ page, q, limit, sortField, sortDirection, status }, { signal });
    },
  });
}