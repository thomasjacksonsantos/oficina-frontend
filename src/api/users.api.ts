import { Page } from '@/typings/page.types'
import { User } from './users.types'
import { BaseApi } from './base.api';

const ENDPOINT = "/users"

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
}

export default new UsersApi() as UsersApi