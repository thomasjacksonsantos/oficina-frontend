"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductGroup } from "@/api/product-group.types";

interface ProductGroupContextType {
  viewingProductGroup: ProductGroup | null;
  editingProductGroup: ProductGroup | null;
  deletingProductGroup: ProductGroup | null;
  activingProductGroup: string | null;
  registeringProductGroup: boolean | null;
  deactivingProductGroup: string | null;
  setViewingProductGroup: (productGroup: ProductGroup | null) => void;
  setEditingProductGroup: (productGroup: ProductGroup | null) => void;
  setDeletingProductGroup: (productGroup: ProductGroup | null) => void;
  setActivingProductGroup: (productGroupId: string | null) => void;
  setDeactivingProductGroup: (productGroupId: string | null) => void;
  setRegisteringProductGroup: (registering: boolean | null) => void;
}

const ProductGroupContext = createContext<ProductGroupContextType | undefined>(undefined);

export function ProductGroupProvider({ children }: { children: ReactNode }) {
  const [viewingProductGroup, setViewingProductGroup] = useState<ProductGroup | null>(null);
  const [editingProductGroup, setEditingProductGroup] = useState<ProductGroup | null>(null);
  const [deletingProductGroup, setDeletingProductGroup] = useState<ProductGroup | null>(null);
  const [activingProductGroup, setActivingProductGroup] = useState<string | null>(null);
  const [deactivingProductGroup, setDeactivingProductGroup] = useState<string | null>(null);
 const [registeringProductGroup, setRegisteringProductGroup] = useState<boolean | null>(false);
  return (
    <ProductGroupContext.Provider
      value={{
        viewingProductGroup,
        editingProductGroup,
        deletingProductGroup,
        activingProductGroup,
        deactivingProductGroup,
        registeringProductGroup,
        setViewingProductGroup,
        setEditingProductGroup,
        setDeletingProductGroup,
        setActivingProductGroup,
        setDeactivingProductGroup,
        setRegisteringProductGroup
      }}
    >
      {children}
    </ProductGroupContext.Provider>
  );
}

export function useProductGroupContext() {
  const context = useContext(ProductGroupContext);
  if (context === undefined) {
    throw new Error("useProductGroupContext must be used within a ProductGroupProvider");
  }
  return context;
}
