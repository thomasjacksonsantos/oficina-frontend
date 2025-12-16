import { AreaList } from './components/list/product-area-list';
import { AreaProvider } from './components/list/product-area-context';

export default function Area() {
  return (
    <AreaProvider>
      <div className="container mx-auto py-6 px-4">
        <AreaList
          columns={[]}
          sortColumns={['codigo', 'descricao', 'garantia']}
          defaultSortField="codigo"
          defaultSortDirection="asc"
        />
      </div>
    </AreaProvider>
  );
}
