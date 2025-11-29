import { Store } from '@/api/store.types';

// Mock store data - simulates current user's store
let mockStore: Store = {
  id: '1',
  nomeFantasia: 'AutoPeças Premium',
  razaoSocial: 'AutoPeças Premium Comércio LTDA',
  montadora: 'Honda',
  cnpj: '12345678000190',
  inscricaoEstadual: '123456789',
  inscricaoMunicipal: '987654321',
  endereco: {
    cep: '01310100',
    logradouro: 'Av. Paulista',
    numero: '1000',
    complemento: 'Sala 101',
    bairro: 'Bela Vista',
    estado: 'SP',
    cidade: 'São Paulo',
  },
  contato: [
    { tipo: 'Comercial', numero: '1133334444' },
    { tipo: 'WhatsApp', numero: '11987654321' },
  ],
  site: 'www.autopecaspremium.com.br',
  logo: '', // Will be handled by file upload
};

export function getMockStore(): Store {
  return { ...mockStore };
}

export function updateMockStore(updates: Partial<Store>): Store {
  mockStore = { ...mockStore, ...updates };
  return { ...mockStore };
}
