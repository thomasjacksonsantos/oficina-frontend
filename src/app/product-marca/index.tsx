// app/product-unit/index.tsx

import { MarcaList } from './components/list/product-marca-list';
import { MarcaProvider } from './components/list/product-marca-context';

export default function Marca() {
  return (
    <MarcaProvider>
      <div className="container mx-auto pl-40 pr-10 px-4">
        <MarcaList
          columns={[]}
          sortColumns={['codigo', 'descricao']}
          defaultSortField="descricao"
          defaultSortDirection="asc"
        />
      </div>
    </MarcaProvider>
  );
}
