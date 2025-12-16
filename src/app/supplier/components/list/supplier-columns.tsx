import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Supplier } from '@/api/supplier.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type SupplierColumnsProps = {
  onView: (supplier: Supplier) => void;
  onEdit: (id: string) => void;
  onDelete: (supplier: Supplier) => void;
  onActive: (supplier: string) => void;
  onDeactive: (supplier: string) => void;
};

export const createSupplierColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: SupplierColumnsProps): ColumnDef<Supplier>[] => [
  {
    id: 'nomeFantasia',
    accessorKey: 'nomeFantasia',
    header: 'Nome Fantasia',
    cell: ({ row }) => {
      const supplier = row.original;
      return <div className="font-medium">{supplier.nomeFantasia}</div>;
    },
  },
  {
    id: 'razaoSocial',
    accessorKey: 'razaoSocial',
    header: 'Razão Social',
    cell: ({ row }) => {
      const supplier = row.original;
      return <div>{supplier.razaoSocial}</div>;
    },
  },
  {
    id: 'documento',
    accessorKey: 'documento',
    header: 'CPF/CNPJ',
    cell: ({ row }) => {
      const supplier = row.original;
      const formatted =
        supplier.documento.length === 11
          ? supplier.documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
          : supplier.documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      return <div>{formatted}</div>;
    },
  },
  {
    id: 'contatos',
    accessorKey: 'contatos',
    header: 'Contato',
    cell: ({ row }) => {
      const supplier = row.original;
      const firstContact = supplier.contatos[0];
      if (!firstContact) return <div>-</div>;
      return <div>{firstContact.numero}</div>;
    },
  },
  {
    id: 'fornecedorStatus',
    accessorKey: 'fornecedorStatus',
    header: 'Status',
    cell: ({ row }) => {
      const supplier = row.original;
      const isActive =
        supplier.fornecedorStatus === 'Ativo' || supplier.fornecedorStatus === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {supplier.fornecedorStatus || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const supplier = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(supplier.id)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(supplier.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(supplier.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
