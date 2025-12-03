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
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onActive: (productId: string) => void;
  onDeactive: (productId: string) => void;
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
    header: 'Código',
    cell: ({ row }) => {
      const product = row.original;
      return <div className="font-medium font-mono">{product.referencia}</div>;
    },
  },
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const product = row.original;
      return <div className="max-w-[300px] truncate">{product.descricao}</div>;
    },
  },
  {
    id: 'aplicacao',
    accessorKey: 'aplicacao',
    header: 'Aplicação',
    cell: ({ row }) => {
      const product = row.original;
      return <div className="max-w-[200px] truncate">{product.aplicacao}</div>;
    },
  },
  {
    id: 'preco.venda',
    accessorKey: 'preco.venda',
    header: 'Valor',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="font-medium">
          R$ {product.preco.venda.toFixed(2).replace('.', ',')}
        </div>
      );
    },
  },
  {
    id: 'dadosComplementares.estoque',
    accessorKey: 'dadosComplementares.estoque',
    header: 'Est. Atual',
    cell: ({ row }) => {
      const product = row.original;
      return <div className="text-center">{product.dadosComplementares.estoque}</div>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const product = row.original;
      const isActive = product.status === 'Ativo' || product.status === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {product.status || 'Ativo'}
        </Badge>
      );
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
            <DropdownMenuItem onClick={() => onEdit(product)}>Editar</DropdownMenuItem>
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