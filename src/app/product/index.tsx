'use client';

import { ProductList } from './components/list/product-list';
import { ProductProvider } from './components/list/product-context';

export default function ProductPage() {
  return (
    <ProductProvider>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <ProductList
          columns={[]}
          sortColumns={['referencia', 'grupoProduto', 'unidadeProduto', 'produtoStatus']}
          defaultSortField="referencia"
          defaultSortDirection="asc"
        />
      </div>
    </ProductProvider>
  );
}
