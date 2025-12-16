// app/product-unit/components/form/product-unit-view-dialog.tsx

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUnitContext } from '../list/product-unit-context';

export default function UnitViewDialog() {
  const { viewingUnit, setViewingUnit } = useUnitContext();

  if (!viewingUnit) return null;

  return (
    <Dialog open={!!viewingUnit} onOpenChange={() => setViewingUnit(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Unidade</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Descrição</Label>
            <p className="font-medium">{viewingUnit.descricao}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Status</Label>
            <p className="font-medium">{viewingUnit.unidadeProdutoStatus || 'Ativo'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}