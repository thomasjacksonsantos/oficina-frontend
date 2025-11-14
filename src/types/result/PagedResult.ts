export interface PagedResult<T> {
    dados: T;
    paginaAtual: number;
    qtdPorPagina: number;
    totalRegistro: number;
    totalPaginas: number;
}