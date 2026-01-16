// app/store-transfer/components/list/store-transfer-columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StoreTransfer } from '@/api/store-transfer.types';
import { IconEye } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type StoreTransferColumnsProps = {
  onView: (storeTransfer: StoreTransfer) => void;
  onEdit: (storeTransfer: StoreTransfer) => void;
};

export const createStoreTransferColumns = ({
  onView,
  onEdit,
}: StoreTransferColumnsProps): ColumnDef<StoreTransfer>[] => [
  {
    id: 'data',
    accessorKey: 'data',
    header: 'Data',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      const date = new Date(storeTransfer.data);
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString('pt-BR')}</div>
          <div className="text-muted-foreground text-xs">
            {formatDistanceToNow(date, { addSuffix: true, locale: ptBR })}
          </div>
        </div>
      );
    },
  },
  {
    id: 'origem',
    accessorKey: 'origem',
    header: 'Origem',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return <div className="font-medium">{storeTransfer.origem}</div>;
    },
  },
  {
    id: 'destino',
    accessorKey: 'destino',
    header: 'Destino',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return <div className="font-medium">{storeTransfer.destino}</div>;
    },
  },
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return <div>{storeTransfer.descricao}</div>;
    },
  },
  {
    id: 'quantidade',
    accessorKey: 'quantidade',
    header: 'Qtd',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return <div className="text-left font-mono font-medium">{storeTransfer.quantidade.toFixed(2)}</div>;
    },
  },
  {
    id: 'estOrigem',
    header: 'Est. Origem',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="text-left font-mono">{storeTransfer.movimentoSaida.quantidade.toFixed(2)}</div>
      );
    },
  },
  {
    id: 'valorUnitOrigem',
    header: 'Valor Unit. Orig',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="text-left font-mono">
          R$ {storeTransfer.movimentoSaida.valorUnitario.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'totalOrigem',
    header: 'Total Orig.',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="text-left font-mono font-medium">
          R$ {storeTransfer.movimentoSaida.valorTotal.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'estDestino',
    header: 'Est. Destino',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="text-left font-mono">{storeTransfer.movimentoEntrada.quantidade.toFixed(2)}</div>
      );
    },
  },
  {
    id: 'valorUnitDestino',
    header: 'Valor Unit. Dest.',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="text-left font-mono">
          R$ {storeTransfer.movimentoEntrada.valorUnitario.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'totalDestino',
    header: 'Total Dest.',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="text-left font-mono font-medium">
          R$ {storeTransfer.movimentoEntrada.valorTotal.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const storeTransfer = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onView(storeTransfer)}
          >
            <IconEye className="size-4" />
            <span className="sr-only">Visualizar</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(storeTransfer)}>
            Editar
          </Button>
        </div>
      );
    },
  },
];