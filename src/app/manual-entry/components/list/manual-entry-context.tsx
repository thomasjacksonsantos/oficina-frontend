"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ManualEntry } from "@/api/manual-entry.types";

interface ManualEntryContextType {
  viewingEntry: ManualEntry | null;
  editingEntry: ManualEntry | null;
  deletingEntry: ManualEntry | null;
  activingEntry: string | null;
  registeringEntry: boolean | null;
  deactivingEntry: string | null;
  setViewingEntry: (entry: ManualEntry | null) => void;
  setEditingEntry: (entry: ManualEntry | null) => void;
  setDeletingEntry: (entry: ManualEntry | null) => void;
  setActivingEntry: (entryId: string | null) => void;
  setDeactivingEntry: (entryId: string | null) => void;
  setRegisteringEntry: (registering: boolean | null) => void;
}

const ManualEntryContext = createContext<ManualEntryContextType | undefined>(undefined);

export function ManualEntryProvider({ children }: { children: ReactNode }) {
  const [viewingEntry, setViewingEntry] = useState<ManualEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<ManualEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<ManualEntry | null>(null);
  const [activingEntry, setActivingEntry] = useState<string | null>(null);
  const [deactivingEntry, setDeactivingEntry] = useState<string | null>(null);
  const [registeringEntry, setRegisteringEntry] = useState<boolean | null>(false);

  return (
    <ManualEntryContext.Provider
      value={{
        viewingEntry,
        editingEntry,
        deletingEntry,
        activingEntry,
        deactivingEntry,
        registeringEntry,
        setViewingEntry,
        setEditingEntry,
        setDeletingEntry,
        setActivingEntry,
        setDeactivingEntry,
        setRegisteringEntry
      }}
    >
      {children}
    </ManualEntryContext.Provider>
  );
}

export function useManualEntryContext() {
  const context = useContext(ManualEntryContext);
  if (context === undefined) {
    throw new Error("useManualEntryContext must be used within a ManualEntryProvider");
  }
  return context;
}