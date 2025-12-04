import { useQuery } from "@tanstack/react-query";
import BandeirasCartaoApi from "@/api/bandeira-cartao.api";

type Params = {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  status?: string;
};

// Mock data for demonstration
const getMockBandeirasCartaoPage = ({ page = 1, limit = 10, q = '' }: Params) => {
  const allBandeiras = [
    {
      id: '1',
      descricao: 'Visa',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos A',
      formaPagamento: 'Crédito',
      banco: { nome: 'Itaú' },
      status: 'Ativo'
    },
    {
      id: '2',
      descricao: 'Mastercard',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos B',
      formaPagamento: 'Débito',
      banco: { nome: 'Bradesco' },
      status: 'Ativo'
    },
    {
      id: '3',
      descricao: 'American Express',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos C',
      formaPagamento: 'Crédito',
      banco: { nome: 'Santander' },
      status: 'Inativo'
    },
    {
      id: '4',
      descricao: 'Elo',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos D',
      formaPagamento: 'Crédito',
      banco: { nome: 'Banco do Brasil' },
      status: 'Ativo'
    },
    {
      id: '5',
      descricao: 'Hipercard',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos E',
      formaPagamento: 'Crédito',
      banco: { nome: 'Itaú' },
      status: 'Ativo'
    },
    {
      id: '6',
      descricao: 'Diners Club',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos F',
      formaPagamento: 'Crédito',
      banco: { nome: 'Caixa' },
      status: 'Inativo'
    },
    {
      id: '7',
      descricao: 'Discover',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos G',
      formaPagamento: 'Crédito',
      banco: { nome: 'Bradesco' },
      status: 'Ativo'
    },
    {
      id: '8',
      descricao: 'Aura',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos H',
      formaPagamento: 'Débito',
      banco: { nome: 'Santander' },
      status: 'Ativo'
    },
    {
      id: '9',
      descricao: 'JCB',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos I',
      formaPagamento: 'Crédito',
      banco: { nome: 'Banco do Brasil' },
      status: 'Inativo'
    },
    {
      id: '10',
      descricao: 'Cabal',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos J',
      formaPagamento: 'Débito',
      banco: { nome: 'Itaú' },
      status: 'Ativo'
    },
    {
      id: '11',
      descricao: 'Banricompras',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos K',
      formaPagamento: 'Crédito',
      banco: { nome: 'Banrisul' },
      status: 'Ativo'
    },
    {
      id: '12',
      descricao: 'Alelo',
      planoContaRecebimento: 'Plano de Conta dos Recebimentos L',
      formaPagamento: 'Vale Refeição',
      banco: { nome: 'Bradesco' },
      status: 'Ativo'
    },
  ];

  const filtered = q
    ? allBandeiras.filter(b =>
        b.descricao.toLowerCase().includes(q.toLowerCase()) ||
        b.planoContaRecebimento.toLowerCase().includes(q.toLowerCase()) ||
        b.formaPagamento.toLowerCase().includes(q.toLowerCase()) ||
        b.banco.nome.toLowerCase().includes(q.toLowerCase())
      )
    : allBandeiras;

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

export function useGetBandeirasCartao(
  { page, q, limit, sortField, sortDirection, status }: Params = {}
) {
  return useQuery({
    queryKey: ['getBandeirasCartao', [{ page, q, limit, sortField, sortDirection, status }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }
        
        return getMockBandeirasCartaoPage({ page, q, limit, sortField, sortDirection, status });
      }
      
      return BandeirasCartaoApi.getBandeirasCartao({ page, q, limit, sortField, sortDirection, status }, { signal });
    },
  });
}