export type Vehicle = {
  id: string;
  placa: string;
  modelo: string;
  montadora: string;
  hodrometro: number;
  cor: string;
  motorizacao: string;
  ano: string;
  numeroSerie: string;
  chassi: string;
  status: string;
};

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'criado' | 'atualizado' | 'status'> & {
  id?: string;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;