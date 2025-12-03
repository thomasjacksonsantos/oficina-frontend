import { SupplierList } from './components/list/supplier-list';
import { SupplierProvider } from './components/list/supplier-context';

export default function Supplier() {
  return (
    <SupplierProvider>
      <div className="container mx-auto pr-10 px-4">
        <SupplierList
          columns={[]}
          sortColumns={['nomeFantasia', 'razaoSocial', 'documento']}
          defaultSortField="nomeFantasia"
          defaultSortDirection="asc"
        />
      </div>
    </SupplierProvider>
  );
}
