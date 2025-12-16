import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ProductGroup } from '@/api/product-group.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type ProductGroupColumnsProps = {
  onView: (productGroup: ProductGroup) => void;
  onEdit: (productGroup: ProductGroup) => void;
  onDelete: (productGroup: ProductGroup) => void;
  onActive: (productGroupId: string) => void;
  onDeactive: (productGroupId: string) => void;
};

export const createProductGroupColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: ProductGroupColumnsProps): ColumnDef<ProductGroup>[] => [
  {
    id: 'codigo',
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ row }) => {
      const productGroup = row.original;
      return <div className="font-medium">{productGroup.id}</div>;
    },
  },
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const productGroup = row.original;
      return <div className="font-medium">{productGroup.descricao}</div>;
    },
  },
  {
    id: 'area',
    accessorKey: 'area',
    header: 'Área de Produto',
    cell: ({ row }) => {
      const productGroup = row.original;
      return <div>{productGroup.area}</div>;
    },
  },
  {
    id: 'ncm',
    accessorKey: 'ncm',
    header: 'NCM',
    cell: ({ row }) => {
      const productGroup = row.original;
      return <div className="font-mono">{productGroup.ncm}</div>;
    },
  },
  {
    id: 'anp',
    accessorKey: 'anp',
    header: 'ANP',
    cell: ({ row }) => {
      const productGroup = row.original;
      return <div className="font-mono">{productGroup.anp}</div>;
    },
  },
  {
    id: 'grupoProdutoStatus',
    accessorKey: 'grupoProdutoStatus',
    header: 'Status',
    cell: ({ row }) => {
      const productGroup = row.original;
      const isActive =
        productGroup.grupoProdutoStatus === 'Ativo' || productGroup.grupoProdutoStatus === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {productGroup.grupoProdutoStatus || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const productGroup = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(productGroup)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(productGroup.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(productGroup.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
