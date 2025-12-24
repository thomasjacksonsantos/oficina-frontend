// app/entrada-chave-acesso/components/list/entrada-context.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotaFiscalListItem, NotaFiscalDetalhes } from '@/api/entrada-chave-acesso.types';

interface EntradaContextType {
  viewingNotaFiscal: NotaFiscalDetalhes | null;
  importingNotaFiscal: NotaFiscalListItem | null;
  consultingEntry: boolean;
  setViewingNotaFiscal: (notaFiscal: NotaFiscalDetalhes | null) => void;
  setImportingNotaFiscal: (notaFiscal: NotaFiscalListItem | null) => void;
  setConsultingEntry: (consulting: boolean) => void;
}

const EntradaContext = createContext<EntradaContextType | undefined>(undefined);

export function EntradaProvider({ children }: { children: ReactNode }) {
  const [viewingNotaFiscal, setViewingNotaFiscal] = useState<NotaFiscalDetalhes | null>(null);
  const [importingNotaFiscal, setImportingNotaFiscal] = useState<NotaFiscalListItem | null>(null);
  const [consultingEntry, setConsultingEntry] = useState<boolean>(false);

  return (
    <EntradaContext.Provider
      value={{
        viewingNotaFiscal,
        importingNotaFiscal,
        consultingEntry,
        setViewingNotaFiscal,
        setImportingNotaFiscal,
        setConsultingEntry,
      }}
    >
      {children}
    </EntradaContext.Provider>
  );
}

export function useEntradaContext() {
  const context = useContext(EntradaContext);
  if (context === undefined) {
    throw new Error('useEntradaContext must be used within an EntradaProvider');
  }
  return context;
}