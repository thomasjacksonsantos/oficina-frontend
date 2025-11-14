
export interface Result<T> {
    isSuccess: boolean;
    isFailed: boolean;
    value: T;
    errors: any[];
}

export interface Error {
    tipo: any;
    codigo: string,
    descricao: string
}