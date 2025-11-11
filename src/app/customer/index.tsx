import { CustomerList } from "./components/list/customer-list"
import { CustomerProvider } from "./components/list/customer-context"

export default function Customer() {
  return (
    <CustomerProvider>
      <div className="container mx-auto py-6 px-4">
        <CustomerList
          columns={[]}
          sortColumns={["id", "nome", "documento", "email", "telefone", "status"]}
          defaultSortField="nome"
          defaultSortDirection="asc"
        />
      </div>
    </CustomerProvider>
  )
}

