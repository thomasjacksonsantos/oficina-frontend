import { Supplier } from '@/api/supplier.types';
import { Page } from '@/typings/page.types';

// Mock data storage
let mockSuppliers: Supplier[] = [
  {
    id: '1',
    nomeFantasia: 'Tech Solutions Ltda',
    razaoSocial: 'Tech Solutions LTDA',
    documento: '01010101011001',
    dataNascimento: '2015-03-15',
    emailFornecedor: 'contato@techsolutions.com.br',
    site: 'www.techsolutions.com.br',
    contatos: [
      { numero: '11987654321', tipoTelefone: 'Celular' },
      { numero: '1133334444', tipoTelefone: 'Comercial' },
    ],
    endereco: {
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'São Paulo',
      bairro: 'Centro',
      complemento: 'Sala 101',
      cep: '01310100',
      numero: '1000',
      logradouro: 'Av. Paulista',
    },
    inscricaoEstadual: '123456789',
    inscricaoMunicipal: '987654321',
    tipoConsumidor: 'Consumidor Final',
    indicadorIE: 'Contribuinte de ICMS (COM IE)',
    fornecedorStatus: 'Ativo',
  },
  {
    id: '2',
    nomeFantasia: 'Distribuidora ABC',
    razaoSocial: 'ABC Distribuidora LTDA',
    documento: '02020202022002',
    dataNascimento: '2018-07-20',
    emailFornecedor: 'vendas@abcdistribuidora.com',
    site: 'www.abcdistribuidora.com',
    contatos: [{ numero: '21987654321', tipoTelefone: 'Celular' }],
    endereco: {
      pais: 'Brasil',
      estado: 'RJ',
      cidade: 'Rio de Janeiro',
      bairro: 'Copacabana',
      complemento: 'Loja 5',
      cep: '22070002',
      numero: '500',
      logradouro: 'Av. Atlântica',
    },
    inscricaoEstadual: '987654321',
    inscricaoMunicipal: '123456789',
    tipoConsumidor: 'Revenda',
    indicadorIE: 'Contribuinte Isento de ICMS (Sem IE)',
    fornecedorStatus: 'Ativo',
  },
  {
    id: '3',
    nomeFantasia: 'Comércio XYZ',
    razaoSocial: 'XYZ Comércio e Serviços LTDA',
    documento: '03030303033003',
    dataNascimento: '2020-01-10',
    emailFornecedor: 'contato@xyz.com',
    site: 'www.xyz.com',
    contatos: [
      { numero: '31987654321', tipoTelefone: 'Celular' },
      { numero: '3133334444', tipoTelefone: 'Comercial' },
    ],
    endereco: {
      pais: 'Brasil',
      estado: 'MG',
      cidade: 'Belo Horizonte',
      bairro: 'Savassi',
      complemento: '',
      cep: '30130100',
      numero: '200',
      logradouro: 'Rua da Bahia',
    },
    inscricaoEstadual: '',
    inscricaoMunicipal: '456789123',
    tipoConsumidor: 'Consumidor Final',
    indicadorIE: 'Não Contribuinte de ICMS (Com ou sem IE)',
    fornecedorStatus: 'Inativo',
  },
];

let nextId = 4;

type GetSuppliersParams = {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  fornecedorStatus?: string;
};

export function getMockSuppliersPage(params: GetSuppliersParams = {}): Page<Supplier> {
  const {
    page = 1,
    q = '',
    limit = 10,
    sortField = 'nomeFantasia',
    sortDirection = 'asc',
    fornecedorStatus = '',
  } = params;

  // Filter by search query
  let filtered = [...mockSuppliers];

  if (q) {
    const searchLower = q.toLowerCase();
    filtered = filtered.filter(
      (supplier) =>
        supplier.nomeFantasia.toLowerCase().includes(searchLower) ||
        supplier.razaoSocial.toLowerCase().includes(searchLower) ||
        supplier.documento.includes(q)
    );
  }

  // Filter by fornecedorStatus
  if (fornecedorStatus) {
    filtered = filtered.filter((supplier) => supplier.fornecedorStatus === fornecedorStatus);
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: any = a[sortField as keyof Supplier];
    let bVal: any = b[sortField as keyof Supplier];

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Paginate
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    dados: paginated,
    totalRegistros: filtered.length,
    paginaAtual: page,
    totalPaginas: Math.ceil(filtered.length / limit),
    limite: limit,
  };
}

export function getMockSupplierById(id: string): Supplier | undefined {
  return mockSuppliers.find((s) => s.id === id);
}

export function createMockSupplier(supplier: Omit<Supplier, 'id' | 'fornecedorStatus'>): Supplier {
  const newSupplier: Supplier = {
    ...supplier,
    id: String(nextId++),
    fornecedorStatus: 'Ativo',
  };
  mockSuppliers.push(newSupplier);
  return newSupplier;
}

export function updateMockSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
  const index = mockSuppliers.findIndex((s) => s.id === id);
  if (index === -1) return null;

  mockSuppliers[index] = { ...mockSuppliers[index], ...updates };
  return mockSuppliers[index];
}

export function deleteMockSupplier(id: string): boolean {
  const index = mockSuppliers.findIndex((s) => s.id === id);
  if (index === -1) return false;

  mockSuppliers.splice(index, 1);
  return true;
}

export function activeMockSupplier(id: string): boolean {
  const supplier = mockSuppliers.find((s) => s.id === id);
  if (!supplier) return false;

  supplier.fornecedorStatus = 'Ativo';
  return true;
}

export function deactiveMockSupplier(id: string): boolean {
  const supplier = mockSuppliers.find((s) => s.id === id);
  if (!supplier) return false;

  supplier.fornecedorStatus = 'Inativo';
  return true;
}
