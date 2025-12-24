// api/entrada-chave-acesso.types.ts

export type NotaFiscalListItem = {
  id: string;
  chaveAcesso: string;
  cnpjFornecedor: string;
  notaFiscalStatus: string;
  criado: string;
  atualizado: string;
};

export type Emitente = {
  nome: string;
  documento: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  numero: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  telefone: string;
  logradouro?: string;
  endereco?: string;
};

export type Destinatario = {
  nome: string;
  documento: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  numero: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  telefone: string;
};

export type DadosNotaFiscal = {
  numeroNota: string;
  naturezaOperacao: string;
  chaveAcesso: string;
  emitente: Emitente;
  destinatario: Destinatario;
  dataEmissao: string;
  dataSaida: string;
  horaSaida: string;
  informacoesComplementares: string;
};

export type CalculoImpostos = {
  baseCalculoICMS: number;
  valorICMS: number;
  baseCalculoICMSST: number;
  valorICMSSub: number;
  valorFrete: number;
  valorSeguro: number;
  desconto: number;
  outrasDespesas: number;
  valorIPI: number;
  valorTotalImpostos: number;
  valorTotalProdutos: number;
  valorTotalNotaFiscal: number;
};

export type ItemNotaFiscal = {
  codigo: string;
  descricao: string;
  ncm: string;
  grupoProdutoId: string;
  descricaoNotaFiscal: string;
  unidadeProdutoId: string;
  origemMercadoria: string;
  quantidade: number | string;
  valorUnitario: number | string;
  valorTotal: number | string;
  freteDespesas: number | string;
  desconto: number | string;
  imposto: number | string;
  valorICMSST: number | string;
  valorIPI: number | string;
  markup?: number | string;
  valorVenda?: number | string;
};

export type NotaFiscalDetalhes = {
  dadosNotaFiscal: DadosNotaFiscal;
  calculoImpostos: CalculoImpostos;
  itens: ItemNotaFiscal[];
};

export type ConsultaChaveAcessoInput = {
  chaveAcesso: string;
};

export type ConsultaXmlInput = {
  lojaId: string;
  xmlBase64: string;
};

export type UpsertProdutosInput = {
  lojaId: string;
  chaveAcesso: string;
  fornecedor: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
  };
  produtos: ItemNotaFiscal[];
};

export type GrupoProduto = {
  id: string;
  nome: string;
  descricao?: string;
};

export type UnidadeProduto = {
  id: string;
  nome: string;
  descricao?: string;
};
