import { ProductGroupList } from './components/list/product-group-list';
import { ProductGroupProvider } from './components/list/product-group-context';

export default function ProductGroup() {
  return (
    <ProductGroupProvider>
      <div className="container mx-auto py-6 px-4">
        <ProductGroupList
          columns={[]}
          sortColumns={['codigo', 'descricao', 'area', 'ncm']}
          defaultSortField="descricao"
          defaultSortDirection="asc"
        />
      </div>
    </ProductGroupProvider>
  );
}
