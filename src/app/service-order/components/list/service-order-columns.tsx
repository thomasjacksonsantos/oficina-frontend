import { ServiceOrder } from "@/api/service-orders.types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ServiceOrderColumnsProps = {
  onView: (serviceOrder: ServiceOrder) => void;
  onEdit: (serviceOrder: ServiceOrder) => void;
  onDelete: (serviceOrder: ServiceOrder) => void;
}

export const createServiceOrderColumns = ({ onView, onEdit, onDelete }: ServiceOrderColumnsProps): ColumnDef<ServiceOrder>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "cliente.nome",
    accessorKey: "veiculoCliente.cliente.nome",
    header: "Cliente",
    cell: ({ row }) => {
      const cliente = row.original.veiculoCliente.cliente;
      return <div>{cliente.nome}</div>;
    }
  },
  {
    id: "veiculo.placa",
    accessorKey: "veiculoCliente.veiculo.placa",
    header: "Placa",
    cell: ({ row }) => {
      const veiculo = row.original.veiculoCliente.veiculo;
      return <div>{veiculo.placa}</div>;
    }
  },
  {
    id: "veiculo.modelo",
    accessorKey: "veiculoCliente.veiculo.modelo",
    header: "Veículo",
    cell: ({ row }) => {
      const veiculo = row.original.veiculoCliente.veiculo;
      return <div>{veiculo.marca} {veiculo.modelo} {veiculo.ano}</div>;
    }
  },
  {
    id: "pagamento.status",
    accessorKey: "pagamento.status",
    header: "Status Pagamento",
    cell: ({ row }) => {
      const status = row.original.pagamento?.status;
      if (!status) return <Badge variant="outline">Pendente</Badge>;
      const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        "Pago": { label: "Pago", variant: "default" },
        "Pendente": { label: "Pendente", variant: "secondary" },
        "Cancelado": { label: "Cancelado", variant: "destructive" },
      };
      const statusInfo = statusLabels[status] || { label: status, variant: "outline" as const };
      return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    }
  },
  {
    id: "dataFaturamentoInicial",
    accessorKey: "dataFaturamentoInicial",
    header: "Data Inicial",
    cell: ({ row }) => {
      const date = row.getValue("dataFaturamentoInicial") as string;
      return <div>{new Date(date).toLocaleDateString("pt-BR")}</div>;
    }
  },
  {
    id: "dataFaturamentoFinal",
    accessorKey: "dataFaturamentoFinal",
    header: "Data Final",
    cell: ({ row }) => {
      const date = row.getValue("dataFaturamentoFinal") as string | undefined;
      return <div>{date ? new Date(date).toLocaleDateString("pt-BR") : "—"}</div>;
    }
  },
  {
    id: "funcionario.nome",
    accessorKey: "funcionario.nome",
    header: "Funcionário",
    cell: ({ row }) => {
      const funcionario = row.original.funcionario;
      return <div>{funcionario.nome}</div>;
    }
  },
  {
    id: "valorTotal",
    accessorKey: "valorTotal",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue("valorTotal") as number;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const serviceOrder = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(serviceOrder)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(serviceOrder)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(serviceOrder)}
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
