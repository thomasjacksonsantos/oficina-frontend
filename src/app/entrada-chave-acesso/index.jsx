// app/entrada-chave-acesso/index.tsx

import { EntradaList, EntradaProvider } from './components/list';

export default function EntradaChaveAcesso() {
  return (
    <EntradaProvider>
      <div className="container mx-auto py-6 px-4">
        <EntradaList
          columns={[]}
          sortColumns={['chaveAcesso', 'cnpjFornecedor', 'notaFiscalStatus', 'criado']}
          defaultSortField="criado"
          defaultSortDirection="desc"
        />
      </div>
    </EntradaProvider>
  );
}
