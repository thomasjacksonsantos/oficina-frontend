"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { BandeiraCartao } from "@/api/bandeira-cartao.types";

interface BandeiraCartaoContextType {
  viewingBandeiraCartao: BandeiraCartao | null;
  editingBandeiraCartao: BandeiraCartao | null;
  deletingBandeiraCartao: BandeiraCartao | null;
  activingBandeiraCartao: string | null;
  registeringBandeiraCartao: boolean | null;
  deactivingBandeiraCartao: string | null;
  setViewingBandeiraCartao: (bandeiraCartao: BandeiraCartao | null) => void;
  setEditingBandeiraCartao: (bandeiraCartao: BandeiraCartao | null) => void;
  setDeletingBandeiraCartao: (bandeiraCartao: BandeiraCartao | null) => void;
  setActivingBandeiraCartao: (bandeiraCartaoId: string | null) => void;
  setDeactivingBandeiraCartao: (bandeiraCartaoId: string | null) => void;
  setRegisteringBandeiraCartao: (registering: boolean | null) => void;
}

const BandeiraCartaoContext = createContext<BandeiraCartaoContextType | undefined>(undefined);

export function BandeiraCartaoProvider({ children }: { children: ReactNode }) {
  const [viewingBandeiraCartao, setViewingBandeiraCartao] = useState<BandeiraCartao | null>(null);
  const [editingBandeiraCartao, setEditingBandeiraCartao] = useState<BandeiraCartao | null>(null);
  const [deletingBandeiraCartao, setDeletingBandeiraCartao] = useState<BandeiraCartao | null>(null);
  const [activingBandeiraCartao, setActivingBandeiraCartao] = useState<string | null>(null);
  const [deactivingBandeiraCartao, setDeactivingBandeiraCartao] = useState<string | null>(null);
  const [registeringBandeiraCartao, setRegisteringBandeiraCartao] = useState<boolean | null>(false);

  return (
    <BandeiraCartaoContext.Provider
      value={{
        viewingBandeiraCartao,
        editingBandeiraCartao,
        deletingBandeiraCartao,
        activingBandeiraCartao,
        deactivingBandeiraCartao,
        registeringBandeiraCartao,
        setViewingBandeiraCartao,
        setEditingBandeiraCartao,
        setDeletingBandeiraCartao,
        setActivingBandeiraCartao,
        setDeactivingBandeiraCartao,
        setRegisteringBandeiraCartao
      }}
    >
      {children}
    </BandeiraCartaoContext.Provider>
  );
}

export function useBandeiraCartaoContext() {
  const context = useContext(BandeiraCartaoContext);
  if (context === undefined) {
    throw new Error("useBandeiraCartaoContext must be used within a BandeiraCartaoProvider");
  }
  return context;
}