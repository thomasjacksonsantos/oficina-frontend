import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateVehicleInput, Vehicle, UpdateVehicleInput } from './vehicle.types';

const ENDPOINT = 'v1/veiculos';

class VehiclesApi extends BaseApi {
  async getVehicles(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<Vehicle>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getVehicleById(id: string) {
    return this.get<Vehicle>(`${ENDPOINT}/${id}`);
  }

  async createVehicle(vehicle: CreateVehicleInput) {
    return this.post<Vehicle>(ENDPOINT, vehicle);
  }

  async updateVehicle(vehicle: UpdateVehicleInput, id: string) {
    return this.post<CreateVehicleInput>(`${ENDPOINT}/edit/${id}`, vehicle);
  }

  async deleteVehicle(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeVehicle(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveVehicle(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new VehiclesApi() as VehiclesApi;
