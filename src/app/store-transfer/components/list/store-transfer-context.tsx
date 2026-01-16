// app/store-transfer/components/list/store-transfer-context.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StoreTransfer } from '@/api/store-transfer.types';

interface StoreTransferContextType {
  viewingStoreTransfer: StoreTransfer | null;
  editingStoreTransfer: StoreTransfer | null;
  registeringStoreTransfer: boolean;
  setViewingStoreTransfer: (storeTransfer: StoreTransfer | null) => void;
  setEditingStoreTransfer: (storeTransfer: StoreTransfer | null) => void;
  setRegisteringStoreTransfer: (registering: boolean) => void;
}

const StoreTransferContext = createContext<StoreTransferContextType | undefined>(undefined);

export function StoreTransferProvider({ children }: { children: ReactNode }) {
  const [viewingStoreTransfer, setViewingStoreTransfer] = useState<StoreTransfer | null>(null);
  const [editingStoreTransfer, setEditingStoreTransfer] = useState<StoreTransfer | null>(null);
  const [registeringStoreTransfer, setRegisteringStoreTransfer] = useState<boolean>(false);

  return (
    <StoreTransferContext.Provider
      value={{
        viewingStoreTransfer,
        editingStoreTransfer,
        registeringStoreTransfer,
        setViewingStoreTransfer,
        setEditingStoreTransfer,
        setRegisteringStoreTransfer,
      }}
    >
      {children}
    </StoreTransferContext.Provider>
  );
}

export function useStoreTransferContext() {
  const context = useContext(StoreTransferContext);
  if (context === undefined) {
    throw new Error('useStoreTransferContext must be used within a StoreTransferProvider');
  }
  return context;
}