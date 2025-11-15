"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Customer } from "@/api/customers.types";

interface CustomerContextType {
  viewingCustomer: Customer | null;
  editingCustomer: Customer | null;
  deletingCustomer: Customer | null;
  setViewingCustomer: (customer: Customer | null) => void;
  setEditingCustomer: (customer: Customer | null) => void;
  setDeletingCustomer: (customer: Customer | null) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  return (
    <CustomerContext.Provider
      value={{
        viewingCustomer,
        editingCustomer,
        deletingCustomer,
        setViewingCustomer,
        setEditingCustomer,
        setDeletingCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerContext() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }
  return context;
}

