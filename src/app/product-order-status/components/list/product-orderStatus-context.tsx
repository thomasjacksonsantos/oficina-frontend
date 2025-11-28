// app/product-orderStatus/components/list/product-orderStatus-context.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { OrderStatus } from "@/api/product-orderStatus.types";

interface OrderStatusContextType {
  viewingOrderStatus: OrderStatus | null;
  editingOrderStatus: OrderStatus | null;
  deletingOrderStatus: OrderStatus | null;
  activingOrderStatus: string | null;
  deactivingOrderStatus: string | null;
  setViewingOrderStatus: (orderStatus: OrderStatus | null) => void;
  setEditingOrderStatus: (orderStatus: OrderStatus | null) => void;
  setDeletingOrderStatus: (orderStatus: OrderStatus | null) => void;
  setActivingOrderStatus: (orderStatusId: string | null) => void;
  setDeactivingOrderStatus: (orderStatusId: string | null) => void;
}

const OrderStatusContext = createContext<OrderStatusContextType | undefined>(undefined);

export function OrderStatusProvider({ children }: { children: ReactNode }) {
  const [viewingOrderStatus, setViewingOrderStatus] = useState<OrderStatus | null>(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState<OrderStatus | null>(null);
  const [deletingOrderStatus, setDeletingOrderStatus] = useState<OrderStatus | null>(null);
  const [activingOrderStatus, setActivingOrderStatus] = useState<string | null>(null);
  const [deactivingOrderStatus, setDeactivingOrderStatus] = useState<string | null>(null);

  return (
    <OrderStatusContext.Provider
      value={{
        viewingOrderStatus,
        editingOrderStatus,
        deletingOrderStatus,
        activingOrderStatus,
        deactivingOrderStatus,
        setViewingOrderStatus,
        setEditingOrderStatus,
        setDeletingOrderStatus,
        setActivingOrderStatus,
        setDeactivingOrderStatus
      }}
    >
      {children}
    </OrderStatusContext.Provider>
  );
}

export function useOrderStatusContext() {
  const context = useContext(OrderStatusContext);
  if (context === undefined) {
    throw new Error("useOrderStatusContext must be used within a OrderStatusProvider");
  }
  return context;
}