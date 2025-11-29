// app/product-unit/index.tsx

import { UnitList } from './components/list/product-unit-list';
import { UnitProvider } from './components/list/product-unit-context';

export default function Unit() {
  return (
    <UnitProvider>
      <div className="container mx-auto pl-40 pr-10 px-4">
        <UnitList
          columns={[]}
          sortColumns={['descricao']}
          defaultSortField="descricao"
          defaultSortDirection="asc"
        />
      </div>
    </UnitProvider>
  );
}
