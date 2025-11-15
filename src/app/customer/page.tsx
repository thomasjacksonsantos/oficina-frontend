import { Button, Input } from "@/components/ui"
import { columns, Customer } from "./columns"
import { DataTable } from "./data-table"
import React from "react"

async function getData(): Promise<Customer[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      nome: "Thomas Jackson",
      documento: "123.456.789-00",
      email: "m@example.com",
      telefone: "1234-5678",
      status: "ativo",
    },
    {
      id: "2",
      nome: "Maria",
      documento: "987.654.321-00",
      email: "maria@example.com",
      telefone: "2345-6789",
      status: "ativo",
    },
    {
      id: "3",
      nome: "João Silva",
      documento: "12.345.678/0001-99",
      email: "joao@example.com",
      telefone: "3456-7890",
      status: "inativo",
    },
    // ...
  ]
}

export default async function Page() {
  const [sorting, setSorting] = React.useState([])
  const [filter, setFilter] = React.useState("")

  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <div className="flex gap-8 items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Aqui estao todos os clientes cadastrados.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar cliente..."
            className="max-w-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button variant="outline">Buscar</Button>
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline">View</Button> */}
          <Button>Novo Cliente</Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}