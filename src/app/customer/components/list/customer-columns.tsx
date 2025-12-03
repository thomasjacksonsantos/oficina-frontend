
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Customer } from "@/api/customers.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconCircleCheckFilled, IconDotsVertical } from "@tabler/icons-react";
import { Badge } from "@/components/ui";


type CustomerColumnsProps = {
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const createCustomerColumns = ({ onView, onEdit, onDelete }: CustomerColumnsProps): ColumnDef<Customer>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "nome",
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const cliente = row.original;
      return <div>{cliente.nome}</div>;
    }
  },
  {
    id: "documento",
    accessorKey: "documento",
    header: "Documento",
    cell: ({ row }) => {
      const cliente = row.original;
      return <div>{cliente.documento}</div>;
    }
  },
  {
    id: "contatos",
    accessorKey: "contatos",
    header: "Contatos",
    cell: ({ row }) => {
      const contatos = row.original.contatos;
      return (
        <div>
          {contatos && contatos.length > 0 && (
            <>
              {contatos.map((contato) => (
                <div key={contato.ddd + contato.numero}>
                  <span>{contato.numero}</span>
                </div>
              ))}
            </>
          )}
          {(!contatos || contatos.length === 0) && (
            <div className="text-gray-500">Nenhum contato</div>
          )}
        </div>
      );
    }
  },
  {
    id: "clienteStatus",
    accessorKey: "clienteStatus",
    header: "Status",
    cell: ({ row }) => {
      return (<Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.clienteStatus === "Ativo" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
        )}
        {row.original.clienteStatus}
      </Badge>)
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const customer = row.original;

      return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(customer)}>Editar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(customer)}>Deletar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      );
    }
  }
];
