// app/product-orderStatus/components/list/product-orderStatus-header-list.tsx

'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useOrderStatusContext } from './product-orderStatus-context';
import DeleteOrderStatusForm from '../form/delete-product-orderStatus-form';
import EditOrderStatusDialog from '../form/product-orderStatus-edit-dialog';
import ViewOrderStatusDialog from '../form/product-orderStatus-view-dialog';
import CreateOrderStatusDialog from '../form/product-orderStatus-create-dialog';

export default function OrderStatusHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { deletingOrderStatus, setDeletingOrderStatus } = useOrderStatusContext();

  useEffect(() => {
    if (deletingOrderStatus) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingOrderStatus]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingOrderStatus(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar unidade"
        description="Tem certeza que deseja deletar esta unidade?"
      >
        {deletingOrderStatus && (
          <DeleteOrderStatusForm orderStatusId={deletingOrderStatus.id} setIsOpen={handleCloseDelete} />
        )}
      </ResponsiveDialog>
      <EditOrderStatusDialog />
      <ViewOrderStatusDialog />
      <CreateOrderStatusDialog isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Status Pedido</h2>
          <span className="text-muted-foreground">Gerencie suas unidades aqui.</span>
        </div>
        <div>
          <Button variant="default" onClick={() => setIsCreateOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Unidade
          </Button>
        </div>
      </div>
    </>
  );
}
