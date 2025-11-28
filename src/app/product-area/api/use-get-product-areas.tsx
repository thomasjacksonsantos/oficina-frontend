import { useQuery } from "@tanstack/react-query";
import AreasApi from "@/api/area.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
}

// Mock data for demonstration
const getMockAreasPage = ({ page = 1, limit = 10, q = '' }: Params) => {
  const allAreas = [
    { id: '1', codigo: 'AUTO-001', descricao: 'Automotiva', descricaoEstendida: 'Área dedicada a produtos e serviços automotivos, incluindo lubrificantes, óleos e fluidos para veículos.', garantia: '12', status: 'Ativo' },
    { id: '2', codigo: 'IND-001', descricao: 'Industrial', descricaoEstendida: 'Área para produtos industriais de alta performance, incluindo lubrificantes e graxas para máquinas pesadas.', garantia: '24', status: 'Ativo' },
    { id: '3', codigo: 'COMB-001', descricao: 'Combustível', descricaoEstendida: 'Área especializada em combustíveis e aditivos para otimização de desempenho de motores.', garantia: '6', status: 'Ativo' },
    { id: '4', codigo: 'MAR-001', descricao: 'Marítimo', descricaoEstendida: 'Produtos específicos para aplicações marítimas, incluindo óleos e lubrificantes resistentes à corrosão.', garantia: '18', status: 'Ativo' },
    { id: '5', codigo: 'AERO-001', descricao: 'Aeronáutico', descricaoEstendida: 'Lubrificantes de alta performance para aviação, atendendo normas internacionais de segurança.', garantia: '36', status: 'Inativo' },
    { id: '6', codigo: 'AGRO-001', descricao: 'Agrícola', descricaoEstendida: 'Produtos desenvolvidos para equipamentos agrícolas, tratores e implementos do campo.', garantia: '12', status: 'Ativo' },
    { id: '7', codigo: 'MIN-001', descricao: 'Mineração', descricaoEstendida: 'Lubrificantes especiais para equipamentos de mineração que operam em condições extremas.', garantia: '24', status: 'Ativo' },
    { id: '8', codigo: 'CONST-001', descricao: 'Construção', descricaoEstendida: 'Produtos para máquinas e equipamentos de construção civil e obras pesadas.', garantia: '12', status: 'Ativo' },
    { id: '9', codigo: 'FOOD-001', descricao: 'Alimentícia', descricaoEstendida: 'Lubrificantes grau alimentício para uso em indústrias de processamento de alimentos.', garantia: '12', status: 'Ativo' },
    { id: '10', codigo: 'FARM-001', descricao: 'Farmacêutica', descricaoEstendida: 'Produtos certificados para uso em ambientes farmacêuticos e hospitalares.', garantia: '18', status: 'Ativo' },
    { id: '11', codigo: 'TEX-001', descricao: 'Têxtil', descricaoEstendida: 'Lubrificantes especiais para máquinas têxteis e equipamentos de costura industrial.', garantia: '6', status: 'Inativo' },
    { id: '12', codigo: 'PAPEL-001', descricao: 'Papel e Celulose', descricaoEstendida: 'Produtos para indústria de papel, incluindo óleos e graxas para equipamentos de alta velocidade.', garantia: '12', status: 'Ativo' },
    { id: '13', codigo: 'PLAST-001', descricao: 'Plásticos', descricaoEstendida: 'Lubrificantes para máquinas de injeção e extrusão de plásticos.', garantia: '12', status: 'Ativo' },
    { id: '14', codigo: 'METAL-001', descricao: 'Metalúrgica', descricaoEstendida: 'Produtos para operações de usinagem, corte e conformação de metais.', garantia: '18', status: 'Ativo' },
    { id: '15', codigo: 'ECO-001', descricao: 'Ecológico', descricaoEstendida: 'Linha de produtos biodegradáveis e ecologicamente corretos para diversas aplicações.', garantia: '12', status: 'Ativo' },
  ];

  const filtered = q 
    ? allAreas.filter(a => 
        a.codigo.toLowerCase().includes(q.toLowerCase()) ||
        a.descricao.toLowerCase().includes(q.toLowerCase()) ||
        a.descricaoEstendida.toLowerCase().includes(q.toLowerCase())
      )
    : allAreas;

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

export function useGetAreas(
  { page, q, limit, sortField, sortDirection, status }: Params = {}
) {
  return useQuery({
    queryKey: ['getAreas', [{ page, q, limit, sortField, sortDirection, status }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }
        
        return getMockAreasPage({ page, q, limit, sortField, sortDirection, status });
      }
      
      return AreasApi.getAreas({ page, q, limit, sortField, sortDirection, status }, { signal });
    },
  });
}
