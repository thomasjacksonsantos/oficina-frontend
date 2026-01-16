// app/store-transfer/index.tsx

import { StoreTransferList } from './components/list/store-transfer-list';
import { StoreTransferProvider } from './components/list/store-transfer-context';

export default function StoreTransfer() {
  return (
    <StoreTransferProvider>
      <div className="container mx-auto py-6 px-4">
        <StoreTransferList
          columns={[]}
          sortColumns={['data', 'origem', 'destino', 'descricao', 'quantidade']}
          defaultSortField="data"
          defaultSortDirection="desc"
        />
      </div>
    </StoreTransferProvider>
  );
}