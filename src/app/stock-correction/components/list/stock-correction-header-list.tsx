// app/stock-correction/components/list/stock-correction-header-list.tsx

'use client';

import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { useStockCorrectionContext } from './stock-correction-context';
import StockCorrectionForm from '../forms/stock-correction-form';
import StockCorrectionViewDialog from '../forms/stock-correction-view-dialog';

export default function StockCorrectionHeaderList() {
  const { setRegisteringStockCorrection } = useStockCorrectionContext();

  return (
    <>
      <StockCorrectionForm />
      <StockCorrectionViewDialog />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Correção de Estoque</h2>
          <span className="text-muted-foreground">
            Gerencie os movimentos de estoque aqui.
          </span>
        </div>
        <div>
          <Button onClick={() => setRegisteringStockCorrection(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Corrigir Estoque
          </Button>
        </div>
      </div>
    </>
  );
}