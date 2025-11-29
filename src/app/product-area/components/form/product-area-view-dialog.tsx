'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAreaContext } from '../list/product-area-context';

export default function AreaViewDialog() {
  const { viewingArea, setViewingArea } = useAreaContext();

  if (!viewingArea) return null;

  return (
    <Dialog open={!!viewingArea} onOpenChange={() => setViewingArea(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Área</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Código</Label>
              <p className="font-medium font-mono">{viewingArea.codigo}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p className="font-medium">{viewingArea.descricao}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Descrição Estendida</Label>
              <p className="font-medium text-sm leading-relaxed">
                {viewingArea.descricaoEstendida}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Garantia</Label>
              <p className="font-medium">{viewingArea.garantia} meses</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium">{viewingArea.status || 'Ativo'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
