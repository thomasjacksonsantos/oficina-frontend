// app/product-marca/components/form/product-marca-view-dialog.tsx

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMarcaContext } from '../list/product-marca-context';

export default function MarcaViewDialog() {
  const { viewingMarca, setViewingMarca } = useMarcaContext();

  if (!viewingMarca) return null;

  return (
    <Dialog open={!!viewingMarca} onOpenChange={() => setViewingMarca(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Unidade</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Descrição</Label>
            <p className="font-medium">{viewingMarca.descricao}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Status</Label>
            <p className="font-medium">{viewingMarca.status || 'Ativo'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
