import { ServiceOrder, PaymentStatus, PaymentType } from "@/api/service-orders.types";
import { Page } from "@/typings/page.types";

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: 1,
    valorTotal: 114.80,
    dataFaturamentoInicial: "2025-01-15T08:30:00Z",
    dataFaturamentoFinal: "2025-01-15T17:30:00Z",
    observacao: "Troca de óleo e filtros. Verificar sistema de freios.",
    funcionarioId: 42,
    funcionario: {
      id: 42,
      nome: "João Silva",
      especialidade: "Mecânico Geral",
    },
    veiculoClienteId: 15,
    veiculoCliente: {
      id: 15,
      veiculoId: 8,
      veiculo: {
        id: 8,
        marca: "Honda",
        modelo: "Civic",
        ano: 2020,
        placa: "ABC-1234",
        cor: "Branco",
      },
      clienteId: 25,
      cliente: {
        id: 25,
        nome: "João Silva",
        documento: "123.456.789-00",
        email: "joao.silva@email.com",
        telefone: "(11) 98765-4321",
      },
    },
    itens: [
      {
        id: 1,
        descricao: "Troca de óleo do motor 5W-30",
        quantidade: 1,
        valorUnitario: 89.90,
        valorTotal: 89.90,
      },
      {
        id: 2,
        descricao: "Filtro de óleo original",
        quantidade: 1,
        valorUnitario: 24.90,
        valorTotal: 24.90,
      },
    ],
    pagamento: {
      id: 1,
      tipoPagamento: PaymentType.CARTAO_CREDITO,
      valorPago: 114.80,
      dataPagamento: "2025-01-15T17:45:00Z",
      status: PaymentStatus.PAGO,
    },
    criado: {
      dataHora: "2025-01-15T08:15:00Z",
    },
    atualizado: {
      dataHora: "2025-01-15T17:30:00Z",
    },
  },
  {
    id: 2,
    valorTotal: 189.90,
    dataFaturamentoInicial: "2025-01-16T09:00:00Z",
    observacao: "Problema no sistema de freios. Pastilhas desgastadas.",
    funcionarioId: 42,
    funcionario: {
      id: 42,
      nome: "João Silva",
      especialidade: "Mecânico Geral",
    },
    veiculoClienteId: 16,
    veiculoCliente: {
      id: 16,
      veiculoId: 9,
      veiculo: {
        id: 9,
        marca: "Toyota",
        modelo: "Corolla",
        ano: 2019,
        placa: "XYZ-5678",
        cor: "Prata",
      },
      clienteId: 26,
      cliente: {
        id: 26,
        nome: "Maria Santos",
        documento: "987.654.321-00",
        email: "maria.santos@email.com",
        telefone: "(11) 97654-3210",
      },
    },
    itens: [
      {
        id: 3,
        descricao: "Pastilha de freio dianteira",
        quantidade: 1,
        valorUnitario: 189.90,
        valorTotal: 189.90,
      },
    ],
    pagamento: {
      id: 2,
      tipoPagamento: PaymentType.PIX,
      valorPago: 189.90,
      dataPagamento: "2025-01-16T16:00:00Z",
      status: PaymentStatus.PAGO,
    },
    criado: {
      dataHora: "2025-01-16T09:00:00Z",
    },
    atualizado: {
      dataHora: "2025-01-16T10:30:00Z",
    },
  },
  {
    id: 3,
    valorTotal: 154.60,
    dataFaturamentoInicial: "2025-01-17T10:00:00Z",
    dataFaturamentoFinal: "2025-01-17T11:30:00Z",
    observacao: "Manutenção preventiva básica",
    funcionarioId: 43,
    funcionario: {
      id: 43,
      nome: "Ana Costa",
      especialidade: "Mecânico Especializado",
    },
    veiculoClienteId: 17,
    veiculoCliente: {
      id: 17,
      veiculoId: 10,
      veiculo: {
        id: 10,
        marca: "Volkswagen",
        modelo: "Gol",
        ano: 2021,
        placa: "DEF-9012",
        cor: "Preto",
      },
      clienteId: 27,
      cliente: {
        id: 27,
        nome: "Pedro Oliveira",
        documento: "456.789.123-00",
        email: "pedro.oliveira@email.com",
        telefone: "(11) 96543-2109",
      },
    },
    itens: [
      {
        id: 4,
        descricao: "Troca de óleo do motor 5W-30",
        quantidade: 1,
        valorUnitario: 89.90,
        valorTotal: 89.90,
      },
      {
        id: 5,
        descricao: "Filtro de óleo original",
        quantidade: 1,
        valorUnitario: 24.90,
        valorTotal: 24.90,
      },
      {
        id: 6,
        descricao: "Lâmpada H7 55W",
        quantidade: 2,
        valorUnitario: 19.90,
        valorTotal: 39.80,
      },
    ],
    pagamento: {
      id: 3,
      tipoPagamento: PaymentType.DINHEIRO,
      valorPago: 154.60,
      dataPagamento: "2025-01-17T11:30:00Z",
      status: PaymentStatus.PAGO,
    },
    criado: {
      dataHora: "2025-01-17T10:00:00Z",
    },
    atualizado: {
      dataHora: "2025-01-17T11:30:00Z",
    },
  },
  {
    id: 4,
    valorTotal: 349.90,
    dataFaturamentoInicial: "2025-01-18T08:30:00Z",
    observacao: "Troca de bateria e verificação do sistema elétrico",
    funcionarioId: 42,
    funcionario: {
      id: 42,
      nome: "João Silva",
      especialidade: "Mecânico Geral",
    },
    veiculoClienteId: 18,
    veiculoCliente: {
      id: 18,
      veiculoId: 11,
      veiculo: {
        id: 11,
        marca: "Ford",
        modelo: "Ka",
        ano: 2022,
        placa: "GHI-3456",
        cor: "Vermelho",
      },
      clienteId: 28,
      cliente: {
        id: 28,
        nome: "Fernanda Lima",
        documento: "789.123.456-00",
        email: "fernanda.lima@email.com",
        telefone: "(11) 95432-1098",
      },
    },
    itens: [
      {
        id: 7,
        descricao: "Bateria 60Ah",
        quantidade: 1,
        valorUnitario: 349.90,
        valorTotal: 349.90,
      },
    ],
    criado: {
      dataHora: "2025-01-18T08:30:00Z",
    },
    atualizado: {
      dataHora: "2025-01-18T08:30:00Z",
    },
  },
  {
    id: 5,
    valorTotal: 129.90,
    dataFaturamentoInicial: "2025-01-19T14:00:00Z",
    dataFaturamentoFinal: "2025-01-19T16:00:00Z",
    observacao: "Troca de velas e limpeza de bicos injetores",
    funcionarioId: 43,
    funcionario: {
      id: 43,
      nome: "Ana Costa",
      especialidade: "Mecânico Especializado",
    },
    veiculoClienteId: 19,
    veiculoCliente: {
      id: 19,
      veiculoId: 12,
      veiculo: {
        id: 12,
        marca: "Chevrolet",
        modelo: "Onix",
        ano: 2020,
        placa: "JKL-7890",
        cor: "Cinza",
      },
      clienteId: 29,
      cliente: {
        id: 29,
        nome: "Roberto Souza",
        documento: "321.654.987-00",
        email: "roberto.souza@email.com",
        telefone: "(11) 94321-0987",
      },
    },
    itens: [
      {
        id: 8,
        descricao: "Velas de ignição iridium",
        quantidade: 1,
        valorUnitario: 129.90,
        valorTotal: 129.90,
      },
    ],
    pagamento: {
      id: 4,
      tipoPagamento: PaymentType.CARTAO_DEBITO,
      valorPago: 129.90,
      dataPagamento: "2025-01-19T16:00:00Z",
      status: PaymentStatus.PAGO,
    },
    criado: {
      dataHora: "2025-01-19T14:00:00Z",
    },
    atualizado: {
      dataHora: "2025-01-19T16:00:00Z",
    },
  },
];

