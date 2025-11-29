// app/product-orderStatus/index.tsx

import { OrderStatusList } from './components/list/product-orderStatus-list';
import { OrderStatusProvider } from './components/list/product-orderStatus-context';

export default function OrderStatus() {
  return (
    <OrderStatusProvider>
      <div className="container mx-auto pl-40 pr-10 px-4">
        <OrderStatusList
          columns={[]}
          sortColumns={['codigo', 'descricao']}
          defaultSortField="descricao"
          defaultSortDirection="asc"
        />
      </div>
    </OrderStatusProvider>
  );
}
