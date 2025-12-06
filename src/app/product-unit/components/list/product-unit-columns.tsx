// app/product-unit/components/list/product-unit-columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Unit } from '@/api/product-unit.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconCircleCheckFilled } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type UnitColumnsProps = {
  onView: (unit: Unit) => void;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
  onActive: (unitId: string) => void;
  onDeactive: (unitId: string) => void;
};

export const createUnitColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: UnitColumnsProps): ColumnDef<Unit>[] => [
  {
  id: 'codigo',
  accessorKey: 'codigo',
  header: 'Código',
  cell: ({ row }) => {
    const unit = row.original;
    return <div className="font-medium">{unit.id}</div>;
  },
},
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const unit = row.original;
      return <div className="font-medium">{unit.descricao}</div>;
    },
  },
    {
    id: 'unidadeProdutoStatus',
    accessorKey: 'unidadeProdutoStatus',
    header: 'Status',
    cell: ({ row }) => {
      const unit = row.original;
      const isActive = unit.unidadeProdutoStatus === 'Ativo' || unit.unidadeProdutoStatus === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {unit.unidadeProdutoStatus || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const unit = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(unit)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(unit.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(unit.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];