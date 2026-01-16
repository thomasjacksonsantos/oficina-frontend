// app/store-transfer/components/list/store-transfer-header-list.tsx

'use client';

import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { useStoreTransferContext } from './store-transfer-context';
import StoreTransferForm from '../forms/store-transfer-form';
import StoreTransferViewDialog from '../forms/store-transfer-view-dialog';

export default function StoreTransferHeaderList() {
  const { setRegisteringStoreTransfer } = useStoreTransferContext();

  return (
    <>
      <StoreTransferForm />
      <StoreTransferViewDialog />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transferência Entre Lojas</h2>
          <span className="text-muted-foreground">
            Gerencie as transferências de estoque entre lojas aqui.
          </span>
        </div>
        <div>
          <Button onClick={() => setRegisteringStoreTransfer(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Transferência
          </Button>
        </div>
      </div>
    </>
  );
}