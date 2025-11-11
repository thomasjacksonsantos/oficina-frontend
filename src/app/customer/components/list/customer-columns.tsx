
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Customer } from "@/api/customers.types";


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
                  {contato.tipoTelefone}: {contato.ddd} {contato.numero}
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
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(customer)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(customer)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(customer)}
            className="text-red-600 hover:text-red-700"
            title="Deletar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];
