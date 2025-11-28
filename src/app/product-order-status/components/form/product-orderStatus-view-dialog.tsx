// app/product-orderStatus/components/form/product-orderStatus-view-dialog.tsx

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useOrderStatusContext } from '../list/product-orderStatus-context';

export default function OrderStatusViewDialog() {
  const { viewingOrderStatus, setViewingOrderStatus } = useOrderStatusContext();

  if (!viewingOrderStatus) return null;

  return (
    <Dialog open={!!viewingOrderStatus} onOpenChange={() => setViewingOrderStatus(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Unidade</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Descrição</Label>
            <p className="font-medium">{viewingOrderStatus.descricao}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Status</Label>
            <p className="font-medium">{viewingOrderStatus.status || 'Ativo'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
