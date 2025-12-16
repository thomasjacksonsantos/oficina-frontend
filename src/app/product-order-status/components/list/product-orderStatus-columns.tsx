// app/product-orderStatus/components/list/product-orderStatus-columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/api/product-orderStatus.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconCircleCheckFilled } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type OrderStatusColumnsProps = {
  onView: (orderStatus: OrderStatus) => void;
  onEdit: (orderStatus: OrderStatus) => void;
  onDelete: (orderStatus: OrderStatus) => void;
  onActive: (orderStatusId: string) => void;
  onDeactive: (orderStatusId: string) => void;
};

export const createOrderStatusColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: OrderStatusColumnsProps): ColumnDef<OrderStatus>[] => [
  {
  id: 'codigo',
  accessorKey: 'codigo',
  header: 'Código',
  cell: ({ row }) => {
    const orderStatus = row.original;
    return <div className="font-medium">{orderStatus.id}</div>;
  },
},
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const orderStatus = row.original;
      return <div className="font-medium">{orderStatus.descricao}</div>;
    },
  },
    {
    id: 'statusPedidoCompraStatus',
    accessorKey: 'statusPedidoCompraStatus',
    header: 'Status',
    cell: ({ row }) => {
      const orderStatus = row.original;
      const isActive = orderStatus.statusPedidoCompraStatus === 'Ativo' || orderStatus.statusPedidoCompraStatus === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          { orderStatus.statusPedidoCompraStatus || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const orderStatus = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(orderStatus)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(orderStatus.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(orderStatus.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];