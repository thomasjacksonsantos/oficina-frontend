// app/product-unit/components/list/product-unit-context.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Unit } from "@/api/product-unit.types";

interface UnitContextType {
  viewingUnit: Unit | null;
  editingUnit: Unit | null;
  deletingUnit: Unit | null;
  activingUnit: string | null;
  deactivingUnit: string | null;
  setViewingUnit: (unit: Unit | null) => void;
  setEditingUnit: (unit: Unit | null) => void;
  setDeletingUnit: (unit: Unit | null) => void;
  setActivingUnit: (unitId: string | null) => void;
  setDeactivingUnit: (unitId: string | null) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);
  const [activingUnit, setActivingUnit] = useState<string | null>(null);
  const [deactivingUnit, setDeactivingUnit] = useState<string | null>(null);

  return (
    <UnitContext.Provider
      value={{
        viewingUnit,
        editingUnit,
        deletingUnit,
        activingUnit,
        deactivingUnit,
        setViewingUnit,
        setEditingUnit,
        setDeletingUnit,
        setActivingUnit,
        setDeactivingUnit
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnitContext() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error("useUnitContext must be used within a UnitProvider");
  }
  return context;
}