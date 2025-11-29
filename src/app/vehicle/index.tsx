import { VehicleList } from './components/list/vehicle-list';
import { VehicleProvider } from './components/list/vehicle-context';

export default function Vehicle() {
  return (
    <VehicleProvider>
      <div className="container mx-auto py-6 px-4">
        <VehicleList
          columns={[]}
          sortColumns={['codigo', 'modelo', 'montadora']}
          defaultSortField="dataFaturamentoInicial"
          defaultSortDirection="desc"
        />
      </div>
    </VehicleProvider>
  );
}
