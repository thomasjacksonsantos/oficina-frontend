import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { BandeiraCartao } from '@/api/bandeira-cartao.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type BandeiraCartaoColumnsProps = {
  onView: (bandeiraCartao: BandeiraCartao) => void;
  onEdit: (bandeiraCartao: BandeiraCartao) => void;
  onDelete: (bandeiraCartao: BandeiraCartao) => void;
  onActive: (bandeiraCartaoId: string) => void;
  onDeactive: (bandeiraCartaoId: string) => void;
};

export const createBandeiraCartaoColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: BandeiraCartaoColumnsProps): ColumnDef<BandeiraCartao>[] => [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Codigo',
    cell: ({ row }) => {
      const bandeiraCartao = row.original;
      return <div className="font-medium">{bandeiraCartao.id}</div>;
    },
  },
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Nome da Bandeira',
    cell: ({ row }) => {
      const bandeiraCartao = row.original;
      return <div className="font-medium">{bandeiraCartao.descricao}</div>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const bandeiraCartao = row.original;
      const isActive = bandeiraCartao.status === 'Ativo' || bandeiraCartao.status === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {bandeiraCartao.status || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acoes',
    cell: ({ row }) => {
      const bandeiraCartao = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(bandeiraCartao)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(bandeiraCartao.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(bandeiraCartao.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];