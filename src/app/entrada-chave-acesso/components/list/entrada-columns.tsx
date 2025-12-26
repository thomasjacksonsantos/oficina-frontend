// app/entrada-chave-acesso/components/list/entrada-columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { NotaFiscalListItem } from '@/api/entrada-chave-acesso.types';
import { Badge } from '@/components/ui/badge';
import { IconCircleCheckFilled } from '@tabler/icons-react';

type EntradaColumnsProps = {
  onImport: (notaFiscal: NotaFiscalListItem) => void;
};

export const createEntradaColumns = ({
  onImport,
}: EntradaColumnsProps): ColumnDef<NotaFiscalListItem>[] => [
  {
    id: 'nf',
    accessorKey: 'nf',
    header: 'NF',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      const nfValue = notaFiscal.nf ?? (notaFiscal.id ? notaFiscal.id.substring(0, 8) : '');
      return <div className="font-medium">{nfValue}</div>;
    },
  },
  {
    id: 'chaveAcesso',
    accessorKey: 'chaveAcesso',
    header: 'Chave Acesso',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      return <div className="font-medium font-mono text-xs">{notaFiscal.chaveAcesso}</div>;
    },
  },
  {
    id: 'cnpjFornecedor',
    accessorKey: 'cnpjFornecedor',
    header: 'CNPJ Fornecedor',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      const formatted = notaFiscal.cnpjFornecedor.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
      return <div>{formatted}</div>;
    },
  },
  {
    id: 'notaFiscalStatus',
    accessorKey: 'notaFiscalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      const isImported = notaFiscal.notaFiscalStatus.key === 'Importado';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isImported ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-yellow-500 dark:fill-yellow-400" />
          )}
          {notaFiscal.notaFiscalStatus.nome}
        </Badge>
      );
    },
  },
  {
    id: 'criado',
    accessorKey: 'criado',
    header: 'Criado',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      return (
        <div className="text-sm">
          {new Date(notaFiscal.criado).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    id: 'atualizado',
    accessorKey: 'atualizado',
    header: 'Atualizado',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      return (
        <div className="text-sm">
          {new Date(notaFiscal.atualizado).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const notaFiscal = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 dark:text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
          onClick={() => onImport(notaFiscal)}
        >
          Importar
        </Button>
      );
    },
  },
];
