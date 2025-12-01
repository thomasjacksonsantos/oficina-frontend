"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Area } from "@/api/area.types";

interface AreaContextType {
  viewingArea: Area | null;
  editingArea: Area | null;
  deletingArea: Area | null;
  activingArea: string | null;
  registeringArea: boolean | null;
  deactivingArea: string | null;
  setViewingArea: (area: Area | null) => void;
  setEditingArea: (area: Area | null) => void;
  setDeletingArea: (area: Area | null) => void;
  setActivingArea: (areaId: string | null) => void;
  setDeactivingArea: (areaId: string | null) => void;
  setRegisteringArea: (registering: boolean | null) => void;
}

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export function AreaProvider({ children }: { children: ReactNode }) {
  const [viewingArea, setViewingArea] = useState<Area | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [deletingArea, setDeletingArea] = useState<Area | null>(null);
  const [activingArea, setActivingArea] = useState<string | null>(null);
  const [deactivingArea, setDeactivingArea] = useState<string | null>(null);
  const [registeringArea, setRegisteringArea] = useState<boolean | null>(false);

  return (
    <AreaContext.Provider
      value={{
        viewingArea,
        editingArea,
        deletingArea,
        activingArea,
        deactivingArea,
        registeringArea,
        setViewingArea,
        setEditingArea,
        setDeletingArea,
        setActivingArea,
        setDeactivingArea,
        setRegisteringArea
      }}
    >
      {children}
    </AreaContext.Provider>
  );
}

export function useAreaContext() {
  const context = useContext(AreaContext);
  if (context === undefined) {
    throw new Error("useAreaContext must be used within a AreaProvider");
  }
  return context;
}
