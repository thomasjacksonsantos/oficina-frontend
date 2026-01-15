// app/stock-correction/components/list/stock-correction-context.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { StockCorrection } from "@/api/stock-correction.types";

interface StockCorrectionContextType {
  viewingStockCorrection: StockCorrection | null;
  correctingStockCorrection: StockCorrection | null;
  registeringStockCorrection: boolean | null;
  setViewingStockCorrection: (stockCorrection: StockCorrection | null) => void;
  setCorrectingStockCorrection: (stockCorrection: StockCorrection | null) => void;
  setRegisteringStockCorrection: (registering: boolean | null) => void;
}

const StockCorrectionContext = createContext<StockCorrectionContextType | undefined>(undefined);

export function StockCorrectionProvider({ children }: { children: ReactNode }) {
  const [viewingStockCorrection, setViewingStockCorrection] = useState<StockCorrection | null>(null);
  const [correctingStockCorrection, setCorrectingStockCorrection] = useState<StockCorrection | null>(null);
  const [registeringStockCorrection, setRegisteringStockCorrection] = useState<boolean | null>(false);

  return (
    <StockCorrectionContext.Provider
      value={{
        viewingStockCorrection,
        correctingStockCorrection,
        registeringStockCorrection,
        setViewingStockCorrection,
        setCorrectingStockCorrection,
        setRegisteringStockCorrection,
      }}
    >
      {children}
    </StockCorrectionContext.Provider>
  );
}

export function useStockCorrectionContext() {
  const context = useContext(StockCorrectionContext);
  if (context === undefined) {
    throw new Error("useStockCorrectionContext must be used within a StockCorrectionProvider");
  }
  return context;
}