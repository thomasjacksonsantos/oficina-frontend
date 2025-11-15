import { BaseApi } from "./base.api";
import { CreateLoginInput, LoginResponse } from "./account.types";

const ENDPOINT = "v1/autenticacao/login"
const TOKEN_STORAGE_KEY = "access_token"

class AccountApi extends BaseApi {
    async createLogin(login: CreateLoginInput) {
        const response = await this.post<LoginResponse>(ENDPOINT, login);

        // Armazenar o token no localStorage após login bem-sucedido
        if (response.token) {
            this.storeToken(response.token);
        }

        return response;
    }

    private storeToken(token: string): void {
        try {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } catch (error) {
            console.error('Erro ao armazenar token no localStorage:', error);
        }
    }
}

export default new AccountApi() as AccountApi;