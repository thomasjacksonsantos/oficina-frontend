import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/api/vehicle.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type VehicleColumnsProps = {
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onActive: (vehicle: string) => void;
  onDeactive: (vehicle: string) => void;
};

export const createVehicleColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: VehicleColumnsProps): ColumnDef<Vehicle>[] => [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Código',
  },
  {
    id: 'placa',
    accessorKey: 'placa',
    header: 'Placa',
    cell: ({ row }) => {
      const vehicle = row.original;
      return <div className="font-medium">{vehicle.placa}</div>;
    },
  },
  {
    id: 'modelo',
    accessorKey: 'modelo',
    header: 'Modelo',
    cell: ({ row }) => {
      const vehicle = row.original;
      return <div>{vehicle.modelo}</div>;
    },
  },
  {
    id: 'montadora',
    accessorKey: 'montadora',
    header: 'Montadora',
    cell: ({ row }) => {
      const vehicle = row.original;
      return <div>{vehicle.montadora}</div>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const vehicle = row.original;
      const isActive = vehicle.status === 'Ativo' || vehicle.status === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {vehicle.status || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const vehicle = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(vehicle)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(vehicle.id)}
            >
              Activa
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(vehicle.id)}>
              Deactiva
            </DropdownMenuItem>
            {/* <DropdownMenuItem variant="destructive" onClick={() => onDelete(vehicle)}>
              Deletar
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
