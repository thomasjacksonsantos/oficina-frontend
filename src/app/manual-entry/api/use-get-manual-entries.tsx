import { useQuery } from "@tanstack/react-query";
import ManualEntryApi from "@/api/manual-entry.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
}

// Mock data for demonstration
const getMockManualEntriesPage = ({ page = 1, limit = 10, q = '' }: Params) => {
  const allEntries = [
    {
      id: '1',
      codigo: 'D0001',
      data: '01/12/2025',
      nfRevenda: 'Sim',
      fornecedor: { id: '1', nome: 'Huracan' },
      dataEntrega: '01/12/2025',
      condicaoPagamento: 30,
      contato: 'João Silva',
      dataEmissao: '01/12/2025',
      numeroNotaFiscal: '123123',
      numeroPedidoCompra: '2',
      chaveAcesso: '12345678901234567890123456789012345678901234',
      observacao: 'Primeira entrada manual de teste',
      cabecalho: {
        quantidadeItens: 5,
        totalQuantidade: 50,
        valorICMSSubstituicao: 500.00,
        valorTotalProdutos: 5000.00,
        valorFrete: 100.00,
        valorSeguro: 50.00,
        valorDesconto: 200.00,
        outrasDespesasAcessorios: 30.00,
        valorTotalNota: 5480.00
      },
      lancado: {
        quantidadeItens: 5,
        totalQuantidade: 50,
        valorICMSSubstituicao: 500.00,
        valorTotalProdutos: 5000.00,
        valorFrete: 100.00,
        valorSeguro: 50.00,
        valorDesconto: 200.00,
        outrasDespesasAcessorios: 30.00,
        valorTotalNota: 5480.00
      },
      produtos: [
        {
          id: '1',
          codigo: '112',
          descricao: 'Descrição Produto 1',
          aplicacao: 'MONROE-AMORT',
          quantidade: 3,
          valorUnitario: 123.00,
          valorTotal: 369.00,
          valorICMS: 0.00,
          valorIPI: 0.00,
          valorDesconto: 0.00,
          descontoTICompraSeg: 0.00,
          descontoTICompraImp: 33.00,
          compraAnterior: 0.00,
          compraAtual: 123.00,
          estoqueAtual: 0
        }
      ],
      status: 'Ativo'
    },
    {
      id: '2',
      codigo: 'D0002',
      data: '01/12/2025',
      nfRevenda: 'Não',
      fornecedor: { id: '1', nome: 'Huracan' },
      dataEntrega: '01/12/2025',
      condicaoPagamento: 60,
      contato: 'Maria Santos',
      dataEmissao: '01/12/2025',
      numeroNotaFiscal: '4454232',
      numeroPedidoCompra: '2',
      chaveAcesso: '98765432109876543210987654321098765432109876',
      observacao: 'Segunda entrada manual',
      cabecalho: {
        quantidadeItens: 3,
        totalQuantidade: 30,
        valorICMSSubstituicao: 300.00,
        valorTotalProdutos: 3000.00,
        valorFrete: 80.00,
        valorSeguro: 40.00,
        valorDesconto: 150.00,
        outrasDespesasAcessorios: 20.00,
        valorTotalNota: 3290.00
      },
      lancado: {
        quantidadeItens: 3,
        totalQuantidade: 30,
        valorICMSSubstituicao: 300.00,
        valorTotalProdutos: 3000.00,
        valorFrete: 80.00,
        valorSeguro: 40.00,
        valorDesconto: 150.00,
        outrasDespesasAcessorios: 20.00,
        valorTotalNota: 3290.00
      },
      produtos: [
        {
          id: '2',
          codigo: '225',
          descricao: 'Descrição Produto 2',
          aplicacao: 'MONROE-AMORT',
          quantidade: 10,
          valorUnitario: 100.00,
          valorTotal: 1000.00,
          valorICMS: 0.00,
          valorIPI: 0.00,
          valorDesconto: 50.00,
          descontoTICompraSeg: 0.00,
          descontoTICompraImp: 10.00,
          compraAnterior: 0.00,
          compraAtual: 100.00,
          estoqueAtual: 5
        }
      ],
      status: 'Ativo'
    },
    {
      id: '3',
      codigo: 'D0003',
      data: '01/12/2025',
      nfRevenda: 'Sim',
      fornecedor: { id: '1', nome: 'Huracan' },
      dataEntrega: '01/12/2025',
      condicaoPagamento: 45,
      contato: 'Pedro Costa',
      dataEmissao: '01/12/2025',
      numeroNotaFiscal: '124564541',
      numeroPedidoCompra: '2',
      chaveAcesso: '11111111111111111111111111111111111111111111',
      observacao: 'Terceira entrada manual',
      cabecalho: {
        quantidadeItens: 7,
        totalQuantidade: 70,
        valorICMSSubstituicao: 700.00,
        valorTotalProdutos: 7000.00,
        valorFrete: 150.00,
        valorSeguro: 70.00,
        valorDesconto: 300.00,
        outrasDespesasAcessorios: 50.00,
        valorTotalNota: 7670.00
      },
      lancado: {
        quantidadeItens: 7,
        totalQuantidade: 70,
        valorICMSSubstituicao: 700.00,
        valorTotalProdutos: 7000.00,
        valorFrete: 150.00,
        valorSeguro: 70.00,
        valorDesconto: 300.00,
        outrasDespesasAcessorios: 50.00,
        valorTotalNota: 7670.00
      },
      produtos: [
        {
          id: '3',
          codigo: '338',
          descricao: 'Descrição Produto 3',
          aplicacao: 'MONROE-AMORT',
          quantidade: 7,
          valorUnitario: 200.00,
          valorTotal: 1400.00,
          valorICMS: 0.00,
          valorIPI: 0.00,
          valorDesconto: 100.00,
          descontoTICompraSeg: 0.00,
          descontoTICompraImp: 20.00,
          compraAnterior: 0.00,
          compraAtual: 200.00,
          estoqueAtual: 10
        }
      ],
      status: 'Inativo'
    },
    {
      id: '4',
      codigo: 'D0004',
      data: '01/12/2025',
      nfRevenda: 'Não',
      fornecedor: { id: '1', nome: 'Huracan' },
      dataEntrega: '01/12/2025',
      condicaoPagamento: 90,
      contato: 'Ana Oliveira',
      dataEmissao: '01/12/2025',
      numeroNotaFiscal: '214844',
      numeroPedidoCompra: '2',
      chaveAcesso: '22222222222222222222222222222222222222222222',
      observacao: 'Quarta entrada manual',
      cabecalho: {
        quantidadeItens: 4,
        totalQuantidade: 40,
        valorICMSSubstituicao: 400.00,
        valorTotalProdutos: 4000.00,
        valorFrete: 90.00,
        valorSeguro: 45.00,
        valorDesconto: 180.00,
        outrasDespesasAcessorios: 25.00,
        valorTotalNota: 4380.00
      },
      lancado: {
        quantidadeItens: 4,
        totalQuantidade: 40,
        valorICMSSubstituicao: 400.00,
        valorTotalProdutos: 4000.00,
        valorFrete: 90.00,
        valorSeguro: 45.00,
        valorDesconto: 180.00,
        outrasDespesasAcessorios: 25.00,
        valorTotalNota: 4380.00
      },
      produtos: [
        {
          id: '4',
          codigo: '441',
          descricao: 'Descrição Produto 4',
          aplicacao: 'MONROE-AMORT',
          quantidade: 4,
          valorUnitario: 150.00,
          valorTotal: 600.00,
          valorICMS: 0.00,
          valorIPI: 0.00,
          valorDesconto: 30.00,
          descontoTICompraSeg: 0.00,
          descontoTICompraImp: 15.00,
          compraAnterior: 0.00,
          compraAtual: 150.00,
          estoqueAtual: 8
        }
      ],
      status: 'Ativo'
    }
  ];

  const filtered = q 
    ? allEntries.filter(e => 
        e.codigo.toLowerCase().includes(q.toLowerCase()) ||
        e.numeroNotaFiscal.toLowerCase().includes(q.toLowerCase()) ||
        e.numeroPedidoCompra.toLowerCase().includes(q.toLowerCase()) ||
        e.fornecedor.nome.toLowerCase().includes(q.toLowerCase())
      )
    : allEntries;

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

export function useGetManualEntries(
  { page, q, limit, sortField, sortDirection, status }: Params = {}
) {
  return useQuery({
    queryKey: ['getManualEntries', [{ page, q, limit, sortField, sortDirection, status }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }
        
        return getMockManualEntriesPage({ page, q, limit, sortField, sortDirection, status });
      }
      
      return ManualEntryApi.getManualEntries({ page, q, limit, sortField, sortDirection, status }, { signal });
    },
  });
}