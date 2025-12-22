import { Page } from '@/typings/page.types'
import { User, ValidarDocumento, ValidarEmailExistente } from './users.types'
import { BaseApi } from './base.api';

const ENDPOINT = "v1/usuarios"

class UsersApi extends BaseApi {

  async getUsers(queryString: Record<string, any>) {
    return await this.get<Page<User>>(ENDPOINT, queryString);
  }

  async getUserById(id: string) {
    return this.get<User>(`/${ENDPOINT}/${id}`);
  }

  async createUser(User: User) {
    return this.post<User>(ENDPOINT, User);
  }

  async getValidarDocumento(documento: string) {
    return this.post<ValidarDocumento>(`${ENDPOINT}/validar-documento/${documento}`, {});
  }

  async validarEmailExistente(email: string) {
    return this.get<ValidarEmailExistente>(`${ENDPOINT}/email-existente?valor=${email}`);
  }
}

export default new UsersApi() as UsersApi