import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { PaymentForm } from '@/api/payment-form.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type PaymentFormColumnsProps = {
  onView: (paymentForm: PaymentForm) => void;
  onEdit: (paymentForm: PaymentForm) => void;
  onDelete: (paymentForm: PaymentForm) => void;
  onActive: (paymentFormId: string) => void;
  onDeactive: (paymentFormId: string) => void;
};

export const createPaymentFormColumns = ({
  onView,
  onEdit,
  onDelete,
  onActive,
  onDeactive,
}: PaymentFormColumnsProps): ColumnDef<PaymentForm>[] => [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Codigo',
    cell: ({ row }) => {
      const paymentForm = row.original;
      return <div className="font-medium">{paymentForm.id}</div>;
    },
  },
  {
    id: 'descricao',
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const paymentForm = row.original;
      return <div className="font-medium">{paymentForm.descricao}</div>;
    },
  },
  {
    id: 'numeroParcela',
    accessorKey: 'numeroParcela',
    header: 'Nº Parcelas',
    cell: ({ row }) => {
      const paymentForm = row.original;
      return <div className="text-center">{paymentForm.numeroParcela}</div>;
    },
  },
  {
    id: 'tipoPagamento',
    accessorKey: 'tipoPagamento',
    header: 'Tipo de Pagamento',
    cell: ({ row }) => {
      const paymentForm = row.original;
      return <div>{paymentForm.tipoPagamento}</div>;
    },
  },
  {
    id: 'planoParcelamento',
    accessorKey: 'planoParcelamento',
    header: 'Plano de Parcelamento',
    cell: ({ row }) => {
      const paymentForm = row.original;
      return <div>{paymentForm.planoParcelamento}</div>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const paymentForm = row.original;
      const isActive = paymentForm.status === 'Ativo' || paymentForm.status === 'Active';

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
          )}
          {paymentForm.status || 'Ativo'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const paymentForm = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(paymentForm)}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 dark:text-green-500 focus:bg-green-500/10 dark:focus:bg-green-500/20 focus:text-green-600 dark:focus:text-green-500"
              onClick={() => onActive(paymentForm.id)}
            >
              Ativar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeactive(paymentForm.id)}>
              Desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
