
  export type Page<T> = {
    dados: Array<T>;
    limite: number;
    paginaAtual: number;
    totalRegistros: number;
    totalPaginas: number;
  };