export function getMockServiceOrdersPage(params: {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  status?: string;
  priority?: string;
}): Page<ServiceOrder> {
  const { 
    page = 1, 
    q = "", 
    limit = 10, 
    sortField = "dataFaturamentoInicial", 
    sortDirection = "desc",
    status,
    priority,
  } = params;

  // Filter service orders
  let filtered = [...mockServiceOrders];
  
  // Search filter
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (so) =>
        so.id.toString().includes(query) ||
        so.veiculoCliente.cliente.nome.toLowerCase().includes(query) ||
        so.veiculoCliente.cliente.documento?.toLowerCase().includes(query) ||
        so.veiculoCliente.veiculo.placa.toLowerCase().includes(query) ||
        so.veiculoCliente.veiculo.modelo?.toLowerCase().includes(query) ||
        so.veiculoCliente.veiculo.marca?.toLowerCase().includes(query) ||
        so.observacao?.toLowerCase().includes(query) ||
        so.funcionario.nome.toLowerCase().includes(query)
    );
  }

  // Status filter (by payment status)
  if (status) {
    filtered = filtered.filter((so) => so.pagamento?.status === status);
  }

  // Priority filter (not applicable in new structure, but kept for compatibility)
  if (priority) {
    // Can be filtered by employee specialty or other criteria if needed
  }

  // Sort service orders
  filtered = filtered.sort((a, b) => {
    let aValue: any = a[sortField as keyof ServiceOrder];
    let bValue: any = b[sortField as keyof ServiceOrder];

    // Handle nested properties
    if (sortField === "cliente.nome" || sortField === "cliente.name") {
      aValue = a.veiculoCliente.cliente.nome;
      bValue = b.veiculoCliente.cliente.nome;
    } else if (sortField === "veiculo.placa" || sortField === "vehicle.licensePlate") {
      aValue = a.veiculoCliente.veiculo.placa;
      bValue = b.veiculoCliente.veiculo.placa;
    } else if (sortField === "funcionario.nome" || sortField === "responsible.name") {
      aValue = a.funcionario.nome;
      bValue = b.funcionario.nome;
    } else if (sortField === "startDate" || sortField === "createdAt") {
      aValue = a.dataFaturamentoInicial;
      bValue = b.dataFaturamentoInicial;
    } else if (sortField === "endDate" || sortField === "updatedAt") {
      aValue = a.dataFaturamentoFinal || a.dataFaturamentoInicial;
      bValue = b.dataFaturamentoFinal || b.dataFaturamentoInicial;
    }

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Handle dates
    if (sortField === "dataFaturamentoInicial" || sortField === "dataFaturamentoFinal" || 
        sortField === "startDate" || sortField === "endDate" || 
        sortField === "createdAt" || sortField === "updatedAt") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle undefined/null values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    meta: {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  };
}
