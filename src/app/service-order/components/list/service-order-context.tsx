"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ServiceOrder } from "@/api/service-orders.types";

interface ServiceOrderContextType {
  viewingServiceOrder: ServiceOrder | null;
  editingServiceOrder: ServiceOrder | null;
  deletingServiceOrder: ServiceOrder | null;
  setViewingServiceOrder: (serviceOrder: ServiceOrder | null) => void;
  setEditingServiceOrder: (serviceOrder: ServiceOrder | null) => void;
  setDeletingServiceOrder: (serviceOrder: ServiceOrder | null) => void;
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined);

export function ServiceOrderProvider({ children }: { children: ReactNode }) {
  const [viewingServiceOrder, setViewingServiceOrder] = useState<ServiceOrder | null>(null);
  const [editingServiceOrder, setEditingServiceOrder] = useState<ServiceOrder | null>(null);
  const [deletingServiceOrder, setDeletingServiceOrder] = useState<ServiceOrder | null>(null);

  return (
    <ServiceOrderContext.Provider
      value={{
        viewingServiceOrder,
        editingServiceOrder,
        deletingServiceOrder,
        setViewingServiceOrder,
        setEditingServiceOrder,
        setDeletingServiceOrder,
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
}

export function useServiceOrderContext() {
  const context = useContext(ServiceOrderContext);
  if (context === undefined) {
    throw new Error("useServiceOrderContext must be used within a ServiceOrderProvider");
  }
  return context;
}

