
export interface Result<T> {
    isSuccess: boolean;
    statusCode: string;
    mensagem: string;
    value: T;
    errors: any[];
}

export interface Error {
    tipo: any;
    codigo: string,
    descricao: string
}