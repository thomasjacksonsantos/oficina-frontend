"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PaymentForm } from "@/api/payment-form.types";

interface PaymentFormContextType {
  viewingPaymentForm: PaymentForm | null;
  editingPaymentForm: PaymentForm | null;
  deletingPaymentForm: PaymentForm | null;
  activingPaymentForm: string | null;
  registeringPaymentForm: boolean | null;
  deactivingPaymentForm: string | null;
  setViewingPaymentForm: (paymentForm: PaymentForm | null) => void;
  setEditingPaymentForm: (paymentForm: PaymentForm | null) => void;
  setDeletingPaymentForm: (paymentForm: PaymentForm | null) => void;
  setActivingPaymentForm: (paymentFormId: string | null) => void;
  setDeactivingPaymentForm: (paymentFormId: string | null) => void;
  setRegisteringPaymentForm: (registering: boolean | null) => void;
}

const PaymentFormContext = createContext<PaymentFormContextType | undefined>(undefined);

export function PaymentFormProvider({ children }: { children: ReactNode }) {
  const [viewingPaymentForm, setViewingPaymentForm] = useState<PaymentForm | null>(null);
  const [editingPaymentForm, setEditingPaymentForm] = useState<PaymentForm | null>(null);
  const [deletingPaymentForm, setDeletingPaymentForm] = useState<PaymentForm | null>(null);
  const [activingPaymentForm, setActivingPaymentForm] = useState<string | null>(null);
  const [deactivingPaymentForm, setDeactivingPaymentForm] = useState<string | null>(null);
  const [registeringPaymentForm, setRegisteringPaymentForm] = useState<boolean | null>(false);

  return (
    <PaymentFormContext.Provider
      value={{
        viewingPaymentForm,
        editingPaymentForm,
        deletingPaymentForm,
        activingPaymentForm,
        deactivingPaymentForm,
        registeringPaymentForm,
        setViewingPaymentForm,
        setEditingPaymentForm,
        setDeletingPaymentForm,
        setActivingPaymentForm,
        setDeactivingPaymentForm,
        setRegisteringPaymentForm
      }}
    >
      {children}
    </PaymentFormContext.Provider>
  );
}

export function usePaymentFormContext() {
  const context = useContext(PaymentFormContext);
  if (context === undefined) {
    throw new Error("usePaymentFormContext must be used within a PaymentFormProvider");
  }
  return context;
}