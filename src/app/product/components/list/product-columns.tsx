import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Product } from '@/api/product.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type ProductColumnsProps = {
  onView: (product: Product) => void;
  onEdit: (id: string) => void;
  onDelete: (product: Product) => void;
  onActive: (product: string) => void;
  onDeactive: (product: string) => void;
};

export const createProductColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: ProductColumnsProps): ColumnDef<Product>[] => [
  {
    id: 'referencia',
    accessorKey: 'referencia',
    header: 'Referência',
    cell: ({ row }) => {
      const product = row.original;
      return <div className="font-medium">{product.referencia}</div>;
    },
  },
  {
    id: 'grupoProduto',
    accessorKey: 'grupoProduto',
    header: 'Grupo',
    cell: ({ row }) => {
      const product = row.original;
      // API returns the group as a string on `grupoProduto` (description or id), so show it
      return <div>{product.grupoProduto || '-'}</div>;
    },
  },
  {
    id: 'unidadeProduto',
    accessorKey: 'unidadeProduto',
    header: 'Unidade',
    cell: ({ row }) => {
      const product = row.original;
      return <div>{product.unidadeProduto || '-'}</div>;
    },
  },
  {
    id: 'produtoStatus',
    accessorKey: 'produtoStatus',
    header: 'Status',
    cell: ({ row }) => {
      const product = row.original;
      const statusKey = product.produtoStatus?.key || '';
      const isActive = statusKey === 'Ativo' || statusKey === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {product.produtoStatus?.nome || statusKey || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'ncm',
    accessorKey: 'ncm',
    header: 'NCM',
    cell: ({ row }) => {
      const product = row.original;
      return <div>{product.ncm || '-'}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const product = row.original;
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
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(product.id)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(product.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(product.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
