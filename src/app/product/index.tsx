import { ProductList } from './components/list/product-list';
import { ProductProvider } from './components/list/product-context';

export default function Area() {
  return (
    <ProductProvider>
      <div className="container mx-auto py-6 px-4">
        <ProductList
          columns={[]}
          sortColumns={['codigo', 'descricao', 'garantia']}
          defaultSortField="codigo"
          defaultSortDirection="asc"
        />
      </div>
    </ProductProvider>
  );
}
