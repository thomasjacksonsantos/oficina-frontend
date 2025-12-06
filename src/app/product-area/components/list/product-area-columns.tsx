import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Area } from '@/api/area.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type AreaColumnsProps = {
  onView: (area: Area) => void;
  onEdit: (area: Area) => void;
  onDelete: (area: Area) => void;
  onActive: (areaId: string) => void;
  onDeactive: (areaId: string) => void;
};

export const createAreaColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: AreaColumnsProps): ColumnDef<Area>[] => [
  {
    id: 'codigo',
    accessorKey: 'id',
    header: 'Código',
    cell: ({ row }) => {
      const area = row.original;
      return <div className="font-medium">{area.id}</div>;
    },
  },
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const area = row.original;
      return <div>{area.descricao}</div>;
    },
  },
  {
    id: 'garantia',
    accessorKey: 'garantia',
    header: 'Garantia',
    cell: ({ row }) => {
      const area = row.original;
      return <div>{area.garantia} meses</div>;
    },
  },
  {
    id: 'areaProdutoStatus',
    accessorKey: 'areaProdutoStatus',
    header: 'Status',
    cell: ({ row }) => {
      const area = row.original;
      const isActive = area.areaProdutoStatus === 'Ativo' || area.areaProdutoStatus === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {area.areaProdutoStatus || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const area = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(area)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(area.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(area.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
