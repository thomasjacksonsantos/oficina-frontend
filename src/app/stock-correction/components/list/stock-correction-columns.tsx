// app/stock-correction/components/list/stock-correction-columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StockCorrection } from '@/api/stock-correction.types';
import { IconEye } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type StockCorrectionColumnsProps = {
  onView: (stockCorrection: StockCorrection) => void;
  onCorrect: (stockCorrection: StockCorrection) => void;
};

export const createStockCorrectionColumns = ({
  onView,
  onCorrect,
}: StockCorrectionColumnsProps): ColumnDef<StockCorrection>[] => [
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Produto',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      return <div className="font-medium">{stockCorrection.descricao}</div>;
    },
  },
  {
    id: 'data',
    accessorKey: 'data',
    header: 'Data',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      const date = new Date(stockCorrection.data);
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
    id: 'quantidadeAntes',
    accessorKey: 'quantidadeAntes',
    header: 'Qtd. Anterior',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      return (
        <div className="text-left font-mono">{stockCorrection.quantidadeAntes.toFixed(2)}</div>
      );
    },
  },
  {
    id: 'quantidade',
    accessorKey: 'quantidade',
    header: 'Qtd. Ajuste',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      return (
        <div className="text-left font-mono font-medium">
          {stockCorrection.quantidade.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'quantidadeDiferenca',
    accessorKey: 'quantidadeDiferenca',
    header: 'Qtd. Nova',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      return (
        <div className="text-left font-mono font-semibold">
          {stockCorrection.quantidadeDiferenca.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'valorUnitario',
    accessorKey: 'valorUnitario',
    header: 'Valor Unitário',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      return (
        <div className="text-left font-mono">R$ {stockCorrection.valorUnitario.toFixed(2)}</div>
      );
    },
  },
  {
    id: 'valorTotal',
    header: 'Valor Total',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      const total = stockCorrection.quantidade * stockCorrection.valorUnitario;
      return <div className="text-left font-mono font-medium">R$ {total.toFixed(2)}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const stockCorrection = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onView(stockCorrection)}
          >
            <IconEye className="size-4" />
            <span className="sr-only">Visualizar</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onCorrect(stockCorrection)}>
            Corrigir Estoque
          </Button>
        </div>
      );
    },
  },
];
