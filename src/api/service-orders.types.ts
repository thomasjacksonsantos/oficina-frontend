// Payment Status
export enum PaymentStatus {
  PAGO = "Pago",
  PENDENTE = "Pendente",
  CANCELADO = "Cancelado",
}

// Payment Type
export enum PaymentType {
  CARTAO_CREDITO = "Cartão de Crédito",
  CARTAO_DEBITO = "Cartão de Débito",
  DINHEIRO = "Dinheiro",
  PIX = "PIX",
  BOLETO = "Boleto",
}

// Service Order Item
export type ServiceOrderItem = {
  id: number;
  descricao: string; // Description
  quantidade: number; // Quantity
  valorUnitario: number; // Unit Value
  valorTotal: number; // Total Value
};

// Payment Information
export type ServiceOrderPayment = {
  id: number;
  tipoPagamento: PaymentType | string; // Payment Type
  valorPago: number; // Paid Value
  dataPagamento: string; // Payment Date (ISO datetime)
  status: PaymentStatus | string; // Status
};

// Vehicle Information
export type ServiceOrderVehicle = {
  id: number;
  marca: string; // Brand
  modelo: string; // Model
  ano: number; // Year
  placa: string; // License Plate
  cor: string; // Color
};

// Client Information
export type ServiceOrderClient = {
  id: number;
  nome: string; // Name
  documento: string; // Document (CPF/CNPJ)
  email: string; // Email
  telefone: string; // Phone
};

// Vehicle Client (relationship between vehicle and client)
export type ServiceOrderVehicleClient = {
  id: number;
  veiculoId: number; // Vehicle Id
  veiculo: ServiceOrderVehicle; // Vehicle
  clienteId: number; // Client Id
  cliente: ServiceOrderClient; // Client
};

// Employee/Responsible Person
export type ServiceOrderEmployee = {
  id: number;
  nome: string; // Name
  especialidade: string; // Speciality
};

// Timestamps
export type ServiceOrderTimestamps = {
  dataHora: string; // Date Time (ISO datetime)
};

// Main Service Order Type
export type ServiceOrder = {
  id: number;
  valorTotal: number; // Total Value
  dataFaturamentoInicial: string; // Initial Billing Date (ISO datetime)
  dataFaturamentoFinal?: string; // Final Billing Date (ISO datetime)
  observacao?: string; // Observation
  funcionarioId: number; // Employee Id
  funcionario: ServiceOrderEmployee; // Employee
  veiculoClienteId: number; // Vehicle Client Id
  veiculoCliente: ServiceOrderVehicleClient; // Vehicle Client
  itens: ServiceOrderItem[]; // Items
  pagamento?: ServiceOrderPayment; // Payment
  criado: ServiceOrderTimestamps; // Created
  atualizado: ServiceOrderTimestamps; // Updated
};

// Input types for creating/updating
export type CreateServiceOrderInput = Omit<ServiceOrder, 'id' | 'criado' | 'atualizado'> & {
  id?: number; // Optional for creation
};

export type UpdateServiceOrderInput = Partial<CreateServiceOrderInput>;
