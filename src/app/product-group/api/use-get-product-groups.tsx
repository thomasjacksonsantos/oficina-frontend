import { useQuery } from '@tanstack/react-query';
import ProductGroupsApi from '@/api/product-group.api';

type Params = {
  pagina?: number;
  q?: string;
  totalPagina?: number;
  sortField?: string;
  sortDirection?: string;
  status?: string;
};

// Mock data for demonstration
const getMockProductGroupsPage = ({ pagina = 1, totalPagina = 10, q = '' }: Params) => {
  const allGroups = [
    {
      id: '1',
      descricao: 'Lubrificantes Automotivos',
      area: 'Automotiva',
      ncm: '27101210',
      anp: 'LUB-001',
      status: 'Ativo',
    },
    {
      id: '2',
      descricao: 'Óleos de Motor',
      area: 'Automotiva',
      ncm: '27101220',
      anp: 'LUB-002',
      status: 'Ativo',
    },
    {
      id: '3',
      descricao: 'Graxas Industriais',
      area: 'Industrial',
      ncm: '27101230',
      anp: 'GRX-001',
      status: 'Ativo',
    },
    {
      id: '4',
      descricao: 'Fluidos de Freio',
      area: 'Automotiva',
      ncm: '38200000',
      anp: 'FLU-001',
      status: 'Ativo',
    },
    {
      id: '5',
      descricao: 'Aditivos Combustível',
      area: 'Combustível',
      ncm: '38112100',
      anp: 'ADT-001',
      status: 'Inativo',
    },
    {
      id: '6',
      descricao: 'Lubrificantes Industriais',
      area: 'Industrial',
      ncm: '27101240',
      anp: 'LUB-003',
      status: 'Ativo',
    },
    {
      id: '7',
      descricao: 'Óleos Hidráulicos',
      area: 'Industrial',
      ncm: '27101250',
      anp: 'HID-001',
      status: 'Ativo',
    },
    {
      id: '8',
      descricao: 'Graxas Especiais',
      area: 'Especial',
      ncm: '27101260',
      anp: 'GRX-002',
      status: 'Ativo',
    },
    {
      id: '9',
      descricao: 'Protetivos Anticorrosivos',
      area: 'Proteção',
      ncm: '27101270',
      anp: 'PRT-001',
      status: 'Ativo',
    },
    {
      id: '10',
      descricao: 'Desengraxantes',
      area: 'Limpeza',
      ncm: '34029090',
      anp: 'LMP-001',
      status: 'Ativo',
    },
    {
      id: '11',
      descricao: 'Fluidos de Transmissão',
      area: 'Automotiva',
      ncm: '27101280',
      anp: 'FLU-002',
      status: 'Ativo',
    },
    {
      id: '12',
      descricao: 'Óleos para Engrenagem',
      area: 'Industrial',
      ncm: '27101290',
      anp: 'ENG-001',
      status: 'Inativo',
    },
    {
      id: '13',
      descricao: 'Coolants Radiador',
      area: 'Automotiva',
      ncm: '38200010',
      anp: 'CLT-001',
      status: 'Ativo',
    },
    {
      id: '14',
      descricao: 'Óleos Compressores',
      area: 'Industrial',
      ncm: '27101291',
      anp: 'CMP-001',
      status: 'Ativo',
    },
    {
      id: '15',
      descricao: 'Lubrificantes Biodegradáveis',
      area: 'Ecológico',
      ncm: '27101292',
      anp: 'BIO-001',
      status: 'Ativo',
    },
  ];

  const filtered = q
    ? allGroups.filter(
        (g) =>
          g.descricao.toLowerCase().includes(q.toLowerCase()) ||
          g.area.toLowerCase().includes(q.toLowerCase()) ||
          g.ncm.includes(q) ||
          g.anp.toLowerCase().includes(q.toLowerCase())
      )
    : allGroups;

  const start = (pagina - 1) * totalPagina;
  const end = start + totalPagina;
  const paginatedData = filtered.slice(start, end);

  return {
    dados: paginatedData,
    totalRegistros: filtered.length,
    paginaAtual: pagina,
    itensPorPagina: totalPagina,
    totalPaginas: Math.ceil(filtered.length / totalPagina),
  };
};

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = false;

export function useGetProductGroups({
  pagina,
  q,
  totalPagina,
  sortField,
  sortDirection,
  status,
}: Params = {}) {
  return useQuery({
    queryKey: ['getProductGroups', [{ pagina, q, totalPagina, sortField, sortDirection, status }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }

        return getMockProductGroupsPage({
          pagina,
          q,
          totalPagina,
          sortField,
          sortDirection,
          status,
        });
      }

      return ProductGroupsApi.getProductGroups(
        { pagina, q, totalPagina, sortField, sortDirection, status },
        { signal }
      );
    },
  });
}
