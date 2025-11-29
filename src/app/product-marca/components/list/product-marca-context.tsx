// app/product-marca/components/list/product-marca-context.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Marca } from "@/api/product-marca.types";

interface MarcaContextType {
  viewingMarca: Marca | null;
  editingMarca: Marca | null;
  deletingMarca: Marca | null;
  activingMarca: string | null;
  deactivingMarca: string | null;
  setViewingMarca: (marca: Marca | null) => void;
  setEditingMarca: (marca: Marca | null) => void;
  setDeletingMarca: (marca: Marca | null) => void;
  setActivingMarca: (marcaId: string | null) => void;
  setDeactivingMarca: (marcaId: string | null) => void;
}

const MarcaContext = createContext<MarcaContextType | undefined>(undefined);

export function MarcaProvider({ children }: { children: ReactNode }) {
  const [viewingMarca, setViewingMarca] = useState<Marca | null>(null);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
  const [deletingMarca, setDeletingMarca] = useState<Marca | null>(null);
  const [activingMarca, setActivingMarca] = useState<string | null>(null);
  const [deactivingMarca, setDeactivingMarca] = useState<string | null>(null);

  return (
    <MarcaContext.Provider
      value={{
        viewingMarca,
        editingMarca,
        deletingMarca,
        activingMarca,
        deactivingMarca,
        setViewingMarca,
        setEditingMarca,
        setDeletingMarca,
        setActivingMarca,
        setDeactivingMarca
      }}
    >
      {children}
    </MarcaContext.Provider>
  );
}

export function useMarcaContext() {
  const context = useContext(MarcaContext);
  if (context === undefined) {
    throw new Error("useMarcaContext must be used within a MarcaProvider");
  }
  return context;
}