'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Supplier } from '@/api/supplier.types';

interface SupplierContextType {
  viewingSupplier: Supplier | null;
  editingSupplier: Supplier | null;
  deletingSupplier: Supplier | null;
  activingSupplier: string | null;
  deactivingSupplier: string | null;
  setViewingSupplier: (supplier: Supplier | null) => void;
  setEditingSupplier: (supplier: Supplier | null) => void;
  setDeletingSupplier: (supplier: Supplier | null) => void;
  setActivingSupplier: (supplierId: string | null) => void;
  setDeactivingSupplier: (supplierId: string | null) => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [activingSupplier, setActivingSupplier] = useState<string | null>(null);
  const [deactivingSupplier, setDeactivingSupplier] = useState<string | null>(null);

  return (
    <SupplierContext.Provider
      value={{
        viewingSupplier,
        editingSupplier,
        deletingSupplier,
        activingSupplier,
        deactivingSupplier,
        setViewingSupplier,
        setEditingSupplier,
        setDeletingSupplier,
        setActivingSupplier,
        setDeactivingSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplierContext() {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSupplierContext must be used within a SupplierProvider');
  }
  return context;
}
