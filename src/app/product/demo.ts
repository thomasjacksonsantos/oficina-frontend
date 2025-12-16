import { Product } from '@/api/product.types'; // Adjust the import path as needed

export const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    descricao: 'Filtro de Óleo Automotivo Premium',
    aplicacao:
      'Compatível com motores 1.0, 1.4, 1.6 e 2.0. Ideal para veículos Volkswagen, Fiat, Chevrolet e Ford.',
    referencia: 'FO-2024-VW',
    codigoBarra: '7891234567890',
    marca: 'Mann Filter',
    grupo: 'Filtros',
    observacao: 'Produto em promoção até o final do mês',
    dadosComplementares: {
      fornecedor: 'Auto Peças Distribuidora Ltda',
      endereco: 'Rua das Indústrias, 1500 - São Paulo, SP',
      statusProduto: 'Ativo',
      estoque: 150,
      tipoUnidade: 'UN',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '84212300',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: 'Isento de substituição tributária',
    },
    preco: {
      compra: 25.5,
      venda: 45.9,
      custo: 28.75,
      compraFixo: 25.0,
      dataCompra: '2024-11-15',
      dataVenda: '2024-12-01',
      dataCusto: '2024-11-20',
      dataCompraFixo: '2024-11-01',
    },
    markup: {
      produto: 80.0,
      grupo: 75.0,
    },
  },
  {
    id: '2',
    descricao: 'Pastilha de Freio Dianteira Cerâmica',
    aplicacao:
      'Aplicável em Honda Civic, Corolla, HB20, Onix e modelos similares. Alta performance e durabilidade.',
    referencia: 'PF-CER-2024',
    codigoBarra: '7891234567891',
    marca: 'TRW',
    grupo: 'Sistema de Freio',
    observacao: 'Produto com garantia estendida de 12 meses',
    dadosComplementares: {
      fornecedor: 'Brasil Freios Importadora S.A.',
      endereco: 'Av. Industrial, 3200 - Curitiba, PR',
      statusProduto: 'Ativo',
      estoque: 85,
      tipoUnidade: 'CJ',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Importado',
      NCM: '87083010',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: 'Sujeito a substituição tributária',
    },
    preco: {
      compra: 95.0,
      venda: 189.9,
      custo: 105.5,
      compraFixo: 92.0,
      dataCompra: '2024-11-10',
      dataVenda: '2024-12-02',
      dataCusto: '2024-11-15',
      dataCompraFixo: '2024-10-20',
    },
    markup: {
      produto: 100.0,
      grupo: 95.0,
    },
  },
  {
    id: '3',
    descricao: 'Óleo Lubrificante 5W30 Sintético',
    aplicacao:
      'Lubrificante sintético de alta performance para motores a gasolina e flex. Recomendado para uso em climas variados.',
    referencia: 'OL-5W30-SYN',
    codigoBarra: '7891234567892',
    marca: 'Castrol',
    grupo: 'Lubrificantes',
    observacao: 'Embalagem de 1 litro',
    dadosComplementares: {
      fornecedor: 'Petrobras Lubrificantes',
      endereco: 'Rod. Presidente Dutra, km 163 - Rio de Janeiro, RJ',
      statusProduto: 'Ativo',
      estoque: 320,
      tipoUnidade: 'LT',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '27101929',
      ANP: '810301',
      regraEspecificaParaEsteItem: 'Sujeito a ICMS-ST conforme convênio 110/2007',
    },
    preco: {
      compra: 42.0,
      venda: 79.9,
      custo: 46.2,
      compraFixo: 41.5,
      dataCompra: '2024-11-18',
      dataVenda: '2024-12-01',
      dataCusto: '2024-11-22',
      dataCompraFixo: '2024-11-05',
    },
    markup: {
      produto: 90.0,
      grupo: 85.0,
    },
  },
  {
    id: '4',
    descricao: 'Bateria Automotiva 60Ah Selada',
    aplicacao:
      'Bateria de 60 amperes para veículos de pequeno e médio porte. Tecnologia selada livre de manutenção.',
    referencia: 'BAT-60AH-2024',
    codigoBarra: '7891234567893',
    marca: 'Moura',
    grupo: 'Elétrica',
    observacao: 'Instalação gratuita na compra',
    dadosComplementares: {
      fornecedor: 'Moura Baterias S.A.',
      endereco: 'Estrada do Encanamento, 1000 - Belo Jardim, PE',
      statusProduto: 'Ativo',
      estoque: 45,
      tipoUnidade: 'UN',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '85071000',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: 'Produto reciclável - devolução obrigatória',
    },
    preco: {
      compra: 280.0,
      venda: 489.9,
      custo: 308.0,
      compraFixo: 275.0,
      dataCompra: '2024-11-12',
      dataVenda: '2024-12-01',
      dataCusto: '2024-11-16',
      dataCompraFixo: '2024-10-28',
    },
    markup: {
      produto: 75.0,
      grupo: 70.0,
    },
  },
  {
    id: '5',
    descricao: 'Correia Dentada com Tensor',
    aplicacao:
      'Kit completo de correia dentada com tensor e polia. Para motores 1.0 e 1.4 VW/Fiat.',
    referencia: 'CD-KIT-VW14',
    codigoBarra: '7891234567894',
    marca: 'Gates',
    grupo: 'Motor',
    observacao: 'Recomenda-se troca a cada 50.000 km',
    dadosComplementares: {
      fornecedor: 'Gates do Brasil Ltda',
      endereco: 'Av. das Nações Unidas, 4777 - São Paulo, SP',
      statusProduto: 'Ativo',
      estoque: 62,
      tipoUnidade: 'KT',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '40103900',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: '',
    },
    preco: {
      compra: 185.0,
      venda: 349.9,
      custo: 203.5,
      compraFixo: 182.0,
      dataCompra: '2024-11-20',
      dataVenda: '2024-12-02',
      dataCusto: '2024-11-23',
      dataCompraFixo: '2024-11-08',
    },
    markup: {
      produto: 89.0,
      grupo: 85.0,
    },
  },
  {
    id: '6',
    descricao: 'Amortecedor Traseiro Pressurizado',
    aplicacao: 'Amortecedor a gás para eixo traseiro. Compatível com Gol, Palio, Celta e Uno.',
    referencia: 'AM-TR-GOL',
    codigoBarra: '7891234567895',
    marca: 'Cofap',
    grupo: 'Suspensão',
    observacao: 'Venda em pares - preço unitário',
    dadosComplementares: {
      fornecedor: 'Cofap Companhia Fabricadora de Peças',
      endereco: 'Rua Comendador Alfredo Maffei, 500 - Santo André, SP',
      statusProduto: 'Ativo',
      estoque: 28,
      tipoUnidade: 'UN',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '87088010',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: 'Sujeito a ST',
    },
    preco: {
      compra: 135.0,
      venda: 259.9,
      custo: 148.5,
      compraFixo: 132.0,
      dataCompra: '2024-11-14',
      dataVenda: '2024-12-01',
      dataCusto: '2024-11-18',
      dataCompraFixo: '2024-10-30',
    },
    markup: {
      produto: 92.0,
      grupo: 88.0,
    },
  },
  {
    id: '7',
    descricao: 'Vela de Ignição Iridium',
    aplicacao: 'Vela de alta performance com ponta de irídio. Para motores 1.0 a 2.0 Flex.',
    referencia: 'VG-IRID-2024',
    codigoBarra: '7891234567896',
    marca: 'NGK',
    grupo: 'Ignição',
    observacao: 'Maior durabilidade e economia de combustível',
    dadosComplementares: {
      fornecedor: 'NGK do Brasil Ltda',
      endereco: 'Rua Paul Rosenbaum, 577 - São Paulo, SP',
      statusProduto: 'Ativo',
      estoque: 240,
      tipoUnidade: 'UN',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Importado',
      NCM: '85113090',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: '',
    },
    preco: {
      compra: 28.0,
      venda: 54.9,
      custo: 30.8,
      compraFixo: 27.5,
      dataCompra: '2024-11-19',
      dataVenda: '2024-12-02',
      dataCusto: '2024-11-21',
      dataCompraFixo: '2024-11-10',
    },
    markup: {
      produto: 96.0,
      grupo: 92.0,
    },
  },
  {
    id: '8',
    descricao: 'Radiador Alumínio com Defletor',
    aplicacao:
      'Radiador completo em alumínio para sistemas de arrefecimento. Chevrolet Onix/Prisma 2012-2020.',
    referencia: 'RAD-ONIX-2020',
    codigoBarra: '7891234567897',
    marca: 'Visconde',
    grupo: 'Arrefecimento',
    observacao: 'Produto testado e certificado',
    dadosComplementares: {
      fornecedor: 'Visconde Radiadores Ltda',
      endereco: 'Av. São João, 2100 - Guarulhos, SP',
      statusProduto: 'Desativo',
      estoque: 12,
      tipoUnidade: 'UN',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '87089190',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: 'Substituição tributária ICMS',
    },
    preco: {
      compra: 420.0,
      venda: 789.9,
      custo: 462.0,
      compraFixo: 415.0,
      dataCompra: '2024-10-25',
      dataVenda: '2024-11-15',
      dataCusto: '2024-10-30',
      dataCompraFixo: '2024-10-10',
    },
    markup: {
      produto: 88.0,
      grupo: 85.0,
    },
  },
  {
    id: '9',
    descricao: 'Jogo de Cabos de Vela Silicone',
    aplicacao:
      'Cabos de vela em silicone de alta resistência. Para veículos com sistema de ignição eletrônica.',
    referencia: 'CV-SIL-UNI',
    codigoBarra: '7891234567898',
    marca: 'Tecfil',
    grupo: 'Ignição',
    observacao: 'Jogo com 4 cabos',
    dadosComplementares: {
      fornecedor: 'Tecfil Têxtil Ltda',
      endereco: 'Rua Ministro Godói, 969 - São Paulo, SP',
      statusProduto: 'Ativo',
      estoque: 78,
      tipoUnidade: 'JG',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '85447000',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: '',
    },
    preco: {
      compra: 68.0,
      venda: 129.9,
      custo: 74.8,
      compraFixo: 67.0,
      dataCompra: '2024-11-16',
      dataVenda: '2024-12-01',
      dataCusto: '2024-11-19',
      dataCompraFixo: '2024-11-02',
    },
    markup: {
      produto: 91.0,
      grupo: 88.0,
    },
  },
  {
    id: '10',
    descricao: 'Bomba de Combustível Elétrica Submersível',
    aplicacao:
      'Bomba elétrica para tanque de combustível. Compatível com sistemas Flex e Gasolina.',
    referencia: 'BC-ELE-FLEX',
    codigoBarra: '7891234567899',
    marca: 'Bosch',
    grupo: 'Alimentação',
    observacao: 'Inclui kit de instalação',
    dadosComplementares: {
      fornecedor: 'Robert Bosch Ltda',
      endereco: 'Via Anchieta, km 23,5 - São Bernardo do Campo, SP',
      statusProduto: 'Ativo',
      estoque: 34,
      tipoUnidade: 'UN',
    },
    dadosFiscalProduto: {
      origemMercadoria: 'Nacional',
      NCM: '84133090',
      ANP: 'N/A',
      regraEspecificaParaEsteItem: 'ST conforme protocolo ICMS',
    },
    preco: {
      compra: 245.0,
      venda: 459.9,
      custo: 269.5,
      compraFixo: 242.0,
      dataCompra: '2024-11-17',
      dataVenda: '2024-12-02',
      dataCusto: '2024-11-20',
      dataCompraFixo: '2024-11-07',
    },
    markup: {
      produto: 88.0,
      grupo: 85.0,
    },
  },
];
type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
  grupo?: string
  marca?: string
}
// Helper function to filter demo products based on query parameters
export function filterDemoProducts(params: Params) {
  let filtered = [...DEMO_PRODUCTS];

  // Filter by search query
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.descricao.toLowerCase().includes(query) ||
        p.referencia.toLowerCase().includes(query) ||
        p.codigoBarra.includes(query) ||
        p.marca.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (params.status) {
    filtered = filtered.filter((p) => p.dadosComplementares.statusProduto === params.status);
  }

  // Filter by grupo
  if (params.grupo) {
    filtered = filtered.filter((p) => p.grupo === params.grupo);
  }

  // Filter by marca
  if (params.marca) {
    filtered = filtered.filter((p) => p.marca === params.marca);
  }

  // Sort
  if (params.sortField && params.sortDirection) {
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (params.sortField) {
        case 'descricao':
          aValue = a.descricao;
          bValue = b.descricao;
          break;
        case 'preco.venda':
          aValue = a.preco.venda;
          bValue = b.preco.venda;
          break;
        case 'estoque':
          aValue = a.dadosComplementares.estoque;
          bValue = b.dadosComplementares.estoque;
          break;
        default:
          return 0;
      }

      if (params.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}
