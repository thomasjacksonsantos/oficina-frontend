"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/api/product.types";

interface ProductContextType {
  viewingProduct: Product | null;
  editingProduct: Product | null;
  deletingProduct: Product | null;
  activingProduct: string | null;
  deactivingProduct: string | null;
  registeringProduct: boolean | null;
  setViewingProduct: (product: Product | null) => void;
  setEditingProduct: (product: Product | null) => void;
  setDeletingProduct: (product: Product | null) => void;
  setActivingProduct: (productId: string | null) => void;
  setDeactivingProduct: (productId: string | null) => void;
  setRegisteringProduct: (registering: boolean | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [activingProduct, setActivingProduct] = useState<string | null>(null);
  const [deactivingProduct, setDeactivingProduct] = useState<string | null>(null);
  const [registeringProduct, setRegisteringProduct] = useState<boolean | null>(false);

  return (
    <ProductContext.Provider
      value={{
        viewingProduct,
        editingProduct,
        deletingProduct,
        activingProduct,
        deactivingProduct,
        registeringProduct,
        setViewingProduct,
        setEditingProduct,
        setDeletingProduct,
        setActivingProduct,
        setDeactivingProduct,
        setRegisteringProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}