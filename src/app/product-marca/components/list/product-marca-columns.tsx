// app/product-marca/components/list/product-marca-columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Marca } from '@/api/product-marca.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconCircleCheckFilled } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type MarcaColumnsProps = {
  onView: (marca: Marca) => void;
  onEdit: (marca: Marca) => void;
  onDelete: (marca: Marca) => void;
  onActive: (marcaId: string) => void;
  onDeactive: (marcaId: string) => void;
};

export const createMarcaColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: MarcaColumnsProps): ColumnDef<Marca>[] => [
  {
  id: 'codigo',
  accessorKey: 'codigo',
  header: 'Código',
  cell: ({ row }) => {
    const marca = row.original;
    return <div className="font-medium">{marca.id}</div>;
  },
},
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const marca = row.original;
      return <div className="font-medium">{marca.descricao}</div>;
    },
  },
    {
    id: 'marcaProdutoStatus',
    accessorKey: 'marcaProdutoStatus',
    header: 'Status',
    cell: ({ row }) => {
      const marca = row.original;
      const isActive = marca.marcaProdutoStatus === 'Ativo' || marca.marcaProdutoStatus === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {marca.marcaProdutoStatus || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const marca = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(marca)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(marca.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(marca.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];