import { ServiceOrderList } from "./components/list/service-order-list"
import { ServiceOrderProvider } from "./components/list/service-order-context"

export default function ServiceOrder() {
  return (
    <ServiceOrderProvider>
      <div className="container mx-auto py-6 px-4">
        <ServiceOrderList
          columns={[]}
          sortColumns={["id", "dataFaturamentoInicial", "valorTotal", "cliente.nome", "veiculo.placa", "funcionario.nome"]}
          defaultSortField="dataFaturamentoInicial"
          defaultSortDirection="desc"
        />
      </div>
    </ServiceOrderProvider>
  )
}

