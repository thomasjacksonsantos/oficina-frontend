import { ManualEntryList } from './components/list/manual-entry-list';
import { ManualEntryProvider } from './components/list/manual-entry-context';

export default function ManualEntry() {
  return (
    <ManualEntryProvider>
      <div className="container mx-auto py-6 px-4">
        <ManualEntryList
          columns={[]}
          sortColumns={['codigo', 'fornecedor', 'dataEmissao', 'numeroNotaFiscal']}
          defaultSortField="codigo"
          defaultSortDirection="asc"
        />
      </div>
    </ManualEntryProvider>
  );
}
