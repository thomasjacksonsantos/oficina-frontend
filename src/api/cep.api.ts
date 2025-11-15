
import { BaseApi } from './base.api';
import { Cep } from './cep.types';

const ENDPOINT = "v1/cep"

class CepApi extends BaseApi {
  async getCep(cep: string) {
    return await this.get<Cep>(`${ENDPOINT}/${cep}`);
  }
}

export default new CepApi() as CepApi;
