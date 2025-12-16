import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ManualEntry } from '@/api/manual-entry.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';

type ManualEntryColumnsProps = {
  onView: (entry: ManualEntry) => void;
  onEdit: (entry: ManualEntry) => void;
  onDelete: (entry: ManualEntry) => void;
  onActive: (entryId: string) => void;
  onDeactive: (entryId: string) => void;
};

export const createManualEntryColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: ManualEntryColumnsProps): ColumnDef<ManualEntry>[] => [
  {
    id: 'codigo',
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ row }) => {
      const entry = row.original;
      return <div className="font-medium">{entry.codigo}</div>;
    },
  },
  {
    id: 'fornecedor',
    accessorKey: 'fornecedor.nome',
    header: 'Fornecedor',
    cell: ({ row }) => {
      const entry = row.original;
      return <div>{entry.fornecedor.nome}</div>;
    },
  },
  {
    id: 'dataEmissao',
    accessorKey: 'dataEmissao',
    header: 'Emissão',
    cell: ({ row }) => {
      const entry = row.original;
      return <div>{entry.dataEmissao}</div>;
    },
  },
  {
    id: 'numeroNotaFiscal',
    accessorKey: 'numeroNotaFiscal',
    header: 'Nº Documento',
    cell: ({ row }) => {
      const entry = row.original;
      return <div>{entry.numeroNotaFiscal}</div>;
    },
  },
  {
    id: 'numeroPedidoCompra',
    accessorKey: 'numeroPedidoCompra',
    header: 'Nº Pedido',
    cell: ({ row }) => {
      const entry = row.original;
      return <div>{entry.numeroPedidoCompra}</div>;
    },
  },
  {
    id: 'quantidadeItens',
    accessorKey: 'cabecalho.quantidadeItens',
    header: 'Qtd',
    cell: ({ row }) => {
      const entry = row.original;
      return <div>{entry.cabecalho.quantidadeItens}</div>;
    },
  },
  {
    id: 'valorTotalNota',
    accessorKey: 'cabecalho.valorTotalNota',
    header: 'Total',
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <div className="font-medium">
          R$ {entry.cabecalho.valorTotalNota.toFixed(2).replace('.', ',')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <DropdownMenu>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(entry)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(entry.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(entry.id)}>
              Desativar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(entry)}>
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];