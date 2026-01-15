// app/stock-correction/index.tsx

import { StockCorrectionList } from './components/list/stock-correction-list';
import { StockCorrectionProvider } from './components/list/stock-correction-context';

export default function StockCorrection() {
  return (
    <StockCorrectionProvider>
      <div className="container mx-auto py-6 px-4">
        <StockCorrectionList
          columns={[]}
          sortColumns={['descricao', 'data', 'quantidade', 'valorUnitario']}
          defaultSortField="data"
          defaultSortDirection="desc"
        />
      </div>
    </StockCorrectionProvider>
  );
}